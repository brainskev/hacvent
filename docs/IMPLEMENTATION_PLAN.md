# ThermoGrid Complete Workflow Implementation Plan
**Production-Ready System Architecture**

## Overview
This document outlines the complete implementation of the 7-step workflow from quote request to project completion.

## Database Schema ✅ COMPLETED
- Created migration file: `database/migrations/001_add_quotes_and_workflow_tables.sql`
- Added tables: quotes, contracts, installations, installation_updates, financing, project_milestones, system_performance
- Extended reviews table with detailed ratings
- Added proper indexes and triggers

## Step 1: Contractor Quote Response System ✅ IN PROGRESS

### Components Created:
- ✅ `components/QuoteForm.tsx` - Complete 4-step quote creation form

### Still Needed:
1. **Contractor Dashboard Quote Management**
   - File: `pages/contractor-dashboard.tsx` (update existing)
   - Features:
     - View incoming consultation requests
     - Create and send quotes
     - Track quote status (sent, viewed, accepted, rejected)
     - Quote history and analytics

2. **API Routes for Quotes**
   - `/api/quotes/create` - Create new quote
   - `/api/quotes/send` - Send quote to customer
   - `/api/quotes/update` - Update quote status
   - `/api/quotes/[id]` - Get quote details

3. **Email Notifications**
   - Quote sent notification to customer
   - Quote viewed notification to contractor
   - Quote accepted/rejected notifications

## Step 2: Quote Comparison View

### Components Needed:
1. **QuoteComparisonView Component**
   - File: `components/QuoteComparisonView.tsx`
   - Features:
     - Side-by-side comparison of all received quotes
     - Cost breakdown visualization
     - Timeline comparison
     - Warranty comparison
     - Filter and sort options
     - Export to PDF

2. **QuoteCard Component**
   - File: `components/QuoteCard.tsx`
   - Features:
     - Detailed quote display
     - Expandable sections
     - Accept/Reject actions
     - Download quote PDF

3. **Customer Dashboard Integration**
   - Add "Quotes" tab to dashboard
   - Notification when new quote received
   - Quote comparison interface

### API Routes:
- `/api/quotes/customer/[projectId]` - Get all quotes for project
- `/api/quotes/[id]/view` - Mark quote as viewed
- `/api/quotes/[id]/accept` - Accept quote
- `/api/quotes/[id]/reject` - Reject quote with reason

## Step 3: Contractor Selection & Scheduling

### Components Needed:
1. **ContractSigningModal Component**
   - File: `components/ContractSigningModal.tsx`
   - Features:
     - Contract terms display
     - Digital signature capture (using react-signature-canvas)
     - Agreement checkboxes
     - IP address capture
     - Timestamp recording

2. **ConsultationScheduler Component**
   - File: `components/ConsultationScheduler.tsx`
   - Features:
     - Calendar view
     - Available time slots from contractor
     - Booking confirmation
     - Calendar integration (Google, Outlook)

3. **Contract Generation**
   - File: `lib/contract-generator.ts`
   - Uses: PDF generation library (jsPDF or similar)
   - Features:
     - Generate contract from quote
     - Include all terms and conditions
     - Add signature fields

### API Routes:
- `/api/contracts/create` - Create contract from accepted quote
- `/api/contracts/[id]/sign` - Sign contract (customer/contractor)
- `/api/consultations/schedule` - Schedule on-site consultation
- `/api/consultations/[id]/reschedule` - Reschedule consultation

### Integrations:
- Signature capture: react-signature-canvas
- Calendar: FullCalendar or similar
- PDF generation: jsPDF or PDFKit

## Step 4: Pre-Installation Phase

### Components Needed:
1. **FinancingApplication Component**
   - File: `components/FinancingApplication.tsx`
   - Features:
     - Loan calculator
     - Application form
     - Credit check integration
     - Approval status tracking

2. **RebatePreApproval Component**
   - File: `components/RebatePreApproval.tsx`
   - Features:
     - Pre-approval application forms
     - Document upload
     - Status tracking
     - Program-specific requirements

