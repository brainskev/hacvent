import { ObjectId } from 'mongodb'

/**
 * Status Enums for State Machine
 * Defines the application lifecycle
 */
export enum ApplicationStatus {
  PRELIMINARY_ELIGIBILITY = 'preliminary-eligibility',
  DOCUMENTS_REQUESTED = 'documents-requested',
  DOCUMENTS_RECEIVED = 'documents-received',
  SUBMITTED_TO_PROGRAM = 'submitted-to-program',
  APPROVED = 'approved',
  CONTRACTOR_MATCHED = 'contractor-matched',
  INSTALLATION_IN_PROGRESS = 'installation-in-progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  CONTRACTOR = 'contractor'
}

export enum DocumentType {
  // Income Verification - Primary
  INCOME_TAX_FORM = 'income-tax-form', // 1040, W2, 1099, Schedule 1
  
  // Income Verification - Alternative
  WAGE_STATEMENT = 'wage-statement', // Paystubs/wage statements (past 30 days)
  RETIREMENT_INCOME_PROOF = 'retirement-income-proof', // Pension, Social Security, 401K, IRA statements
  GOVERNMENT_ASSISTANCE_PROOF = 'government-assistance-proof', // Social Security, veteran benefits, worker's comp
  UNEMPLOYMENT_BENEFITS = 'unemployment-benefits', // Unemployment/strike benefits proof
  
  // Proof of Ownership/Residency
  PROPERTY_TAX_BILL = 'property-tax-bill', // Recent property tax bill
  HOME_INSURANCE_STATEMENT = 'home-insurance-statement', // Home insurance statement (front page with recent date)
  MORTGAGE_STATEMENT = 'mortgage-statement', // Mortgage statement
  
  // Installation & Rebate Documents
  HVAC_QUOTE = 'hvac-quote',
  INSTALLATION_CERTIFICATE = 'installation-certificate',
  REBATE_PAPERWORK = 'rebate-paperwork',
  
  OTHER = 'other'
}

export enum DocumentStatus {
  REQUESTED = 'requested',
  UPLOADED = 'uploaded',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

/**
 * User Document
 */
export interface IUser {
  _id?: ObjectId
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Application Document
 */
export interface IApplication {
  _id?: ObjectId
  customerId: ObjectId | string
  contractorId?: ObjectId
  applicationNumber: string
  status: ApplicationStatus
  eligibilityScore?: number
  requestedAmount?: number
  approvalAmount?: number
  serviceArea: string
  currentUtility?: string
  homeType?: 'single-family' | 'multi-family' | 'other'
  hvacType?: string
  estimatedInstallDate?: Date
  createdAt: Date
  updatedAt: Date
  submittedToProgramAt?: Date
  approvedAt?: Date
  rejectedAt?: Date
  completedAt?: Date
  notes?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  projectSize?: string
  preferredContactMethod?: string
  rebatePortalEmail?: string
  rebatePortalPassword?: string
}

/**
 * Document Record
 */
export interface IDocument {
  _id?: ObjectId
  applicationId: ObjectId
  userId: ObjectId | string
  fileName: string
  fileUrl: string
  publicId?: string
  resourceType?: string
  version?: number
  deliveryType?: string
  accessMode?: string
  format?: string
  documentType: DocumentType
  status: DocumentStatus
  size: number
  mimeType: string
  uploadedAt: Date
  verifiedAt?: Date
  verifiedBy?: ObjectId
  rejectionReason?: string
}

/**
 * Status History (Audit Trail)
 */
export interface IStatusChange {
  _id?: ObjectId
  applicationId: ObjectId
  fromStatus: ApplicationStatus
  toStatus: ApplicationStatus
  changedBy: ObjectId
  reason?: string
  metadata?: Record<string, any>
  createdAt: Date
}

/**
 * Notification/Message
 */
export interface INotification {
  _id?: ObjectId
  recipientId: ObjectId | string
  senderId: ObjectId
  applicationId: ObjectId
  type:
    | 'status-update'
    | 'document-request'
    | 'document-received'
    | 'approval'
    | 'rejection'
    | 'contractor-matched'
    | 'invoice'
    | 'general'
  subject: string
  body: string
  emailSent: boolean
  emailSentAt?: Date
  dashboardViewed: boolean
  viewedAt?: Date
  createdAt: Date
}

/**
 * Document Request (Admin requests docs from customer)
 */
export interface IDocumentRequest {
  _id?: ObjectId
  applicationId: ObjectId
  requestedFrom: ObjectId // customer or contractor
  requestedBy: ObjectId // admin
  requiredDocuments: DocumentType[]
  dueDate: Date
  status: 'pending' | 'partial' | 'complete'
  createdAt: Date
  completedAt?: Date
}

/**
 * Contractor Document
 */
export interface IContractor {
  _id?: ObjectId
  company_name: string
  contact_name: string
  email: string
  phone: string
  license_number: string
  service_areas: string[]
  approved: boolean
  approval_fee_paid: boolean
  approval_fee_amount: number
  approval_fee_paid_date?: Date
  projects: string[] // Array of customer IDs
  total_projects_completed: number
  total_revenue_generated?: number
  filing_fees_owed?: number
  filing_fees_paid?: number
  referral_fees_owed?: number
  referral_fees_paid?: number
  onboarding_date: Date
  status: 'pending' | 'approved' | 'suspended' | 'deactivated'
  notes?: string
  created_at: Date
  updated_at: Date
}
