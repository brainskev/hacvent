-- ThermoGrid Database Seed Data
-- Run this after schema.sql has been applied
-- Note: You must first create user accounts in Supabase Auth Dashboard

-- =============================================
-- IMPORTANT: Create these users first in Supabase Auth Dashboard:
-- =============================================
-- 1. customer1@thermogrid.com (password: Customer123!)
-- 2. customer2@thermogrid.com (password: Customer123!)
-- 3. contractor1@thermogrid.com (password: Contractor123!)
-- 4. contractor2@thermogrid.com (password: Contractor123!)
-- 5. contractor3@thermogrid.com (password: Contractor123!)
--
-- Then replace the UUIDs below with the actual auth.users IDs from Supabase

-- =============================================
-- SAMPLE REBATE PROGRAMS
-- =============================================

INSERT INTO rebate_programs (
    program_name, 
    program_type, 
    provider, 
    amount, 
    max_amount,
    state, 
    eligible_systems, 
    min_efficiency_rating, 
    requirements, 
    is_active, 
    description,
    application_url
) VALUES
(
    'Federal Tax Credit 25C', 
    'federal', 
    'IRS', 
    2000.00,
    2000.00,
    NULL, 
    ARRAY['Central Heat Pump', 'Central AC', 'Ductless', 'Geothermal'], 
    'SEER 16', 
    ARRAY['SEER 16+ or SEER2 15.2+', 'HSPF 8.5+ or HSPF2 7.8+', 'Professional installation required', 'ENERGY STAR certified equipment'], 
    true, 
    'Federal tax credit for energy-efficient home improvements. Up to $2,000 for heat pumps and central AC systems.',
    'https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit'
),
(
    'California Energy Upgrade Program', 
    'state', 
    'California Energy Commission', 
    1500.00,
    3000.00,
    'California', 
    ARRAY['Central Heat Pump', 'Ductless'], 
    'SEER 15', 
    ARRAY['ENERGY STAR certified', 'Must replace existing system', 'Income verification for enhanced rebates'], 
    true, 
    'State rebate for energy-efficient HVAC upgrades. Enhanced rebates available for income-qualified households.',
    'https://www.energy.ca.gov/programs-and-topics/programs/energy-upgrade-california'
),
(
    'PG&E Energy Efficiency Rebate', 
    'utility', 
    'Pacific Gas & Electric', 
    800.00,
    1200.00,
    'California', 
    ARRAY['Central Heat Pump', 'Central AC', 'Ductless'], 
    'SEER 15', 
    ARRAY['System must be installed by PG&E-qualified contractor', 'Post-installation inspection required', 'Minimum SEER 15 rating'], 
    true, 
    'Utility company rebate for efficient HVAC systems. Must be installed by qualified contractor in PG&E service area.',
    'https://www.pge.com/en_US/residential/save-energy-money/savings-solutions-and-rebates/rebates-by-product/rebates-by-product.page'
),
(
    'SoCal Gas Energy Savings Assistance', 
    'utility', 
    'Southern California Gas Company', 
    1000.00,
    1500.00,
    'California', 
    ARRAY['Central Heat Pump', 'Furnace'], 
    'AFUE 95', 
    ARRAY['Income qualification required', 'Must be SoCal Gas customer', 'Home energy assessment'], 
    true, 
    'Free HVAC system replacement for income-qualified customers in Southern California Gas service area.',
    'https://www.socalgas.com/save-money-and-energy/assistance-programs/energy-savings-assistance-program'
),
(
    'Mass Save Heat Pump Rebate', 
    'utility', 
    'Mass Save (Massachusetts)', 
    10000.00,
    10000.00,
    'Massachusetts', 
    ARRAY['Central Heat Pump', 'Ductless'], 
    'HSPF 10', 
    ARRAY['Must replace fossil fuel heating system', 'Whole-home heat pump installation', 'Energy assessment required'], 
    true, 
    'Generous rebate for replacing fossil fuel systems with heat pumps in Massachusetts. Up to $10,000 for whole-home installations.',
    'https://www.masssave.com/residential/heating-and-cooling/air-source-heat-pumps'
);

