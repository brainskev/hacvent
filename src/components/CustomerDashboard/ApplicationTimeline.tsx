'use client'

import React, { useState } from 'react'
import { ApplicationStatus, IApplication, INotification } from '@/lib/types'
import { statusLabels, statusBadgeColors, timelineOrder } from '@/lib/statusMachine'
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  FileText
} from 'lucide-react'

interface ApplicationTimelineProps {
  application: IApplication
  onNavigateToActions?: () => void
}

export function ApplicationTimeline({ application, onNavigateToActions }: ApplicationTimelineProps) {
  const [expandedMobile, setExpandedMobile] = useState(false)
  const isActionRequired = application.status === ApplicationStatus.DOCUMENTS_REQUESTED

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Application Timeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            Application #{application.applicationNumber}
          </p>
        </div>
        {isActionRequired && (
          <button
            onClick={onNavigateToActions}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 text-amber-700 px-4 py-2 text-sm font-semibold ring-1 ring-amber-200 hover:bg-amber-100"
          >
            <AlertCircle className="w-4 h-4" />
            Action Required
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Timeline - Desktop */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between gap-1 mb-6">
          {timelineOrder.map((status, index) => {
            const isCompleted =
              timelineOrder.indexOf(application.status) >= index ||
              application.status === ApplicationStatus.COMPLETED ||
              application.status === ApplicationStatus.REJECTED

            const isCurrent = application.status === status

            return (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                    title={statusLabels[status]}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <p className="text-xs text-center font-semibold text-gray-700 mt-2 leading-tight max-w-[80px]">
                    {statusLabels[status]}
                  </p>
                </div>
                {index < timelineOrder.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 mb-6 ${isCompleted ? 'bg-emerald-200' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Vertical Timeline - Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setExpandedMobile(!expandedMobile)}
          className="w-full flex items-center justify-between p-3 mb-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
        >
          <span className="text-sm font-semibold text-gray-900">View Timeline ({timelineOrder.length} steps)</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile ? 'rotate-180' : ''}`} />
        </button>

        {expandedMobile && (
          <div className="space-y-3 mb-4 pl-3 border-l-2 border-gray-200">
            {timelineOrder.map((status) => {
              const isCompleted =
                timelineOrder.indexOf(application.status) >= timelineOrder.indexOf(status) ||
                application.status === ApplicationStatus.COMPLETED ||
                application.status === ApplicationStatus.REJECTED

              const isCurrent = application.status === status

              return (
                <div key={status} className="flex gap-2 items-start">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3 animate-pulse" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      isCurrent ? 'text-blue-700' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {statusLabels[status]}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-600">Currently in progress</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
          Current Status
        </p>
        <span
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ${statusBadgeColors[application.status]}`}
        >
          {statusLabels[application.status]}
        </span>
      </div>
    </div>
  )
}
