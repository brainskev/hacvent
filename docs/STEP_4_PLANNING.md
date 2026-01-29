# Step 4: Pre-Installation Phase - Planning & Implementation

## Overview
Step 4 bridges the gap between contract signing and installation. Customers will:
1. Review and select financing options
2. Get rebate pre-approval verification
3. Confirm installation date and finalize details
4. Complete site survey checklist
5. Prepare home for installation

## Architecture

### Component Workflow
```
Consultation Scheduled (from Step 3)
        ↓
Pre-Installation Dashboard
├─ Financing Options (if applicable)
├─ Rebate Pre-Approval Status
├─ Installation Scheduling
└─ Site Survey Checklist
        ↓
Ready for Installation (Step 5)
```

## Components to Build

### 1. FinancingOptions.tsx
**Purpose**: Display and compare financing options

**Features**:
- Multiple financing plan cards
- Monthly payment calculator
- APR, term, and total interest display
- Down payment flexibility
- Compare side-by-side
- Select and confirm option

**Props**:
```typescript
interface FinancingOptionsProps {
  projectCost: number
  netCost: number
  availablePlans: FinancingPlan[]
  onSelectPlan: (plan: FinancingPlan) => void
  selectedPlan?: FinancingPlan
  isLoading?: boolean
}

interface FinancingPlan {
  id: string
  provider: string // e.g., "LendingClub", "Affirm"
  term: number // months
  apr: number
  monthlyPayment: number
  totalInterest: number
  minDownPayment: number
  maxDownPayment: number
  features: string[]
}
```

### 2. RebatePreApproval.tsx
**Purpose**: Show rebate pre-approval status and next steps

**Features**:
- Rebate eligibility summary
- Pre-approval status (pending/approved/denied)
- Rebate amount and timeline
- Required documents checklist
- Next steps guidance

**Props**:
```typescript
interface RebatePreApprovalProps {
  rebates: RebateProgram[]
  approvalStatus: 'pending' | 'approved' | 'denied'
  totalRebateAmount: number
  requiredDocuments: Document[]
  onSubmitDocuments: (documents: File[]) => void
  isLoading?: boolean
}

interface RebateProgram {
  id: string
  name: string
  provider: string
  maxAmount: number
  approvalStatus: string
  timeline: string
}
```

### 3. InstallationScheduling.tsx
**Purpose**: Finalize installation date and details

**Features**:
- Confirm installation date from consultation
- Select installation time window
- Address verification
- Special access instructions
- Crew size and equipment info
- Pre-installation checklist

**Props**:
```typescript
interface InstallationSchedulingProps {
  consultationDate: string
  contractorName: string
  address: string
  onConfirmSchedule: (details: InstallationDetails) => void
  isLoading?: boolean
}

interface InstallationDetails {
  installationDate: string
  timeWindow: 'morning' | 'afternoon' | 'flexible'
  specialInstructions: string
  accessInstructions: string
  confirmed: boolean
}
```

### 4. SiteSurveyChecklist.tsx
**Purpose**: Pre-installation site survey checklist

**Features**:
- Safety checklist items (20-30 items)
- Property access items
- Equipment protection items
- Utility access items
- Customer responsibilities
- Print checklist
- Mark items complete
- Digital or printable format

**Props**:
```typescript
interface SiteSurveyChecklistProps {
  items: ChecklistItem[]
  onItemCheck: (itemId: string, checked: boolean) => void
  onSubmitChecklist: (checklist: ChecklistItem[]) => void
  isLoading?: boolean
}

interface ChecklistItem {
  id: string
  category: 'safety' | 'access' | 'protection' | 'utility' | 'responsibility'
  title: string
  description: string
  checked: boolean
  documentation?: string
}
```

### 5. PreInstallationDashboard.tsx
**Purpose**: Main dashboard integrating all Step 4 components

**Features**:
- Progress indicator (4 sections)
- Card-based layout for each section
- Status summaries
- Action buttons
- Timeline display
- Contact contractor button

---

## API Endpoints

### POST /api/pre-installation/financing
**Get financing options for project**

Request:
```json
{
  "projectCost": 9200,
  "customerId": "uuid"
}
```

