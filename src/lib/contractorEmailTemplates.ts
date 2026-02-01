import { EmailTemplate } from './emailTemplates'

export interface ContractorInfo {
  company_name: string
  contact_name: string
  email: string
  license_number: string
}

/**
 * Template: Request submission details for state approval
 */
export function getDetailsRequestEmailTemplate(contractor: ContractorInfo): EmailTemplate & { to: string } {
  const subject = `Action Required: Documents Needed for State HVAC Rebate Approval`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .document-list { list-style: none; padding: 0; }
    .document-list li { padding: 10px; margin: 8px 0; background: #f3f4f6; border-radius: 4px; }
    .document-list li:before { content: "✓ "; color: #10b981; font-weight: bold; margin-right: 8px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Hacvent Contractor Network</h1>
      <p style="margin: 10px 0 0 0;">Welcome to the approval process!</p>
    </div>
    
    <div class="content">
      <p>Dear ${contractor.contact_name},</p>
      
      <p>Thank you for applying to join the Hacvent contractor network. We're excited to help you get approved for Michigan's HVAC rebate programs!</p>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #10b981;">📋 Next Steps</h3>
        <p>To submit your application to the state HVAC rebate program, we need the following documents from you:</p>
        
        <ul class="document-list">
          <li>Current HVAC Contractor License (Michigan)</li>
          <li>Proof of Liability Insurance</li>
          <li>Workers' Compensation Insurance Certificate</li>
          <li>W-9 Tax Form</li>
          <li>Business Registration Documents</li>
        </ul>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #059669;">💰 What Happens Next</h3>
        <ol style="padding-left: 20px;">
          <li>Send us the required documents</li>
          <li>We submit your application to the state portal</li>
          <li>State reviews and approves (typically 5-10 business days)</li>
          <li>We send you a $50 invoice for paperwork processing</li>
          <li>Once paid, you're activated and start receiving customer matches!</li>
        </ol>
      </div>
      
      <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0;"><strong>⚡ Fast Track:</strong> If you're already approved with the state portal, let us know! We can activate you immediately at no charge.</p>
      </div>
      
      <p><strong>Please reply to this email with the required documents attached.</strong></p>
      
      <p>Best regards,<br>
      <strong>The Hacvent Team</strong><br>
      support@hacvent.com</p>
    </div>
    
    <div class="footer">
      <p>Hacvent - Connecting homeowners with certified HVAC contractors</p>
      <p>License #: ${contractor.license_number}</p>
    </div>
  </div>
</body>
</html>
  `
  
  const text = `
Dear ${contractor.contact_name},

Thank you for applying to join the Hacvent contractor network. We're excited to help you get approved for Michigan's HVAC rebate programs!

NEXT STEPS
To submit your application to the state HVAC rebate program, we need the following documents from you:

✓ Current HVAC Contractor License (Michigan)
✓ Proof of Liability Insurance
✓ Workers' Compensation Insurance Certificate
✓ W-9 Tax Form
✓ Business Registration Documents

WHAT HAPPENS NEXT
1. Send us the required documents
2. We submit your application to the state portal
3. State reviews and approves (typically 5-10 business days)
4. We send you a $50 invoice for paperwork processing
5. Once paid, you're activated and start receiving customer matches!

FAST TRACK: If you're already approved with the state portal, let us know! We can activate you immediately at no charge.

Please reply to this email with the required documents attached.

Best regards,
The Hacvent Team
support@hacvent.com

License #: ${contractor.license_number}
  `
  
  return { subject, html, text, to: contractor.email }
}

/**
 * Template: Send $50 paperwork processing invoice
 */
export function getInvoiceEmailTemplate(contractor: ContractorInfo): EmailTemplate & { to: string; invoiceNumber: string } {
  const invoiceNumber = `INV-${Date.now()}`
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
  
  const subject = `Invoice for Rebate Program Paperwork Processing - ${contractor.company_name}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .invoice-box { background: white; border: 2px solid #e5e7eb; padding: 30px; margin: 20px 0; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .invoice-table th { background: #f3f4f6; font-weight: bold; }
    .total-row { background: #f0fdf4; font-weight: bold; font-size: 18px; }
    .payment-info { background: #dbeafe; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">INVOICE</h1>
      <p style="margin: 10px 0 0 0;">Hacvent - Contractor Services</p>
    </div>
    
    <div class="invoice-box">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px;">
        <div>
          <strong>Hacvent</strong><br>
          Contractor Network Services<br>
          support@hacvent.com
        </div>
        <div style="text-align: right;">
          <strong>Invoice #:</strong> ${invoiceNumber}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
          <strong>Due Date:</strong> ${dueDate}
        </div>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="margin-top: 0;">Bill To:</h3>
        <strong>${contractor.company_name}</strong><br>
        ${contractor.contact_name}<br>
        ${contractor.email}<br>
        License #: ${contractor.license_number}
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>State Rebate Program Application Processing</strong><br>
              <span style="font-size: 13px; color: #6b7280;">
                Includes: Document preparation, state portal submission, application tracking, approval coordination, and administrative processing
              </span>
            </td>
            <td style="text-align: right;">$50.00</td>
          </tr>
          <tr class="total-row">
            <td style="text-align: right;">TOTAL DUE:</td>
            <td style="text-align: right;">$50.00</td>
          </tr>
        </tbody>
      </table>
      
      <div class="payment-info">
        <h3 style="margin-top: 0; color: #2563eb;">💳 Payment Instructions</h3>
        <p><strong>Option 1: Bank Transfer (Preferred)</strong></p>
        <ul style="margin: 5px 0;">
          <li>Bank: [Your Bank Name]</li>
          <li>Account Name: Hacvent / Marxma LLC</li>
          <li>Account Number: [Account Number]</li>
          <li>Routing Number: [Routing Number]</li>
          <li>Reference: ${invoiceNumber}</li>
        </ul>
        
        <p style="margin-top: 15px;"><strong>Option 2: Check Payment</strong></p>
        <p style="margin: 5px 0;">
          Make checks payable to: <strong>Marxma LLC</strong><br>
          Mail to: [Your Business Address]<br>
          Reference: ${invoiceNumber}
        </p>
      </div>
      
      <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0;"><strong>🎉 What's Next:</strong> Once we receive your payment, we'll immediately activate your account and you'll start receiving qualified customer matches within 24-48 hours!</p>
      </div>
      
      <p style="margin-top: 30px;">Questions about this invoice? Contact us at support@hacvent.com</p>
      
      <p>Thank you for your business!</p>
    </div>
    
    <div class="footer">
      <p>Hacvent - A service of Marxma LLC</p>
      <p>This invoice is due within 14 days of issue date</p>
    </div>
  </div>
</body>
</html>
  `
  
  const text = `
INVOICE

Hacvent - Contractor Services
Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}
Due Date: ${dueDate}

BILL TO:
${contractor.company_name}
${contractor.contact_name}
${contractor.email}
License #: ${contractor.license_number}

DESCRIPTION                                    AMOUNT
State Rebate Program Application Processing   $50.00
(Includes document preparation, state portal 
submission, application tracking, approval 
coordination, and administrative processing)

TOTAL DUE: $50.00

PAYMENT INSTRUCTIONS:

Option 1: Bank Transfer (Preferred)
- Bank: [Your Bank Name]
- Account Name: Hacvent / Marxma LLC
- Account Number: [Account Number]
- Routing Number: [Routing Number]
- Reference: ${invoiceNumber}

Option 2: Check Payment
Make checks payable to: Marxma LLC
Mail to: [Your Business Address]
Reference: ${invoiceNumber}

WHAT'S NEXT:
Once we receive your payment, we'll immediately activate your account and you'll start receiving qualified customer matches within 24-48 hours!

Questions? Contact us at support@hacvent.com

Thank you for your business!

Hacvent - A service of Marxma LLC
This invoice is due within 14 days of issue date
  `
  
  return { subject, html, text, to: contractor.email, invoiceNumber }
}

/**
 * Template: Notify contractor they're approved and active
 */
export function getApprovalConfirmationEmailTemplate(contractor: ContractorInfo): EmailTemplate & { to: string } {
  const subject = `🎉 You're Approved! Welcome to the Hacvent Contractor Network`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .success-box { background: #f0fdf4; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
      <p style="margin: 15px 0 0 0; font-size: 18px;">You're now an approved Hacvent contractor</p>
    </div>
    
    <div class="content">
      <div class="success-box">
        <h2 style="color: #10b981; margin-top: 0;">✓ Account Activated</h2>
        <p style="font-size: 18px; margin: 0;">You're now live and ready to receive customer matches!</p>
      </div>
      
      <p>Dear ${contractor.contact_name},</p>
      
      <p>Great news! Your application has been fully approved, and ${contractor.company_name} is now an active member of the Hacvent contractor network.</p>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #10b981;">🚀 What This Means</h3>
        <ul>
          <li><strong>Immediate Customer Matches:</strong> You'll start receiving qualified leads from homeowners in your service areas</li>
          <li><strong>$8K-$14K Rebate Projects:</strong> Work with customers eligible for substantial HEEHRA rebates</li>
          <li><strong>Streamlined Process:</strong> We handle rebate paperwork coordination, so you can focus on installations</li>
          <li><strong>Quality Leads:</strong> All customers are pre-screened and rebate-eligible</li>
        </ul>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #059669;">📍 Your Service Areas</h3>
        <p>You're now listed for projects in your approved service areas. Customers from these regions will see you as an available contractor option.</p>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0; color: #2563eb;">📬 What to Expect</h3>
        <ol>
          <li>You'll receive email notifications when matched with customers</li>
          <li>Customer contact details will be provided for direct outreach</li>
          <li>We'll coordinate rebate documentation and submission</li>
          <li>You handle the installation and invoicing</li>
        </ol>
      </div>
      
      <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Respond quickly to customer matches! Homeowners often reach out to multiple contractors, and first responders typically win the business.</p>
      </div>
      
      <p>Welcome to the team! We're excited to partner with you in making energy-efficient HVAC upgrades accessible to Michigan homeowners.</p>
      
      <p>Best regards,<br>
      <strong>The Hacvent Team</strong><br>
      support@hacvent.com</p>
    </div>
    
    <div class="footer">
      <p>Hacvent - Connecting homeowners with certified HVAC contractors</p>
      <p>${contractor.company_name} • License #: ${contractor.license_number}</p>
    </div>
  </div>
</body>
</html>
  `
  
  const text = `
🎉 CONGRATULATIONS! You're now an approved Hacvent contractor

Dear ${contractor.contact_name},

Great news! Your application has been fully approved, and ${contractor.company_name} is now an active member of the Hacvent contractor network.

✓ ACCOUNT ACTIVATED
You're now live and ready to receive customer matches!

WHAT THIS MEANS:
• Immediate Customer Matches: You'll start receiving qualified leads from homeowners in your service areas
• $8K-$14K Rebate Projects: Work with customers eligible for substantial HEEHRA rebates
• Streamlined Process: We handle rebate paperwork coordination, so you can focus on installations
• Quality Leads: All customers are pre-screened and rebate-eligible

YOUR SERVICE AREAS:
You're now listed for projects in your approved service areas. Customers from these regions will see you as an available contractor option.

WHAT TO EXPECT:
1. You'll receive email notifications when matched with customers
2. Customer contact details will be provided for direct outreach
3. We'll coordinate rebate documentation and submission
4. You handle the installation and invoicing

PRO TIP: Respond quickly to customer matches! Homeowners often reach out to multiple contractors, and first responders typically win the business.

Welcome to the team! We're excited to partner with you in making energy-efficient HVAC upgrades accessible to Michigan homeowners.

Best regards,
The Hacvent Team
support@hacvent.com

${contractor.company_name} • License #: ${contractor.license_number}
  `
  
  return { subject, html, text, to: contractor.email }
}