-- =============================================
-- SAMPLE PROFILES (Replace UUIDs with real auth.users IDs)
-- =============================================

-- Note: After creating users in Supabase Auth, run this query to get their IDs:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- Then uncomment and update these INSERT statements:

/*
-- Customer 1
INSERT INTO profiles (id, role, email, full_name, phone) VALUES
('REPLACE-WITH-AUTH-UUID-1', 'customer', 'customer1@thermogrid.com', 'John Anderson', '555-0101');

INSERT INTO customers (profile_id, address_line1, city, state, zip_code, home_type, system_age, current_system_type) VALUES
('REPLACE-WITH-AUTH-UUID-1', '123 Oak Street', 'San Francisco', 'California', '94102', 'single-family', '16-20', 'Central AC');

-- Customer 2
INSERT INTO profiles (id, role, email, full_name, phone) VALUES
('REPLACE-WITH-AUTH-UUID-2', 'customer', 'customer2@thermogrid.com', 'Sarah Martinez', '555-0102');

INSERT INTO customers (profile_id, address_line1, city, state, zip_code, home_type, system_age, current_system_type) VALUES
('REPLACE-WITH-AUTH-UUID-2', '456 Elm Avenue', 'Los Angeles', 'California', '90001', 'townhouse', '11-15', 'Ductless');

-- Contractor 1 - Elite HVAC Solutions
INSERT INTO profiles (id, role, email, full_name, phone) VALUES
('REPLACE-WITH-AUTH-UUID-3', 'contractor', 'contractor1@thermogrid.com', 'Michael Chen', '555-0201');

INSERT INTO contractors (
    profile_id, company_name, license_number, business_address_line1, 
    city, state, zip_code, service_radius, years_experience, completed_projects,
    rating, total_reviews, status, availability, bio, insurance_verified, verified_at
) VALUES
('REPLACE-WITH-AUTH-UUID-3', 'Elite HVAC Solutions', 'CA-HVAC-12345', '789 Commercial Blvd',
 'San Francisco', 'California', '94103', 50, 15, 250,
 4.8, 89, 'verified', 'available_now', 
 'Specializing in high-efficiency heat pump installations with over 15 years of experience. EPA and NATE certified.',
 true, NOW());

INSERT INTO contractor_certifications (contractor_id, certification_name, issuing_organization, verified) 
SELECT id, 'EPA 608 Universal', 'Environmental Protection Agency', true 
FROM contractors WHERE company_name = 'Elite HVAC Solutions';

INSERT INTO contractor_certifications (contractor_id, certification_name, issuing_organization, verified) 
SELECT id, 'NATE Certified', 'North American Technician Excellence', true 
FROM contractors WHERE company_name = 'Elite HVAC Solutions';

INSERT INTO contractor_specialties (contractor_id, specialty_name)
SELECT id, 'Central Heat Pump' FROM contractors WHERE company_name = 'Elite HVAC Solutions'
UNION ALL
SELECT id, 'Ductless' FROM contractors WHERE company_name = 'Elite HVAC Solutions';

-- Contractor 2 - Bay Area Climate Control
INSERT INTO profiles (id, role, email, full_name, phone) VALUES
('REPLACE-WITH-AUTH-UUID-4', 'contractor', 'contractor2@thermogrid.com', 'Jennifer Williams', '555-0202');

INSERT INTO contractors (
    profile_id, company_name, license_number, business_address_line1, 
    city, state, zip_code, service_radius, years_experience, completed_projects,
    rating, total_reviews, status, availability, bio, insurance_verified, verified_at
) VALUES
('REPLACE-WITH-AUTH-UUID-4', 'Bay Area Climate Control', 'CA-HVAC-23456', '321 Service Road',
 'Oakland', 'California', '94612', 40, 12, 180,
 4.7, 64, 'verified', 'available_soon', 
 'Family-owned business serving the Bay Area for over a decade. Experts in energy-efficient cooling and heating solutions.',
 true, NOW());

INSERT INTO contractor_certifications (contractor_id, certification_name, issuing_organization, verified) 
SELECT id, 'EPA 608 Type II', 'Environmental Protection Agency', true 
FROM contractors WHERE company_name = 'Bay Area Climate Control';

INSERT INTO contractor_specialties (contractor_id, specialty_name)
SELECT id, 'Central AC' FROM contractors WHERE company_name = 'Bay Area Climate Control'
UNION ALL
SELECT id, 'Central Heat Pump' FROM contractors WHERE company_name = 'Bay Area Climate Control';

-- Contractor 3 - GreenTech HVAC
INSERT INTO profiles (id, role, email, full_name, phone) VALUES
('REPLACE-WITH-AUTH-UUID-5', 'contractor', 'contractor3@thermogrid.com', 'David Rodriguez', '555-0203');

INSERT INTO contractors (
    profile_id, company_name, license_number, business_address_line1, 
    city, state, zip_code, service_radius, years_experience, completed_projects,
    rating, total_reviews, status, availability, bio, insurance_verified, verified_at
) VALUES
('REPLACE-WITH-AUTH-UUID-5', 'GreenTech HVAC', 'CA-HVAC-34567', '555 Green Street',
 'San Jose', 'California', '95110', 60, 20, 400,
 4.9, 142, 'verified', 'available_now', 
 'Award-winning green energy contractor specializing in sustainable heating and cooling. LEED certified with extensive heat pump expertise.',
 true, NOW());

INSERT INTO contractor_certifications (contractor_id, certification_name, issuing_organization, verified) 
SELECT id, 'EPA 608 Universal', 'Environmental Protection Agency', true 
FROM contractors WHERE company_name = 'GreenTech HVAC';

INSERT INTO contractor_certifications (contractor_id, certification_name, issuing_organization, verified) 
SELECT id, 'LEED AP', 'U.S. Green Building Council', true 
FROM contractors WHERE company_name = 'GreenTech HVAC';

INSERT INTO contractor_specialties (contractor_id, specialty_name)
SELECT id, 'Central Heat Pump' FROM contractors WHERE company_name = 'GreenTech HVAC'
UNION ALL
SELECT id, 'Geothermal' FROM contractors WHERE company_name = 'GreenTech HVAC'
UNION ALL
SELECT id, 'Ductless' FROM contractors WHERE company_name = 'GreenTech HVAC';

-- =============================================
-- SAMPLE PROJECT FOR CUSTOMER 1
-- =============================================

INSERT INTO projects (
    customer_id, project_name, system_type, desired_efficiency_rating,
    estimated_start_date, status, total_cost, total_rebate_amount, notes
)
SELECT 
    c.id, 
    'Heat Pump Installation', 
    'Central Heat Pump', 
    'SEER 18',
    (CURRENT_DATE + INTERVAL '30 days')::DATE,
    'contractor_selection',
    15000.00,
    3800.00,
    'Looking to replace old AC unit with energy-efficient heat pump'
FROM customers c
JOIN profiles p ON c.profile_id = p.id
WHERE p.email = 'customer1@thermogrid.com';

-- Create eligibility results for the project
INSERT INTO eligibility_results (
    project_id, total_savings, federal_credit, state_rebate, 
    utility_rebate, location, system_type, efficiency_rating
)
SELECT 
    p.id,
    3800.00,
    2000.00,
    1500.00,
    800.00,
    'San Francisco, CA 94102',
    'Central Heat Pump',
    'SEER 18'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

-- Add contractors to shortlist
INSERT INTO contractor_shortlist (project_id, contractor_id, match_score, visibility)
SELECT 
    p.id,
    con.id,
    95,
    'limited'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN contractors con
WHERE pr.email = 'customer1@thermogrid.com'
AND con.company_name = 'Elite HVAC Solutions';

INSERT INTO contractor_shortlist (project_id, contractor_id, match_score, visibility)
SELECT 
    p.id,
    con.id,
    92,
    'limited'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN contractors con
WHERE pr.email = 'customer1@thermogrid.com'
AND con.company_name = 'GreenTech HVAC';

INSERT INTO contractor_shortlist (project_id, contractor_id, match_score, visibility)
SELECT 
    p.id,
    con.id,
    88,
    'limited'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN contractors con
WHERE pr.email = 'customer1@thermogrid.com'
AND con.company_name = 'Bay Area Climate Control';

-- Add project rebates
INSERT INTO project_rebates (project_id, rebate_program_id, amount, status)
SELECT 
    p.id,
    rp.id,
    2000.00,
    'not_started'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN rebate_programs rp
WHERE pr.email = 'customer1@thermogrid.com'
AND rp.program_name = 'Federal Tax Credit 25C';

INSERT INTO project_rebates (project_id, rebate_program_id, amount, status)
SELECT 
    p.id,
    rp.id,
    1500.00,
    'not_started'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN rebate_programs rp
WHERE pr.email = 'customer1@thermogrid.com'
AND rp.program_name = 'California Energy Upgrade Program';

INSERT INTO project_rebates (project_id, rebate_program_id, amount, status)
SELECT 
    p.id,
    rp.id,
    800.00,
    'not_started'
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
CROSS JOIN rebate_programs rp
WHERE pr.email = 'customer1@thermogrid.com'
AND rp.program_name = 'PG&E Energy Efficiency Rebate';

-- Add sample notification for customer
INSERT INTO notifications (user_id, type, title, message, action_label, action_url)
SELECT 
    pr.id,
    'success',
    'Your contractors are ready!',
    'We found 3 qualified contractors for your heat pump installation project.',
    'View Contractors',
    '/dashboard'
FROM profiles pr
WHERE pr.email = 'customer1@thermogrid.com';

-- Add more notifications
INSERT INTO notifications (user_id, type, title, message, action_label, action_url)
SELECT 
    pr.id,
    'info',
    'Rebate programs updated',
    'New federal tax credits available for heat pump installations in 2025.',
    'View Programs',
    '/dashboard'
FROM profiles pr
WHERE pr.email = 'customer1@thermogrid.com';

-- Add project steps/timeline
INSERT INTO project_steps (project_id, step_number, title, description, status, completed_date, estimated_date)
SELECT 
    p.id,
    1,
    'Eligibility Confirmed',
    'Your home qualifies for $3,800 in rebates',
    'completed',
    NOW() - INTERVAL '2 days',
    NULL
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

INSERT INTO project_steps (project_id, step_number, title, description, status, estimated_date)
SELECT 
    p.id,
    2,
    'Select Contractor',
    'Choose from verified contractors in your area',
    'in-progress',
    (CURRENT_DATE + INTERVAL '7 days')::DATE
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

INSERT INTO project_steps (project_id, step_number, title, description, status, estimated_date)
SELECT 
    p.id,
    3,
    'Schedule Consultation',
    'Meet with contractor for assessment and quote',
    'pending',
    (CURRENT_DATE + INTERVAL '14 days')::DATE
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

INSERT INTO project_steps (project_id, step_number, title, description, status, estimated_date)
SELECT 
    p.id,
    4,
    'Installation',
    'Professional HVAC system installation',
    'pending',
    (CURRENT_DATE + INTERVAL '30 days')::DATE
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

INSERT INTO project_steps (project_id, step_number, title, description, status, estimated_date)
SELECT 
    p.id,
    5,
    'Submit Rebate Applications',
    'Upload documentation and apply for all eligible rebates',
    'pending',
    (CURRENT_DATE + INTERVAL '35 days')::DATE
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

INSERT INTO project_steps (project_id, step_number, title, description, status, estimated_date)
SELECT 
    p.id,
    6,
    'Receive Rebates',
    'Track approval status and receive payments',
    'pending',
    (CURRENT_DATE + INTERVAL '90 days')::DATE
FROM projects p
JOIN customers c ON p.customer_id = c.id
JOIN profiles pr ON c.profile_id = pr.id
WHERE pr.email = 'customer1@thermogrid.com';

-- Add sample contractor reviews
INSERT INTO reviews (project_id, contractor_id, customer_id, rating, title, review_text, would_recommend, is_verified, created_at)
SELECT 
    NULL, -- No project associated (previous customer review)
    con.id,
    c2.id,
    5,
    'Outstanding service and professionalism',
    'Elite HVAC installed our heat pump last year. The team was punctual, knowledgeable, and completed the job in two days. They helped us maximize our rebates and the system works perfectly. Highly recommend!',
    true,
    true,
    NOW() - INTERVAL '45 days'
FROM contractors con
CROSS JOIN customers c2
JOIN profiles pr2 ON c2.profile_id = pr2.id
WHERE con.company_name = 'Elite HVAC Solutions'
AND pr2.email = 'customer2@thermogrid.com';

INSERT INTO reviews (project_id, contractor_id, customer_id, rating, title, review_text, would_recommend, is_verified, created_at)
SELECT 
    NULL,
    con.id,
    c2.id,
    5,
    'Best HVAC contractor in the Bay Area',
    'GreenTech went above and beyond. They helped us navigate all the rebate paperwork and we saved over $4,000. The installation was seamless and the system is incredibly efficient. Worth every penny!',
    true,
    true,
    NOW() - INTERVAL '60 days'
FROM contractors con
CROSS JOIN customers c2
JOIN profiles pr2 ON c2.profile_id = pr2.id
WHERE con.company_name = 'GreenTech HVAC'
AND pr2.email = 'customer2@thermogrid.com';

INSERT INTO reviews (project_id, contractor_id, customer_id, rating, title, review_text, would_recommend, is_verified, created_at)
SELECT 
    NULL,
    con.id,
    c2.id,
    4,
    'Great work, very professional team',
    'Bay Area Climate Control did a good job installing our AC system. Communication could have been better but the final result is excellent. System runs quietly and efficiently.',
    true,
    true,
    NOW() - INTERVAL '30 days'
FROM contractors con
CROSS JOIN customers c2
JOIN profiles pr2 ON c2.profile_id = pr2.id
WHERE con.company_name = 'Bay Area Climate Control'
AND pr2.email = 'customer2@thermogrid.com';

-- Add contractor availability (next 7 days)
INSERT INTO contractor_availability (contractor_id, date, time_slot, is_available)
SELECT 
    con.id,
    (CURRENT_DATE + gs.day)::DATE,
    'morning',
    (gs.day % 3) != 0 -- Available most mornings
FROM contractors con
CROSS JOIN generate_series(0, 6) AS gs(day)
WHERE con.company_name = 'Elite HVAC Solutions';

INSERT INTO contractor_availability (contractor_id, date, time_slot, is_available)
SELECT 
    con.id,
    (CURRENT_DATE + gs.day)::DATE,
    'afternoon',
    true -- Always available afternoons
FROM contractors con
CROSS JOIN generate_series(0, 6) AS gs(day)
WHERE con.company_name = 'Elite HVAC Solutions';

INSERT INTO contractor_availability (contractor_id, date, time_slot, is_available)
SELECT 
    con.id,
    (CURRENT_DATE + gs.day)::DATE,
    'morning',
    (gs.day % 2) = 0 -- Available every other morning
FROM contractors con
CROSS JOIN generate_series(0, 6) AS gs(day)
WHERE con.company_name = 'GreenTech HVAC';

INSERT INTO contractor_availability (contractor_id, date, time_slot, is_available)
SELECT 
    con.id,
    (CURRENT_DATE + gs.day)::DATE,
    'afternoon',
    (gs.day % 2) = 0 -- Available every other afternoon
FROM contractors con
CROSS JOIN generate_series(0, 6) AS gs(day)
WHERE con.company_name = 'Bay Area Climate Control';

*/

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- After seeding, run these to verify all data areas:

