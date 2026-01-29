import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { IApplication, ApplicationStatus, IStatusChange, INotification } from '@/lib/types'
import { isValidTransition, statusLabels } from '@/lib/statusMachine'

/**
 * PATCH /api/admin/applications/[id]/status
 * Change application status
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newStatus, reason, adminId } = await request.json()
    const applicationId = new ObjectId(params.id)

    if (!newStatus || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current application
    const applicationsCollection = await getCollection<IApplication>('applications')
    const application = await applicationsCollection.findOne({ _id: applicationId })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Validate transition
    if (!isValidTransition(application.status, newStatus)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${application.status} to ${newStatus}`
        },
        { status: 400 }
      )
    }

    const oldStatus = application.status

    // Update application status
    await applicationsCollection.updateOne(
      { _id: applicationId },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
          ...(newStatus === ApplicationStatus.APPROVED && { approvedAt: new Date() }),
          ...(newStatus === ApplicationStatus.REJECTED && { rejectedAt: new Date() }),
          ...(newStatus === ApplicationStatus.COMPLETED && { completedAt: new Date() })
        }
      }
    )

    // Log status change
    const statusChangesCollection = await getCollection<IStatusChange>('statusChanges')
    await statusChangesCollection.insertOne({
      applicationId,
      fromStatus: oldStatus,
      toStatus: newStatus,
      changedBy: new ObjectId(adminId),
      reason,
      createdAt: new Date()
    })

    // Create notification for customer
    const notificationsCollection = await getCollection<INotification>('notifications')
    await notificationsCollection.insertOne({
      recipientId: application.customerId,
      senderId: new ObjectId(adminId),
      applicationId,
      type: 'status-update',
      subject: `Application Status Updated`,
      body: `Your application status has been updated to: ${statusLabels[newStatus as ApplicationStatus]}${reason ? ` - ${reason}` : ''}`,
      emailSent: false,
      dashboardViewed: false,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: `Status updated from ${oldStatus} to ${newStatus}`,
      application: {
        ...application,
        status: newStatus,
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Status change error:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/applications/[id]/status-history
 * Get status change history for an application
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = new ObjectId(params.id)
    const statusChangesCollection = await getCollection<IStatusChange>('statusChanges')

    const history = await statusChangesCollection
      .find({ applicationId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      history
    })
  } catch (error) {
    console.error('Failed to fetch status history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status history' },
      { status: 500 }
    )
  }
}
