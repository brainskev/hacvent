import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_name, contact_name, email, phone, license_number, service_areas } = body || {}

    if (!company_name || !contact_name || !email || !phone || !license_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      company_name,
      contact_name,
      email,
      phone,
      license_number,
      service_areas: (service_areas || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
      approved: false,
      approval_fee_paid: false,
      approval_fee_amount: 50,
      approval_fee_paid_date: null,
      projects: [],
      referral_fee_tier: null,
      filing_fees_owed: 0,
      filing_fees_paid: 0,
      onboarding_date: new Date(),
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    }

    const contractors = await getCollection('contractors')
    const result = await contractors.insertOne(payload)
    return NextResponse.json({ id: result.insertedId }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
