# Customer Detail Page Redesign

## Overview

The admin customer detail page has been completely redesigned with a **document-first workflow** to ensure all customer requirements are completed before being submitted to the program.

## Key Improvements

### 1. **Document Management as Primary Focus**

- **Document Review Section** is now the main left column (2/3 width)
- Visual summary cards show real-time document stats:
  - Total documents uploaded
  - Verified documents (green)
  - Pending review (yellow)
  - Rejected documents (red)

### 2. **Smart Status Blocking**

- **Status cannot be changed to "SUBMITTED_TO_PROGRAM" or beyond** until all documents are verified
- Clear visual indicator warns admins: "⚠️ Verify all documents first"
- This ensures no customer moves forward without complete documentation

### 3. **Document Verification Workflow**

For each pending document:

- **Verify Button**: Mark document as verified with one click
- **Reject Button**: Opens rejection reason form
- Rejection reason is required and stored with the document
- Customer receives notification if document is rejected
- Admin can request re-upload via email

### 4. **Document Display & Actions**

Each document shows:

- File name and type
- Upload date
- Current status (Verified ✓ | Rejected ✗ | Pending)
- Action buttons:
  - 📥 **Download** - Save file locally
  - 👁️ **Preview** - View in modal dialog
  - ✓ **Verify** (if pending)
  - ✗ **Reject** (if pending)

### 5. **Simplified Right Sidebar Management**

Instead of multiple tabs, the right sidebar (1/3 width) now contains:

**Status Management**

- Change status (disabled until docs verified)
- Add reason/notes for the change
- Update button

**Send Message**

- Quick email composer
- Subject and message fields
- One-click send

**Project Info**

- Creation date
- Number of applications
- Service area

### 6. **Better Visual Hierarchy**

- **Header Card** with gradient background
  - Customer name, application #, service area
  - Email and phone in-line
  - Current status badge
- **Document Readiness Alert**
  - Green + checkmark: "Ready to proceed - All documents verified"
  - Yellow + alert: "Pending review - X documents awaiting verification"
  - Auto-updates as documents are verified/rejected

### 7. **Logic & Workflow**

```
Customer Journey:
1. Customer uploads documents via customer portal
2. Admin sees them in "Pending" status
3. Admin reviews each document
4. Admin either:
   a) Verifies → Document moves to "Verified" status
   b) Rejects → Enters reason → Customer notified → Re-upload required
5. Once ALL documents verified:
   - ✓ Alert shows "Ready to proceed"
   - ✓ Status dropdown becomes enabled
   - ✓ Admin can move to next status (docs-received → state-submission-in-progress)
6. Customer stays on admin side until:
   - All documents verified ✓
   - Initial eligibility confirmed ✓
   - Ready for contractor matching
7. Only then is customer "passed" to contractor side
```

### 8. **Document Modal Preview**

- Click 👁️ icon to preview document in full-screen modal
- iframe supports PDFs, images, and other formats
- Quick close button (X)

### 9. **Multi-Project Support**

- If customer has multiple projects, "Switch Project" dropdown at top
- Allows admins to manage all customer projects from one interface
- Each project has its own documents and status

## Technical Details

### New State Variables

```typescript
const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
const [rejectionReason, setRejectionReason] = useState("");
const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
```

### Helper Functions

```typescript
// Get document count by status
getDocStats(app) → { total, verified, pending, rejected }

// Check if all required docs verified
allDocsVerified(app) → boolean
```

### Handler Functions

```typescript
handleVerifyDocument(docId); // PATCH /api/admin/documents/:id/verify
handleRejectDocument(docId); // PATCH /api/admin/documents/:id/verify (with reason)
handleStatusUpdate(); // PATCH /api/admin/applications/:id/status
handleSendEmail(); // Email composition
```

## Document Status Flow

```
UPLOADED (Pending)
    ↓
    ├─→ VERIFIED ✓ (Admin approved)
    │
    └─→ REJECTED ✗ (Admin rejected with reason)
         ↓
         → Customer notified
         → Customer re-uploads
         → Back to UPLOADED
```

## UI/UX Improvements

### Colors & Icons

- **Green** (#10B981): Verified status, approve button
- **Yellow** (#F59E0B): Pending/warning status
- **Red** (#EF4444): Rejected status, reject button
- **Blue** (#3B82F6): Primary actions, info
- **Gray**: Secondary actions

### Icons Used

- `File` - Document icon
- `CheckCircle` - Verified status
- `AlertCircle` - Warning/pending
- `X` - Close/reject
- `Download` - File download
- `Eye` - Preview document
- `Mail` - Email messaging
- `ArrowLeft` - Navigation back

## API Integration Points

### Fetch Applications

```
GET /api/admin/applications
→ Returns all apps, filtered by customerId on client
→ Populates with document array
```

### Verify Document

```
PATCH /api/admin/documents/:id/verify
Body: { status: 'verified' }
```

### Reject Document

```
PATCH /api/admin/documents/:id/verify
Body: { status: 'rejected', rejectionReason: 'reason text' }
```

### Update Application Status

```
PATCH /api/admin/applications/:id/status
Body: { status: 'NEW_STATUS', reason: 'reason text' }
```

## Responsive Design

- **Desktop (lg)**: 2-column main grid (docs + sidebar)
- **Tablet/Mobile**: Full-width stacked layout
- All buttons and inputs touch-friendly
- Modal preview centers on screen with padding

## Future Enhancements

1. Batch verify multiple documents
2. Document templates/checklists
3. Auto-verify documents using AI/OCR
4. Document expiration dates with warnings
5. Document categories/organization
6. Archive old documents
7. Export document checklist as PDF
8. Contractor document requirements alignment
9. Electronic signature integration
10. Automated document request emails

## Testing Checklist

- [ ] Verify document updates status and UI
- [ ] Reject document requires reason
- [ ] Status dropdown disabled until all docs verified
- [ ] Alert shows correct doc counts
- [ ] Preview modal opens/closes correctly
- [ ] Download link works
- [ ] Email sends successfully
- [ ] Multi-project switching works
- [ ] Back button returns to customers list
- [ ] Responsive on mobile/tablet
