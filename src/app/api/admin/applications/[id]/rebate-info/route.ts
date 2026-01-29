import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/mongodb'
import { IApplication } from '@/lib/types'

/**
 * PATCH /api/admin/applications/[id]/rebate-info
 * Save rebate portal credentials (admin-only)
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rebatePortalEmail, rebatePortalPassword } = await request.json()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid application id' }, { status: 400 })
    }

    const applicationsCollection = await getCollection<IApplication>('applications')

    await applicationsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          rebatePortalEmail: rebatePortalEmail || '',
          rebatePortalPassword: rebatePortalPassword || '',
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to update rebate info:', error)
    return NextResponse.json({ error: 'Failed to update rebate info' }, { status: 500 })
  }
}