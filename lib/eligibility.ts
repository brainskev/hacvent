import { supabase } from './supabase';

// =============================================
// TYPES
// =============================================

export interface EligibilityInput {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  homeType: 'single-family' | 'townhouse' | 'condo' | 'manufactured' | 'multifamily';
  ownership: boolean;
  systemAge: string;
  currentSystemType: string;
  desiredSystemType: string;
  desiredEfficiency: string;
  householdIncome?: number;
  householdSize?: number;
}

export interface RebateProgram {
  id: string;
  program_name: string;
  program_type: string;
  provider: string;
  amount: number;
  max_amount: number | null;
  state: string | null;
  requirements: string[];
  eligible_systems: string[];
  min_efficiency_rating: string;
  description: string;
  application_url: string;
  income_limits: any;
}

export interface EligibilityResult {
  totalSavings: number;
  federalCredit: number;
  stateRebate: number;
  utilityRebate: number;
  manufacturerRebate: number;
  location: string;
  systemType: string;
  efficiencyRating: string;
  programs: {
    name: string;
    amount: number;
    eligible: boolean;
    requirements: string[];
    reason?: string;
  }[];
  incomeBonusAvailable?: boolean;
  estimatedInstallationCost?: number;
}

// =============================================
// UTILITY TERRITORY MAPPING
// =============================================

const UTILITY_TERRITORIES: Record<string, string[]> = {
  'Pacific Gas & Electric': ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', '94112', '94114', '94115', '94116', '94117', '94118', '94121', '94122', '94123', '94124', '94127', '94129', '94131', '94132', '94133', '94134'],
  'Southern California Edison': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011', '90012', '90013', '90014', '90015', '90016', '90017', '90018', '90019', '90020'],
  'Southern California Gas Company': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011', '90012'],
  'San Diego Gas & Electric': ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110'],
  'Sacramento Municipal Utility District': ['95814', '95815', '95816', '95817', '95818', '95819', '95820', '95821', '95822', '95823'],
};

// =============================================
// ELIGIBILITY SERVICE
// =============================================

export class EligibilityService {
  /**
   * Get utility provider based on ZIP code
   */
  static getUtilityProvider(zipCode: string): string | null {
    for (const [provider, zipcodes] of Object.entries(UTILITY_TERRITORIES)) {
      if (zipcodes.includes(zipCode)) {
        return provider;
      }
    }
    return null;
  }

  /**
   * Validate address format
   */
  static validateAddress(input: EligibilityInput): { valid: boolean; error?: string } {
    if (!input.address || input.address.length < 5) {
      return { valid: false, error: 'Please enter a valid street address' };
    }
    if (!input.city || input.city.length < 2) {
      return { valid: false, error: 'Please enter a valid city' };
    }
    if (!input.state) {
      return { valid: false, error: 'Please select a state' };
    }
    if (!input.zipCode || !/^\d{5}$/.test(input.zipCode)) {
      return { valid: false, error: 'Please enter a valid 5-digit ZIP code' };
    }
    return { valid: true };
  }

  /**
   * Check if efficiency rating meets minimum requirements
   */
  static meetsEfficiencyRequirement(
    desired: string,
    minimum: string
  ): boolean {
    // Extract numeric value from efficiency rating (e.g., "SEER 18" -> 18)
    const desiredMatch = desired.match(/(\d+\.?\d*)/);
    const minimumMatch = minimum.match(/(\d+\.?\d*)/);

    if (!desiredMatch || !minimumMatch) return false;

    const desiredValue = parseFloat(desiredMatch[1]);
    const minimumValue = parseFloat(minimumMatch[1]);

    return desiredValue >= minimumValue;
  }

  /**
   * Check income qualification
   */
  static checkIncomeQualification(
    program: RebateProgram,
    householdIncome?: number,
    householdSize?: number
  ): boolean {
    if (!program.income_limits || !householdIncome) return true;

    const limits = program.income_limits;
    
    // Check based on household size
    if (householdSize && limits[`family_of_${householdSize}`]) {
      return householdIncome <= limits[`family_of_${householdSize}`];
    }
    
    // Check single/married
    if (householdSize === 1 && limits.single) {
      return householdIncome <= limits.single;
    }
    if (householdSize === 2 && limits.married) {
      return householdIncome <= limits.married;
    }

    return true; // No income restriction or not specified
  }

  /**
   * Find applicable rebate programs based on criteria
   */
  static async findRebatePrograms(
    input: EligibilityInput
  ): Promise<RebateProgram[]> {
    try {
      // Build query for rebate programs
      let query = supabase
        .from('rebate_programs')
        .select('*')
        .eq('is_active', true);

      // Filter by state (include both state-specific and federal programs)
      query = query.or(`state.eq.${input.state},state.is.null`);

      const { data: programs, error } = await query;

      if (error) {
        console.error('Error fetching rebate programs:', error);
        return [];
      }

      if (!programs) return [];

      // Filter programs by eligibility criteria
      const eligiblePrograms = programs.filter((program) => {
        // Check if system type is eligible
        if (
          program.eligible_systems &&
          !program.eligible_systems.includes(input.desiredSystemType)
        ) {
          return false;
        }

        // Check efficiency requirements
        if (
          program.min_efficiency_rating &&
          !this.meetsEfficiencyRequirement(
            input.desiredEfficiency,
            program.min_efficiency_rating
          )
        ) {
          return false;
        }

        // Check ownership requirement (most programs require ownership)
        if (!input.ownership) {
          // Only exclude if program explicitly requires ownership
          const requiresOwnership = program.requirements?.some(
            (req: string) => req.toLowerCase().includes('owner')
          );
          if (requiresOwnership) return false;
        }

        return true;
      });

      return eligiblePrograms as RebateProgram[];
    } catch (error) {
      console.error('Error finding rebate programs:', error);
      return [];
    }
  }

