# Customer + Admin Dashboard Implementation

**Date:** January 28, 2026  
**Status:** MVP Complete with Extensible Architecture

---

## 🎯 What We've Built

### 1. **MongoDB Schemas & Data Model**

Located in: [src/lib/types.ts](src/lib/types.ts)

#### Core Collections:

- **Users** – Admin, Customer, Contractor accounts
- **Applications** – The primary workflow entity
- **Documents** – Uploaded files with verification status
- **StatusChanges** – Audit trail for all status transitions
- **Notifications** – One-way admin → customer updates
- **DocumentRequests** – Tracks document requests with due dates

#### Key Enums:

- `ApplicationStatus` – 9-state workflow (PRELIMINARY_ELIGIBILITY → COMPLETED)
- `UserRole` – ADMIN, CUSTOMER, CONTRACTOR
- `DocumentStatus` – REQUESTED, UPLOADED, VERIFIED, REJECTED
- `DocumentType` – TAX_RETURN, MORTGAGE_STATEMENT, UTILITY_BILL, etc.

---

### 2. **State Machine & Status Management**

Located in: [src/lib/statusMachine.ts](src/lib/statusMachine.ts)

**Features:**

- Validates allowed transitions between statuses
- Prevents invalid workflows (e.g., can't go from APPROVED to DOCUMENTS_REQUESTED)
- Timeline ordering for customer-facing display
- Badge colors, labels, and icons for each status

**Key Functions:**

```typescript
isValidTransition(from, to); // Check if transition is allowed
getAllowedNextStatuses(current); // Get valid next states
```

---

### 3. **Customer Dashboard**

Located in: [src/app/customer-dashboard/page.tsx](src/app/customer-dashboard/page.tsx)

**Components:**

- **ApplicationTimeline** – Visual timeline of application progress
- **DocumentUpload** – Secure file upload with document type selection
- **NotificationsFeed** – Read-only admin updates timestamped

**Features:**

- Status-driven UI (shows different content based on application status)
- Action alerts when documents are requested
- Real-time document upload status (UPLOADED, VERIFIED, REJECTED)
- Email confirmation tracking

**MVP Constraints (By Design):**

- ✓ No editing of submitted data
- ✓ No contractor details visible until matched
- ✓ No financial calculations shown
- ✓ One-way notifications only

---

### 4. **Expanded Admin Dashboard**

Located in: [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx)

**Components:**

- **AdminApplicationCard** – Expandable application details with action buttons
- **AdminQueueView** – Multi-queue navigation system

**Views (7 Queues):**

1. **Intake Queue** – NEW applications (PRELIMINARY_ELIGIBILITY)
2. **Awaiting Documents** – Customer docs requested (DOCUMENTS_REQUESTED)
3. **Ready for State** – Docs complete, ready to submit (DOCUMENTS_RECEIVED)
4. **Awaiting Approval** – Submitted to state (SUBMITTED_TO_PROGRAM)
5. **Ready to Match** – Approved, needs contractor (APPROVED)
6. **Active Projects** – Installations in progress (INSTALLATION_IN_PROGRESS)
7. **Completed** – Finished installations (COMPLETED)

**Key Metrics:**

- Total applications
- Breakdown by queue
- Total requested vs. approved amounts
- Active projects count

**Admin Actions:**

- Change application status (with validation)
- Request documents from customers
- Match contractors to applications
- View full application details
- Inline status transitions

---

## 📡 API Endpoints

All endpoints follow REST conventions and require authentication (to be implemented).

### Document Management

```
POST   /api/admin/applications/[id]/documents
       Upload a file for an application

GET    /api/admin/applications/[id]/documents
       Get all documents for an application
```

### Status Management

```
PATCH  /api/admin/applications/[id]/status
       Change application status with validation
       Body: { newStatus, reason, adminId }

GET    /api/admin/applications/[id]/status
       Get status change history
```

### Document Requests

```
POST   /api/admin/applications/[id]/document-requests
       Request specific document types from customer
       Body: { requiredDocuments[], dueDate, adminId }

GET    /api/admin/applications/[id]/document-requests
       Get all document requests for an application
```

---

## 📧 Email Notification System

Located in: [src/lib/emailTemplates.ts](src/lib/emailTemplates.ts) and [src/lib/notificationService.ts](src/lib/notificationService.ts)

### Templates Included:

1. **Document Request** – Lists required docs with due date
2. **Status Update** – Generic status change notification
3. **Approval** – Celebration email with rebate amount
4. **Rejection** – Professional rejection with reason

### How It Works:

1. Admin action creates a `Notification` record in MongoDB
2. Background job (or webhook) calls `processPendingNotifications()`
3. Email is sent via your provider (SendGrid, Nodemailer, etc.)
4. Notification marked as `emailSent: true` with timestamp
5. Customer sees email confirmation in dashboard

### To Connect Your Email Provider:

Edit `src/lib/notificationService.ts` function `sendEmail()`:

```typescript
// Example: SendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send({
  to,
  subject,
  html,
  text,
});
```

---

## 🔄 Complete Workflow Example

### Customer Journey:

1. **Customer submits application** → Status: PRELIMINARY_ELIGIBILITY
2. **Admin reviews** → Clicks "Request Documents" → Status: DOCUMENTS_REQUESTED
   - Customer gets email with required doc list
   - Dashboard shows action alert
3. **Customer uploads documents** → Status: DOCUMENTS_RECEIVED
   - Admin gets notification of upload
4. **Admin verifies docs & submits to state** → Status: SUBMITTED_TO_PROGRAM
   - Customer notified of state submission
5. **State approves** → Admin updates status → Status: APPROVED
   - Customer gets approval email with rebate amount
   - Dashboard shows "Ready for Contractor"
6. **Admin matches contractor** → Status: CONTRACTOR_MATCHED
   - Customer notified of contractor details
7. **Installation happens** → Status: INSTALLATION_IN_PROGRESS
   - Contractor uploads completion certificate
8. **Admin completes project** → Status: COMPLETED
   - Customer gets completion confirmation

### Data Flow:

```
Customer Action
    ↓
Upload File / Form
    ↓
API Endpoint (/api/admin/applications/[id]/...)
    ↓
MongoDB Update (Application + StatusChange + Notification)
    ↓
Email Notification Service
    ↓
Send Email + Update Notification.emailSent
    ↓
Customer Dashboard Reflects Change
```

---

## 🚀 Next Steps (Post-MVP)

### Phase 2: Real Data Integration

- [ ] Connect to actual MongoDB instance
- [ ] Add authentication (NextAuth or JWT)
- [ ] Implement actual email service (SendGrid, AWS SES, etc.)
- [ ] Add file upload storage (S3, Google Cloud Storage)
- [ ] Create customer intake form with validation

### Phase 3: Contractor Features

- [ ] Contractor email notification system
- [ ] Contractor document uploads (completion certs, invoices)
- [ ] Email-based contractor actions (approve, request revisions)
- [ ] Payment tracking and invoicing

### Phase 4: State Program Integration

- [ ] Michigan program API connection
- [ ] Automated state submission workflow
- [ ] Approval/rejection callback handlers
- [ ] Multi-state support framework

### Phase 5: Advanced Features

- [ ] Dashboard analytics and reporting
- [ ] Bulk actions (mass status updates, document requests)
- [ ] Contractor onboarding workflow
- [ ] Payment processing integration
- [ ] Audit logging and compliance reports

---

## 📚 Architecture Principles

### 1. **Status-Driven Design**

Everything flows from application status. UI, permissions, and available actions all depend on current status.

### 2. **Email-Centric Communication**

Contractors interact only via email (no dashboard). Customers get one-way updates. Admins have full control.

### 3. **Immutable Audit Trail**

Every status change is logged in `StatusChanges` collection. Nothing is deleted, only marked.

### 4. **Extensible State Machine**

Add new statuses or transitions without breaking existing code:

```typescript
// Just add to ApplicationStatus enum and statusTransitions
export enum ApplicationStatus {
  // ...existing...
  PRE_INSTALLATION_INSPECTION = "pre-installation-inspection",
}
```

### 5. **Scalable for Multiple Programs**

Each application can track its program, making it easy to add energy efficiency programs beyond HVAC.

---

## 🛠️ Installation & Setup

### Prerequisites:

- Node.js 18+
- MongoDB instance (local or Atlas)
- Environment variables:
  ```
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
  MONGODB_DB=hacvent
  SENDGRID_API_KEY=sg_xxxxxxxxxxxx  # Optional for Phase 2
  ```

### To Run Locally:

```bash
npm install
npm run dev
# Visit http://localhost:3000/customer-dashboard
# Visit http://localhost:3000/admin/dashboard
```

### Database Initialization:

```bash
# Create indexes for performance
mongo < database/schema_michigan.sql
```

---

## 📊 File Structure

```
src/
├── app/
│   ├── customer-dashboard/
│   │   └── page.tsx              # Customer dashboard entry
│   ├── admin/dashboard/
│   │   └── page.tsx              # Admin dashboard entry
│   └── api/admin/applications/
│       └── [id]/
│           ├── documents/
│           ├── status/
│           └── document-requests/
├── components/
│   ├── CustomerDashboard/
│   │   ├── ApplicationTimeline.tsx
│   │   ├── DocumentUpload.tsx
│   │   └── NotificationsFeed.tsx
│   ├── AdminDashboard/
│   │   ├── AdminApplicationCard.tsx
│   │   └── AdminQueueView.tsx
│   └── AdminLayout.tsx
└── lib/
    ├── types.ts                  # MongoDB schemas & enums
    ├── statusMachine.ts          # State machine logic
    ├── emailTemplates.ts         # Email HTML templates
    ├── notificationService.ts    # Email sending
    └── mongodb.ts                # DB connection
```

---

## 💡 Key Decisions Made

1. **Why Multiple Queues?** – Admins need different views per workflow stage. One long list would be unmanageable at scale.

2. **Why Email-First for Contractors?** – Reduces scope, no contractor dashboard maintenance, contractors already have email.

3. **Why Immutable Status History?** – Compliance and audit requirements demand a complete record of who changed what and when.

4. **Why No Live Chat?** – Email is asynchronous, scalable, and sufficient for rebate program workflows (not consumer support).

5. **Why Mock Data in Demo?** – Real data integration happens in Phase 2. Demo shows architecture and UX without data setup friction.

---

## ✅ Testing Checklist (Manual)

- [ ] Customer can upload documents when status is DOCUMENTS_REQUESTED
- [ ] Upload blocked when status is other states
- [ ] Admin can expand application card
- [ ] Admin can change status to valid next states only
- [ ] Changing status creates StatusChange record
- [ ] Changing status creates Notification record
- [ ] Notification appears in customer dashboard
- [ ] Application moves to correct queue after status change
- [ ] Queue counts update in real-time
- [ ] Filter by queue works (All, Intake, Docs, etc.)

---

## 📞 Support

For questions or issues:

1. Check the inline code comments
2. Review the types in `src/lib/types.ts` for data shape
3. Test endpoints with Postman/curl
4. Check MongoDB collections for actual data

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, MongoDB, Lucide Icons

**Designed for:** Scalability, auditability, and operational efficiency
