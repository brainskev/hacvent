import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
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
