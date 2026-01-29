import { NextRequest, NextResponse } from 'next/server'
import { updateDocumentStatus } from '@/lib/documentService'
import { getCollection } from '@/lib/mongodb'
import { INotification, IApplication } from '@/lib/types'
import { ObjectId } from 'mongodb'

/**
 * PATCH /api/admin/documents/[id]/verify
 * Verify or reject a document
 * 
 * Body:
 * - action: 'verify' | 'reject'
 * - status: 'verified' | 'rejected' (legacy support)
 * - verifiedBy: admin user ID (optional)
 * - rejectionReason: reason (for reject)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, status, verifiedBy, rejectionReason } = await request.json()
    const documentId = params.id

    const normalizedAction = action || (status === 'verified' ? 'verify' : status === 'rejected' ? 'reject' : null)

    if (!normalizedAction || !['verify', 'reject'].includes(normalizedAction)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (normalizedAction === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { error: 'rejectionReason required for reject action' },
        { status: 400 }
      )
    }

    const document = await updateDocumentStatus(
      documentId,
      normalizedAction === 'verify' ? 'verified' : 'rejected',
      verifiedBy && ObjectId.isValid(verifiedBy) ? new ObjectId(verifiedBy) : undefined,
      rejectionReason
    )

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    try {
      const applicationsCollection = await getCollection<IApplication>('applications')
      const notificationsCollection = await getCollection<INotification>('notifications')
      const application = await applicationsCollection.findOne({ _id: document.applicationId })

      const recipientId = document.userId
      const applicationNumber = application?.applicationNumber || 'Your application'

      const subject = normalizedAction === 'verify'
        ? `Document verified for ${applicationNumber}`
        : `Document rejected for ${applicationNumber}`

      const body = normalizedAction === 'verify'
        ? `Your document has been verified and accepted for ${applicationNumber}.`
        : `Your document was rejected for ${applicationNumber}.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`

      await notificationsCollection.insertOne({
        recipientId,
        senderId: verifiedBy && ObjectId.isValid(verifiedBy) ? new ObjectId(verifiedBy) : new ObjectId('000000000000000000000000'),
        applicationId: document.applicationId,
        type: normalizedAction === 'verify' ? 'document-received' : 'rejection',
        subject,
        body,
        emailSent: false,
        dashboardViewed: false,
        createdAt: new Date()
      })
    } catch (notifyError) {
      console.error('Error creating notification for document update:', notifyError)
    }

    return NextResponse.json(
      {
        success: true,
        document,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}
