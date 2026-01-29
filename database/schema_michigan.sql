-- Hacvent - Michigan HVAC Rebate Platform
-- Database Schema for Michigan-focused HVAC rebate management
-- Version: 2.0

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Customers (Homeowners seeking HVAC rebates)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  property_address TEXT NOT NULL,
  property_type VARCHAR(50) NOT NULL, -- 'single_family', 'multi_family', 'condo', 'mobile_home'
  project_size VARCHAR(50) NOT NULL, -- 'small', 'medium', 'large'
  hvac_type VARCHAR(100) NOT NULL, -- 'heat_pump', 'central_ac', 'furnace', 'boiler', 'ductless'
  eligibility_status BOOLEAN DEFAULT false,
  preferred_contact_method VARCHAR(20) DEFAULT 'email', -- 'email', 'phone', 'sms'
  uploaded_docs JSONB DEFAULT '[]'::jsonb, -- Array of document URLs/paths
  assigned_contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
  intake_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'matched', 'paperwork_submitted', 'completed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractors (Licensed HVAC contractors in Michigan)
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  insurance_docs JSONB DEFAULT '[]'::jsonb, -- Array of insurance document URLs
  service_areas JSONB DEFAULT '[]'::jsonb, -- Array of Michigan county names
  approved BOOLEAN DEFAULT false,
  approval_fee_paid BOOLEAN DEFAULT false,
  approval_fee_amount DECIMAL(10,2) DEFAULT 50.00,
  approval_fee_paid_date TIMESTAMP WITH TIME ZONE,
  projects JSONB DEFAULT '[]'::jsonb, -- Array of customer IDs for quick reference
  total_projects_completed INTEGER DEFAULT 0,
  total_revenue_generated DECIMAL(12,2) DEFAULT 0,
  filing_fees_owed DECIMAL(10,2) DEFAULT 0,
  filing_fees_paid DECIMAL(10,2) DEFAULT 0,
  referral_fees_owed DECIMAL(10,2) DEFAULT 0,
  referral_fees_paid DECIMAL(10,2) DEFAULT 0,
  onboarding_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'suspended', 'deactivated'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (HVAC installation projects with rebate applications)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
  project_cost DECIMAL(10,2) NOT NULL,
  referral_fee DECIMAL(10,2) NOT NULL, -- Calculated based on tiered structure
  filing_fee DECIMAL(10,2) DEFAULT 25.00,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'submitted', 'approved', 'rejected'
  paperwork_docs JSONB DEFAULT '[]'::jsonb, -- Array of document URLs
  submission_date TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  confirmation_number VARCHAR(100),
  michigan_portal_ref VARCHAR(100), -- Reference number from Michigan rebate portal
  project_type VARCHAR(100) NOT NULL, -- Type of HVAC system installed
  equipment_details JSONB, -- Equipment specifications
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins (Platform administrators)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'superadmin'
  dashboard_permissions JSONB DEFAULT '{
    "view_customers": true,
    "edit_customers": true,
    "view_contractors": true,
    "approve_contractors": false,
    "view_projects": true,
    "submit_projects": true,
    "manage_payments": false,
    "view_reports": true,
    "manage_admins": false
  }'::jsonb,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- FINANCIAL TRACKING TABLES
-- =============================================================================

-- Payments (Track all payments in the system)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  payment_type VARCHAR(50) NOT NULL, -- 'approval_fee', 'filing_fee', 'referral_fee'
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'waived'
  due_date TIMESTAMP WITH TIME ZONE,
  paid_date TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50), -- 'credit_card', 'ach', 'check', 'wire'
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices (Generated invoices for contractors)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  invoice_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  total_amount DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid', 'overdue'
  line_items JSONB NOT NULL, -- Array of invoice line items
  payment_ids JSONB DEFAULT '[]'::jsonb, -- Array of payment IDs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AUDIT & NOTIFICATIONS TABLES
-- =============================================================================

