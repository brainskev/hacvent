import { INotification, IApplication, ApplicationStatus } from '@/lib/types'
import { getCollection } from './mongodb'
import { ObjectId } from 'mongodb'
import {
  getDocumentRequestEmailTemplate,
  getStatusUpdateEmailTemplate,
  getApprovalEmailTemplate,
  getRejectionEmailTemplate
} from './emailTemplates'

/**
 * Send email via external service (Nodemailer, SendGrid, etc.)
 * This is a placeholder - replace with your actual email service
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    // TODO: Replace with actual email service
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({...})
    // await transporter.sendMail({ to, subject, html, text })

    console.log(`Email sent to ${to}: ${subject}`)
    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

/**
 * Get customer email from user ID
 */
async function getCustomerEmail(userId: string): Promise<string | null> {
  try {
    const usersCollection = await getCollection('users')
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    return user?.email || null
  } catch (error) {
    console.error('Error fetching user email:', error)
    return null
  }
}

/**
 * Process pending notifications and send emails
 */
export async function processPendingNotifications(): Promise<void> {
  try {
    const notificationsCollection = await getCollection<INotification>('notifications')
    const usersCollection = await getCollection('users')

    // Find unsent notifications
    const pendingNotifications = await notificationsCollection
      .find({ emailSent: false })
      .limit(100)
      .toArray()

    for (const notification of pendingNotifications) {
      try {
        // Get recipient email
        const recipient = await usersCollection.findOne({ _id: notification.recipientId })
        if (!recipient?.email) {
          console.warn(`No email found for user ${notification.recipientId}`)
          continue
        }

        // Send email based on notification type
        const emailSent = await sendEmail(
          recipient.email,
          notification.subject,
          notification.body, // Would be formatted HTML in real implementation
          notification.body
        )

        if (emailSent) {
          // Mark as sent
          await notificationsCollection.updateOne(
            { _id: notification._id },
            {
              $set: {
                emailSent: true,
                emailSentAt: new Date()
              }
            }
          )
        }
      } catch (error) {
        console.error(`Error processing notification ${notification._id}:`, error)
      }
    }
  } catch (error) {
    console.error('Error processing pending notifications:', error)
  }
}

/**
 * Send document request email
 */
export async function sendDocumentRequestNotification(
  applicationId: string,
  customerId: string,
  requiredDocuments: string[],
  dueDate: Date,
  applicationNumber: string
): Promise<void> {
  try {
    const usersCollection = await getCollection('users')
    const customer = await usersCollection.findOne({ _id: new ObjectId(customerId) })

    if (!customer) {
      console.warn(`Customer not found: ${customerId}`)
      return
    }

    const template = getDocumentRequestEmailTemplate(
      customer.firstName || 'Valued Customer',
      requiredDocuments,
      dueDate,
      applicationNumber
    )

    await sendEmail(customer.email, template.subject, template.html, template.text)

    // Mark notification as sent
    const notificationsCollection = await getCollection<INotification>('notifications')
    await notificationsCollection.updateMany(
      {
        recipientId: new ObjectId(customerId),
        applicationId: new ObjectId(applicationId),
        type: 'document-request',
        emailSent: false
      },
      {
        $set: {
          emailSent: true,
          emailSentAt: new Date()
        }
      }
    )
  } catch (error) {
    console.error('Error sending document request notification:', error)
  }
}

/**
 * Send status update email
 */
export async function sendStatusUpdateNotification(
  applicationId: string,
  customerId: string,
  oldStatus: ApplicationStatus,
  newStatus: ApplicationStatus,
  applicationNumber: string,
  reason?: string
): Promise<void> {
  try {
    const usersCollection = await getCollection('users')
    const customer = await usersCollection.findOne({ _id: new ObjectId(customerId) })

    if (!customer) {
      console.warn(`Customer not found: ${customerId}`)
      return
    }

    // Send different emails based on status
    let subject = ''
    let html = ''
    let text = ''

    if (newStatus === ApplicationStatus.APPROVED) {
      const applicationsCollection = await getCollection<IApplication>('applications')
      const application = await applicationsCollection.findOne({ _id: new ObjectId(applicationId) })
      const approvalAmount = application?.approvalAmount || 0

      const template = getApprovalEmailTemplate(
        customer.firstName || 'Valued Customer',
        applicationNumber,
        approvalAmount
      )
      subject = template.subject
      html = template.html
      text = template.text
    } else if (newStatus === ApplicationStatus.REJECTED) {
      const template = getRejectionEmailTemplate(
        customer.firstName || 'Valued Customer',
        applicationNumber,
        reason
      )
      subject = template.subject
      html = template.html
      text = template.text
    } else {
      const template = getStatusUpdateEmailTemplate(
        customer.firstName || 'Valued Customer',
        applicationNumber,
        oldStatus,
        newStatus,
        reason
      )
      subject = template.subject
      html = template.html
      text = template.text
    }

    await sendEmail(customer.email, subject, html, text)

    // Mark notification as sent
    const notificationsCollection = await getCollection<INotification>('notifications')
    await notificationsCollection.updateMany(
      {
        recipientId: new ObjectId(customerId),
        applicationId: new ObjectId(applicationId),
        type: 'status-update',
        emailSent: false
      },
      {
        $set: {
          emailSent: true,
          emailSentAt: new Date()
        }
      }
    )
  } catch (error) {
    console.error('Error sending status update notification:', error)
  }
}
