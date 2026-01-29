# Document Requirements & Upload System

## Overview

ThermoGrid requires income verification and proof of home ownership to process applications. This document outlines the specific documents acceptable for each category.

---

## 1. Income Verification Documents

### Primary: Tax Form (Highly Recommended)

**Document Type:** `INCOME_TAX_FORM`

Choose ONE of the following based on employment type:

#### Self-Employed

- **1040 IRS Tax Form** (most recent year)
- **Schedule 1** (if filed with 1040)
- Must show your income and match your application

#### W2 Employees

- **W2 Tax Form** (most recent year)
- Shows wages and employer information
- More recent years if recent job change

#### 1099 Contractors

- **1099 Tax Form** (most recent year)
- From your contracting income
- May combine multiple 1099s if contract work

**Why This:** Official IRS documentation provides most reliable income verification and is processed fastest.

---

### Alternative Income Documents

#### 1. Wage Statements (Paystubs)

**Document Type:** `WAGE_STATEMENT`

- **Requirement:** Paystubs for the past **30 days**
- **Must Include:**
  - Employee name
  - Employer name
  - Gross pay and deductions
  - YTD (Year-to-Date) totals
- **Multiple Stubs:** If you haven't been employed 30 days, provide all available stubs
- **Use Case:** Recent job starts or to supplement tax forms

#### 2. Retirement Income Proof

**Document Type:** `RETIREMENT_INCOME_PROOF`

Proof of regular income from any of:

- **Pension Statement** (monthly/annual benefit letter)
- **Social Security Statement** (benefit verification letter)
- **401K Distribution** (proof of withdrawals)
- **IRA Statement** (current balance and regular withdrawal history)

**Must Show:** Regular deposit history or benefit amount

#### 3. Government Assistance Proof

**Document Type:** `GOVERNMENT_ASSISTANCE_PROOF`

Benefits count as household income if you receive:

- **Social Security Benefits** (SSI or SSDI)
- **Veteran's Benefits** (VA disability, pension)
- **Worker's Compensation** (ongoing payments)
- **Local Agency Assistance** (TANF, general assistance)

**Required Documents:**

- Official benefit statement showing monthly amount
- Recent payment history (3+ months minimum)

#### 4. Unemployment Benefits

**Document Type:** `UNEMPLOYMENT_BENEFITS`

If currently receiving unemployment:

- **Unemployment Benefit Statement** (showing weekly/bi-weekly amount)
- **Strike Benefits** documentation (if applicable)
- Must include benefits schedule and expected end date

---

## 2. Proof of Ownership/Residency

### Required: One Document Showing Name & Address

To verify you own/occupy the residence, provide ONE of:

#### 1. Property Tax Bill (Preferred)

**Document Type:** `PROPERTY_TAX_BILL`

- **Recent statement** showing current year
- Must display your name and full property address
- Clearly show tax assessment
- File date should be within last 12 months

**Why Best:** Directly proves ownership and current address

#### 2. Home Insurance Statement

**Document Type:** `HOME_INSURANCE_STATEMENT`

- **Front page only** of policy document
- Must have recent date (within last 6 months)
- Must show:
  - Your name
  - Property address
  - Coverage dates
  - Insurance company name

**Note:** Full insurance policies not needed, just cover page

#### 3. Mortgage Statement

**Document Type:** `MORTGAGE_STATEMENT`

- **Most recent monthly statement**
- Must clearly show:
  - Your name
  - Property address
  - Current loan balance
  - Lender name
  - Statement date within last 2 months

**Note:** Applies only if property has mortgage

---

## 3. Installation & Rebate Documents

### HVAC Quote

**Document Type:** `HVAC_QUOTE`

Estimated quote for HVAC installation including:

- Equipment specifications
- Labor costs
- Total project cost
- Equipment efficiency rating
- Contractor name and license

### Installation Certificate

**Document Type:** `INSTALLATION_CERTIFICATE`

Post-installation document from contractor showing:

- Equipment installed (make/model)
- Installation date
- Efficiency rating achieved
- Contractor license
- Warranty information

### Rebate Paperwork

**Document Type:** `REBATE_PAPERWORK`

Documents supporting rebate claims:

- Manufacturer rebate forms
- Utility company paperwork
- Program eligibility proofs
- Payment confirmations

---

## 4. Upload System Implementation

### Frontend: Document Upload Component

Located: `src/components/CustomerDashboard/DocumentUpload.tsx`

**Features:**

- Categorized document selector (radio buttons with hints)
- Two main sections:
  1. **Income Verification** (5 types, choose one)
  2. **Proof of Ownership** (3 types, choose one)
- Drag-and-drop file upload area
- Real-time validation
- Status tracking (Uploaded, Verified, Rejected)

**User Flow:**

1. Select document category (Income Verification or Proof of Ownership)
2. Select specific document type with helpful hints
3. Drag files or click to select
4. Upload to Cloudinary via `/api/customer/documents/upload`
5. Admin verifies documents in `/admin/customers/[id]/page.tsx`

### File Requirements

**Accepted Formats:**

- PDF
- JPEG, JPG, PNG
- Microsoft Word (DOCX)

**Maximum File Size:** 10MB per document

**File Naming:**
Use clear, descriptive names:

- ✅ `2024_1040_tax_return.pdf`
- ✅ `January_2024_paystub.jpg`
- ✅ `2024_property_tax_bill.pdf`
- ❌ `document1.pdf`
- ❌ `scan.jpg`

---

## 5. Database Schema

### DocumentType Enum

