import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript autocompletion
export type Profile = {
  id: string;
  role: 'customer' | 'contractor' | 'admin';
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
};

export type Customer = {
  id: string;
  profile_id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  home_type: string | null;
  system_age: string | null;
  current_system_type: string | null;
  property_ownership: boolean;
  income_qualified: boolean | null;
  created_at: string;
  updated_at: string;
};

export type Contractor = {
  id: string;
  profile_id: string;
  company_name: string;
  license_number: string;
  business_address_line1: string;
  business_address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  service_radius: number;
  years_experience: number;
  completed_projects: number;
  rating: number;
  total_reviews: number;
  status: 'pending' | 'verified' | 'suspended' | 'rejected';
  availability: 'available_now' | 'available_soon' | 'booked';
  profile_image_url: string | null;
  bio: string | null;
  website_url: string | null;
  insurance_verified: boolean;
  insurance_expiry: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  customer_id: string;
  selected_contractor_id: string | null;
  project_name: string | null;
  system_type: string;
  desired_efficiency_rating: string | null;
  estimated_start_date: string | null;
  actual_start_date: string | null;
  completion_date: string | null;
  status: 'eligibility_check' | 'contractor_selection' | 'consultation_scheduled' | 
          'in_progress' | 'installation_complete' | 'rebate_submitted' | 'completed' | 'cancelled';
  total_cost: number | null;
  total_rebate_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RebateProgram = {
  id: string;
  program_name: string;
  program_type: string | null;
  provider: string | null;
  amount: number;
  max_amount: number | null;
  percentage: number | null;
  state: string | null;
  utility_company: string | null;
  requirements: string[] | null;
  eligible_systems: string[] | null;
  min_efficiency_rating: string | null;
  income_limits: any | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  application_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  action_label: string | null;
  action_url: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
};
