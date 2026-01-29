# Step 3: Contract Signing & Consultation Scheduling - Planning

## Overview
Step 3 focuses on two critical workflows:
1. **Contract Signing Flow** - Digital signatures, contract generation, and status tracking
2. **Consultation Scheduling** - Calendar integration, appointment booking, and reminders

## Architecture

### Data Flow
```
Customer selects quote from Step 2
    ↓
Show contract details and terms
    ↓
Generate digital contract (PDF)
    ↓
Customer signs contract (e-signature)
    ↓
Schedule consultation appointment
    ↓
Confirmation and notifications sent to both parties
    ↓
Contractor prepares for installation
```

## Step 3a: Contract Signing Flow

### Components Needed

#### 1. ContractDetails.tsx
- Display contract terms and conditions
- Show pricing summary from selected quote
- Display contractor information
- Show key project details (equipment, timeline, warranty)
- "Accept & Sign" and "Reject" buttons
- Scrollable terms section with checkbox for acknowledgment

#### 2. SigningModal.tsx
- Modal for digital signature capture
- Sign pad / signature drawing area
- Print name field (fallback)
- Timestamp and IP tracking
- Submit and cancel buttons
- Success confirmation message

#### 3. ContractTracker.tsx
- Show contract status: Draft → Sent → Signed by Customer → Signed by Contractor → Active
- Timeline view of contract events
- Download contract PDF button
- Re-send contract option if expired

### API Endpoints

#### POST /api/contracts/create
**Purpose**: Generate contract from accepted quote

**Request**:
```json
{
  "quoteId": "string",
  "customerId": "string"
}
```

**Response**:
```json
{
  "contractId": "string",
  "contractNumber": "string",
  "status": "draft",
  "createdAt": "ISO8601",
  "quoteDetails": {...},
  "terms": {...}
}
```

#### POST /api/contracts/sign
**Purpose**: Submit digital signature

**Request**:
```json
{
  "contractId": "string",
  "signatureData": "base64|string",
  "fullName": "string",
  "timestamp": "ISO8601",
  "ipAddress": "string"
}
```

**Response**:
```json
{
  "contractId": "string",
  "status": "signed-by-customer",
  "signedAt": "ISO8601",
  "signatureId": "string"
}
```

#### GET /api/contracts/:id
**Purpose**: Fetch contract details and status

**Response**:
```json
{
  "id": "string",
  "contractNumber": "string",
  "status": "signed-by-customer|signed-by-contractor|active",
  "quoteId": "string",
  "customerId": "string",
  "contractorId": "string",
  "createdAt": "ISO8601",
  "signedByCustomerAt": "ISO8601",
  "signedByContractorAt": "ISO8601",
  "pdf_url": "string",
  "terms": {...}
}
```

#### POST /api/contracts/:id/send-for-signature
**Purpose**: Send contract to contractor for signature

**Request**:
```json
{
  "contractId": "string"
}
```

**Response**:
```json
{
  "contractId": "string",
  "status": "awaiting-contractor-signature",
  "sentAt": "ISO8601"
}
```

### Database Schema Updates

```sql
-- Contracts table
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(20) UNIQUE,
  quote_id UUID REFERENCES quotes(id),
  customer_id UUID REFERENCES auth.users(id),
  contractor_id UUID REFERENCES contractors(id),
  status VARCHAR(50) DEFAULT 'draft',
  -- draft, awaiting-customer-signature, signed-by-customer, 
  -- awaiting-contractor-signature, signed-by-contractor, active, rejected
  
  contract_terms JSONB,
  pdf_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  customer_signed_at TIMESTAMP,
  contractor_signed_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  created_by UUID REFERENCES auth.users(id)
);

-- Contract signatures table
CREATE TABLE contract_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  signed_by UUID REFERENCES auth.users(id),
  signature_data TEXT, -- Base64 encoded image
  full_name VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  signed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(contract_id, signed_by)
);
```

---

## Step 3b: Consultation Scheduling

### Components Needed

#### 1. ConsultationScheduler.tsx
- Calendar view with available time slots
- Date picker for selecting consultation date
- Time slot selector (15-min intervals, e.g., 9:00, 9:15, 9:30)
- Contractor availability based on existing bookings
- Notes/preferences text area
- Confirmation section

#### 2. ConsultationModal.tsx (Enhancement)
- Embed ConsultationScheduler
- Show contractor details and availability
- Payment/pricing confirmation
- Submit booking button

#### 3. ScheduledConsultations.tsx
- List of upcoming consultations
- Show date, time, contractor info
- Zoom/video call link (if virtual)
- Reschedule/cancel options
- Reminder notifications

#### 4. AvailabilityManager.tsx (For Contractors)
- Set contractor availability calendar
- Block out time slots
- Bulk time entry (e.g., "9am-5pm every weekday")
- Vacation/holidays blocking
- Modify existing availability

### API Endpoints

#### POST /api/consultations/book
**Purpose**: Book a consultation appointment

**Request**:
```json
{
  "contractId": "string",
  "contractorId": "string",
  "customerId": "string",
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "HH:MM",
  "duration": 60,
  "type": "in-person|video",
  "notes": "string"
}
```