  /**
   * Calculate total savings from programs
   */
  static calculateSavings(
    programs: RebateProgram[],
    input: EligibilityInput
  ): EligibilityResult {
    let federalCredit = 0;
    let stateRebate = 0;
    let utilityRebate = 0;
    let manufacturerRebate = 0;

    const programDetails = programs.map((program) => {
      const amount = program.amount;
      const eligible = this.checkIncomeQualification(
        program,
        input.householdIncome,
        input.householdSize
      );

      // Categorize by program type
      if (eligible) {
        if (program.program_type === 'federal') {
          federalCredit += amount;
        } else if (program.program_type === 'state') {
          stateRebate += amount;
        } else if (program.program_type === 'utility') {
          utilityRebate += amount;
        } else if (program.program_type === 'manufacturer') {
          manufacturerRebate += amount;
        }
      }

      return {
        name: program.program_name,
        amount: amount,
        eligible: eligible,
        requirements: program.requirements || [],
        reason: !eligible ? 'Income qualification required' : undefined,
      };
    });

    const totalSavings = federalCredit + stateRebate + utilityRebate + manufacturerRebate;

    // Check if income-qualified bonuses are available
    const incomeBonusAvailable = programs.some(
      (p) => p.income_limits && !this.checkIncomeQualification(p, input.householdIncome, input.householdSize)
    );

    return {
      totalSavings,
      federalCredit,
      stateRebate,
      utilityRebate,
      manufacturerRebate,
      location: `${input.city}, ${input.state} ${input.zipCode}`,
      systemType: input.desiredSystemType,
      efficiencyRating: input.desiredEfficiency,
      programs: programDetails,
      incomeBonusAvailable,
      estimatedInstallationCost: this.estimateInstallationCost(input.desiredSystemType),
    };
  }

  /**
   * Estimate installation cost based on system type
   */
  static estimateInstallationCost(systemType: string): number {
    const costMap: Record<string, number> = {
      'Central Heat Pump': 15000,
      'Central AC': 8000,
      'Ductless': 5000,
      'Geothermal': 25000,
      'Furnace': 6000,
    };

    return costMap[systemType] || 10000;
  }

  /**
   * Main eligibility check function
   */
  static async checkEligibility(
    input: EligibilityInput
  ): Promise<{ success: boolean; result?: EligibilityResult; error?: string }> {
    // Validate address
    const validation = this.validateAddress(input);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Find applicable programs
    const programs = await this.findRebatePrograms(input);

    if (programs.length === 0) {
      return {
        success: false,
        error: 'No rebate programs found for your location and system type. Try different system specifications.',
      };
    }

    // Calculate savings
    const result = this.calculateSavings(programs, input);

    return { success: true, result };
  }

  /**
   * Save eligibility results to database
   */
  static async saveEligibilityResult(
    projectId: string,
    result: EligibilityResult,
    programIds: string[]
  ): Promise<boolean> {
    try {
      // Save eligibility result
      const { error: eligibilityError } = await supabase
        .from('eligibility_results')
        .insert({
          project_id: projectId,
          total_savings: result.totalSavings,
          federal_credit: result.federalCredit,
          state_rebate: result.stateRebate,
          utility_rebate: result.utilityRebate,
          manufacturer_rebate: result.manufacturerRebate,
          location: result.location,
          system_type: result.systemType,
          efficiency_rating: result.efficiencyRating,
        });

      if (eligibilityError) {
        console.error('Error saving eligibility result:', eligibilityError);
        return false;
      }

      // Save project rebates for each program
      const projectRebates = result.programs
        .filter(p => p.eligible)
        .map((program, index) => ({
          project_id: projectId,
          rebate_program_id: programIds[index],
          amount: program.amount,
          status: 'not_started' as const,
        }));

      if (projectRebates.length > 0) {
        const { error: rebatesError } = await supabase
          .from('project_rebates')
          .insert(projectRebates);

        if (rebatesError) {
          console.error('Error saving project rebates:', rebatesError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving eligibility result:', error);
      return false;
    }
  }

  /**
   * Get utility company name for display
   */
  static getUtilityCompanyName(zipCode: string): string {
    const provider = this.getUtilityProvider(zipCode);
    return provider || 'Your local utility company';
  }

  /**
   * Check if system replacement qualifies for enhanced rebates
   */
  static checkReplacementBonus(currentSystem: string, newSystem: string): {
    qualifies: boolean;
    bonus: number;
    reason: string;
  } {
    // Bonus for replacing fossil fuel with heat pump
    if (
      (currentSystem.toLowerCase().includes('furnace') ||
        currentSystem.toLowerCase().includes('gas')) &&
      newSystem.toLowerCase().includes('heat pump')
    ) {
      return {
        qualifies: true,
        bonus: 500,
        reason: 'Replacing fossil fuel heating with electric heat pump',
      };
    }

    // Bonus for replacing very old system
    return {
      qualifies: false,
      bonus: 0,
      reason: 'No additional bonus available',
    };
  }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get efficiency rating display name
 */
export function getEfficiencyRatingName(systemType: string): string {
  if (systemType.includes('Heat Pump')) {
    return 'SEER/HSPF';
  }
  if (systemType.includes('AC')) {
    return 'SEER';
  }
  if (systemType.includes('Furnace')) {
    return 'AFUE';
  }
  return 'Efficiency Rating';
}

/**
 * Parse efficiency rating to numeric value
 */
export function parseEfficiencyRating(rating: string): number | null {
  const match = rating.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}