Response:
```json
{
  "availablePlans": [
    {
      "id": "plan1",
      "provider": "LendingClub",
      "term": 60,
      "apr": 6.5,
      "monthlyPayment": 169.50,
      "totalInterest": 1170.00,
      "minDownPayment": 0,
      "maxDownPayment": 4600,
      "features": ["No prepayment penalty", "Fixed rate", "Secure online"]
    }
  ]
}
```

### POST /api/pre-installation/select-financing
**Select financing plan**

Request:
```json
{
  "contractId": "uuid",
  "planId": "plan1",
  "downPayment": 1000
}
```

Response:
```json
{
  "financingId": "uuid",
  "status": "selected",
  "monthlyPayment": 145.33,
  "firstPaymentDue": "2025-01-15"
}
```

### GET /api/pre-installation/rebates/:contractId
**Get rebate pre-approval status**

Response:
```json
{
  "rebates": [
    {
      "id": "rebate1",
      "name": "Federal Solar Tax Credit",
      "provider": "IRS",
      "maxAmount": 3680,
      "approvalStatus": "approved",
      "timeline": "At tax filing"
    }
  ],
  "totalRebateAmount": 3680,
  "requiredDocuments": [
    {
      "id": "doc1",
      "name": "Installation Invoice",
      "status": "required"
    }
  ]
}
```

### POST /api/pre-installation/schedule-installation
**Confirm installation date and details**

Request:
```json
{
  "contractId": "uuid",
  "installationDate": "2025-12-27",
  "timeWindow": "morning",
  "specialInstructions": "Use driveway entrance"
}
```

Response:
```json
{
  "installationId": "uuid",
  "status": "scheduled",
  "date": "2025-12-27T08:00:00Z",
  "crewSize": 2,
  "estimatedDuration": "6-8 hours"
}
```

### POST /api/pre-installation/survey-checklist
**Submit completed site survey checklist**

Request:
```json
{
  "contractId": "uuid",
  "checklist": [
    {
      "id": "item1",
      "category": "safety",
      "checked": true
    }
  ]
}
```

Response:
```json
{
  "checklistId": "uuid",
  "status": "submitted",
  "completionPercentage": 100,
  "readyForInstallation": true
}
```

---

## Database Tables

