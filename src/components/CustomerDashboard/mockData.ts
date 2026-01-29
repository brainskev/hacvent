import { ApplicationStatus, IApplication, INotification } from '@/lib/types'

export const mockApplications: IApplication[] = [
  {
    _id: '67890abcdef123456789abc0' as any,
    applicationNumber: 'APP-001',
    customerId: {} as any,
    status: ApplicationStatus.DOCUMENTS_REQUESTED,
    eligibilityScore: 0.85,
    requestedAmount: 7500,
    serviceArea: 'Ann Arbor, MI',
    currentUtility: 'DTE Energy',
    homeType: 'single-family',
    hvacType: 'Gas Furnace + Central AC',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15')
  },
  {
    _id: '67890abcdef123456789abc1' as any,
    applicationNumber: 'APP-002',
    customerId: {} as any,
    status: ApplicationStatus.PRELIMINARY_ELIGIBILITY,
    eligibilityScore: 0.72,
    requestedAmount: 6400,
    serviceArea: 'Ypsilanti, MI',
    currentUtility: 'Consumers Energy',
    homeType: 'single-family',
    hvacType: 'Heat Pump',
    createdAt: new Date('2025-02-03'),
    updatedAt: new Date('2025-02-05')
  }
]

export const mockNotifications: INotification[] = [
  {
    _id: 'notif-1' as any,
    subject: 'Documents Requested',
    body: 'We need your proof of ownership and latest utility bill to proceed with eligibility review.',
    type: 'document-request',
    recipientId: {} as any,
    senderId: {} as any,
    applicationId: '67890abcdef123456789abc0' as any,
    emailSent: true,
    emailSentAt: new Date('2025-01-15'),
    dashboardViewed: true,
    viewedAt: new Date('2025-01-15'),
    createdAt: new Date('2025-01-15')
  },
  {
    _id: 'notif-2' as any,
    subject: 'Preliminary Eligibility Approved',
    body: 'Great news! Your home meets the preliminary eligibility requirements for our energy-efficient HVAC rebate program.',
    type: 'approval',
    recipientId: {} as any,
    senderId: {} as any,
    applicationId: '67890abcdef123456789abc0' as any,
    emailSent: true,
    emailSentAt: new Date('2025-01-12'),
    dashboardViewed: true,
    viewedAt: new Date('2025-01-12'),
    createdAt: new Date('2025-01-12')
  },
  {
    _id: 'notif-3' as any,
    subject: 'Application Submitted',
    body: 'Your application has been successfully submitted. We will review it and contact you within 5 business days.',
    type: 'status-update',
    recipientId: {} as any,
    senderId: {} as any,
    applicationId: '67890abcdef123456789abc1' as any,
    emailSent: true,
    emailSentAt: new Date('2025-01-01'),
    dashboardViewed: true,
    viewedAt: new Date('2025-01-01'),
    createdAt: new Date('2025-01-01')
  }
]
