# Document Upload Quick Reference

## For Customers: Upload Checklist

### Step 1: Income Verification

Choose **ONE** of these:

| Priority       | Document                  | What We Need                            |
| -------------- | ------------------------- | --------------------------------------- |
| 🟢 PRIMARY     | Tax Form (1040, W2, 1099) | Most recent year, shows income          |
| 🟡 ALTERNATIVE | Recent Paystubs           | Last 30 days of wage statements         |
| 🟡 ALTERNATIVE | Retirement Statement      | Social Security, 401K, pension proof    |
| 🟡 ALTERNATIVE | Government Benefits       | Social Security, veteran, worker's comp |
| 🟡 ALTERNATIVE | Unemployment Proof        | Current unemployment/strike benefits    |

### Step 2: Proof of Residence

Choose **ONE** of these (must show your name & address):

| Document              | Requirements                                                 |
| --------------------- | ------------------------------------------------------------ |
| 💰 Property Tax Bill  | Recent (last 12 months), your name, property address         |
| 🏠 Home Insurance     | Front page only, recent date (last 6 months), name & address |
| 📄 Mortgage Statement | Recent (last 2 months), name, address, loan info             |

---

## For Admins: Verification Guide

### Income Verification - Quick Checks

**✓ Tax Forms (1040/W2/1099)**

- Recent year
- Name matches
- Income amount reasonable
- For 1040: Schedule 1 if self-employed

**✓ Paystubs**

- All within 30 days
- Name/employer match
- Gross pay visible
- Recent date

**✓ Government Benefits**

- Official statement
- Benefit amount shown
- Within 6 months
- Matches application

### Proof of Ownership - Quick Checks

**✓ Property Tax Bill**

- Current year
- Name & address match
- Amount reasonable
- Not scan of 5+ year old bill

**✓ Insurance Statement**

- Front page visible
- Date within 6 months
- Property/name match
- Active coverage shown

**✓ Mortgage Statement**

- Within 2 months
- Current balance shown
- Name & address match
- Not promotional document

---

## File Upload Specs

| Spec                 | Requirement                    |
| -------------------- | ------------------------------ |
| **Accepted Formats** | PDF, JPG, PNG, DOCX            |
| **Max File Size**    | 10MB per document              |
| **Image Quality**    | Clear, readable, good lighting |
| **Resolution**       | Minimum 100 DPI                |
| **Language**         | English documents preferred    |

---

## Status Workflow

```
REQUESTED
    ↓
UPLOADED (customer provides file)
    ↓
VERIFIED (admin approves) → or → REJECTED (requires resubmission)
    ↓
Ready for next step
```

---

## Rejection Reasons - Template

When rejecting documents, use clear reasons:

- **Blurry/Unreadable** - Resubmit with better quality image
- **Missing Name** - Document must show customer's full name
- **Missing Address** - Document must include full property address
- **Outdated** - Document exceeds acceptable date range
- **Wrong Type** - Resubmit with correct document type
- **Incomplete** - Front and back both required (if applicable)
- **Name Mismatch** - Document name must match application
- **Invalid Format** - Unsupported file type or corrupted file

---

## Common Scenarios

### Scenario 1: Recent Job Start

**Customer Only Has 2 Weeks Paystubs**

- ✅ Accept - provide all available paystubs
- Note: "Only 2 weeks available due to recent start"

### Scenario 2: Self-Employed, No Current Income

**Has Tax Return But Low/No Current Income**

- ✅ Accept tax return + latest profit/loss statement
- Note: "Self-employed, last year income verified"

### Scenario 3: Multiple Income Sources

**Has Paystub + 1099 + Social Security**

- ✅ Accept all - totals household income
- Admin verifies: Does combined income qualify?

### Scenario 4: Senior Living on Fixed Income

**Only Has Social Security Statement**

- ✅ Accept benefit statement + property ownership
- Verify benefit amount adequate for program

### Scenario 5: Retirement Property, No Mortgage

**Can't Find Mortgage - Has Tax Bill + Insurance**

- ✅ Accept either tax bill or insurance
- Either proves ownership

---

## Database Document Type Values

Use these exact enum values in system:

### Income Verification

- `income-tax-form`
- `wage-statement`
- `retirement-income-proof`
- `government-assistance-proof`
- `unemployment-benefits`

### Proof of Ownership

- `property-tax-bill`
- `home-insurance-statement`
- `mortgage-statement`

### Installation/Rebate

- `hvac-quote`
- `installation-certificate`
- `rebate-paperwork`

### Other

- `other`

---

## Admin Dashboard Document View

Location: `/admin/customers/[id]/page.tsx`

Features:

- List all documents for customer
- Filter by status (Requested, Uploaded, Verified, Rejected)
- Reject with reason
- Verify with confirmation
- Add admin notes
- Download documents for offline review

---

## Escalation Path

If document issue can't be resolved:

1. **Reject with detailed reason** - Customer sees exact issue
2. **Customer resubmits** - Automated if possible
3. **Still problematic?** - Flag for support team
4. **Support review** - May contact customer directly

Contact: support@thermogrid.local

---

## Performance Goals

| Metric                        | Target  |
| ----------------------------- | ------- |
| Average verification time     | 2 hours |
| Documents rejected (resubmit) | <5%     |
| Customer satisfaction         | >95%    |
| Upload success rate           | >98%    |

