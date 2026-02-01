import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import {
  getDetailsRequestEmailTemplate,
  getInvoiceEmailTemplate,
  getApprovalConfirmationEmailTemplate
} from '@/lib/emailTemplates'

/**
 * PATCH /api/admin/contractors/[id]
 * Update contractor status and send workflow emails
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractorId = params.id
    const body = await request.json()
    const { action, ...updates } = body

    const db = await getDb()
    const contractorsCollection = db.collection('contractors')

    // Fetch the contractor first
    const contractor = await contractorsCollection.findOne({ 
      _id: new ObjectId(contractorId) 
    })

    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // Handle workflow actions with email sending
    let emailSent = false
    let emailTemplate = null

    switch (action) {
      case 'request_details':
        // Send email requesting documents for state submission
        emailTemplate = getDetailsRequestEmailTemplate({
          company_name: contractor.company_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          license_number: contractor.license_number
        })
        emailSent = true
        break

      case 'mark_state_approved_fast_track':
        // Already state-approved, immediate activation, send welcome email
        emailTemplate = getApprovalConfirmationEmailTemplate({
          company_name: contractor.company_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          license_number: contractor.license_number
        })
        emailSent = true
        break

      case 'mark_state_approved':
        // State approval received after submission, send invoice
        emailTemplate = getInvoiceEmailTemplate({
          company_name: contractor.company_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          license_number: contractor.license_number
        })
        emailSent = true
        break

      case 'final_approval':
        // Payment received and verified, send welcome email
        emailTemplate = getApprovalConfirmationEmailTemplate({
          company_name: contractor.company_name,
          contact_name: contractor.contact_name,
          email: contractor.email,
          license_number: contractor.license_number
        })
        emailSent = true
        break

      case 'mark_submitted_to_state':
      case 'mark_payment_received':
      case 'reactivate':
        // Status updates without email
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update contractor in database
    const updateData = {
      ...updates,
      updated_at: new Date()
    }

    const result = await contractorsCollection.updateOne(
      { _id: new ObjectId(contractorId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    // Fetch updated contractor
    const updatedContractor = await contractorsCollection.findOne({ 
      _id: new ObjectId(contractorId) 
    })

    if (!updatedContractor) {
      return NextResponse.json(
        { error: 'Failed to fetch updated contractor' },
        { status: 500 }
      )
    }

    // In production, send the actual email here
    // For now, we'll log the email template
    if (emailSent && emailTemplate) {
      console.log('='.repeat(60))
      console.log('📧 EMAIL WOULD BE SENT:')
      console.log('To:', emailTemplate.to)
      console.log('Subject:', emailTemplate.subject)
      console.log('='.repeat(60))
      console.log(emailTemplate.text)
      console.log('='.repeat(60))
      
      // TODO: Integrate with actual email service
      // Example with Sendgrid:
      // await sgMail.send({
      //   to: emailTemplate.to,
      //   from: 'noreply@hacvent.com',
      //   subject: emailTemplate.subject,
      //   html: emailTemplate.html,
      //   text: emailTemplate.text
      // })
    }

    return NextResponse.json({
      success: true,
      message: 'Contractor updated successfully',
      emailSent,
      contractor: {
        ...updatedContractor,
        _id: updatedContractor._id.toString()
      }
    })

  } catch (error) {
    console.error('Error updating contractor:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update contractor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/contractors/[id]
 * Fetch a single contractor by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractorId = params.id

    const db = await getDb()
    const contractorsCollection = db.collection('contractors')

    const contractor = await contractorsCollection.findOne({ 
      _id: new ObjectId(contractorId) 
    })

    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      contractor: {
        ...contractor,
        _id: contractor._id.toString()
      }
    })

  } catch (error) {
    console.error('Error fetching contractor:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch contractor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
