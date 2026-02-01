import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

/**
 * GET /api/contractors
 * Fetch approved contractors with optional filtering
 * Query params:
 * - serviceArea: Filter by county/service area
 * - approved: Filter by approval status (default: true)
 * - limit: Number of results to return (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const serviceArea = searchParams.get('serviceArea')
    const approvedParam = searchParams.get('approved')
    const limitParam = searchParams.get('limit')
    
    // Build query
    const query: any = {}
    
    // Only show approved contractors by default (public endpoint)
    if (approvedParam === 'false') {
      query.approved = false
    } else if (approvedParam === 'all') {
      // No filter on approved status
    } else {
      query.approved = true
      query.status = 'approved' // Must be both approved AND status is 'approved'
    }
    
    // Filter by service area if provided
    if (serviceArea) {
      query.service_areas = { $elemMatch: { $regex: new RegExp(serviceArea, 'i') } }
    }
    
    const contractors = await getCollection('contractors')
    const limit = limitParam ? parseInt(limitParam, 10) : 50
    
    const results = await contractors
      .find(query)
      .project({
        // Only return necessary public fields
        company_name: 1,
        contact_name: 1,
        email: 1,
        phone: 1,
        service_areas: 1,
        total_projects_completed: 1,
        onboarding_date: 1,
        _id: 1,
      })
      .sort({ total_projects_completed: -1, onboarding_date: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ 
      contractors: results,
      count: results.length 
    }, { status: 200 })
  } catch (err: any) {
    console.error('Error fetching contractors:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
