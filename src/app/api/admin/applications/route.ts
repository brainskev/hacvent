import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { IApplication } from '@/lib/types'

/**
 * GET /api/admin/applications
 * Fetch all applications for admin view
 * 
 * This endpoint is for admin use only and should be protected with proper authentication
 */

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // const isAdmin = await checkAdminAuth(request)
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const applicationsCollection = await getCollection<IApplication>('applications')

    // Fetch all applications, sorted by most recent first
    const applications = await applicationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      {
        success: true,
        applications: applications || [],
        count: applications.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching applications for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
