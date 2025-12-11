# ThermoGrid Database Setup Guide

## 📦 Database Schema Overview

Complete PostgreSQL schema for ThermoGrid with **22 tables**, full **Row Level Security (RLS)**, and comprehensive relationships.

## 🗄️ Database Tables

### Core Tables (5)
1. **profiles** - User profiles (extends Supabase auth.users)
2. **customers** - Customer details and property information
3. **contractors** - Contractor business profiles
4. **projects** - HVAC installation projects
5. **rebate_programs** - Available rebate programs

### Relationship Tables (6)
6. **contractor_certifications** - Contractor certifications (EPA, NATE, etc.)
7. **contractor_specialties** - Contractor expertise areas
8. **contractor_shortlist** - Matched contractors per project
9. **project_rebates** - Project-specific rebate applications
10. **project_steps** - Project timeline tracking
11. **eligibility_results** - Rebate eligibility calculations

### Transaction Tables (5)
12. **consultations** - Consultation requests and scheduling
13. **documents** - File upload tracking
14. **messages** - Customer-contractor messaging
15. **notifications** - System notifications
16. **reviews** - Contractor reviews and ratings

### Supporting Tables (2)
17. **contractor_availability** - Contractor scheduling
18. **audit_log** - System audit trail

## 🚀 Setup Instructions for Supabase

### Method 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase project**
   - Navigate to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema**
   - Copy the entire contents of `database/schema.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Tables Created**
   - Go to "Table Editor" in sidebar
   - You should see all 22 tables listed

### Method 2: Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push --db-url "your-database-connection-string"

# Or apply the schema file directly
psql "your-database-connection-string" -f database/schema.sql
```

### Method 3: Direct PostgreSQL Connection

```bash
# Connect using psql
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the schema file
\i /path/to/thermogrid/database/schema.sql
```

## 🔐 Row Level Security (RLS) Policies

All tables have RLS enabled with these key policies:

### Customer Policies:
- ✅ Can view/update their own data
- ✅ Can view their projects
- ✅ Can view shortlisted contractors
- ✅ Can send consultations
- ✅ Can upload documents

### Contractor Policies:
- ✅ Can view/update their own profile
- ✅ Can view projects they're shortlisted for
- ✅ Can view limited project info (privacy-protected)
- ✅ Can view full info after selection
- ✅ Can respond to consultations

### Public Access:
- ✅ Anyone can view verified contractors
- ✅ Anyone can view active rebate programs
- ✅ Anyone can view contractor reviews

## 📊 Key Relationships

```
profiles (1) ──→ (1) customers
profiles (1) ──→ (1) contractors

customers (1) ──→ (many) projects
contractors (1) ──→ (many) projects (selected)

projects (1) ──→ (many) project_rebates
projects (1) ──→ (many) contractor_shortlist
projects (1) ──→ (many) consultations
projects (1) ──→ (many) documents
projects (1) ──→ (many) messages
projects (1) ──→ (many) project_steps

contractors (1) ──→ (many) contractor_certifications
contractors (1) ──→ (many) contractor_specialties
contractors (1) ──→ (many) reviews

rebate_programs (1) ──→ (many) project_rebates
```

## 🎯 Database Enums

### user_role
- `customer`
- `contractor`
- `admin`

### project_status
- `eligibility_check`
- `contractor_selection`
- `consultation_scheduled`
- `in_progress`
- `installation_complete`
- `rebate_submitted`
- `completed`
- `cancelled`

### contractor_status
- `pending`
- `verified`
- `suspended`
- `rejected`

### document_status
- `pending`
- `approved`
- `rejected`
- `requires_revision`

### rebate_status
- `not_started`
- `in_progress`
- `submitted`
- `under_review`
- `approved`
- `rejected`
- `payment_issued`

## 🔧 Helper Functions

### calculate_match_score(contractor_id, project_id)
Calculates a 0-100 match score based on:
- Verification status (20 pts)
- Contractor rating (20 pts)
- Years of experience (15 pts)
- Availability (15 pts)
- Specialty match (20 pts)
- Active certifications (10 pts)

**Usage:**
```sql
SELECT calculate_match_score(
  'contractor-uuid',
  'project-uuid'
);
```

### get_contractor_distance(contractor_id, customer_id)
Returns distance between contractor and customer.

**Usage:**
```sql
SELECT get_contractor_distance(
  'contractor-uuid',
  'customer-uuid'
);
```

## 📈 Useful Views

### contractor_profiles
Aggregated contractor data with certifications and specialties:
```sql
SELECT * FROM contractor_profiles WHERE status = 'verified';
```

### project_summary
Complete project overview with customer and contractor info:
```sql
SELECT * FROM project_summary WHERE status = 'in_progress';
```

## 🧪 Sample Queries