-- 1. Check rebate programs (should have 5)
-- SELECT program_name, program_type, amount, state FROM rebate_programs;

-- 2. Check profiles (should have 5: 2 customers, 3 contractors)
-- SELECT email, role, full_name FROM profiles ORDER BY role, email;

-- 3. Check contractors (should have 3 with certifications)
-- SELECT 
--     c.company_name, 
--     c.rating, 
--     c.years_experience, 
--     c.status,
--     COUNT(DISTINCT cc.id) as cert_count,
--     COUNT(DISTINCT cs.id) as specialty_count
-- FROM contractors c
-- LEFT JOIN contractor_certifications cc ON c.id = cc.contractor_id
-- LEFT JOIN contractor_specialties cs ON c.id = cs.contractor_id
-- GROUP BY c.id, c.company_name, c.rating, c.years_experience, c.status;

-- 4. Check projects with customer info (should have 1)
-- SELECT p.project_name, p.system_type, p.status, p.total_rebate_amount, pr.email as customer_email
-- FROM projects p
-- JOIN customers c ON p.customer_id = c.id
-- JOIN profiles pr ON c.profile_id = pr.id;

-- 5. Check contractor shortlist (should have 3 contractors matched)
-- SELECT 
--     pr.email as customer,
--     con.company_name as contractor,
--     cs.match_score
-- FROM contractor_shortlist cs
-- JOIN projects p ON cs.project_id = p.id
-- JOIN customers c ON p.customer_id = c.id
-- JOIN profiles pr ON c.profile_id = pr.id
-- JOIN contractors con ON cs.contractor_id = con.id
-- ORDER BY cs.match_score DESC;

