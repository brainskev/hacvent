import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getCollection } from '@/lib/mongodb'
import { IDocument, DocumentStatus, DocumentType, ApplicationStatus } from '@/lib/types'
import { ObjectId } from 'mongodb'

/**
 * POST /api/customer/documents/upload
 * Upload document to Cloudinary and store metadata in MongoDB
 * 
 * Expects:
 * - formData with 'file' field containing the file
 * - 'applicationId' in formData
 * - 'userId' in formData
 * - 'documentType' in formData
 */

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const applicationId = formData.get('applicationId') as string
    const userId = formData.get('userId') as string
    const documentType = formData.get('documentType') as string

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!applicationId || !userId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: applicationId, userId, documentType' },
        { status: 400 }
      )
    }

    // Validate ObjectId format for application only (userId may be Clerk)
    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { error: 'Invalid application ID format' },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Supported: PDF, images, Word documents' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `hacvent/applications/${applicationId}`,
          resource_type: 'auto',
          public_id: `${Date.now()}-${file.name.split('.')[0]}`,
          tags: ['application', applicationId],
          type: 'upload',
          access_type: 'anonymous',
          sign_url: false,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.end(uint8Array)
    })

    const uploadResult = uploadResponse as any

    // Create document record in MongoDB
    const documentsCollection = await getCollection<IDocument>('documents')

    const userIdValue = ObjectId.isValid(userId) ? new ObjectId(userId) : userId

    const newDocument: IDocument = {
      applicationId: new ObjectId(applicationId),
      userId: userIdValue,
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      version: uploadResult.version,
      deliveryType: uploadResult.type,
      accessMode: uploadResult.access_mode,
      format: uploadResult.format,
      documentType: documentType as DocumentType,
      status: DocumentStatus.UPLOADED,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
    }

    const result = await documentsCollection.insertOne(newDocument)

    // Update application status from DOCUMENTS_REQUESTED to DOCUMENTS_RECEIVED
    try {
      const applicationsCollection = await getCollection('applications')
      const applicationObjectId = new ObjectId(applicationId)
      
      // Update status only if currently in DOCUMENTS_REQUESTED
      await applicationsCollection.updateOne(
        {
          _id: applicationObjectId,
          status: ApplicationStatus.DOCUMENTS_REQUESTED,
        },
        {
          $set: {
            status: ApplicationStatus.DOCUMENTS_RECEIVED,
            updatedAt: new Date(),
          },
        }
      )
    } catch (updateError) {
      console.error('Error updating application status:', updateError)
      // Don't fail the upload if status update fails - document was still uploaded
    }

    return NextResponse.json(
      {
        success: true,
        document: {
          _id: result.insertedId,
          fileName: newDocument.fileName,
          fileUrl: newDocument.fileUrl,
          status: newDocument.status,
          size: newDocument.size,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document. Please try again.' },
      { status: 500 }
    )
  }
}