3. **InstallationScheduler Component**
   - File: `components/InstallationScheduler.tsx`
   - Features:
     - Final date selection
     - Team assignment
     - Customer availability check
     - Preparation checklist

### API Routes:
- `/api/financing/apply` - Submit financing application
- `/api/financing/[id]/status` - Check approval status
- `/api/rebates/pre-approval` - Submit pre-approval application
- `/api/installations/schedule` - Schedule installation

### Integrations:
- Financing partners API (e.g., GreenSky, EnerBank)
- Credit check services (if needed)
- Calendar/scheduling system

## Step 5: Installation Tracking

### Components Needed:
1. **InstallationProgressTracker Component**
   - File: `components/InstallationProgressTracker.tsx`
   - Features:
     - Real-time progress updates
     - Milestone visualization
     - Photo gallery
     - Timeline view
     - Current phase indicator

2. **InstallationUpdateForm Component (Contractor)**
   - File: `components/InstallationUpdateForm.tsx`
   - Features:
     - Post updates
     - Upload photos/videos
     - Mark milestones complete
     - Report issues
     - Time tracking

3. **PhotoGallery Component**
   - File: `components/PhotoGallery.tsx`
   - Features:
     - Before/during/after photos
     - Lightbox view
     - Download options
     - Categorization by phase

### API Routes:
- `/api/installations/[id]/updates` - Get all updates
- `/api/installations/[id]/update` - Post new update
- `/api/installations/[id]/photos` - Upload photos
- `/api/installations/[id]/progress` - Update progress percentage
- `/api/installations/[id]/inspection` - Schedule/record inspection

### Integrations:
- Image upload: Supabase Storage
- Real-time updates: Supabase Realtime
- Push notifications: Firebase Cloud Messaging or similar

## Step 6: Post-Installation & Rebate Processing

### Components Needed:
1. **RebateSubmissionWizard Component**
   - File: `components/RebateSubmissionWizard.tsx`
   - Features:
     - Multi-step form for each rebate program
     - Document checklist
     - Auto-fill from project data
     - Program-specific requirements
     - Submission confirmation

2. **DocumentManager Component**
   - File: `components/DocumentManager.tsx`
   - Features:
     - Upload completion documents
     - Categorize by type
     - Preview documents
     - Download/share
     - Approval workflow

3. **RebateStatusTracker Component**
   - File: `components/RebateStatusTracker.tsx`
   - Features:
     - Track each rebate application
     - Status timeline
     - Estimated processing time
     - Payment tracking
     - Alert for actions needed

### API Routes:
- `/api/rebates/submit` - Submit rebate application
- `/api/rebates/[id]/status` - Update rebate status
- `/api/rebates/[id]/payment` - Record payment received
- `/api/documents/upload` - Upload document
- `/api/documents/[id]/approve` - Approve document

### Integrations:
- Document storage: Supabase Storage
- OCR for document verification: Google Cloud Vision or AWS Textract
- Email notifications for status updates

## Step 7: Project Completion & Review

### Components Needed:
1. **ProjectCompletionChecklist Component**
   - File: `components/ProjectCompletionChecklist.tsx`
   - Features:
     - Final walkthrough checklist
     - Sign-off confirmation
     - Issue resolution tracking
     - Final payment processing

2. **ReviewForm Component**
   - File: `components/ReviewForm.tsx`
   - Features:
     - Multi-aspect ratings (quality, communication, timeliness, professionalism)
     - Written review
     - Photo upload
     - Recommendation toggle
     - Review moderation

3. **WarrantyManager Component**
   - File: `components/WarrantyManager.tsx`
   - Features:
     - Warranty details display
     - Document storage
     - Expiration reminders
     - Claim filing
     - Service history

4. **SystemPerformanceMonitor Component**
   - File: `components/SystemPerformanceMonitor.tsx`
   - Features:
     - Energy consumption tracking
     - Cost savings calculation
     - Performance graphs
     - Maintenance reminders
     - Issue reporting

