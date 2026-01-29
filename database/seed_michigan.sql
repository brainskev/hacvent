-- Hacvent - Michigan HVAC Rebate Platform
-- Seed Data for Development/Testing
-- Create users in Supabase Auth first, then replace UUIDs below

-- =============================================================================
-- DEMO USERS TO CREATE IN SUPABASE AUTH
-- =============================================================================
-- 1. admin@hacvent.com (password: Admin123!) - Superadmin
-- 2. manager@hacvent.com (password: Manager123!) - Admin
-- 3. customer1@hacvent.com (password: Customer123!) - Customer
-- 4. customer2@hacvent.com (password: Customer123!) - Customer
-- 5. contractor1@hacvent.com (password: Contractor123!) - Contractor
-- 6. contractor2@hacvent.com (password: Contractor123!) - Contractor

-- Replace these placeholder UUIDs with actual auth.users IDs from Supabase
DO $$
DECLARE
  admin_id UUID := 'REPLACE-WITH-ADMIN-AUTH-UUID';
  manager_id UUID := 'REPLACE-WITH-MANAGER-AUTH-UUID';
  customer1_id UUID := 'REPLACE-WITH-CUSTOMER1-AUTH-UUID';
  customer2_id UUID := 'REPLACE-WITH-CUSTOMER2-AUTH-UUID';
  contractor1_id UUID := 'REPLACE-WITH-CONTRACTOR1-AUTH-UUID';
  contractor2_id UUID := 'REPLACE-WITH-CONTRACTOR2-AUTH-UUID';
  
  cust1_uuid UUID;
  cust2_uuid UUID;
  cont1_uuid UUID;
  cont2_uuid UUID;
  proj1_uuid UUID;
  proj2_uuid UUID;
  proj3_uuid UUID;
BEGIN

-- =============================================================================
-- ADMINS
-- =============================================================================
INSERT INTO admins (id, name, email, role, dashboard_permissions) VALUES
(admin_id, 'Sarah Johnson', 'admin@hacvent.com', 'superadmin', '{
  "view_customers": true,
  "edit_customers": true,
  "view_contractors": true,
  "approve_contractors": true,
  "view_projects": true,
  "submit_projects": true,
  "manage_payments": true,
  "view_reports": true,
  "manage_admins": true
}'::jsonb),
(manager_id, 'Mike Rodriguez', 'manager@hacvent.com', 'admin', '{
  "view_customers": true,
  "edit_customers": true,
  "view_contractors": true,
  "approve_contractors": false,
  "view_projects": true,
  "submit_projects": true,
  "manage_payments": false,
  "view_reports": true,
  "manage_admins": false
}'::jsonb);

-- =============================================================================
-- CONTRACTORS
-- =============================================================================
INSERT INTO contractors (
  id, company_name, contact_name, email, phone, license_number, 
  service_areas, approved, approval_fee_paid, approval_fee_paid_date, status
) VALUES
(contractor1_id, 'Great Lakes Comfort Systems', 'Tom Anderson', 'contractor1@hacvent.com', '313-555-0101', 'MI-HVAC-2024-001',
 '["Wayne", "Oakland", "Macomb", "Washtenaw"]'::jsonb, true, true, NOW() - INTERVAL '60 days', 'approved'),
(contractor2_id, 'Pure Michigan HVAC', 'Lisa Chen', 'contractor2@hacvent.com', '248-555-0202', 'MI-HVAC-2024-002',
 '["Kent", "Ottawa", "Muskegon", "Allegan"]'::jsonb, true, true, NOW() - INTERVAL '45 days', 'approved');

-- Store contractor UUIDs for later use
SELECT id INTO cont1_uuid FROM contractors WHERE email = 'contractor1@hacvent.com';
SELECT id INTO cont2_uuid FROM contractors WHERE email = 'contractor2@hacvent.com';

