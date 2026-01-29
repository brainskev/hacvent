/**
 * Hacvent - Michigan HVAC Rebate Platform
 * Fee Calculation Utilities
 * 
 * Implements the tiered referral fee structure and fee calculations
 */

// Fee constants
export const APPROVAL_FEE = 50; // One-time contractor approval fee
export const FILING_FEE = 25; // Per-project filing fee

/**
 * Tiered Referral Fee Structure:
 * - Under $2,500: $0 (no fee)
 * - $2,500 - $4,499: $150
 * - $4,500 - $7,999: $250
 * - $8,000 - $14,999: $400
 * - $15,000+: $600
 */
export function calculateReferralFee(projectCost: number): number {
  if (projectCost < 2500) {
    return 0;
  } else if (projectCost >= 2500 && projectCost < 4500) {
    return 150;
  } else if (projectCost >= 4500 && projectCost < 8000) {
    return 250;
  } else if (projectCost >= 8000 && projectCost < 15000) {
    return 400;
  } else {
    return 600; // $15,000+
  }
}

/**
 * Calculate all fees for a project
 */
export interface ProjectFees {
  referralFee: number;
  filingFee: number;
  totalFees: number;
  projectCost: number;
  feePercentage: number;
}

export function calculateProjectFees(projectCost: number): ProjectFees {
  const referralFee = calculateReferralFee(projectCost);
  const filingFee = FILING_FEE;
  const totalFees = referralFee + filingFee;
  const feePercentage = projectCost > 0 ? (totalFees / projectCost) * 100 : 0;

  return {
    referralFee,
    filingFee,
    totalFees,
    projectCost,
    feePercentage: Math.round(feePercentage * 100) / 100, // Round to 2 decimals
  };
}

/**
 * Get the fee tier description for a given project cost
 */
export function getFeeTierDescription(projectCost: number): string {
  if (projectCost < 2500) {
    return 'Below minimum ($0 fee)';
  } else if (projectCost >= 2500 && projectCost < 4500) {
    return 'Tier 1: $2.5k - $4.5k';
  } else if (projectCost >= 4500 && projectCost < 8000) {
    return 'Tier 2: $4.5k - $8k';
  } else if (projectCost >= 8000 && projectCost < 15000) {
    return 'Tier 3: $8k - $15k';
  } else {
    return 'Tier 4: $15k+';
  }
}

/**
 * Calculate contractor balance (what they owe)
 */
export interface ContractorBalance {
  filingFeesOwed: number;
  referralFeesOwed: number;
  totalOwed: number;
  approvalFeePaid: boolean;
}

export function calculateContractorBalance(
  filingFeesOwed: number,
  referralFeesOwed: number,
  approvalFeePaid: boolean
): ContractorBalance {
  return {
    filingFeesOwed,
    referralFeesOwed,
    totalOwed: filingFeesOwed + referralFeesOwed,
    approvalFeePaid,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate total revenue from projects
 */
export interface RevenueBreakdown {
  totalReferralFees: number;
  totalFilingFees: number;
  totalApprovalFees: number;
  totalRevenue: number;
  projectCount: number;
  contractorCount: number;
}

export function calculateRevenueBreakdown(
  referralFees: number,
  filingFees: number,
  approvalFees: number,
  projectCount: number,
  contractorCount: number
): RevenueBreakdown {
  return {
    totalReferralFees: referralFees,
    totalFilingFees: filingFees,
    totalApprovalFees: approvalFees,
    totalRevenue: referralFees + filingFees + approvalFees,
    projectCount,
    contractorCount,
  };
}

/**
 * Example usage and tests
 */
export const feeExamples = [
  { projectCost: 2000, expectedFee: 0, description: 'Below minimum' },
  { projectCost: 3500, expectedFee: 150, description: 'Tier 1' },
  { projectCost: 6000, expectedFee: 250, description: 'Tier 2' },
  { projectCost: 10000, expectedFee: 400, description: 'Tier 3' },
  { projectCost: 20000, expectedFee: 600, description: 'Tier 4' },
];

// Validate fee calculation logic
if (typeof window === 'undefined') {
  // Only run in Node.js environment (not browser)
  feeExamples.forEach((example) => {
    const calculated = calculateReferralFee(example.projectCost);
    if (calculated !== example.expectedFee) {
      console.error(
        `Fee calculation error: $${example.projectCost} should be $${example.expectedFee}, got $${calculated}`
      );
    }
  });
}
