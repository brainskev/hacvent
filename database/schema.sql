-- ThermoGrid Database Schema for Supabase
-- PostgreSQL with Row Level Security (RLS)
-- Created: December 11, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('customer', 'contractor', 'admin');
CREATE TYPE project_status AS ENUM ('eligibility_check', 'contractor_selection', 'consultation_scheduled', 'in_progress', 'installation_complete', 'rebate_submitted', 'completed', 'cancelled');
CREATE TYPE contractor_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE consultation_status AS ENUM ('requested', 'scheduled', 'completed', 'cancelled');
CREATE TYPE contact_method AS ENUM ('phone', 'email', 'either');
CREATE TYPE time_preference AS ENUM ('morning', 'afternoon', 'evening');
CREATE TYPE document_type AS ENUM ('proof_of_ownership', 'utility_bill', 'installation_certificate', 'manufacturer_certificate', 'energy_audit', 'income_verification', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected', 'requires_revision');
CREATE TYPE rebate_status AS ENUM ('not_started', 'in_progress', 'submitted', 'under_review', 'approved', 'rejected', 'payment_issued');
CREATE TYPE notification_type AS ENUM ('success', 'info', 'warning', 'error');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE availability_status AS ENUM ('available_now', 'available_soon', 'booked');
CREATE TYPE shortlist_visibility AS ENUM ('limited', 'full');

-- =============================================
-- USERS TABLE (extends Supabase auth.users)
-- =============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- =============================================
-- CUSTOMERS TABLE
-- =============================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    home_type VARCHAR(50), -- single-family, townhouse, condo, manufactured, multifamily
    system_age VARCHAR(20), -- 0-5, 6-10, 11-15, 16-20, 20+
    current_system_type VARCHAR(100),
    property_ownership BOOLEAN DEFAULT true,
    income_qualified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTRACTORS TABLE
-- =============================================

CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    business_address_line1 VARCHAR(255) NOT NULL,
    business_address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    service_radius INTEGER DEFAULT 50, -- miles
    years_experience INTEGER NOT NULL,
    completed_projects INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    status contractor_status DEFAULT 'pending',
    availability availability_status DEFAULT 'available_now',
    profile_image_url TEXT,
    bio TEXT,
    website_url VARCHAR(255),
    insurance_verified BOOLEAN DEFAULT false,
    insurance_expiry DATE,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTRACTOR CERTIFICATIONS
-- =============================================

CREATE TABLE contractor_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    certification_name VARCHAR(255) NOT NULL, -- EPA 608, NATE Certified, LEED, etc.
    certification_number VARCHAR(100),
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    verified BOOLEAN DEFAULT false,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contractor_certifications ON contractor_certifications(contractor_id);

-- =============================================
-- CONTRACTOR SPECIALTIES
-- =============================================

CREATE TABLE contractor_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    specialty_name VARCHAR(100) NOT NULL, -- Heat Pumps, Central AC, Ductless, Geothermal, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contractor_specialties ON contractor_specialties(contractor_id);

-- =============================================
-- PROJECTS TABLE
-- =============================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    selected_contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    project_name VARCHAR(255),
    system_type VARCHAR(100) NOT NULL, -- Central Heat Pump, Central AC, Ductless, etc.
    desired_efficiency_rating VARCHAR(50), -- SEER 18, HSPF 10, etc.
    estimated_start_date DATE,
    actual_start_date DATE,
    completion_date DATE,
    status project_status DEFAULT 'eligibility_check',
    total_cost DECIMAL(10,2),
    total_rebate_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_contractor ON projects(selected_contractor_id);
CREATE INDEX idx_projects_status ON projects(status);

-- =============================================
-- PROJECT TIMELINE/STEPS
-- =============================================

CREATE TABLE project_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- completed, in-progress, pending, blocked
    completed_date TIMESTAMP WITH TIME ZONE,
    estimated_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_steps ON project_steps(project_id);

-- =============================================
-- ELIGIBILITY RESULTS
-- =============================================

CREATE TABLE eligibility_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_savings DECIMAL(10,2) NOT NULL,
    federal_credit DECIMAL(10,2) DEFAULT 0,
    state_rebate DECIMAL(10,2) DEFAULT 0,
    utility_rebate DECIMAL(10,2) DEFAULT 0,
    manufacturer_rebate DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(255),
    system_type VARCHAR(100),
    efficiency_rating VARCHAR(50),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_eligibility_results ON eligibility_results(project_id);

-- =============================================
-- REBATE PROGRAMS
-- =============================================

CREATE TABLE rebate_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name VARCHAR(255) NOT NULL,
    program_type VARCHAR(50), -- federal, state, utility, manufacturer
    provider VARCHAR(255), -- IRS, California Energy Commission, PG&E, etc.
    amount DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2),
    percentage DECIMAL(5,2), -- if percentage-based
    state VARCHAR(50),
    utility_company VARCHAR(255),
    requirements TEXT[], -- array of requirements
    eligible_systems TEXT[], -- array of system types
    min_efficiency_rating VARCHAR(50),
    income_limits JSONB, -- {single: 50000, married: 75000, family_of_4: 100000}
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    application_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rebate_programs_state ON rebate_programs(state);
CREATE INDEX idx_rebate_programs_active ON rebate_programs(is_active);

