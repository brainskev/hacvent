'use client'

import React from 'react'
import { ApplicationStatus, IApplication } from '@/lib/types'
import { statusLabels, statusBadgeColors, getAllowedNextStatuses } from '@/lib/statusMachine'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FileX2,
  FileCheck2,
  ChevronDown,
  Filter,
  Users,
  DollarSign
} from 'lucide-react'

interface AdminApplicationCardProps {
  application: IApplication
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => Promise<void>
  onRequestDocuments?: (applicationId: string) => void
  onMatchContractor?: (applicationId: string) => void
}

export function AdminApplicationCard({
  application,
  onStatusChange,
  onRequestDocuments,
  onMatchContractor
}: AdminApplicationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<ApplicationStatus | ''>('')
  const [isChanging, setIsChanging] = React.useState(false)

  const allowedStatuses = getAllowedNextStatuses(application.status)

  const handleStatusChange = async () => {
    if (!selectedStatus || !onStatusChange) return
    setIsChanging(true)
    try {
      await onStatusChange(application._id?.toString() || '', selectedStatus as ApplicationStatus)
      setSelectedStatus('')
    } catch (error) {
      console.error('Failed to change status:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {application.applicationNumber}
              </h3>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusBadgeColors[application.status]}`}>
                {statusLabels[application.status]}
              </span>
            </div>
            <p className="text-xs text-gray-600">{application.serviceArea}</p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 px-4 py-3 bg-gray-50">
        {application.eligibilityScore !== undefined && (
          <div className="text-center">
            <p className="text-xs text-gray-600">Eligibility</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {Math.round(application.eligibilityScore * 100)}%
            </p>
          </div>
        )}
        {application.requestedAmount !== undefined && (
          <div className="text-center">
            <p className="text-xs text-gray-600">Requested</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              ${(application.requestedAmount / 1000).toFixed(1)}k
            </p>
          </div>
        )}
        <div className="text-center">
          <p className="text-xs text-gray-600">Created</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {/* Details Section */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Home Type</p>
              <p className="text-gray-900 mt-1">{application.homeType || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">HVAC Type</p>
              <p className="text-gray-900 mt-1">{application.hvacType || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Current Utility</p>
              <p className="text-gray-900 mt-1">{application.currentUtility || 'Not specified'}</p>
            </div>
            {application.approvalAmount !== undefined && (
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Approved Amount</p>
                <p className="text-emerald-600 font-semibold mt-1">
                  ${application.approvalAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Status Change Section */}
          {allowedStatuses.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Change Status</p>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  disabled={isChanging}
                  className="flex-1 min-w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select new status...</option>
                  {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusChange}
                  disabled={!selectedStatus || isChanging}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChanging ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
            {application.status === ApplicationStatus.PRELIMINARY_ELIGIBILITY && (
              <button
                onClick={() => onRequestDocuments?.(application._id?.toString() || '')}
                className="flex-1 min-w-40 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-200 px-3 py-2 text-sm font-semibold hover:bg-amber-100"
              >
                <FileX2 className="w-4 h-4" />
                Request Documents
              </button>
            )}

            {application.status === ApplicationStatus.APPROVED && !application.contractorId && (
              <button
                onClick={() => onMatchContractor?.(application._id?.toString() || '')}
                className="flex-1 min-w-40 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-3 py-2 text-sm font-semibold hover:bg-blue-100"
              >
                <Users className="w-4 h-4" />
                Match Contractor
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