### installations table
```sql
CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  customer_id UUID REFERENCES auth.users(id),
  contractor_id UUID REFERENCES contractors(id),
  
  installation_date TIMESTAMP NOT NULL,
  time_window VARCHAR(50), -- morning, afternoon, flexible
  estimated_duration_hours INT,
  crew_size INT,
  
  special_instructions TEXT,
  access_instructions TEXT,
  
  status VARCHAR(50) DEFAULT 'scheduled',
  -- scheduled, confirmed, in-progress, completed, postponed
  
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  UNIQUE(contractor_id, installation_date)
);

-- Financing table
CREATE TABLE financing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  customer_id UUID REFERENCES auth.users(id),
  
  provider VARCHAR(100),
  plan_name VARCHAR(255),
  term_months INT,
  apr DECIMAL(5,2),
  loan_amount DECIMAL(12,2),
  down_payment DECIMAL(12,2),
  monthly_payment DECIMAL(10,2),
  total_interest DECIMAL(12,2),
  
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, approved, active, completed, denied
  
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  first_payment_due DATE,
  
  UNIQUE(contract_id)
);

-- Rebate pre-approval table
CREATE TABLE rebate_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  customer_id UUID REFERENCES auth.users(id),
  rebate_program_id UUID REFERENCES rebate_programs(id),
  
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, approved, denied, claimed, received
  
  estimated_amount DECIMAL(10,2),
  approval_date TIMESTAMP,
  payout_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Site survey checklist table
CREATE TABLE site_survey_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id UUID REFERENCES installations(id),
  customer_id UUID REFERENCES auth.users(id),
  
  items_total INT,
  items_completed INT,
  completion_percentage DECIMAL(5,2),
  
  status VARCHAR(50) DEFAULT 'in-progress',
  -- in-progress, completed, approved
  
  submitted_at TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Survey checklist items
CREATE TABLE survey_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES site_survey_checklists(id),
  
  category VARCHAR(50), -- safety, access, protection, utility, responsibility
  title VARCHAR(255),
  description TEXT,
  checked BOOLEAN DEFAULT false,
  documentation_url TEXT,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Checklist

### Phase 1: Core Components
- [ ] FinancingOptions.tsx (300+ lines)
- [ ] RebatePreApproval.tsx (250+ lines)
- [ ] InstallationScheduling.tsx (250+ lines)
- [ ] SiteSurveyChecklist.tsx (400+ lines)
- [ ] PreInstallationDashboard.tsx (350+ lines)

### Phase 2: API Endpoints
- [ ] POST /api/pre-installation/financing
- [ ] POST /api/pre-installation/select-financing
- [ ] GET /api/pre-installation/rebates/:contractId
- [ ] POST /api/pre-installation/schedule-installation
- [ ] POST /api/pre-installation/survey-checklist

### Phase 3: Database Integration
- [ ] Create 5 new database tables
- [ ] Set up relationships
- [ ] Add indexes for performance

### Phase 4: Testing & Documentation
- [ ] Test all component flows
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Performance optimization

---

## Data Model

### Financing Plan Structure
```typescript
{
  id: string
  provider: string
  term: number // months
  apr: number
  monthlyPayment: number
  totalInterest: number
  minDownPayment: number
  maxDownPayment: number
  features: string[]
  eligibility: {
    minCredit: number
    minIncome: number
    regions: string[]
  }
}
```

### Survey Checklist Structure
```typescript
{
  id: string
  category: 'safety' | 'access' | 'protection' | 'utility' | 'responsibility'
  title: string
  description: string
  checked: boolean
  documentation?: string
  notes?: string
}
```

---

## Features by Component

### FinancingOptions
✅ Display 3-5 financing plans
✅ Monthly payment calculator
✅ APR and term options
✅ Down payment flexibility
✅ Compare side-by-side
✅ Feature comparison
✅ Select and confirm
✅ Responsive grid layout

### RebatePreApproval
✅ List all applicable rebates
✅ Show approval status
✅ Display rebate amounts
✅ Timeline information
✅ Required documents checklist
✅ Document upload ready
✅ Next steps guidance

### InstallationScheduling
✅ Confirm installation date
✅ Time window selection
✅ Address verification
✅ Access instructions
✅ Crew information
✅ Equipment details
✅ Pre-installation checklist preview

### SiteSurveyChecklist
✅ 25+ pre-configured items
✅ 5 categories (safety, access, etc)
✅ Check/uncheck items
✅ Add notes per item
✅ Upload documentation
✅ Print checklist
✅ Progress tracking
✅ Submission confirmation

### PreInstallationDashboard
✅ Progress indicator (4 sections)
✅ Card-based layout
✅ Status summaries
✅ Timeline display
✅ Contact buttons
✅ Next steps guidance
✅ Responsive design

---

## UI/UX Considerations

### Visual Hierarchy
1. Dashboard overview first
2. Actionable cards for each section
3. Clear progress indicators
4. Status badges for completion
5. CTA buttons for next steps

### Mobile Responsive
- Full-width cards on mobile
- Stacked layout
- Touch-friendly buttons
- Scrollable tables
- Collapsible sections

### Accessibility
- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast

---

## Integration Points

### From Step 3
- Use consultation date for installation
- Get contractor details
- Get contract details
- Display cost information

### To Step 5
- Send installation scheduled event
- Pass installation ID
- Pre-load contractor info
- Ready for progress tracking

---

## Timeline
- Total components: 5
- Total API endpoints: 5
- Estimated LOC: 1,800+ lines
- Database tables: 4 new tables
- Completion target: Session completion

---

## Success Metrics

### Functionality
✅ All 5 components created
✅ All 5 API endpoints working
✅ Database schema implemented
✅ 0 TypeScript errors
✅ 100% feature completion

### Performance
✅ Component load < 1s
✅ API response < 500ms
✅ Database query < 100ms

### Quality
✅ Responsive design
✅ Error handling
✅ Input validation
✅ Accessibility WCAG 2.1
✅ Security review

---

## Next Steps After Step 4

### Step 5: Installation Tracking
- Real-time progress updates
- Photo uploads
- Milestone tracking
- Customer notifications
- Live chat with crew

### Step 6: Rebate Processing
- Document submission
- Utility company coordination
- Rebate status tracking
- Payment tracking

### Step 7: Project Review
- Multi-aspect reviews
- Warranty documentation
- Performance monitoring
- System efficiency tracking