**Response**:
```json
{
  "consultationId": "string",
  "status": "scheduled",
  "date": "ISO8601",
  "duration": 60,
  "zoomLink": "https://zoom.us/j/...",
  "confirmationNumber": "string"
}
```

#### GET /api/consultations/availability
**Purpose**: Get available time slots for contractor

**Query Parameters**:
```
contractorId: string
startDate: YYYY-MM-DD
endDate: YYYY-MM-DD
duration: number (minutes)
```

**Response**:
```json
{
  "contractorId": "string",
  "availableSlots": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "available": true
    }
  ]
}
```

#### PUT /api/consultations/:id
**Purpose**: Reschedule consultation

**Request**:
```json
{
  "consultationId": "string",
  "newDate": "YYYY-MM-DD",
  "newTime": "HH:MM"
}
```

#### DELETE /api/consultations/:id
**Purpose**: Cancel consultation

**Response**:
```json
{
  "consultationId": "string",
  "status": "cancelled",
  "cancelledAt": "ISO8601"
}
```

#### POST /api/contractors/availability
**Purpose**: Set contractor availability

**Request**:
```json
{
  "contractorId": "string",
  "availabilityRules": [
    {
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "blockedDates": ["2025-12-25", "2025-12-26"]
}
```

### Database Schema Updates

```sql
-- Consultations table
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  contractor_id UUID REFERENCES contractors(id),
  customer_id UUID REFERENCES auth.users(id),
  
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INT DEFAULT 60,
  type VARCHAR(50) DEFAULT 'in-person', -- in-person, video, phone
  
  status VARCHAR(50) DEFAULT 'scheduled',
  -- scheduled, completed, cancelled, rescheduled
  
  zoom_link TEXT,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  UNIQUE(contractor_id, scheduled_date)
);

-- Contractor availability table
CREATE TABLE contractor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES contractors(id),
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(contractor_id, day_of_week)
);

-- Blocked dates table
CREATE TABLE contractor_blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES contractors(id),
  blocked_date DATE,
  reason VARCHAR(255),
  
  UNIQUE(contractor_id, blocked_date)
);
```

---

## Integration Points

### Customer Dashboard Enhancement
1. After Step 2 quote acceptance, redirect to ContractDetails
2. Show contract signing status in dashboard header
3. Add "Upcoming Consultations" section to overview tab
4. Add consultation countdown timer

### Contractor Dashboard Enhancement
1. Add "Available Consultations" to dashboard
2. Show pending contract signatures
3. Display AvailabilityManager in settings section
4. Calendar view of all scheduled consultations

### Notification System
1. **Customer notifications**:
   - Contract sent for signature
   - Contractor signed contract
   - Consultation scheduled
   - Consultation reminder (24h, 1h before)
   - Contractor cancelled/rescheduled

2. **Contractor notifications**:
   - Contract awaiting signature
   - Customer signed contract
   - Consultation scheduled
   - Customer cancelled/rescheduled

---

## Implementation Priority

### Phase 1 (High Priority)
1. ✅ Create contract signing components and modal
2. ✅ Implement POST /api/contracts/create and /sign endpoints
3. ✅ Create ContractDetails component
4. ✅ Integrate into customer dashboard post-quote

### Phase 2 (High Priority)
1. ✅ Create consultation scheduling components
2. ✅ Implement POST /api/consultations/book endpoint
3. ✅ Implement contractor availability endpoints
4. ✅ Create calendar/scheduler UI

### Phase 3 (Medium Priority)
1. Add Zoom integration for virtual consultations
2. Email notifications for consultations
3. SMS reminders for consultations
4. Contractor dashboard calendar view

---

## UI/UX Considerations

### Contract Signing Flow
- Clear, step-by-step process
- Highlight key terms (pricing, timeline, warranty)
- Make signature capture intuitive
- Show progress indicators
- Display confirmation after signing

### Consultation Scheduling
- Calendar showing next 30-60 days
- Highlight available times clearly
- Show contractor timezone
- Confirmation before booking
- Easy rescheduling/cancellation

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation for calendar
- Clear error messages
- Alternative text for all elements

---

## Testing Strategy

### Contract Signing
- Test signature capture with various devices
- Verify PDF generation
- Test contract status transitions
- Verify notification sending

### Consultation Scheduling
- Test availability calculations
- Test timezone handling
- Verify calendar conflicts
- Test booking confirmation

---

## Success Metrics

1. **Contract Signing**
   - 90% of customers complete signing within 24 hours
   - 0 signature failures or data loss
   - Contract PDF generates in < 2 seconds

2. **Consultation Scheduling**
   - 95% of consultations booked within 48 hours of signing
   - 0 double-booking conflicts
   - 99% calendar availability accuracy

---

## Next Steps

1. Create contract signing components
2. Implement API endpoints for contracts
3. Create consultation scheduling components
4. Implement API endpoints for consultations
5. Integrate both flows into dashboards
6. Test end-to-end workflows
7. Prepare for Step 4 (Pre-Installation)