### API Routes:
- `/api/projects/[id]/complete` - Mark project complete
- `/api/reviews/create` - Submit review
- `/api/reviews/[id]/respond` - Contractor response
- `/api/warranty/[id]/claim` - File warranty claim
- `/api/performance/log` - Log performance data

### Integrations:
- Review moderation: Content filtering API
- Performance monitoring: IoT device integration (if applicable)
- Maintenance scheduling: Calendar integration

## Additional System Requirements

### Authentication & Authorization
- Clerk for authentication
- Role-based access control (RBAC)
- Permission management
- Session handling

### Real-time Features
- Supabase Realtime for live updates
- Websockets for notifications
- Presence tracking

### File Storage
- Supabase Storage for all documents/photos
- CDN for image optimization
- Automatic compression
- Secure access tokens

### Email System
- Transactional emails: SendGrid or Resend
- Template system
- Email tracking
- Notification preferences

### Analytics
- User activity tracking
- Conversion funnel analysis
- Performance metrics
- Business intelligence dashboard

### Testing
- Unit tests: Jest + React Testing Library
- Integration tests: Playwright
- E2E tests for critical paths
- Load testing

### Deployment
- Vercel for Next.js hosting
- Supabase for backend
- CI/CD pipeline
- Environment management
- Monitoring and logging

## Implementation Priority

### Phase 1 (Week 1-2): Core Quote System
1. Complete contractor dashboard quote management
2. Implement QuoteComparisonView
3. Set up API routes for quotes
4. Basic email notifications

### Phase 2 (Week 3-4): Selection & Scheduling
1. Contract signing system
2. Consultation scheduler
3. Installation scheduling
4. Payment processing integration

### Phase 3 (Week 5-6): Installation Management
1. Installation progress tracking
2. Photo/video upload system
3. Real-time updates
4. Inspection scheduling

### Phase 4 (Week 7-8): Rebate Processing
1. Rebate submission wizard
2. Document management
3. Status tracking
4. Payment monitoring

### Phase 5 (Week 9-10): Completion & Optimization
1. Review system
2. Warranty management
3. Performance monitoring
4. System optimization and testing

## File Structure
```
/thermogrid
├── pages/
│   ├── api/
│   │   ├── quotes/
│   │   ├── contracts/
│   │   ├── installations/
│   │   ├── rebates/
│   │   └── reviews/
│   ├── dashboard.tsx
│   ├── contractor-dashboard.tsx
│   └── start-project.tsx
├── components/
│   ├── QuoteForm.tsx ✅
│   ├── QuoteComparisonView.tsx
│   ├── QuoteCard.tsx
│   ├── ContractSigningModal.tsx
│   ├── ConsultationScheduler.tsx
│   ├── FinancingApplication.tsx
│   ├── RebatePreApproval.tsx
│   ├── InstallationScheduler.tsx
│   ├── InstallationProgressTracker.tsx
│   ├── InstallationUpdateForm.tsx
│   ├── PhotoGallery.tsx
│   ├── RebateSubmissionWizard.tsx
│   ├── DocumentManager.tsx
│   ├── RebateStatusTracker.tsx
│   ├── ProjectCompletionChecklist.tsx
│   ├── ReviewForm.tsx
│   ├── WarrantyManager.tsx
│   └── SystemPerformanceMonitor.tsx
├── lib/
│   ├── contract-generator.ts
│   ├── email-service.ts
│   ├── quote-utils.ts
│   └── rbac.ts
└── database/
    ├── migrations/
    │   └── 001_add_quotes_and_workflow_tables.sql ✅
    └── seed_quotes.sql

```

## Next Steps
1. Run the migration to add new tables
2. Complete contractor dashboard updates
3. Implement QuoteComparisonView component
4. Set up API routes
5. Test complete flow end-to-end

This is a comprehensive, production-ready system that will provide a complete workflow for HVAC projects from quote to completion.
