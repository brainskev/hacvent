import { INotification, ApplicationStatus } from '@/lib/types'
import { statusLabels } from './statusMachine'

/**
 * Email templates for different notification types
 */

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function getDocumentRequestEmailTemplate(
  customerName: string,
  requiredDocuments: string[],
  dueDate: Date,
  applicationNumber: string
): EmailTemplate {
  const documentList = requiredDocuments
    .map((doc) => `<li>${doc}</li>`)
    .join('')

  const dueDateFormatted = dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    subject: `Documents Required for Your HVAC Rebate Application (${applicationNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Documents Needed</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p>Hi ${customerName},</p>
          
          <p>We're reviewing your HVAC rebate application <strong>${applicationNumber}</strong> and need a few more documents to proceed.</p>
          
          <p style="margin-top: 20px; margin-bottom: 10px;"><strong>Please upload:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${documentList}
          </ul>
          
          <p style="margin-top: 20px;">
            <strong>Due Date: ${dueDateFormatted}</strong><br>
            Please upload these documents through your customer dashboard as soon as possible to keep your application moving forward.
          </p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-left: 4px solid #667eea; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Need help?</strong> Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
            </p>
          </div>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Documents Needed

Hi ${customerName},

We're reviewing your HVAC rebate application ${applicationNumber} and need a few more documents to proceed.

Please upload:
${requiredDocuments.map((doc) => `- ${doc}`).join('\n')}

Due Date: ${dueDateFormatted}

Please upload these documents through your customer dashboard as soon as possible.

Need help? Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
    `
  }
}

export function getStatusUpdateEmailTemplate(
  customerName: string,
  applicationNumber: string,
  oldStatus: ApplicationStatus,
  newStatus: ApplicationStatus,
  reason?: string
): EmailTemplate {
  const statusEmoji: Record<ApplicationStatus, string> = {
    'preliminary-eligibility': '✓',
    'documents-requested': '📄',
    'documents-received': '✓',
    'submitted-to-program': '📤',
    'approved': '🎉',
    'contractor-matched': '👨‍🔧',
    'installation-in-progress': '🔨',
    'completed': '✅',
    'rejected': '❌'
  }

  const newStatusLabel = statusLabels[newStatus]
  const emoji = statusEmoji[newStatus]

  return {
    subject: `Your Application Status Updated - ${newStatusLabel} (${applicationNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${emoji} Application Update</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p>Hi ${customerName},</p>
          
          <p>Your HVAC rebate application <strong>${applicationNumber}</strong> has been updated.</p>
          
          <div style="margin: 20px 0; padding: 20px; background: #f0f4ff; border-left: 4px solid #667eea; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px;">
              <strong>New Status:</strong><br>
              <span style="font-size: 20px; color: #667eea;">${newStatusLabel}</span>
            </p>
          </div>
          
          ${reason ? `<p><strong>Details:</strong> ${reason}</p>` : ''}
          
          <p>You can view full details of your application in your customer dashboard.</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-left: 4px solid #667eea; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Questions?</strong> Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
            </p>
          </div>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Application Status Updated

Hi ${customerName},

Your HVAC rebate application ${applicationNumber} has been updated.

New Status: ${newStatusLabel}
${reason ? `\nDetails: ${reason}` : ''}

View your full application details at: [dashboard link]

Questions? Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
    `
  }
}

export function getApprovalEmailTemplate(
  customerName: string,
  applicationNumber: string,
  approvalAmount: number
): EmailTemplate {
  return {
    subject: `Congratulations! Your Application is Approved (${applicationNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 You're Approved!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p>Hi ${customerName},</p>
          
          <p>Excellent news! Your HVAC rebate application <strong>${applicationNumber}</strong> has been approved!</p>
          
          <div style="margin: 20px 0; padding: 20px; background: #f0fff4; border: 2px solid #84fab0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #22543d;">
              <strong>Approved Rebate Amount:</strong><br>
              <span style="font-size: 24px; color: #48bb78;">$${approvalAmount.toLocaleString()}</span>
            </p>
          </div>
          
          <p>Here's what happens next:</p>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>We'll match you with a qualified HVAC contractor</li>
            <li>You'll receive a contract to review and sign</li>
            <li>Installation will be scheduled</li>
            <li>Upon completion, you'll receive your rebate</li>
          </ol>
          
          <p>We'll keep you updated every step of the way. Check your dashboard for more details.</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-left: 4px solid #84fab0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Questions?</strong> Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
            </p>
          </div>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Congratulations! Your Application is Approved

Hi ${customerName},

Excellent news! Your HVAC rebate application ${applicationNumber} has been approved!

Approved Rebate Amount: $${approvalAmount.toLocaleString()}

Here's what happens next:
1. We'll match you with a qualified HVAC contractor
2. You'll receive a contract to review and sign
3. Installation will be scheduled
4. Upon completion, you'll receive your rebate

We'll keep you updated every step of the way.

Questions? Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
    `
  }
}

export function getRejectionEmailTemplate(
  customerName: string,
  applicationNumber: string,
  reason?: string
): EmailTemplate {
  return {
    subject: `Application Status Update (${applicationNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Application Status</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p>Hi ${customerName},</p>
          
          <p>Thank you for your interest in our HVAC rebate program. We've completed our review of application <strong>${applicationNumber}</strong>.</p>
          
          <p style="margin-top: 20px; padding: 15px; background: #fff5f5; border-left: 4px solid #ff6a88; border-radius: 4px;">
            Unfortunately, your application does not meet the current program requirements at this time.
          </p>
          
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          
          <p>We encourage you to reapply in the future. Program requirements and availability may change.</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-left: 4px solid #ff9a56; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Have questions?</strong> Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
            </p>
          </div>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
    text: `
Application Status Update

Hi ${customerName},

Thank you for your interest in our HVAC rebate program. We've completed our review of application ${applicationNumber}.

Unfortunately, your application does not meet the current program requirements at this time.

${reason ? `Reason: ${reason}` : ''}

We encourage you to reapply in the future. Program requirements and availability may change.

Questions? Contact us at support@hacvent.com or call 1-800-HVAC-REBATE
    `
  }
}

/**
 * Send documents requested email to customer after intake submission
 */
export async function sendDocumentsRequestedEmail({
  customerName,
  customerEmail,
  applicationNumber,
  applicationId,
}: {
  customerName: string
  customerEmail: string
  applicationNumber: string
  applicationId: string
}): Promise<void> {
  const requiredDocuments = [
    'Tax return (last year)',
    'Recent utility bill',
    'Property proof (mortgage or tax bill)',
    'Current HVAC system information'
  ]
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7) // 7 days from now

  const template = getDocumentRequestEmailTemplate(
    customerName,
    requiredDocuments,
    dueDate,
    applicationNumber
  )

  // For now, log the email to console (in production, use actual email service)
  console.log(`📧 Sending documents requested email to ${customerEmail}:`, {
    applicationNumber,
    applicationId,
    subject: template.subject,
  })

  // TODO: Integrate with actual email service (Sendgrid, Mailgun, etc.)
  // Example:
  // await sgMail.send({
  //   to: customerEmail,
  //   from: 'noreply@hacvent.com',
  //   subject: template.subject,
  //   html: template.html,
  //   text: template.text,
  // })
}