### Get matched contractors for a project:
```sql
SELECT 
  cp.*,
  cs.match_score,
  cs.visibility
FROM contractor_profiles cp
JOIN contractor_shortlist cs ON cp.id = cs.contractor_id
WHERE cs.project_id = 'your-project-uuid'
ORDER BY cs.match_score DESC;
```

### Get customer's active projects:
```sql
SELECT 
  p.*,
  c.company_name as contractor,
  COUNT(pr.id) as rebate_count,
  SUM(pr.amount) as total_rebates
FROM projects p
LEFT JOIN contractors c ON p.selected_contractor_id = c.id
LEFT JOIN project_rebates pr ON p.id = pr.id
WHERE p.customer_id = 'customer-uuid'
  AND p.status NOT IN ('completed', 'cancelled')
GROUP BY p.id, c.company_name;
```

### Get available rebate programs for location:
```sql
SELECT * FROM rebate_programs
WHERE (state = 'California' OR state IS NULL)
  AND is_active = true
  AND (end_date IS NULL OR end_date > CURRENT_DATE)
ORDER BY amount DESC;
```

### Get contractor's pending consultations:
```sql
SELECT 
  con.*,
  p.system_type,
  c.full_name as customer_name,
  cust.city || ', ' || cust.state as location
FROM consultations con
JOIN projects p ON con.project_id = p.id
JOIN customers cust ON con.customer_id = cust.id
JOIN profiles c ON cust.profile_id = c.id
WHERE con.contractor_id = 'contractor-uuid'
  AND con.status = 'requested'
ORDER BY con.created_at DESC;
```

## 🔔 Triggers & Automation

### Auto-update timestamps
All tables with `updated_at` automatically update on row changes.

### Auto-update contractor ratings
Contractor rating and review count automatically update when reviews are added/modified.

### Future triggers to add:
- [ ] Notification creation on project status change
- [ ] Email notification on consultation request
- [ ] Document expiry reminders
- [ ] Rebate deadline alerts

## 🌱 Seeding Sample Data

Uncomment the sample data section in `schema.sql` to add:
- 3 sample rebate programs (Federal, State, Utility)

For development, you'll need to:
1. Create test users in Supabase Auth
2. Insert corresponding profile records
3. Create sample customers and contractors
4. Generate test projects

## 🔄 Migrations

For schema changes, create migration files:

```bash
# Create new migration
supabase migration new add_table_name

# Edit the migration file
# Then apply:
supabase db push
```

## 📝 Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-connection-string
```

## 🔍 Verification Checklist

After setup, verify:

- [ ] All 22 tables created
- [ ] All indexes created
- [ ] All enums defined
- [ ] RLS policies active on all tables
- [ ] Triggers working (test by updating a record)
- [ ] Views accessible
- [ ] Helper functions executable
- [ ] Sample data inserted (if applicable)

## 🛡️ Security Best Practices

1. **Never expose service role key** in frontend code
2. **Use anon key** for client-side operations
3. **Test RLS policies** thoroughly before production
4. **Enable Realtime** only for necessary tables
5. **Use prepared statements** to prevent SQL injection
6. **Audit log** tracks all sensitive operations
7. **Rotate database passwords** regularly

## 📊 Database Size Estimates

Expected storage per 1000 users:
- Users/Profiles: ~50 KB
- Projects: ~200 KB
- Documents (metadata only): ~100 KB
- Messages: ~500 KB
- Notifications: ~200 KB
- **Total**: ~1 MB per 1000 users

File storage (Supabase Storage):
- Documents: 2-5 MB per project average
- Profile images: 200 KB per contractor

## 🚨 Common Issues & Solutions

### Issue: RLS blocking queries
**Solution:** Make sure you're authenticated and calling from the correct user context.

### Issue: Foreign key violations
**Solution:** Ensure parent records exist before inserting child records. Follow this order:
1. profiles
2. customers/contractors
3. projects
4. everything else

### Issue: Enum type errors
**Solution:** Use exact enum values (case-sensitive):
```sql
-- ✅ Correct
INSERT INTO projects (status) VALUES ('eligibility_check');

-- ❌ Wrong
INSERT INTO projects (status) VALUES ('Eligibility Check');
```

### Issue: Trigger not firing
**Solution:** Verify trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%updated_at%';
```

## 📚 Next Steps

1. **Set up Supabase client** in your Next.js app
2. **Create API routes** that interact with these tables
3. **Implement authentication** flow
4. **Add real-time subscriptions** for notifications
5. **Set up file storage** in Supabase Storage for documents
6. **Create database backup** strategy
7. **Monitor performance** and add indexes as needed

## 🔗 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

---

**Schema Version:** 1.0  
**Last Updated:** December 11, 2025  
**Compatible with:** PostgreSQL 14+, Supabase