-- Audit Log (Track all important system actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'customer_created', 'contractor_approved', 'project_submitted', etc.
  entity_type VARCHAR(50) NOT NULL, -- 'customer', 'contractor', 'project', 'payment'
  entity_id UUID NOT NULL,
  changes JSONB, -- JSON object of what changed
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications (Email/SMS notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type VARCHAR(50) NOT NULL, -- 'customer', 'contractor', 'admin'
  recipient_id UUID NOT NULL,
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(20),
  notification_type VARCHAR(100) NOT NULL, -- 'new_customer_intake', 'customer_matched', 'filing_completed', 'payment_reminder'
  subject VARCHAR(255),
  message TEXT NOT NULL,
  delivery_method VARCHAR(20) DEFAULT 'email', -- 'email', 'sms', 'both'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_contractor ON customers(assigned_contractor_id);
CREATE INDEX IF NOT EXISTS idx_customers_intake_date ON customers(intake_date DESC);

CREATE INDEX IF NOT EXISTS idx_contractors_email ON contractors(email);
CREATE INDEX IF NOT EXISTS idx_contractors_approved ON contractors(approved);
CREATE INDEX IF NOT EXISTS idx_contractors_status ON contractors(status);
CREATE INDEX IF NOT EXISTS idx_contractors_license ON contractors(license_number);

CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_contractor ON projects(contractor_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_submission_date ON projects(submission_date DESC);

CREATE INDEX IF NOT EXISTS idx_payments_contractor ON payments(contractor_id);
CREATE INDEX IF NOT EXISTS idx_payments_project ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

CREATE INDEX IF NOT EXISTS idx_invoices_contractor ON invoices(contractor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to calculate referral fee based on project cost (tiered structure)
CREATE OR REPLACE FUNCTION calculate_referral_fee(project_cost_param DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF project_cost_param < 2500 THEN
    RETURN 0;
  ELSIF project_cost_param >= 2500 AND project_cost_param < 4500 THEN
    RETURN 150;
  ELSIF project_cost_param >= 4500 AND project_cost_param < 8000 THEN
    RETURN 250;
  ELSIF project_cost_param >= 8000 AND project_cost_param < 15000 THEN
    RETURN 400;
  ELSE
    RETURN 600;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-calculate referral fee when project is created/updated
CREATE OR REPLACE FUNCTION set_project_referral_fee()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_fee = calculate_referral_fee(NEW.project_cost);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_project_referral_fee 
BEFORE INSERT OR UPDATE OF project_cost ON projects
FOR EACH ROW EXECUTE FUNCTION set_project_referral_fee();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - Optional for Supabase
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin policies (admins can see everything)
CREATE POLICY admin_all_customers ON customers FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_contractors ON contractors FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_projects ON projects FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_payments ON payments FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_invoices ON invoices FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_audit_logs ON audit_logs FOR SELECT TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

CREATE POLICY admin_all_notifications ON notifications FOR ALL TO authenticated
  USING (auth.jwt()->>'role' = 'admin' OR auth.jwt()->>'role' = 'superadmin');

-- Contractor policies (contractors can only see their own data)
CREATE POLICY contractor_own_data ON contractors FOR SELECT TO authenticated
  USING (id::text = auth.jwt()->>'contractor_id');

CREATE POLICY contractor_update_own ON contractors FOR UPDATE TO authenticated
  USING (id::text = auth.jwt()->>'contractor_id');

CREATE POLICY contractor_own_projects ON projects FOR SELECT TO authenticated
  USING (contractor_id::text = auth.jwt()->>'contractor_id');

CREATE POLICY contractor_own_payments ON payments FOR SELECT TO authenticated
  USING (contractor_id::text = auth.jwt()->>'contractor_id');

CREATE POLICY contractor_own_invoices ON invoices FOR SELECT TO authenticated
  USING (contractor_id::text = auth.jwt()->>'contractor_id');

-- Customer policies (customers can only see their own data)
CREATE POLICY customer_own_data ON customers FOR SELECT TO authenticated
  USING (id::text = auth.jwt()->>'customer_id');

CREATE POLICY customer_update_own ON customers FOR UPDATE TO authenticated
  USING (id::text = auth.jwt()->>'customer_id');

CREATE POLICY customer_own_projects ON projects FOR SELECT TO authenticated
  USING (customer_id::text = auth.jwt()->>'customer_id');

-- =============================================================================
-- VIEWS FOR DASHBOARD METRICS
-- =============================================================================

-- Dashboard summary for admins
CREATE OR REPLACE VIEW admin_dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM customers WHERE status = 'new') as new_customers,
  (SELECT COUNT(*) FROM customers WHERE status = 'matched') as matched_customers,
  (SELECT COUNT(*) FROM projects WHERE status = 'pending') as pending_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'submitted') as submitted_projects,
  (SELECT COUNT(*) FROM projects WHERE status = 'approved') as approved_projects,
  (SELECT COUNT(*) FROM contractors WHERE approved = false) as pending_contractor_approvals,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'pending') as pending_payments,
  (SELECT COALESCE(SUM(referral_fee + filing_fee), 0) FROM projects WHERE status = 'approved') as total_revenue,
  (SELECT COALESCE(SUM(referral_fee), 0) FROM projects WHERE status = 'approved') as total_referral_fees,
  (SELECT COALESCE(SUM(filing_fee), 0) FROM projects WHERE status = 'approved') as total_filing_fees;

-- Contractor performance metrics
CREATE OR REPLACE VIEW contractor_performance AS
SELECT
  c.id,
  c.company_name,
  c.total_projects_completed,
  COALESCE(SUM(p.project_cost), 0) as total_project_value,
  COALESCE(SUM(p.referral_fee + p.filing_fee), 0) as total_fees_generated,
  c.filing_fees_owed,
  c.referral_fees_owed,
  (c.filing_fees_owed + c.referral_fees_owed) as total_owed,
  COUNT(CASE WHEN p.status = 'approved' THEN 1 END) as approved_projects,
  COUNT(CASE WHEN p.status = 'rejected' THEN 1 END) as rejected_projects
FROM contractors c
LEFT JOIN projects p ON c.id = p.contractor_id
GROUP BY c.id, c.company_name, c.total_projects_completed, c.filing_fees_owed, c.referral_fees_owed;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE customers IS 'Homeowners seeking HVAC rebates in Michigan';
COMMENT ON TABLE contractors IS 'Licensed HVAC contractors approved to work on rebate projects';
COMMENT ON TABLE projects IS 'HVAC installation projects with Michigan rebate applications';
COMMENT ON TABLE admins IS 'Platform administrators managing the system';
COMMENT ON TABLE payments IS 'All payments tracked in the system (approval fees, filing fees, referral fees)';
COMMENT ON TABLE invoices IS 'Generated invoices for contractor fees';
COMMENT ON TABLE audit_logs IS 'Audit trail of all important system actions';
COMMENT ON TABLE notifications IS 'Email and SMS notifications sent to users';
