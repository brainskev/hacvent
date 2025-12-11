# Quick Start: Seeding ThermoGrid Database

## Step 1: Create Test Users in Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users** in the left sidebar
3. Click **"Add user"** button
4. Create these test users:

### Customer Account
- **Email:** `customer1@thermogrid.com`
- **Password:** `Customer123!`
- **Auto Confirm User:** ✅ (check this box)

### Contractor Accounts
- **Email:** `contractor1@thermogrid.com`
  - **Password:** `Contractor123!`
  - **Auto Confirm User:** ✅

- **Email:** `contractor2@thermogrid.com`
  - **Password:** `Contractor123!`
  - **Auto Confirm User:** ✅

- **Email:** `contractor3@thermogrid.com`
  - **Password:** `Contractor123!`
  - **Auto Confirm User:** ✅

## Step 2: Get User UUIDs

After creating the users, run this query in Supabase SQL Editor:

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC;
```

Copy the UUIDs for each email address.

## Step 3: Update Seed Script

1. Open `database/seed.sql`
2. Find the commented section starting with `/* -- Customer 1`
3. Replace all instances of `REPLACE-WITH-AUTH-UUID-X` with the actual UUIDs:
   - `REPLACE-WITH-AUTH-UUID-1` → customer1@thermogrid.com UUID
   - `REPLACE-WITH-AUTH-UUID-2` → customer2@thermogrid.com UUID (if you want a second customer)
   - `REPLACE-WITH-AUTH-UUID-3` → contractor1@thermogrid.com UUID
   - `REPLACE-WITH-AUTH-UUID-4` → contractor2@thermogrid.com UUID
   - `REPLACE-WITH-AUTH-UUID-5` → contractor3@thermogrid.com UUID

4. **Uncomment the entire section** (remove the `/*` at the start and `*/` at the end)

## Step 4: Run Seed Script

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Copy the entire contents of `database/seed.sql`
4. Paste into the editor
5. Click **"Run"** (or press Ctrl+Enter)

## Step 5: Verify Data

Run this comprehensive verification query:

### Quick Summary Check
```sql
SELECT 
    'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Contractors', COUNT(*) FROM contractors
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Rebate Programs', COUNT(*) FROM rebate_programs
UNION ALL
SELECT 'Project Rebates', COUNT(*) FROM project_rebates
UNION ALL
SELECT 'Contractor Shortlist', COUNT(*) FROM contractor_shortlist
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Project Steps', COUNT(*) FROM project_steps
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Certifications', COUNT(*) FROM contractor_certifications
UNION ALL
SELECT 'Specialties', COUNT(*) FROM contractor_specialties
UNION ALL
SELECT 'Eligibility Results', COUNT(*) FROM eligibility_results
UNION ALL
SELECT 'Availability Slots', COUNT(*) FROM contractor_availability;
```

### Expected Results:
- ✅ **5 Profiles** (2 customers, 3 contractors)
- ✅ **2 Customers**
- ✅ **3 Contractors** (Elite HVAC, Bay Area Climate Control, GreenTech HVAC)
- ✅ **1 Project** (Heat Pump Installation)
- ✅ **5 Rebate Programs** (Federal, California, PG&E, SoCal Gas, Mass Save)
- ✅ **3 Project Rebates** (applications for the project)
- ✅ **3 Contractor Shortlist** (matched contractors)
- ✅ **2+ Notifications** (for customer)
- ✅ **6 Project Steps** (timeline from eligibility to rebate receipt)
- ✅ **3 Reviews** (customer reviews for contractors)
- ✅ **5 Certifications** (EPA, NATE, LEED across contractors)
- ✅ **7 Specialties** (Heat Pumps, AC, Ductless, etc.)
- ✅ **1 Eligibility Result** ($3,800 in savings)
- ✅ **Multiple Availability Slots** (contractor scheduling)

### Detailed Verification Queries

#### Check Project Timeline
```sql
SELECT 
    ps.step_number,
    ps.title,
    ps.status,
    ps.estimated_date
FROM project_steps ps
JOIN projects p ON ps.project_id = p.id
ORDER BY ps.step_number;
```
Should show 6 steps: Eligibility (completed) → Select Contractor (in-progress) → 4 pending steps.

#### Check Contractor Reviews
```sql
SELECT 
    c.company_name,
    r.rating,
    r.title,
    r.would_recommend
FROM reviews r
JOIN contractors c ON r.contractor_id = c.id
ORDER BY r.created_at DESC;
```
Should show 3 verified reviews with ratings 5, 5, and 4 stars.

#### Check Eligibility & Rebates
```sql
SELECT 
    p.project_name,
    er.total_savings,
    er.federal_credit,
    er.state_rebate,
    er.utility_rebate
FROM eligibility_results er
JOIN projects p ON er.project_id = p.id;
```
Should show $3,800 total savings ($2,000 federal + $1,500 state + $800 utility).

## Step 6: Test the Application

1. Make sure your `.env.local` has the Supabase credentials
2. Start the dev server: `npm run dev`
3. Navigate to `/dashboard`
4. You should see:
   - ✅ **Stats Cards:** $3,800 savings, 3 contractors, 3 programs, 0 selected
   - ✅ **Project Timeline:** 6 steps (1 completed, 1 in-progress, 4 pending)
   - ✅ **Eligibility Summary:** $3,800 breakdown with 3 rebate programs
   - ✅ **Matched Contractors:** 3 verified contractors with ratings, certifications, specialties
   - ✅ **Notifications:** 2+ notifications (contractors ready, programs updated)
   - ✅ **Contractor Details:** Reviews, availability, experience, contact info

## Quick Seed (Alternative - Just Rebate Programs)

If you want to test without creating all users, you can just seed the rebate programs:

```sql
-- Just run the rebate programs section (lines 47-91 in seed.sql)
INSERT INTO rebate_programs (...) VALUES (...);
```

This will populate rebate programs but you won't see contractor/project data until you complete the full seed.

## Troubleshooting

### Error: "relation 'profiles' does not exist"
Run `database/schema.sql` first before running seed.sql.

### Error: "foreign key violation"
Make sure auth.users have been created before running the seed script.

### No data showing on dashboard
1. Check browser console for errors
2. Verify .env.local has correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Check Supabase SQL Editor for data: `SELECT * FROM projects;`
4. Ensure RLS policies allow access (user must be authenticated)

### RLS blocking access
For testing without authentication, temporarily disable RLS:
```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractors DISABLE ROW LEVEL SECURITY;
-- etc. (do this for all tables you want to test)
```

**Remember to re-enable RLS before production!**

## Next Steps

Once data is seeded and displaying:

1. ✅ Test contractor selection
2. ✅ Test consultation request form
3. ✅ Test notifications (mark as read)
4. ✅ Test document upload (UI only - storage setup required)
5. 🔜 Implement authentication flow
6. 🔜 Add contractor dashboard data fetching
7. 🔜 Set up Supabase Storage for documents

---

**Current Status:** Dashboard fetches real data from Supabase ✅  
**Demo User:** customer1@thermogrid.com  
**Database Contents:**
- ✅ 5 Rebate programs (Federal, State, Utility)
- ✅ 3 Verified contractors with certifications & specialties
- ✅ 1 Active project with full timeline (6 steps)
- ✅ 3 Contractor matches with scores (95, 92, 88)
- ✅ 3 Rebate applications ($2,000 + $1,500 + $800)
- ✅ Eligibility results ($3,800 total savings)
- ✅ 2+ Notifications
- ✅ 3 Customer reviews (verified)
- ✅ Contractor availability schedules