-- 6. Check project steps/timeline (should have 6 steps)
-- SELECT 
--     p.project_name,
--     ps.step_number,
--     ps.title,
--     ps.status,
--     ps.estimated_date
-- FROM project_steps ps
-- JOIN projects p ON ps.project_id = p.id
-- ORDER BY ps.step_number;

-- 7. Check eligibility results (should have 1)
-- SELECT 
--     p.project_name,
--     er.total_savings,
--     er.federal_credit,
--     er.state_rebate,
--     er.utility_rebate
-- FROM eligibility_results er
-- JOIN projects p ON er.project_id = p.id;

-- 8. Check project rebates (should have 3 rebate applications)
-- SELECT 
--     p.project_name,
--     rp.program_name,
--     pr.amount,
--     pr.status
-- FROM project_rebates pr
-- JOIN projects p ON pr.project_id = p.id
-- JOIN rebate_programs rp ON pr.rebate_program_id = rp.id;

-- 9. Check notifications (should have 2+)
-- SELECT 
--     n.type,
--     n.title,
--     n.message,
--     n.read,
--     p.email
-- FROM notifications n
-- JOIN profiles p ON n.user_id = p.id
-- ORDER BY n.created_at DESC;

-- 10. Check contractor reviews (should have 3)
-- SELECT 
--     c.company_name,
--     r.rating,
--     r.title,
--     r.would_recommend,
--     r.is_verified
-- FROM reviews r
-- JOIN contractors c ON r.contractor_id = c.id
-- ORDER BY r.created_at DESC;

