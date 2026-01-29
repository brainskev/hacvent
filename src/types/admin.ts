export type CustomerStatus =
  | 'preliminary-eligible'
  | 'docs-requested'
  | 'docs-received'
  | 'state-submission-in-progress'
  | 'approved'
  | 'matched'
  | 'installation-in-progress'
  | 'completed'

export interface StatusEntry {
  status: CustomerStatus
  at: string
  note?: string
}

export interface DocumentItem {
  id: string
  name: string
  status: 'requested' | 'uploaded' | 'verified'
  updatedAt: string
}

export interface NoteItem {
  id: string
  body: string
  createdAt: string
}

export interface EmailLog {
  id: string
  subject: string
  sentAt: string
}

export interface CustomerRecord {
  id: string
  name: string
  location: string
  status: CustomerStatus
  lastUpdated: string
  actionRequired: boolean
  documents: DocumentItem[]
  requiredDocuments: string[]
  statusHistory: StatusEntry[]
  notes: NoteItem[]
  emails: EmailLog[]
  applications?: any[] // Store all applications for this customer
  selectedApplicationId?: string // Currently selected application
}

export const STATUS_LABELS: Record<CustomerStatus, string> = {
  'preliminary-eligible': 'Preliminary Eligible',
  'docs-requested': 'Docs Requested',
  'docs-received': 'Docs Received',
  'state-submission-in-progress': 'State Submission In Progress',
  approved: 'Approved',
  matched: 'Matched',
  'installation-in-progress': 'Installation In Progress',
  completed: 'Completed'
}

export const STATUS_STYLES: Record<CustomerStatus, string> = {
  'preliminary-eligible': 'bg-blue-50 text-blue-700 ring-blue-200',
  'docs-requested': 'bg-amber-50 text-amber-700 ring-amber-200',
  'docs-received': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'state-submission-in-progress': 'bg-purple-50 text-purple-700 ring-purple-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  matched: 'bg-sky-50 text-sky-700 ring-sky-200',
  'installation-in-progress': 'bg-orange-50 text-orange-700 ring-orange-200',
  completed: 'bg-gray-100 text-gray-700 ring-gray-200'
}
