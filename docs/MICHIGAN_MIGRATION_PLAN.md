# Michigan Platform Migration Plan - Hacvent

## Overview

Restructuring from a national HVAC rebate platform (ThermoGrid) to a Michigan-focused rebate management platform (Hacvent) with simplified roles and admin-centric workflows.

## Business Model Changes

### Old Model (ThermoGrid)

- National coverage across US
- Complex multi-step customer workflow
- Customer-facing quote comparison
- Multiple rebate program integrations
- Self-service contractor marketplace

### New Model (Hacvent - Michigan)

- **Michigan only** - focused on Michigan rebate programs
- **Admin-driven** - admins manage most workflows
- **Simple fee structure**:
  - $50 contractor approval fee (one-time)
  - $25 filing fee per project
  - Tiered referral fees: $150/$250/$400/$600 based on project size
- **Streamlined roles**: Admin, Customer, Contractor only

## Database Migration

### Step 1: Backup Current Database

```bash
# Export current schema
pg_dump -U postgres -d thermogrid -s > backup_schema.sql

# Export current data
pg_dump -U postgres -d thermogrid -a > backup_data.sql
```

### Step 2: Create New Michigan Schema

```bash
# Apply new schema
psql -U postgres -d thermogrid -f database/schema_michigan.sql
```

### Step 3: Seed Demo Data

1. Create users in Supabase Auth dashboard:
   - admin@hacvent.com (Superadmin)
   - manager@hacvent.com (Admin)
   - customer1@hacvent.com (Customer)
   - customer2@hacvent.com (Customer)
   - contractor1@hacvent.com (Contractor)
   - contractor2@hacvent.com (Contractor)

2. Get auth UUIDs and update seed file
3. Run seed:

```bash
psql -U postgres -d thermogrid -f database/seed_michigan.sql
```

## Application Restructuring

### Pages to Keep & Modify

#### ✅ Keep (with modifications)

- `/pages/admin.tsx` → Rename to `/pages/admin/dashboard.tsx` (main admin dashboard)
- `/pages/dashboard.tsx` → Simplify for customer view only
- `/pages/contractor-dashboard.tsx` → Simplify for contractor view only
- `/pages/index.tsx` → Update to Michigan-focused landing

#### ❌ Remove/Archive

