# Hacvent - Michigan HVAC Rebate Platform

## 🎯 Project Overview

**Hacvent** is a Michigan-focused HVAC rebate management platform that connects homeowners with licensed contractors and streamlines the rebate application process through the Michigan energy rebate programs.

### Key Differentiators

- **Michigan-Only Focus**: Specialized for Michigan rebate programs
- **Admin-Driven**: Admins manage workflow and verify eligibility
- **Simple Fee Structure**: Transparent pricing for contractors
- **Streamlined Process**: From intake to rebate approval

---

## 👥 User Roles

### 1. **Admin** (Platform Operators)

- Manage customer intake and eligibility
- Verify customers on Michigan rebate portal
- Assign contractors to customers
- Submit project paperwork to Michigan
- Track payments and generate invoices
- View analytics and reports

**Permissions:**

- `admin`: Standard admin access
- `superadmin`: Full access including payment management

### 2. **Customer** (Homeowners)

- Submit eligibility intake form
- View assigned contractor
- Track project status
- Upload required documents
- Receive rebate status updates

### 3. **Contractor** (HVAC Companies)

- Complete onboarding ($50 approval fee)
- View assigned customers
- Update project progress
- Upload installation paperwork
- View and pay invoices

---

## 💰 Fee Structure

### Contractor Fees

| Fee Type         | Amount | When Charged                |
| ---------------- | ------ | --------------------------- |
| **Approval Fee** | $50    | One-time, during onboarding |
| **Filing Fee**   | $25    | Per project, when submitted |
| **Referral Fee** | Tiered | Per project, when approved  |

### Referral Fee Tiers

| Project Cost     | Referral Fee |
| ---------------- | ------------ |
| Under $2,500     | $0           |
| $2,500 - $4,499  | $150         |
| $4,500 - $7,999  | $250         |
| $8,000 - $14,999 | $400         |
| $15,000+         | $600         |

**Example:**

- Project cost: $8,500
- Referral fee: $400
- Filing fee: $25
- **Total contractor fees: $425**

---

## 🔄 Core Workflows

### 1. Customer Intake

```
Customer completes intake form
  ↓
Admin reviews eligibility
  ↓
Admin verifies on Michigan portal
  ↓
Admin assigns contractor
  ↓
Customer & contractor notified
  ↓
Status: new → matched
```

### 2. Contractor Onboarding

```
Contractor applies
  ↓
$50 approval fee payment
  ↓
Admin reviews credentials
  ↓
Admin approves contractor
  ↓
Contractor can receive assignments
  ↓
Status: pending → approved
```

### 3. Project Completion

```
Contractor completes install
  ↓
Contractor uploads paperwork
  ↓
Admin reviews & submits to Michigan
  ↓
Michigan approves rebate
  ↓
Fees calculated (referral + filing)
  ↓
Invoice generated
  ↓
Contractor pays invoice
  ↓
Status: pending → submitted → approved
```

---

## 🗄️ Database Schema

### Core Tables

- `customers` - Homeowner information and eligibility
- `contractors` - HVAC company profiles and credentials
- `projects` - HVAC installations with rebate applications
- `admins` - Platform administrators
- `payments` - All payment tracking
- `invoices` - Generated contractor invoices
- `audit_logs` - System action history
- `notifications` - Email/SMS notifications

### Key Relationships

```
customers ←→ projects ←→ contractors
    ↓           ↓
 projects → payments → invoices
```

---

## 📊 Admin Dashboard Features

### Overview Metrics

- New customers (unassigned)
- Matched customers
- Pending projects
- Submitted projects
- Approved projects
- Pending contractor approvals
- Pending payments
- Total revenue

### Management Pages

1. **Customers** - View, assign, update status
2. **Contractors** - Approve, manage, track performance
3. **Projects** - Submit, track, approve
4. **Payments** - Invoices, payment tracking
5. **Reports** - Revenue, contractor performance, trends

---

## 🔧 Tech Stack

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend

- **Supabase** - PostgreSQL database + auth
- **Next.js API Routes** - Backend API
- **Row Level Security** - Data security

### Services

- **Stripe** - Payment processing
- **SendGrid** - Email notifications
- **Twilio** - SMS notifications (optional)

---

## 📁 Project Structure

```
hacvent/
├── pages/
│   ├── admin/                  # Admin dashboard pages
│   │   ├── dashboard.tsx
│   │   ├── customers.tsx
│   │   ├── contractors.tsx
│   │   ├── projects.tsx
│   │   ├── payments.tsx
│   │   └── reports.tsx
│   ├── api/                    # API routes
│   │   ├── admin/
│   │   ├── intake.ts
│   │   └── webhooks/
│   ├── customer-intake.tsx     # Public intake form
│   ├── dashboard.tsx           # Customer dashboard
│   └── contractor-dashboard.tsx # Contractor dashboard
├── components/
│   ├── admin/                  # Admin-specific components
│   ├── customer/               # Customer components
│   └── contractor/             # Contractor components
├── lib/
│   ├── supabase.ts            # Database client
│   ├── feeCalculator.ts       # Fee calculation logic
│   └── storage.ts             # File uploads
└── database/
    ├── schema_michigan.sql     # Database schema
    └── seed_michigan.sql       # Demo data
```

---

## 🚀 Getting Started

### 1. Environment Setup

```bash
cp .env.example .env.local
# Add your Supabase, Stripe, and notification API keys
```

### 2. Database Setup

```bash
# Create Supabase project
# Run schema: database/schema_michigan.sql
# Run seeds: database/seed_michigan.sql
```

### 3. Install & Run

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 4. Demo Accounts

- **Admin**: admin@hacvent.com / Admin123!
- **Customer**: customer1@hacvent.com / Customer123!
- **Contractor**: contractor1@hacvent.com / Contractor123!

---

## 📈 Revenue Model

### Example Monthly Revenue

Assuming 20 projects/month:

| Fee Type      | Calculation             | Monthly    |
| ------------- | ----------------------- | ---------- |
| Filing Fees   | 20 × $25                | $500       |
| Referral Fees | Avg $350/project        | $7,000     |
| Approval Fees | 5 new contractors × $50 | $250       |
| **Total**     |                         | **$7,750** |

### Annual Projection

- **Monthly Average**: $7,750
- **Annual Revenue**: ~$93,000
- **Growth Potential**: Scale with contractor network

---

## 🎯 Success Metrics

### Platform Health

- Active contractors
- Customer satisfaction
- Project approval rate
- Average time to approval
- Payment collection rate

### Financial Metrics

- Monthly recurring revenue
- Average project value
- Fee collection rate
- Outstanding invoices

### Operational Metrics

- Time to assign contractor
- Time to submit project
- Michigan approval rate
- Customer retention

---

## 📞 Support

- **Website**: www.hacvent.com
- **Email**: support@hacvent.com
- **Phone**: 1-800-HACVENT

---

## 📝 License

Proprietary - All rights reserved

---

Built with ♥️ in Michigan | Empowering energy efficiency