-- =============================================
-- PROJECT REBATES (linking projects to programs)
-- =============================================

CREATE TABLE project_rebates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    rebate_program_id UUID NOT NULL REFERENCES rebate_programs(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status rebate_status DEFAULT 'not_started',
    application_date DATE,
    approval_date DATE,
    payment_date DATE,
    payment_amount DECIMAL(10,2),
    rejection_reason TEXT,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_project_rebates ON project_rebates(project_id);
CREATE INDEX idx_project_rebates_status ON project_rebates(status);

-- =============================================
-- CONTRACTOR SHORTLIST
-- =============================================

CREATE TABLE contractor_shortlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    match_score INTEGER, -- 0-100 algorithm score
    visibility shortlist_visibility DEFAULT 'limited',
    shortlisted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed_by_customer BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(project_id, contractor_id)
);

CREATE INDEX idx_shortlist_project ON contractor_shortlist(project_id);
CREATE INDEX idx_shortlist_contractor ON contractor_shortlist(contractor_id);

-- =============================================
-- CONSULTATIONS
-- =============================================

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    preferred_date DATE NOT NULL,
    preferred_time time_preference NOT NULL,
    contact_method contact_method DEFAULT 'either',
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    status consultation_status DEFAULT 'requested',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultations_project ON consultations(project_id);
CREATE INDEX idx_consultations_contractor ON consultations(contractor_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- =============================================
-- DOCUMENTS
-- =============================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    mime_type VARCHAR(100),
    status document_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_status ON documents(status);

-- =============================================
-- MESSAGES
-- =============================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_project ON messages(project_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_label VARCHAR(100),
    action_url TEXT,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- =============================================
-- REVIEWS
-- =============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    would_recommend BOOLEAN,
    response_text TEXT, -- contractor response
    response_date TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_contractor ON reviews(contractor_id);
CREATE INDEX idx_reviews_project ON reviews(project_id);

-- =============================================
-- CONTRACTOR AVAILABILITY
-- =============================================

CREATE TABLE contractor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot time_preference NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contractor_id, date, time_slot)
);

CREATE INDEX idx_availability_contractor ON contractor_availability(contractor_id);
CREATE INDEX idx_availability_date ON contractor_availability(date);

-- =============================================
-- AUDIT LOG
-- =============================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rebate_programs_updated_at BEFORE UPDATE ON rebate_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_rebates_updated_at BEFORE UPDATE ON project_rebates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER TO UPDATE CONTRACTOR RATING
-- =============================================

CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE contractors
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE contractor_id = NEW.contractor_id),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE contractor_id = NEW.contractor_id)
    WHERE id = NEW.contractor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_contractor_rating();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE eligibility_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE rebate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_rebates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_availability ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Customers: Can read/update own data
CREATE POLICY "Customers can view own data" ON customers
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Customers can update own data" ON customers
    FOR UPDATE USING (profile_id = auth.uid());