- `/pages/contractors.tsx` (contractor marketplace - not needed)
- `/pages/start-project.tsx` (customers don't self-start)
- `/pages/faq.tsx` (optional - can simplify to Michigan-specific)
- `/pages/contractor.tsx` (public contractor signup - make admin-only)

### New Pages to Create

```
/pages/
  ├── admin/
  │   ├── dashboard.tsx          ← Main admin dashboard (overview)
  │   ├── customers.tsx          ← Customer management
  │   ├── contractors.tsx        ← Contractor management
  │   ├── projects.tsx           ← Project tracking
  │   ├── payments.tsx           ← Payment & invoicing
  │   └── reports.tsx            ← Analytics & reports
  ├── customer-intake.tsx        ← Public intake form (replaces start-project)
  ├── dashboard.tsx              ← Customer dashboard (simplified)
  └── contractor-dashboard.tsx   ← Contractor dashboard (simplified)
```

### Components to Update

#### Admin Components (NEW)

```
components/admin/
  ├── CustomerTable.tsx          ← List/manage customers
  ├── ContractorTable.tsx        ← List/manage contractors
  ├── ProjectTable.tsx           ← List/manage projects
  ├── PaymentTable.tsx           ← Track payments/invoices
  ├── AssignContractorModal.tsx  ← Assign contractor to customer
  ├── SubmitProjectModal.tsx     ← Submit project to Michigan portal
  ├── DashboardStats.tsx         ← KPI cards
  └── RevenueChart.tsx           ← Revenue visualization
```

#### Customer Components (SIMPLIFY)

- Keep: Basic profile, project status view
- Remove: Quote comparison, contractor selection, rebate tracking

#### Contractor Components (SIMPLIFY)

- Keep: Assigned customers, project status, invoices
- Remove: Quote submission, bidding, marketplace features

### API Routes to Create

```
/pages/api/
  ├── admin/
  │   ├── customers/
  │   │   ├── index.ts           ← GET list, POST create
  │   │   ├── [id].ts            ← GET/PUT/DELETE customer
  │   │   └── assign.ts          ← POST assign contractor
  │   ├── contractors/
  │   │   ├── index.ts           ← GET list, POST create
  │   │   ├── [id].ts            ← GET/PUT/DELETE
  │   │   └── approve.ts         ← POST approve contractor
  │   ├── projects/
  │   │   ├── index.ts           ← GET list, POST create
  │   │   ├── [id].ts            ← GET/PUT/DELETE
  │   │   └── submit.ts          ← POST submit to Michigan
  │   ├── payments/
  │   │   ├── index.ts           ← GET list payments
  │   │   └── invoices.ts        ← GET/POST invoices
  │   └── reports/
  │       └── dashboard.ts       ← GET dashboard metrics
  ├── intake.ts                  ← POST customer intake form
  └── webhooks/
      └── payment.ts             ← Handle payment webhooks
```

## UI/UX Changes

### Color Scheme (Keep but update branding)

- Primary: Keep green/eco theme
- Update all "ThermoGrid" → "Hacvent"
- Add Michigan-specific elements (state outline, colors)

### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│ Hacvent Admin - Dashboard                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 KPI Cards:                                          │
│  [New Customers: 5] [Pending Projects: 3]              │
│  [Pending Payments: $1,250] [Total Revenue: $8,450]    │
│                                                          │
│  📈 Revenue Chart (Monthly)                             │
│  ┌──────────────────────────────────────────┐          │
│  │ Bar/line chart showing revenue breakdown  │          │
│  └──────────────────────────────────────────┘          │
│                                                          │
│  ⚡ Quick Actions:                                      │
│  [New Customer] [Assign Contractor] [Submit Project]    │
│                                                          │
│  📋 Recent Activity:                                    │
│  • Customer John Doe submitted intake (2 hrs ago)       │
│  • Project #123 approved by Michigan (1 day ago)        │
│  • Contractor ABC paid invoice (3 days ago)             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Implementation Order

### Phase 1: Database (1-2 days)

- [ ] Apply new Michigan schema
- [ ] Create seed data with demo accounts
- [ ] Test all constraints and triggers
- [ ] Verify RLS policies work

### Phase 2: API Layer (2-3 days)

- [ ] Create admin API routes
- [ ] Create customer intake API
- [ ] Create contractor API routes
- [ ] Add authentication/authorization middleware
- [ ] Test all endpoints

### Phase 3: Admin Dashboard (3-4 days)

- [ ] Create admin layout & navigation
- [ ] Build dashboard overview page
- [ ] Build customer management page
- [ ] Build contractor management page
- [ ] Build project management page
- [ ] Build payment/invoice page

### Phase 4: Customer/Contractor Views (2-3 days)

- [ ] Simplify customer dashboard
- [ ] Simplify contractor dashboard
- [ ] Create public intake form
- [ ] Update authentication flow

### Phase 5: Testing & Polish (2 days)

- [ ] End-to-end testing of all workflows
- [ ] Fix bugs and edge cases
- [ ] Update documentation
- [ ] Deploy to staging

## Workflows Implementation

### 1. Customer Intake Workflow

```
Customer fills intake form (public)
  ↓
Admin receives notification
  ↓
Admin verifies eligibility on Michigan portal
  ↓
Admin assigns contractor
  ↓
Customer & contractor both notified
  ↓
Status: new → matched
```

**Files to create:**

- `pages/customer-intake.tsx` (public form)
- `pages/api/intake.ts` (submit form)
- `components/admin/AssignContractorModal.tsx`

### 2. Contractor Approval Workflow

```
Contractor completes onboarding form
  ↓
$50 payment collected
  ↓
Admin reviews application
  ↓
Admin approves contractor
  ↓
Contractor can now receive assignments
  ↓
Status: pending → approved
```

**Files to create:**

- `pages/api/admin/contractors/approve.ts`
- `components/admin/ContractorApprovalModal.tsx`

### 3. Project Submission Workflow

```
Contractor completes installation
  ↓
Contractor uploads paperwork to dashboard
  ↓
Admin reviews & submits to Michigan portal
  ↓
Michigan approves rebate
  ↓
Admin marks project approved
  ↓
System calculates fees (referral + filing)
  ↓
Invoice generated for contractor
  ↓
Status: pending → submitted → approved
```

**Files to create:**

- `pages/api/admin/projects/submit.ts`
- `components/admin/SubmitProjectModal.tsx`
- `lib/feeCalculator.ts` (tiered fee logic)

## Fee Calculation Logic

```typescript
// lib/feeCalculator.ts
export function calculateReferralFee(projectCost: number): number {
  if (projectCost < 2500) return 0;
  if (projectCost >= 2500 && projectCost < 4500) return 150;
  if (projectCost >= 4500 && projectCost < 8000) return 250;
  if (projectCost >= 8000 && projectCost < 15000) return 400;
  return 600; // $15k+
}

export const FILING_FEE = 25;
export const APPROVAL_FEE = 50;

export function calculateProjectFees(projectCost: number) {
  return {
    referralFee: calculateReferralFee(projectCost),
    filingFee: FILING_FEE,
    total: calculateReferralFee(projectCost) + FILING_FEE,
  };
}
```

## Environment Variables

Update `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Application
NEXT_PUBLIC_APP_NAME=Hacvent
NEXT_PUBLIC_APP_TAGLINE="Michigan HVAC Rebates Made Easy"
NEXT_PUBLIC_STATE_FOCUS=Michigan

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Notifications
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Michigan Portal Integration (if available)
MICHIGAN_REBATE_PORTAL_API_KEY=...
MICHIGAN_REBATE_PORTAL_URL=...
```

## Success Metrics

After migration, the platform should support:

- ✅ Admin can manage all customers, contractors, and projects
- ✅ Customers submit intake and view project status
- ✅ Contractors view assignments and submit paperwork
- ✅ Automated fee calculation (tiered referral + filing)
- ✅ Invoice generation for contractors
- ✅ Email/SMS notifications at key milestones
- ✅ Dashboard showing revenue, pending items, metrics

## Next Steps

Would you like me to:

1. ✅ Start implementing the admin dashboard?
2. ✅ Create the customer intake form?
3. ✅ Build the API routes?
4. ✅ Update authentication to support the 3 roles?

Let me know which component you'd like to tackle first!