-- 11. Check contractor availability (should have multiple slots)
-- SELECT 
--     c.company_name,
--     ca.date,
--     ca.time_slot,
--     ca.is_available
-- FROM contractor_availability ca
-- JOIN contractors c ON ca.contractor_id = c.id
-- WHERE ca.date >= CURRENT_DATE
-- ORDER BY c.company_name, ca.date, ca.time_slot
-- LIMIT 20;

-- 12. Full dashboard summary
-- SELECT 
--     'Profiles' as table_name, COUNT(*) as count FROM profiles
-- UNION ALL
-- SELECT 'Customers', COUNT(*) FROM customers
-- UNION ALL
-- SELECT 'Contractors', COUNT(*) FROM contractors
-- UNION ALL
-- SELECT 'Projects', COUNT(*) FROM projects
-- UNION ALL
-- SELECT 'Rebate Programs', COUNT(*) FROM rebate_programs
-- UNION ALL
-- SELECT 'Project Rebates', COUNT(*) FROM project_rebates
-- UNION ALL
-- SELECT 'Contractor Shortlist', COUNT(*) FROM contractor_shortlist
-- UNION ALL
-- SELECT 'Notifications', COUNT(*) FROM notifications
-- UNION ALL
-- SELECT 'Project Steps', COUNT(*) FROM project_steps
-- UNION ALL
-- SELECT 'Reviews', COUNT(*) FROM reviews
-- UNION ALL
-- SELECT 'Certifications', COUNT(*) FROM contractor_certifications
-- UNION ALL
-- SELECT 'Specialties', COUNT(*) FROM contractor_specialties
-- UNION ALL
-- SELECT 'Eligibility Results', COUNT(*) FROM eligibility_results
-- UNION ALL
-- SELECT 'Availability Slots', COUNT(*) FROM contractor_availability;

-- End of seed script
