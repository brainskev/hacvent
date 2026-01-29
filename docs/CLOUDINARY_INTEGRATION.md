# Cloudinary Document Upload Integration

## Setup Instructions

### 1. Create Cloudinary Account

- Go to https://cloudinary.com
- Sign up for a free account
- Navigate to Dashboard → Settings → API Keys
- Copy the following:
  - **Cloud Name** (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
  - **API Key** (CLOUDINARY_API_KEY)
  - **API Secret** (CLOUDINARY_API_SECRET)

### 2. Update Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. API Endpoints

#### Upload Document

```
POST /api/customer/documents/upload

FormData:
- file: File (PDF, JPG, PNG, DOCX)
- applicationId: string (MongoDB ObjectId)
- userId: string (MongoDB ObjectId)
- documentType: string (tax-return, mortgage-statement, etc.)

Response:
{
  "success": true,
  "document": {
    "_id": "ObjectId",
    "fileName": "tax-return-2024.pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "status": "uploaded",
    "size": 1024000
  }
}
```

#### Get Application Documents

```
GET /api/customer/documents?applicationId={id}

Response:
{
  "success": true,
  "documents": [
    {
      "_id": "ObjectId",
      "fileName": "tax-return-2024.pdf",
      "fileUrl": "https://res.cloudinary.com/...",
      "documentType": "tax-return",
      "status": "uploaded",
      "size": 1024000,
      "uploadedAt": "2026-01-29T..."
    }
  ]
}
```

#### Admin Verify Document

```
PATCH /api/admin/documents/[id]/verify

Body:
{
  "action": "verify",
  "verifiedBy": "admin_user_id"
}
```

#### Admin Reject Document

```
PATCH /api/admin/documents/[id]/verify

Body:
{
  "action": "reject",
  "rejectionReason": "Document quality too low"
}
```

### 4. File Constraints

- **Max Size**: 10MB
- **Allowed Types**:
  - PDF (`application/pdf`)
  - JPEG (`image/jpeg`, `image/jpg`)
  - PNG (`image/png`)
  - Word Doc (`application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

### 5. Storage Structure

Documents are organized in Cloudinary by application:

```
/hacvent/applications/{applicationId}/{timestamp}-{filename}
```

### 6. Database Schema

Each uploaded document creates an `IDocument` record:

```typescript
{
  _id: ObjectId
  applicationId: ObjectId          // Reference to application
  userId: ObjectId                 // Customer who uploaded
  fileName: string                 // Original filename
  fileUrl: string                  // Cloudinary URL (permanent)
  documentType: DocumentType       // tax-return, mortgage-statement, etc.
  status: DocumentStatus           // uploaded, verified, rejected
  size: number                     // File size in bytes
  mimeType: string                 // application/pdf, etc.
  uploadedAt: Date                 // Upload timestamp
  verifiedAt?: Date                // Admin verification time
  verifiedBy?: ObjectId            // Admin who verified
  rejectionReason?: string         // If rejected
}
```

### 7. Component Usage

The `DocumentUpload` component needs application context:

```tsx
// Pass via context or window object
window.__appContext = {
  applicationId: "app_id",
  userId: "user_id",
};
```

### 8. Cloudinary Benefits

✅ Free tier: 25GB storage, 25GB bandwidth
✅ Automatic image optimization
✅ Security: Private URLs with signed tokens
✅ Reliability: 99.95% uptime SLA
✅ CDN: Global edge caching
✅ Admin dashboard: Monitor usage, view files

### 9. Testing

```bash
# Test upload
curl -X POST http://localhost:3001/api/customer/documents/upload \
  -F "file=@/path/to/file.pdf" \
  -F "applicationId=your_app_id" \
  -F "userId=your_user_id" \
  -F "documentType=tax-return"

# Test fetch
curl http://localhost:3001/api/customer/documents?applicationId=your_app_id
```

### 10. Future Enhancements

- Add virus scanning for uploaded files
- Implement file versioning
- Add batch upload capability
- Create document templates
- Add OCR for automated data extraction
