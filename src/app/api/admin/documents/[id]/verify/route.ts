import { NextRequest, NextResponse } from 'next/server'
import { updateDocumentStatus } from '@/lib/documentService'
import { ObjectId } from 'mongodb'

/**
 * PATCH /api/admin/documents/[id]/verify
 * Verify or reject a document
 * 
 * Body:
 * - action: 'verify' | 'reject'
 * - verifiedBy: admin user ID (for verify)
 * - rejectionReason: reason (for reject)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, verifiedBy, rejectionReason } = await request.json()
    const documentId = params.id

    if (!action || !['verify', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (action === 'verify' && !verifiedBy) {
      return NextResponse.json({ error: 'verifiedBy required for verify action' }, { status: 400 })
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { error: 'rejectionReason required for reject action' },
        { status: 400 }
      )
    }

    const document = await updateDocumentStatus(
      documentId,
      action === 'verify' ? 'verified' : 'rejected',
      verifiedBy ? new ObjectId(verifiedBy) : undefined,
      rejectionReason
    )

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
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
