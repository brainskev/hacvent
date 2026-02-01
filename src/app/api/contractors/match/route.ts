import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

/**
 * POST /api/contractors/match
 * Match contractors to a customer based on location and other criteria
 * Body: { customerLocation: string, maxResults?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerLocation, maxResults = 5 } = body

    if (!customerLocation) {
      return NextResponse.json({ error: 'customerLocation is required' }, { status: 400 })
    }

    const contractors = await getCollection('contractors')
    
    // Extract county from customer location (simple parsing)
    // In production, you'd use a geocoding service or more sophisticated parsing
    const locationParts = customerLocation.split(',').map((s: string) => s.trim())
    const possibleCounties = locationParts.slice(-2) // Last two parts might contain county
    
    // Build query to find approved contractors in the service area
    const query: any = {
      approved: true,
      status: 'approved',
      $or: possibleCounties.map((county: string) => ({
        service_areas: { $elemMatch: { $regex: new RegExp(county, 'i') } }
      }))
    }

    // Find matching contractors
    const matchedContractors = await contractors
      .find(query)
      .project({
        company_name: 1,
        contact_name: 1,
        email: 1,
        phone: 1,
        service_areas: 1,
        total_projects_completed: 1,
        onboarding_date: 1,
        _id: 1,
      })
      .sort({ 
        total_projects_completed: -1, // Prefer contractors with more completed projects
        onboarding_date: -1 
      })
      .limit(maxResults)
      .toArray()

    // If no exact matches found, get any approved contractors as fallback
    let finalResults = matchedContractors
    if (matchedContractors.length === 0) {
      finalResults = await contractors
        .find({ approved: true, status: 'approved' })
        .project({
          company_name: 1,
          contact_name: 1,
          email: 1,
          phone: 1,
          service_areas: 1,
          total_projects_completed: 1,
          onboarding_date: 1,
          _id: 1,
        })
        .sort({ total_projects_completed: -1 })
        .limit(maxResults)
        .toArray()
    }

    return NextResponse.json({ 
      contractors: finalResults,
      count: finalResults.length,
      searchedLocation: customerLocation,
      exactMatch: matchedContractors.length > 0
    }, { status: 200 })
  } catch (err: any) {
    console.error('Error matching contractors:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/contractors/match?location=Wayne,MI&limit=3
 * Get matched contractors via query params (convenience endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')
    const limit = searchParams.get('limit')

    if (!location) {
      return NextResponse.json({ error: 'location query parameter is required' }, { status: 400 })
    }

    // Call the POST handler logic
    const body = {
      customerLocation: location,
      maxResults: limit ? parseInt(limit, 10) : 5
    }

    // Reuse POST logic
    const req = new Request(request.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })

    return POST(req as NextRequest)
  } catch (err: any) {
    console.error('Error in GET match:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
