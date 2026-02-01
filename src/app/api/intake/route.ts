import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ApplicationStatus } from '@/lib/types'
import { sendDocumentsRequestedEmail } from '@/lib/emailTemplates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      phone,
      email,
      property_address,
      property_type,
      project_size,
      hvac_type,
      preferred_contact_method,
    } = body || {}

    // Validate required fields
    if (!name || !phone || !email || !property_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get Clerk user ID from headers (set by middleware or frontend)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const applications = await getCollection('applications')
    
    // Generate application number
    const count = await applications.countDocuments()
    const applicationNumber = `APP-${String(count + 1).padStart(3, '0')}`

    // Calculate preliminary eligibility score based on available information
    // This provides a more encouraging initial score than 0
    let preliminaryScore = 0.5 // Base score of 50% for applying
    
    // Adjust based on HVAC type (heat pumps and electric HVAC qualify for HEEHRA)
    if (hvac_type === 'heat_pump' || hvac_type === 'electric_hvac') {
      preliminaryScore += 0.2 // Boost for qualifying system type
    }
    
    // Adjust based on property type (homeowners more likely to qualify)
    if (property_type === 'single-family' || property_type === 'single_family') {
      preliminaryScore += 0.1
    }
    
    // Cap at 0.75 until documents are verified
    preliminaryScore = Math.min(preliminaryScore, 0.75)

    // Create application with DOCUMENTS_REQUESTED status
    const applicationPayload = {
      applicationNumber,
      customerId: userId,
      status: ApplicationStatus.DOCUMENTS_REQUESTED,
      eligibilityScore: preliminaryScore,
      requestedAmount: 0,
      serviceArea: property_address,
      currentUtility: 'TBD',
      homeType: property_type || 'single-family',
      hvacType: hvac_type || 'TBD',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Store customer info for reference
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      projectSize: project_size,
      preferredContactMethod: preferred_contact_method,
    }

    const result = await applications.insertOne(applicationPayload)
    const applicationId = result.insertedId.toString()

    // Send documents requested email
    try {
      await sendDocumentsRequestedEmail({
        customerName: name,
        customerEmail: email,
        applicationNumber,
        applicationId,
      })
    } catch (emailErr) {
      console.error('Failed to send documents requested email:', emailErr)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ 
      id: applicationId,
      applicationNumber,
      status: ApplicationStatus.DOCUMENTS_REQUESTED
    }, { status: 200 })
  } catch (err: any) {
    console.error('Intake error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