-- =============================================================================
-- CUSTOMERS
-- =============================================================================
INSERT INTO customers (
  id, name, phone, email, property_address, property_type, project_size, 
  hvac_type, eligibility_status, assigned_contractor_id, status
) VALUES
(customer1_id, 'Jennifer Martinez', '586-555-1001', 'customer1@hacvent.com', 
 '1234 Main Street, Detroit, MI 48201', 'single_family', 'medium', 
 'heat_pump', true, cont1_uuid, 'matched'),
(customer2_id, 'Robert Wilson', '616-555-1002', 'customer2@hacvent.com',
 '5678 Lake Avenue, Grand Rapids, MI 49504', 'single_family', 'large',
 'central_ac', true, cont2_uuid, 'matched');

-- Store customer UUIDs
SELECT id INTO cust1_uuid FROM customers WHERE email = 'customer1@hacvent.com';
SELECT id INTO cust2_uuid FROM customers WHERE email = 'customer2@hacvent.com';

-- Add more customers without contractors (new leads)
INSERT INTO customers (
  name, phone, email, property_address, property_type, project_size,
  hvac_type, eligibility_status, status
) VALUES
('David Thompson', '734-555-2001', 'david.thompson@email.com',
 '789 Oak Drive, Ann Arbor, MI 48104', 'single_family', 'small',
 'furnace', true, 'new'),
('Maria Garcia', '517-555-2002', 'maria.garcia@email.com',
 '321 Pine Street, Lansing, MI 48933', 'condo', 'medium',
 'ductless', false, 'new'),
('James Peterson', '248-555-2003', 'james.peterson@email.com',
 '456 Maple Road, Troy, MI 48084', 'single_family', 'large',
 'heat_pump', true, 'new');

-- =============================================================================
-- PROJECTS
-- =============================================================================
-- Project 1: Completed and approved
INSERT INTO projects (
  customer_id, contractor_id, project_cost, status, 
  submission_date, approval_date, confirmation_number, michigan_portal_ref, project_type
) VALUES
(cust1_uuid, cont1_uuid, 8500.00, 'approved',
 NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days', 
 'HACV-2026-001', 'MI-REBATE-789456', 'Heat Pump Installation')
RETURNING id INTO proj1_uuid;

-- Project 2: Submitted, pending approval
INSERT INTO projects (
  customer_id, contractor_id, project_cost, status,
  submission_date, confirmation_number, project_type
) VALUES
(cust2_uuid, cont2_uuid, 12000.00, 'submitted',
 NOW() - INTERVAL '7 days', 'HACV-2026-002', 'Central AC Installation')
RETURNING id INTO proj2_uuid;

-- Project 3: In progress (contractor assigned but not yet submitted)
INSERT INTO projects (
  customer_id, contractor_id, project_cost, status, project_type
) VALUES
(cust1_uuid, cont1_uuid, 5500.00, 'pending', 'Furnace Upgrade')
RETURNING id INTO proj3_uuid;

-- =============================================================================
-- PAYMENTS
-- =============================================================================
-- Approval fees (already paid by both contractors)
INSERT INTO payments (
  contractor_id, payment_type, amount, status, paid_date, payment_method, transaction_id
) VALUES
(cont1_uuid, 'approval_fee', 50.00, 'paid', NOW() - INTERVAL '60 days', 'credit_card', 'ch_1234567890'),
(cont2_uuid, 'approval_fee', 50.00, 'paid', NOW() - INTERVAL '45 days', 'credit_card', 'ch_0987654321');

-- Filing fee for Project 1 (approved project)
INSERT INTO payments (
  contractor_id, project_id, payment_type, amount, status, due_date
) VALUES
(cont1_uuid, proj1_uuid, 'filing_fee', 25.00, 'pending', NOW() + INTERVAL '30 days');

-- Referral fee for Project 1 (approved project, $8500 project → $400 referral fee)
INSERT INTO payments (
  contractor_id, project_id, payment_type, amount, status, due_date
) VALUES
(cont1_uuid, proj1_uuid, 'referral_fee', 400.00, 'pending', NOW() + INTERVAL '30 days');