-- Contractors: Can read/update own data, others can view verified contractors
CREATE POLICY "Contractors can view own data" ON contractors
    FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Anyone can view verified contractors" ON contractors
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Contractors can update own data" ON contractors
    FOR UPDATE USING (profile_id = auth.uid());

-- Projects: Customers see their projects, contractors see shortlisted/selected projects
CREATE POLICY "Customers can view own projects" ON projects
    FOR SELECT USING (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
    );

CREATE POLICY "Contractors can view relevant projects" ON projects
    FOR SELECT USING (
        selected_contractor_id IN (SELECT id FROM contractors WHERE profile_id = auth.uid())
        OR id IN (
            SELECT project_id FROM contractor_shortlist 
            WHERE contractor_id IN (SELECT id FROM contractors WHERE profile_id = auth.uid())
        )
    );

CREATE POLICY "Customers can update own projects" ON projects
    FOR UPDATE USING (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
    );

-- Shortlist: Customers and contractors can view relevant shortlists
CREATE POLICY "View relevant shortlists" ON contractor_shortlist
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
        )
        OR contractor_id IN (SELECT id FROM contractors WHERE profile_id = auth.uid())
    );

-- Consultations: Customers and contractors can view their consultations
CREATE POLICY "View own consultations" ON consultations
    FOR SELECT USING (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
        OR contractor_id IN (SELECT id FROM contractors WHERE profile_id = auth.uid())
    );

-- Messages: Users can view messages they sent or received
CREATE POLICY "View own messages" ON messages
    FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Send messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Notifications: Users can view own notifications
CREATE POLICY "View own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Documents: Project participants can view documents
CREATE POLICY "View project documents" ON documents
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
            OR selected_contractor_id IN (SELECT id FROM contractors WHERE profile_id = auth.uid())
        )
    );

-- Reviews: Anyone can read, only customers can create for their projects
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews" ON reviews
    FOR INSERT WITH CHECK (
        customer_id IN (SELECT id FROM customers WHERE profile_id = auth.uid())
    );

-- Rebate Programs: Anyone can view active programs
CREATE POLICY "Anyone can view active rebate programs" ON rebate_programs
    FOR SELECT USING (is_active = true);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to calculate project match score
CREATE OR REPLACE FUNCTION calculate_match_score(
    p_contractor_id UUID,
    p_project_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    contractor_data RECORD;
    project_data RECORD;
BEGIN
    SELECT * INTO contractor_data FROM contractors WHERE id = p_contractor_id;
    SELECT * INTO project_data FROM projects p 
        JOIN customers c ON p.customer_id = c.id 
        WHERE p.id = p_project_id;
    
    -- Base score for being verified
    IF contractor_data.status = 'verified' THEN
        score := score + 20;
    END IF;
    
    -- Rating bonus (0-20 points)
    score := score + (contractor_data.rating * 4)::INTEGER;
    
    -- Experience bonus (0-15 points)
    IF contractor_data.years_experience >= 15 THEN
        score := score + 15;
    ELSIF contractor_data.years_experience >= 10 THEN
        score := score + 10;
    ELSIF contractor_data.years_experience >= 5 THEN
        score := score + 5;
    END IF;
    
    -- Availability bonus (0-15 points)
    IF contractor_data.availability = 'available_now' THEN
        score := score + 15;
    ELSIF contractor_data.availability = 'available_soon' THEN
        score := score + 8;
    END IF;
    
    -- Specialty match (0-20 points)
    IF EXISTS (
        SELECT 1 FROM contractor_specialties 
        WHERE contractor_id = p_contractor_id 
        AND specialty_name ILIKE '%' || project_data.system_type || '%'
    ) THEN
        score := score + 20;
    END IF;
    
    -- Certification bonus (0-10 points)
    IF EXISTS (
        SELECT 1 FROM contractor_certifications 
        WHERE contractor_id = p_contractor_id 
        AND verified = true 
        AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE)
    ) THEN
        score := score + 10;
    END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;

-- Function to get contractor distance from customer
CREATE OR REPLACE FUNCTION get_contractor_distance(
    p_contractor_id UUID,
    p_customer_id UUID
)
RETURNS VARCHAR AS $$
DECLARE
    distance DECIMAL;
