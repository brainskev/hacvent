import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { isAdminRequest } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminRequest()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const customers = await getCollection('customers')
    
    const allCustomers = await customers
      .find({})
      .sort({ intake_date: -1 })
      .toArray()

    return NextResponse.json({ customers: allCustomers }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
