import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getApplicationDocumentsForUser } from '@/lib/documentService'

/**
 * GET /api/customer/documents?applicationId={id}&userId={id}
 * Retrieve all documents for an application owned by the user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const userId = searchParams.get('userId')

    if (!applicationId || !userId) {
      return NextResponse.json({ error: 'Missing applicationId or userId parameter' }, { status: 400 })
    }

    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json({ error: 'Invalid applicationId' }, { status: 400 })
    }

    const documents = await getApplicationDocumentsForUser(applicationId, userId)

    return NextResponse.json(
      {
        success: true,
        documents,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