---

## 🚀 Quick Start (5 minutes)

### 1. Get Cloudinary Keys

- Visit: https://cloudinary.com/console/settings/api-keys
- Copy: Cloud Name, API Key, API Secret

### 2. Update `.env.local`

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Restart Dev Server

```bash
npm run dev
```

Done! Upload functionality now works.

---

## 📝 Using Document Upload in Components

### Frontend (Customer Uploads)

```tsx
import { DocumentUpload } from '@/components/CustomerDashboard/DocumentUpload'

// Ensure application context is set
window.__appContext = {
  applicationId: 'app_id_here',
  userId: 'user_id_here'
}

// Use component
<DocumentUpload
  applicationStatus={ApplicationStatus.DOCUMENTS_REQUESTED}
  isActionRequired={true}
  documents={documents}
  requestedDocumentTypes={['tax-return', 'utility-bill']}
/>
```

### Backend (API Calls)

```typescript
// Get documents for app
const docs = await getApplicationDocuments(applicationId);

// Verify document (admin)
await updateDocumentStatus(documentId, "verified", adminId);

// Reject document (admin)
await updateDocumentStatus(
  documentId,
  "rejected",
  undefined,
  "Quality too low",
);
```

---

## 🔗 API Endpoints Reference

| Endpoint                           | Method | Purpose             |
| ---------------------------------- | ------ | ------------------- |
| `/api/customer/documents/upload`   | POST   | Upload file         |
| `/api/customer/documents`          | GET    | Fetch app documents |
| `/api/admin/documents/[id]/verify` | PATCH  | Verify/reject doc   |

### POST Upload

```bash
curl -X POST http://localhost:3001/api/customer/documents/upload \
  -F "file=@document.pdf" \
  -F "applicationId=507f1f77bcf86cd799439011" \
  -F "userId=507f1f77bcf86cd799439012" \
  -F "documentType=tax-return"
```

### GET Documents

```bash
curl "http://localhost:3001/api/customer/documents?applicationId=507f1f77bcf86cd799439011"
```

### PATCH Verify

```bash
curl -X PATCH http://localhost:3001/api/admin/documents/507f1f77bcf86cd799439013/verify \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify",
    "verifiedBy": "admin_id"
  }'
```

---

## 📦 File Support

| Type  | Extensions        | MIME Type                                                                                   |
| ----- | ----------------- | ------------------------------------------------------------------------------------------- |
| PDF   | .pdf              | application/pdf                                                                             |
| Image | .jpg, .jpeg, .png | image/jpeg, image/png                                                                       |
| Word  | .doc, .docx       | application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document |

**Max Size:** 10MB per file

---

## 🗂️ File Organization in Cloudinary

```
/hacvent/applications/
  ├── {applicationId1}/
  │   ├── 1706500000000-tax-return-2024.pdf
  │   └── 1706500001000-utility-bill.jpg
  └── {applicationId2}/
      └── 1706500002000-mortgage-statement.pdf
```

---

## 📊 Database Schema

Collection: `documents`

```javascript
{
  _id: ObjectId,
  applicationId: ObjectId,
  userId: ObjectId,
  fileName: "tax-return-2024.pdf",
  fileUrl: "https://res.cloudinary.com/...",
  documentType: "tax-return",
  status: "uploaded", // or "verified", "rejected"
  size: 1024000,
  mimeType: "application/pdf",
  uploadedAt: ISODate("2026-01-29T..."),
  verifiedAt: ISODate("2026-01-29T..."), // optional
  verifiedBy: ObjectId, // optional
  rejectionReason: "Low quality" // optional
}
```

---

## ✅ Document Workflow

```
Customer Uploads
    ↓
Status: "uploaded"
    ↓
Admin Reviews (in admin dashboard)
    ↓
┌─────────────────────────────────┐
│ Admin Action                     │
└─────────────────────────────────┘
    ↙                       ↘
Verify                    Reject
    ↓                       ↓
Status: "verified"    Status: "rejected"
verifiedAt: Date      rejectionReason: String
verifiedBy: AdminId
```

---

## 🔐 Security Notes

- ✅ File type validation (MIME check)
- ✅ File size limit (10MB max)
- ✅ Cloudinary HTTPS URLs
- ✅ Organized by application (no cross-access)
- ⏳ Coming: Virus scanning
- ⏳ Coming: Rate limiting
- ⏳ Coming: Authentication checks

---

## 🐛 Troubleshooting

| Issue                        | Solution                                 |
| ---------------------------- | ---------------------------------------- |
| "Cloudinary not configured"  | Add env vars to `.env.local` and restart |
| "File too large"             | Max 10MB - compress or split file        |
| "Invalid file type"          | Use PDF, JPG, PNG, or DOC/DOCX only      |
| "Upload hangs"               | Check network, verify credentials        |
| "Document not in Cloudinary" | Check console for errors                 |

---

## 📚 Documentation Files

- `CLOUDINARY_INTEGRATION.md` - Full setup guide
- `CLOUDINARY_SETUP.md` - Implementation details
- This file - Quick reference

---

## 🆘 Support

Check these if something breaks:

1. Dev console (browser F12) for client-side errors
2. Terminal output for server-side errors
3. Cloudinary dashboard for upload history
4. MongoDB Compass for document records
