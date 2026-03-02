import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { isAdminRequest } from '@/lib/adminAuth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const contractors = await getCollection('contractors')
    
    const allContractors = await contractors
      .find({})
      .sort({ onboarding_date: -1 })
      .toArray()

    return NextResponse.json({ contractors: allContractors }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