BEGIN
    -- Placeholder: In production, use PostGIS for real distance calculation
    -- For now, return a random distance for demo purposes
    distance := (RANDOM() * 30 + 1)::DECIMAL(4,1);
    RETURN distance::VARCHAR || ' miles';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for contractor profiles with aggregated data
CREATE OR REPLACE VIEW contractor_profiles AS
SELECT 
    c.*,
    p.full_name,
    p.email,
    p.phone,
    ARRAY_AGG(DISTINCT cc.certification_name) FILTER (WHERE cc.certification_name IS NOT NULL) as certifications,
    ARRAY_AGG(DISTINCT cs.specialty_name) FILTER (WHERE cs.specialty_name IS NOT NULL) as specialties
FROM contractors c
JOIN profiles p ON c.profile_id = p.id
LEFT JOIN contractor_certifications cc ON c.id = cc.contractor_id AND cc.verified = true
LEFT JOIN contractor_specialties cs ON c.id = cs.contractor_id
GROUP BY c.id, p.full_name, p.email, p.phone;

-- View for project summary
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.*,
    c.full_name as customer_name,
    c.email as customer_email,
    cust.city || ', ' || cust.state || ' ' || cust.zip_code as customer_location,
    cont.company_name as contractor_name,
    cont.rating as contractor_rating,
    COUNT(DISTINCT pr.id) as rebate_count,
    SUM(pr.amount) as calculated_rebate_total
FROM projects p
JOIN customers cust ON p.customer_id = cust.id
JOIN profiles c ON cust.profile_id = c.id
LEFT JOIN contractors cont ON p.selected_contractor_id = cont.id
LEFT JOIN project_rebates pr ON p.id = pr.project_id
GROUP BY p.id, c.full_name, c.email, cust.city, cust.state, cust.zip_code, 
         cont.company_name, cont.rating;

-- =============================================
-- SAMPLE DATA SEEDS (Optional - for development)
-- =============================================

-- Note: Run these inserts after creating user accounts in Supabase Auth
-- They are commented out for production deployment

/*
-- Sample rebate programs
INSERT INTO rebate_programs (program_name, program_type, provider, amount, state, eligible_systems, min_efficiency_rating, requirements, is_active, description) VALUES
('Federal Tax Credit 25C', 'federal', 'IRS', 2000, NULL, ARRAY['Central Heat Pump', 'Central AC', 'Ductless'], 'SEER 16', ARRAY['SEER 16+', 'HSPF 8.5+', 'Professional installation required'], true, 'Federal tax credit for energy-efficient home improvements'),
('California Energy Upgrade Program', 'state', 'California Energy Commission', 1500, 'California', ARRAY['Central Heat Pump', 'Ductless'], 'SEER 15', ARRAY['ENERGY STAR certified', 'Income verification'], true, 'State rebate for energy upgrades'),
('PG&E Energy Efficiency Rebate', 'utility', 'PG&E', 800, 'California', ARRAY['Central Heat Pump', 'Central AC'], 'SEER 15', ARRAY['System must be installed by licensed contractor', 'Post-installation inspection'], true, 'Utility company rebate for efficient HVAC systems');
*/

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_customers_zip ON customers(zip_code);
CREATE INDEX idx_contractors_zip ON contractors(zip_code);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contractors_rating ON contractors(rating DESC);
CREATE INDEX idx_rebate_programs_type ON rebate_programs(program_type);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE profiles IS 'Extends Supabase auth.users with additional profile information';
COMMENT ON TABLE customers IS 'Customer-specific information including property details';
COMMENT ON TABLE contractors IS 'Contractor business information and verification status';
COMMENT ON TABLE projects IS 'HVAC installation projects with rebate tracking';
COMMENT ON TABLE contractor_shortlist IS 'Matched contractors for customer projects with privacy controls';
COMMENT ON TABLE consultations IS 'Consultation requests and scheduling';
COMMENT ON TABLE project_rebates IS 'Tracks individual rebate applications per project';
COMMENT ON TABLE documents IS 'Project-related document storage references';
COMMENT ON TABLE messages IS 'Direct messaging between customers and contractors';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE reviews IS 'Customer reviews of contractors after project completion';

-- End of schema
