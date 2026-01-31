import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { IApplication } from '@/lib/types'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

/**
 * GET /api/customer/applications
 * Fetch all applications for the current user
 * 
 * Query params:
 * - userId: The Clerk user ID of the customer
 */

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    const applicationsCollection = await getCollection<IApplication>('applications')

    // Fetch all applications for this user, sorted by most recent first
    const applications = await applicationsCollection
      .find({ customerId: userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      {
        success: true,
        applications: applications || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
