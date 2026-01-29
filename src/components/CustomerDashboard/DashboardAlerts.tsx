'use client'

import React from 'react'
import { ApplicationStatus } from '@/lib/types'
import { AlertCircle } from 'lucide-react'

interface DashboardAlertsProps {
  intakeCompleted: boolean
  applicationStatus?: ApplicationStatus
  documentsCount: number
  activeSection: 'timeline' | 'documents' | 'notifications'
  onViewDocuments: () => void
}

export function DashboardAlerts({
  intakeCompleted,
  applicationStatus,
  documentsCount,
  activeSection,
  onViewDocuments
}: DashboardAlertsProps) {
  const showDocumentsAlert =
    intakeCompleted &&
    applicationStatus === ApplicationStatus.DOCUMENTS_REQUESTED &&
    documentsCount === 0 &&
    activeSection !== 'documents'
  return (
    <>
      {!intakeCompleted && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Complete your intake form to start your application.
              </p>
            </div>
            <a
              href="/customer-intake"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap ml-4"
            >
              Start Intake →
            </a>
          </div>
        </div>
      )}

      {showDocumentsAlert && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 max-w-7xl mx-auto">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Documents Requested: Please upload the requested documents to proceed with your application.
              </p>
            </div>
            <button
              onClick={onViewDocuments}
              className="text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap ml-4"
            >
              View Documents →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
