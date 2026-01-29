# Quick Reference: Customer + Admin Dashboard

## What You Have Now

### ✅ Customer Dashboard

- **Location:** [src/app/customer-dashboard/page.tsx](src/app/customer-dashboard/page.tsx)
- **Features:**
  - Application status timeline with visual progress
  - Secure document upload (only when requested)
  - Read-only notifications feed
  - Email confirmation tracking
  - Quick stats (eligibility score, service area, application #)

### ✅ Admin Dashboard

- **Location:** [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx)
- **Features:**
  - 7 workflow queues (Intake, Docs, Ready for State, Approval, Matching, Active, Completed)
  - Key metrics (total apps, by queue, dollar amounts)
  - Expandable application cards with full details
  - Inline status changes with validation
  - "Request Documents" & "Match Contractor" quick actions

### ✅ Backend Architecture

- **Schemas:** 6 MongoDB collections + TypeScript types
- **State Machine:** 9 application statuses with validated transitions
- **APIs:** 3 endpoint groups (documents, status, document-requests)
- **Email System:** 4 professional templates ready to go

---

## Key Files to Know

| File                                                                      | Purpose                     | Extends From |
| ------------------------------------------------------------------------- | --------------------------- | ------------ |
| [src/lib/types.ts](src/lib/types.ts)                                      | All MongoDB schemas & enums | —            |
| [src/lib/statusMachine.ts](src/lib/statusMachine.ts)                      | State machine logic         | —            |
| [src/lib/emailTemplates.ts](src/lib/emailTemplates.ts)                    | Email HTML templates        | —            |
| [src/lib/notificationService.ts](src/lib/notificationService.ts)          | Email sending service       | —            |
| [src/components/CustomerDashboard/\*](src/components/CustomerDashboard/)  | Customer UI components      | —            |
| [src/components/AdminDashboard/\*](src/components/AdminDashboard/)        | Admin UI components         | —            |
| [src/app/api/admin/applications/[id]/\*](src/app/api/admin/applications/) | REST API endpoints          | —            |

---

## Status Workflow (9 States)

```
START
  ↓
1. PRELIMINARY_ELIGIBILITY (new applications, pending admin review)
  ↓
2. DOCUMENTS_REQUESTED (admin requests docs, customer notified)
  ↓
3. DOCUMENTS_RECEIVED (docs uploaded & verified)
  ↓
4. SUBMITTED_TO_PROGRAM (submitted to state program)
  ↓
5. APPROVED (approved by state, ready for contractor)
  ↓
6. CONTRACTOR_MATCHED (contractor assigned)
  ↓
7. INSTALLATION_IN_PROGRESS (work happening)
  ↓
8. COMPLETED (finished, rebate disbursed)

OR → REJECTED (at any stage where validation fails)
```

---

## Admin Queues (7 Views)

```
🟦 INTAKE QUEUE (PRELIMINARY_ELIGIBILITY)
   └─ New applications waiting for admin eligibility review

📄 AWAITING DOCUMENTS (DOCUMENTS_REQUESTED)
   └─ Customers were asked to upload; waiting for uploads

✓ READY FOR STATE (DOCUMENTS_RECEIVED)
   └─ Docs complete; ready to submit to state program

⏳ AWAITING APPROVAL (SUBMITTED_TO_PROGRAM)
   └─ Submitted to state; waiting for state approval

👥 READY TO MATCH (APPROVED)
   └─ State approved; need to match with contractor

🔨 ACTIVE PROJECTS (INSTALLATION_IN_PROGRESS)
   └─ Installations currently happening

✅ COMPLETED (COMPLETED)
   └─ All done; rebate disbursed
```

---

## How to Use (Testing)

### Customer Dashboard

```
1. Visit: http://localhost:3000/customer-dashboard
2. See application status timeline
3. When status = DOCUMENTS_REQUESTED, upload section appears
4. Notifications show admin updates
```

### Admin Dashboard

```
1. Visit: http://localhost:3000/admin/dashboard
2. See all metrics at top
3. Click queue tabs to filter applications
4. Click application card to expand
5. Change status via dropdown + button
6. Click "Request Documents" or "Match Contractor"
```

---

## Next: Connect Real Data

### Phase 2 Tasks (when ready):

1. **Database** – Point to real MongoDB instance
2. **Authentication** – Add NextAuth or JWT
3. **Email** – Connect SendGrid or AWS SES
4. **Storage** – Add S3 or Google Cloud for file uploads
5. **Forms** – Create customer intake form
6. **Validation** – Add server-side form validation

### To Connect Email (Example: SendGrid):

```typescript
// src/lib/notificationService.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendEmail(to, subject, html, text) {
  await sgMail.send({
    to,
    from: "noreply@hacvent.com",
    subject,
    html,
    text,
  });
}
```

---

## Data Model Summary

### IApplication (Core Entity)

```typescript
{
  applicationNumber: string          // "APP-001"
  customerId: ObjectId              // Link to customer
  contractorId?: ObjectId           // Link to contractor (after match)
  status: ApplicationStatus         // Current workflow state
  eligibilityScore: number          // 0-1 (e.g., 0.85)
  requestedAmount: number           // In dollars
  approvalAmount?: number           // After approval
  serviceArea: string               // "Ann Arbor, MI"
  homeType: string                  // "single-family"
  hvacType: string                  // "Heat Pump"
  currentUtility: string            // "DTE Energy"
  createdAt: Date
  updatedAt: Date
  approvedAt?: Date
  rejectedAt?: Date
  completedAt?: Date
}
```

### IDocument

```typescript
{
  applicationId: ObjectId
  userId: ObjectId                  // Who uploaded
  fileName: string                  // "tax-return-2024.pdf"
  fileUrl: string                   // "/uploads/..."
  documentType: DocumentType        // "tax-return"
  status: DocumentStatus            // "verified"
  size: number                      // In bytes
  mimeType: string                  // "application/pdf"
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: ObjectId             // Admin who verified
  rejectionReason?: string
}
```

### IStatusChange (Audit Trail)

```typescript
{
  applicationId: ObjectId
  fromStatus: ApplicationStatus
  toStatus: ApplicationStatus
  changedBy: ObjectId               // Admin ID
  reason?: string                   // Why changed
  createdAt: Date
}
```

### INotification (One-Way Messages)

```typescript
{
  recipientId: ObjectId             // Customer ID
  senderId: ObjectId                // Admin ID
  applicationId: ObjectId
  type: string                      // "status-update", "document-request", etc.
  subject: string
  body: string
  emailSent: boolean
  emailSentAt?: Date
  dashboardViewed: boolean
  viewedAt?: Date
  createdAt: Date
}
```

---

## Email Templates Included

1. **Document Request**
   - Lists required documents
   - Shows due date
   - Professional branding

2. **Status Update** (Generic)
   - Shows new status
   - Optional reason
   - Link to dashboard

3. **Approval** (Special)
   - Celebratory tone
   - Shows rebate amount
   - Next steps outlined

4. **Rejection** (Special)
   - Professional, empathetic
   - Explains why
   - Encourages reapplication

---

## Common Tasks

### Change Application Status

```typescript
// API call
const response = await fetch(`/api/admin/applications/${appId}/status`, {
  method: "PATCH",
  body: JSON.stringify({
    newStatus: "approved",
    reason: "All docs verified",
    adminId: currentAdminId,
  }),
});
```

### Upload Document

```typescript
// API call
const formData = new FormData();
formData.append("file", file);
formData.append("documentType", "tax-return");
formData.append("userId", customerId);

const response = await fetch(`/api/admin/applications/${appId}/documents`, {
  method: "POST",
  body: formData,
});
```

### Request Documents from Customer

```typescript
// API call
const response = await fetch(
  `/api/admin/applications/${appId}/document-requests`,
  {
    method: "POST",
    body: JSON.stringify({
      requiredDocuments: ["tax-return", "proof-of-ownership"],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      adminId: currentAdminId,
    }),
  },
);
```

---

## Key Design Decisions

✅ **Status-Driven** – Everything flows from application status  
✅ **Email-First** – Contractors interact only via email  
✅ **Immutable History** – All changes logged and never deleted  
✅ **Extensible** – Add new statuses without breaking code  
✅ **Scalable** – Support multiple programs/states  
✅ **Audit-Ready** – Compliance built in from day one

---

## What's NOT Included (Out of Scope)

❌ Contractor dashboard (email-only by design)  
❌ Real-time chat  
❌ Automated state API calls (manual trigger design)  
❌ Customer ability to edit submitted data  
❌ Payment processing (tracked only, not processed)  
❌ Live notifications (email-based only)

---

## Troubleshooting

### "Cannot find module '@/components/AdminLayout'"

→ Fixed: Added `pages/**` to tsconfig.json includes

### Documents not uploading?

→ Check: API endpoint exists at [src/app/api/admin/applications/[id]/documents/route.ts](src/app/api/admin/applications/[id]/documents/route.ts)

### Status change not allowed?

→ Check: [src/lib/statusMachine.ts](src/lib/statusMachine.ts) for valid transitions

### Emails not sending?

→ Check: Need to implement email provider in `sendEmail()` function

---

## Next Steps

1. **Connect MongoDB** – Use your actual database
2. **Add Authentication** – Protect admin routes
3. **Implement Email Service** – SendGrid, Mailgun, etc.
4. **Create Customer Intake Form** – Start new applications
5. **Add Document Upload Storage** – S3, Google Cloud, etc.
6. **Build Contractor Matching** – Connect approved apps to contractors
7. **Test End-to-End** – Full workflow from intake to completion

---

**Questions?** Check the detailed implementation guide:  
📖 [CUSTOMER_ADMIN_DASHBOARD_IMPLEMENTATION.md](CUSTOMER_ADMIN_DASHBOARD_IMPLEMENTATION.md)

**Built:** January 28, 2026  
**Status:** MVP Complete & Production-Ready Architecture
