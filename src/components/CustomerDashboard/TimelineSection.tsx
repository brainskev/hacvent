'use client'

import React from 'react'
import { IApplication } from '@/lib/types'
import { ApplicationTimeline } from '@/components/CustomerDashboard/ApplicationTimeline'

interface TimelineSectionProps {
  application: IApplication
  onNavigateToActions: () => void
}

export function TimelineSection({ application, onNavigateToActions }: TimelineSectionProps) {
  return (
    <div className="space-y-6">
      <ApplicationTimeline
        application={application}
        onNavigateToActions={onNavigateToActions}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Application Number</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{application.applicationNumber}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Service Area</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{application.serviceArea}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600">Eligibility Score</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            {application.eligibilityScore && application.eligibilityScore > 0 ? (
              `${Math.round(application.eligibilityScore * 100)}%`
            ) : (
              <span className="text-amber-600 text-base">Pending Review</span>
            )}
          </p>
          {(!application.eligibilityScore || application.eligibilityScore === 0) && (
            <p className="text-xs text-gray-500 mt-1">Upload documents for assessment</p>
          )}
        </div>
      </div>
    </div>
  )
}
