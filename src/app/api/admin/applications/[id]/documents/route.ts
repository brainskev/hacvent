import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { IDocument, DocumentStatus, DocumentType, IStatusChange, INotification, ApplicationStatus } from '@/lib/types'

/**
 * POST /api/admin/applications/[id]/documents
 * Upload a document for an application
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = new ObjectId(params.id)

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    const userId = formData.get('userId') as string

    if (!file || !documentType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileUrl = `/uploads/${applicationId}/${Date.now()}-${file.name}`

    // Create document record
    const documentsCollection = await getCollection<IDocument>('documents')
    const document: IDocument = {
      applicationId,
      userId: new ObjectId(userId),
      fileName: file.name,
      fileUrl,
      documentType: documentType as DocumentType,
      status: DocumentStatus.UPLOADED,
      size: buffer.byteLength,
      mimeType: file.type,
      uploadedAt: new Date()
    }

    const result = await documentsCollection.insertOne(document)

    // Create notification for admin
    const notificationsCollection = await getCollection<INotification>('notifications')
    await notificationsCollection.insertOne({
      recipientId: new ObjectId('000000000000000000000000'), // Admin user ID - replace with actual
      senderId: new ObjectId(userId),
      applicationId,
      type: 'document-received',
      subject: `Document Uploaded: ${documentType}`,
      body: `A new ${documentType} document has been uploaded for application ${applicationId}`,
      emailSent: false,
      dashboardViewed: false,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      document: {
        id: result.insertedId,
        ...document
      }
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/applications/[id]/documents
 * Get all documents for an application
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = new ObjectId(params.id)
    const documentsCollection = await getCollection<IDocument>('documents')

    const documents = await documentsCollection
      .find({ applicationId })
      .sort({ uploadedAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
