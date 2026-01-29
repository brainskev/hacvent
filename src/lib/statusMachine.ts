import { ApplicationStatus } from './types'

/**
 * State Machine Definition
 * Defines valid transitions between statuses
 */
export const statusTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.PRELIMINARY_ELIGIBILITY]: [
    ApplicationStatus.DOCUMENTS_REQUESTED,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.DOCUMENTS_REQUESTED]: [
    ApplicationStatus.DOCUMENTS_RECEIVED,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.DOCUMENTS_RECEIVED]: [
    ApplicationStatus.SUBMITTED_TO_PROGRAM,
    ApplicationStatus.DOCUMENTS_REQUESTED, // Request more docs
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.SUBMITTED_TO_PROGRAM]: [
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.APPROVED]: [
    ApplicationStatus.CONTRACTOR_MATCHED,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.CONTRACTOR_MATCHED]: [
    ApplicationStatus.INSTALLATION_IN_PROGRESS,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.INSTALLATION_IN_PROGRESS]: [
    ApplicationStatus.COMPLETED,
    ApplicationStatus.REJECTED
  ],
  [ApplicationStatus.COMPLETED]: [],
  [ApplicationStatus.REJECTED]: []
}

/**
 * Status Labels for UI
 */
export const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PRELIMINARY_ELIGIBILITY]: 'Preliminary Eligibility',
  [ApplicationStatus.DOCUMENTS_REQUESTED]: 'Documents Requested',
  [ApplicationStatus.DOCUMENTS_RECEIVED]: 'Documents Received',
  [ApplicationStatus.SUBMITTED_TO_PROGRAM]: 'Submitted to Program',
  [ApplicationStatus.APPROVED]: 'Approved',
  [ApplicationStatus.CONTRACTOR_MATCHED]: 'Contractor Matched',
  [ApplicationStatus.INSTALLATION_IN_PROGRESS]: 'Installation In Progress',
  [ApplicationStatus.COMPLETED]: 'Completed',
  [ApplicationStatus.REJECTED]: 'Rejected'
}

/**
 * Status Badge Colors for UI
 */
export const statusBadgeColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PRELIMINARY_ELIGIBILITY]: 'bg-blue-50 text-blue-700 ring-blue-200',
  [ApplicationStatus.DOCUMENTS_REQUESTED]: 'bg-amber-50 text-amber-700 ring-amber-200',
  [ApplicationStatus.DOCUMENTS_RECEIVED]: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  [ApplicationStatus.SUBMITTED_TO_PROGRAM]: 'bg-purple-50 text-purple-700 ring-purple-200',
  [ApplicationStatus.APPROVED]: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  [ApplicationStatus.CONTRACTOR_MATCHED]: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  [ApplicationStatus.INSTALLATION_IN_PROGRESS]: 'bg-orange-50 text-orange-700 ring-orange-200',
  [ApplicationStatus.COMPLETED]: 'bg-green-50 text-green-700 ring-green-200',
  [ApplicationStatus.REJECTED]: 'bg-rose-50 text-rose-700 ring-rose-200'
}

/**
 * Status Icons (icon names from lucide-react)
 */
export const statusIcons: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PRELIMINARY_ELIGIBILITY]: 'CheckCircle2',
  [ApplicationStatus.DOCUMENTS_REQUESTED]: 'FileX2',
  [ApplicationStatus.DOCUMENTS_RECEIVED]: 'FileCheck2',
  [ApplicationStatus.SUBMITTED_TO_PROGRAM]: 'Send',
  [ApplicationStatus.APPROVED]: 'ThumbsUp',
  [ApplicationStatus.CONTRACTOR_MATCHED]: 'Users',
  [ApplicationStatus.INSTALLATION_IN_PROGRESS]: 'Wrench',
  [ApplicationStatus.COMPLETED]: 'CheckCircle2',
  [ApplicationStatus.REJECTED]: 'XCircle'
}

/**
 * Check if transition is valid
 */
export function isValidTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return statusTransitions[from]?.includes(to) ?? false
}

/**
 * Get allowed next statuses
 */
export function getAllowedNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  return statusTransitions[current] ?? []
}

/**
 * Timeline order for display
 */
export const timelineOrder: ApplicationStatus[] = [
  ApplicationStatus.PRELIMINARY_ELIGIBILITY,
  ApplicationStatus.DOCUMENTS_REQUESTED,
  ApplicationStatus.DOCUMENTS_RECEIVED,
  ApplicationStatus.SUBMITTED_TO_PROGRAM,
  ApplicationStatus.APPROVED,
  ApplicationStatus.CONTRACTOR_MATCHED,
  ApplicationStatus.INSTALLATION_IN_PROGRESS,
  ApplicationStatus.COMPLETED
]