-- Update contractor financial tracking
UPDATE contractors SET
  total_projects_completed = 1,
  filing_fees_owed = 25.00,
  referral_fees_owed = 400.00
WHERE id = cont1_uuid;

-- =============================================================================
-- INVOICES
-- =============================================================================
-- Invoice for contractor 1
INSERT INTO invoices (
  invoice_number, contractor_id, due_date, total_amount, status, line_items
) VALUES
('INV-2026-001', cont1_uuid, NOW() + INTERVAL '30 days', 425.00, 'unpaid', 
'[
  {"description": "Filing Fee - Project HACV-2026-001", "amount": 25.00, "project_id": "' || proj1_uuid || '"},
  {"description": "Referral Fee - Project HACV-2026-001 ($8,500 project)", "amount": 400.00, "project_id": "' || proj1_uuid || '"}
]'::jsonb);

-- =============================================================================
-- AUDIT LOGS
-- =============================================================================
INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, changes) VALUES
(admin_id, 'contractor_approved', 'contractor', cont1_uuid, '{"approved": true, "status": "approved"}'::jsonb),
(admin_id, 'contractor_approved', 'contractor', cont2_uuid, '{"approved": true, "status": "approved"}'::jsonb),
(admin_id, 'customer_assigned', 'customer', cust1_uuid, '{"assigned_contractor_id": "' || cont1_uuid || '", "status": "matched"}'::jsonb),
(admin_id, 'customer_assigned', 'customer', cust2_uuid, '{"assigned_contractor_id": "' || cont2_uuid || '", "status": "matched"}'::jsonb),
(admin_id, 'project_submitted', 'project', proj1_uuid, '{"status": "submitted", "submission_date": "' || (NOW() - INTERVAL '20 days')::text || '"}'::jsonb),
(admin_id, 'project_approved', 'project', proj1_uuid, '{"status": "approved", "approval_date": "' || (NOW() - INTERVAL '5 days')::text || '"}'::jsonb);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
INSERT INTO notifications (
  recipient_type, recipient_id, recipient_email, notification_type, 
  subject, message, status, sent_at
) VALUES
('customer', cust1_uuid, 'customer1@hacvent.com', 'customer_matched',
 'You''ve Been Matched with a Contractor!',
 'Great news! We''ve matched you with Great Lakes Comfort Systems for your HVAC project.',
 'sent', NOW() - INTERVAL '30 days'),
('contractor', cont1_uuid, 'contractor1@hacvent.com', 'new_customer_intake',
 'New Customer Assignment',
 'You''ve been assigned a new customer: Jennifer Martinez in Detroit.',
 'sent', NOW() - INTERVAL '30 days'),
('contractor', cont1_uuid, 'contractor1@hacvent.com', 'payment_reminder',
 'Invoice Due Soon - INV-2026-001',
 'Your invoice for $425.00 is due in 30 days. Please submit payment to avoid late fees.',
 'sent', NOW() - INTERVAL '1 day');

END $$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Uncomment to verify data after seeding

-- SELECT 'Admins' as table_name, COUNT(*) as count FROM admins
-- UNION ALL SELECT 'Contractors', COUNT(*) FROM contractors
-- UNION ALL SELECT 'Customers', COUNT(*) FROM customers
-- UNION ALL SELECT 'Projects', COUNT(*) FROM projects
-- UNION ALL SELECT 'Payments', COUNT(*) FROM payments
-- UNION ALL SELECT 'Invoices', COUNT(*) FROM invoices
-- UNION ALL SELECT 'Audit Logs', COUNT(*) FROM audit_logs
-- UNION ALL SELECT 'Notifications', COUNT(*) FROM notifications;

-- SELECT * FROM admin_dashboard_summary;
-- SELECT * FROM contractor_performance;
