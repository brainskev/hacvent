# Step 4 - What's Next: API Endpoints & Database

**Current Status:** 5 components complete and compiled ✅

---

## 🔨 Ready to Build: API Endpoints

All 5 components are ready to connect to backend API endpoints. Reference specs available in `STEP_4_PLANNING.md`.

### Quick Reference:

| Endpoint | Method | Purpose | Location to Create |
|----------|--------|---------|-------------------|
| `/api/pre-installation/financing` | POST | Get available financing plans | `pages/api/pre-installation/financing.ts` |
| `/api/pre-installation/select-financing` | POST | Save financing selection | `pages/api/pre-installation/select-financing.ts` |
| `/api/pre-installation/rebates` | GET | Get rebate programs & status | `pages/api/pre-installation/rebates.ts` |
| `/api/pre-installation/schedule-installation` | POST | Save installation date/time | `pages/api/pre-installation/schedule-installation.ts` |
| `/api/pre-installation/survey-checklist` | POST | Save checklist completion | `pages/api/pre-installation/survey-checklist.ts` |

---

## 📊 Ready to Create: Database Tables

SQL schemas are already written in `STEP_4_PLANNING.md` lines [database section].

### Tables to Create:

1. **installations** - Installation scheduling and crew assignments
2. **financing** - Financing plan selections and payment terms
3. **rebate_approvals** - Rebate pre-approval status tracking
4. **site_survey_checklists** - Site survey checklist records

---

## 💡 Development Approach

### Option 1: Build APIs First (Recommended)
1. Create 5 API endpoints using specs from STEP_4_PLANNING.md
2. Use mock data initially
3. Update components to call real endpoints
4. Replace mock data with database queries

### Option 2: Build Database First
1. Create 4 database tables
2. Build 5 API endpoints with database integration
3. Test components with real data

### Option 3: Parallel Development
1. Start API endpoints with mock data
2. Create database tables simultaneously
3. Connect them together

---

## 🎯 Recommended Next Action

Ready to proceed? Here are your options:

**Build API Endpoints:**
- Create `/pages/api/pre-installation/` directory
- Implement 5 endpoints (see specs in STEP_4_PLANNING.md)
- Start with mock data for quick testing
- Estimated time: 1-2 hours

**Create Database Tables:**
- Add migrations to `/database/migrations/`
- Run SQL schemas (defined in STEP_4_PLANNING.md)
- Set up Supabase tables
- Estimated time: 30 minutes

**Integrate Components:**
- Update components to call real API endpoints
- Replace mock data with API responses
- Add error handling and loading states
- Estimated time: 1 hour

---

## 📝 Component Integration Notes

All 5 components already have:
- ✅ Props for API callbacks (`onSelectPlan`, `onSubmitDocuments`, etc.)
- ✅ Loading states (`isLoading` prop)
- ✅ Mock data as fallback
- ✅ Error handling structure
- ✅ TypeScript interfaces for data structures

**Easy API Integration:**
```typescript
// Example: Connect FinancingOptions to API
<FinancingOptions
  projectCost={15000}
  netCost={12000}
  availablePlans={plansFromAPI}  // ← Will use real plans instead of mock
  onSelectPlan={async (plan, downPayment) => {
    // ← Call API endpoint to save selection
  }}
  isLoading={loading}  // ← Show loading state while fetching
/>
```

---

## 📂 File Structure When Complete

```
Step 4 Complete Structure:
├── components/
│   ├── FinancingOptions.tsx ✅
│   ├── RebatePreApproval.tsx ✅
│   ├── InstallationScheduling.tsx ✅
│   ├── SiteSurveyChecklist.tsx ✅
│   └── PreInstallationDashboard.tsx ✅
├── pages/api/pre-installation/
│   ├── financing.ts (TO BUILD)
│   ├── select-financing.ts (TO BUILD)
│   ├── rebates.ts (TO BUILD)
│   ├── schedule-installation.ts (TO BUILD)
│   └── survey-checklist.ts (TO BUILD)
└── database/
    ├── migrations/
    │   └── 002_add_pre_installation_tables.sql (TO CREATE)
    └── schema.sql (TO UPDATE)
```

---

## 🚀 Command to Proceed

Ready to build the next phase?

Say: **"Build the 5 API endpoints"** or **"Create the database tables"** or **"Integrate the components"**

All specifications and starting code are ready to use from `STEP_4_PLANNING.md`.
