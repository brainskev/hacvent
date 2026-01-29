import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { INotification, IDocumentRequest, DocumentType } from '@/lib/types'

/**
 * POST /api/admin/applications/[id]/request-documents
 * Request documents from customer
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { requiredDocuments, dueDate, adminId } = await request.json()
    const applicationId = new ObjectId(params.id)

    if (!requiredDocuments || !Array.isArray(requiredDocuments) || requiredDocuments.length === 0) {
      return NextResponse.json(
        { error: 'At least one document type is required' },
        { status: 400 }
      )
    }

    // Create document request
    const documentRequestsCollection = await getCollection<IDocumentRequest>(
      'documentRequests'
    )

    const documentRequest: IDocumentRequest = {
      applicationId,
      requestedFrom: new ObjectId(params.id), // Will be updated with actual customer ID
      requestedBy: new ObjectId(adminId),
      requiredDocuments: requiredDocuments as DocumentType[],
      dueDate: new Date(dueDate),
      status: 'pending',
      createdAt: new Date()
    }

    const result = await documentRequestsCollection.insertOne(documentRequest)

    // Create notification for customer
    const notificationsCollection = await getCollection<INotification>('notifications')

    const documentList = requiredDocuments.join(', ')
    await notificationsCollection.insertOne({
      recipientId: new ObjectId('000000000000000000000000'), // Customer ID - replace with actual
      senderId: new ObjectId(adminId),
      applicationId,
      type: 'document-request',
      subject: 'Documents Required for Your Application',
      body: `Please upload the following documents: ${documentList}. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      emailSent: false,
      dashboardViewed: false,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      documentRequest: {
        id: result.insertedId,
        ...documentRequest
      }
    })
  } catch (error) {
    console.error('Document request error:', error)
    return NextResponse.json(
      { error: 'Failed to request documents' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/applications/[id]/document-requests
 * Get document requests for an application
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = new ObjectId(params.id)
    const documentRequestsCollection = await getCollection<IDocumentRequest>(
      'documentRequests'
    )

    const requests = await documentRequestsCollection
      .find({ applicationId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      requests
    })
  } catch (error) {
    console.error('Failed to fetch document requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document requests' },
      { status: 500 }
    )
  }
}