```typescript
export enum DocumentType {
  // Income Verification - Primary
  INCOME_TAX_FORM = "income-tax-form",

  // Income Verification - Alternative
  WAGE_STATEMENT = "wage-statement",
  RETIREMENT_INCOME_PROOF = "retirement-income-proof",
  GOVERNMENT_ASSISTANCE_PROOF = "government-assistance-proof",
  UNEMPLOYMENT_BENEFITS = "unemployment-benefits",

  // Proof of Ownership/Residency
  PROPERTY_TAX_BILL = "property-tax-bill",
  HOME_INSURANCE_STATEMENT = "home-insurance-statement",
  MORTGAGE_STATEMENT = "mortgage-statement",

  // Installation & Rebate
  HVAC_QUOTE = "hvac-quote",
  INSTALLATION_CERTIFICATE = "installation-certificate",
  REBATE_PAPERWORK = "rebate-paperwork",

  OTHER = "other",
}
```

### IDocument Interface

```typescript
export interface IDocument {
  _id?: ObjectId;
  applicationId: ObjectId;
  userId: ObjectId;
  fileName: string;
  fileUrl: string; // Cloudinary URL
  documentType: DocumentType;
  status: DocumentStatus; // requested, uploaded, verified, rejected
  size: number; // Bytes
  mimeType: string; // e.g., 'application/pdf'
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: ObjectId; // Admin user who verified
  rejectionReason?: string;
}
```

---

## 6. API Endpoints

### Upload Endpoint

**POST** `/api/customer/documents/upload`

**Request:**

```typescript
FormData {
  file: File
  documentType: string        // DocumentType enum value
  applicationId: string       // MongoDB ObjectId
  userId: string             // MongoDB ObjectId
}
```

**Response:**

```typescript
{
  success: boolean;
  documentId: string; // MongoDB _id
  cloudinaryUrl: string;
  message: string;
}
```

### Get Documents

**GET** `/api/customer/documents?applicationId=XXX`

**Response:**

```typescript
{
  success: boolean
  documents: IDocument[]
}
```

### Admin Verify Document

**PATCH** `/api/admin/documents/[id]/verify`

**Request:**

```typescript
{
  action: 'verify' | 'reject'
  reason?: string             // Required if rejecting
}
```

---

## 7. Admin Verification Checklist

When reviewing uploaded documents, admins should verify:

### Income Verification Documents

**Tax Forms (1040, W2, 1099):**

- [ ] Document is from most recent tax year
- [ ] Name matches application
- [ ] Income amount is reasonable
- [ ] Schedule 1 included if self-employed
- [ ] Document is official IRS form

**Paystubs:**

- [ ] All stubs within last 30 days
- [ ] Name and employer match
- [ ] Gross income visible
- [ ] YTD totals reasonable
- [ ] Recent date (not old scan)

**Retirement/Government Benefits:**

- [ ] Official benefit statement
- [ ] Shows monthly/annual benefit amount
- [ ] Recent date (within 6 months)
- [ ] Name and benefit type match
- [ ] Not expired

### Proof of Ownership Documents

**Property Tax Bill:**

- [ ] Current year (issued within 12 months)
- [ ] Name matches application
- [ ] Address matches property
- [ ] Amount reasonable for property
- [ ] Not a scan of very old bill

**Home Insurance:**

- [ ] Front page visible
- [ ] Date within last 6 months
- [ ] Coverage includes property
- [ ] Name and address match
- [ ] Not expired policy

**Mortgage Statement:**

- [ ] Within last 2 months
- [ ] Current loan balance shown
- [ ] Name and address match
- [ ] Property matches application
- [ ] Not a promotional document

---

## 8. Common Issues & Resolutions

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| Blurry/unreadable document  | Request resubmission with better image quality      |
| Missing name or address     | Mark as rejected - must have identifying info       |
| Outdated document           | Reject if outside acceptable timeframe              |
| Wrong income type selected  | Admin can manually recategorize in dashboard        |
| Multiple documents uploaded | Accept all; admin selects primary in notes          |
| Document exceeds 10MB       | Request compressed version or PDF instead of images |

---

## 9. User Guidance

### What to Prepare (Before Application)

Have ready:

- [ ] Most recent tax return (or paystubs if recent job)
- [ ] Proof of ownership document (property tax, insurance, mortgage)
- [ ] Clear images or scans (good lighting, not blurry)
- [ ] File names ready
- [ ] 10-15 minutes for upload process

### Tips for Best Results

1. **Use Clear Images**
   - Good lighting, not shadowed
   - Full document visible, not cropped
   - Readable text

2. **File Format Preference**
   - PDF preferred (most compatible)
   - JPG/PNG if camera images
   - Avoid TIFF or BMP formats

3. **Document Preparation**
   - Remove watermarks if possible
   - Ensure front and back visible if needed
   - Use black/white if color not needed

4. **If Rejected**
   - Read rejection reason carefully
   - Resubmit with corrected document
   - Contact support if unclear

---

## 10. Future Enhancements

Planned improvements to document system:

- [ ] Document virus scanning (ClamAV integration)
- [ ] Automated document type detection (AI-powered)
- [ ] OCR text extraction for compliance
- [ ] Digital signature verification
- [ ] Secure document retention policies
- [ ] Bulk admin document review dashboard
- [ ] Email notifications for verification status
- [ ] Document expiration tracking
- [ ] Re-request automation (expired docs)

---

## Questions or Issues?

For document-related questions:

- Check the guidance in each document upload section
- Review admin verification checklist
- Contact support@thermogrid.local
