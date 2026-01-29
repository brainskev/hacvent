'use client'

import React from 'react'
import { ApplicationStatus, IApplication } from '@/lib/types'
import { AdminApplicationCard } from './AdminApplicationCard'
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'

interface AdminQueueViewProps {
  applications: IApplication[]
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => Promise<void>
  onRequestDocuments?: (applicationId: string) => void
  onMatchContractor?: (applicationId: string) => void
}

export function AdminQueueView({
  applications,
  onStatusChange,
  onRequestDocuments,
  onMatchContractor
}: AdminQueueViewProps) {
  const [activeQueue, setActiveQueue] = React.useState<ApplicationStatus | 'all'>('all')

  const queues = [
    {
      id: 'intake' as const,
      label: 'Intake Queue',
      status: ApplicationStatus.PRELIMINARY_ELIGIBILITY,
      icon: Users,
      description: 'New applications ready for eligibility review'
    },
    {
      id: 'documents' as const,
      label: 'Awaiting Documents',
      status: ApplicationStatus.DOCUMENTS_REQUESTED,
      icon: FileText,
      description: 'Waiting for customer document uploads'
    },
    {
      id: 'submission' as const,
      label: 'Ready for State',
      status: ApplicationStatus.DOCUMENTS_RECEIVED,
      icon: Clock,
      description: 'Documents complete, ready to submit to state'
    },
    {
      id: 'approval' as const,
      label: 'Awaiting Approval',
      status: ApplicationStatus.SUBMITTED_TO_PROGRAM,
      icon: Clock,
      description: 'Submitted to state program'
    },
    {
      id: 'matching' as const,
      label: 'Ready to Match',
      status: ApplicationStatus.APPROVED,
      icon: Briefcase,
      description: 'Approved applications awaiting contractor match'
    },
    {
      id: 'active' as const,
      label: 'Active Projects',
      status: ApplicationStatus.INSTALLATION_IN_PROGRESS,
      icon: AlertCircle,
      description: 'Installations currently in progress'
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      status: ApplicationStatus.COMPLETED,
      icon: CheckCircle2,
      description: 'Completed installations'
    }
  ]

  const filtered =
    activeQueue === 'all'
      ? applications
      : applications.filter((app) => app.status === (activeQueue as ApplicationStatus))

  const queueCounts = Object.values(ApplicationStatus).reduce(
    (acc, status) => {
      acc[status] = applications.filter((app) => app.status === status).length
      return acc
    },
    {} as Record<ApplicationStatus, number>
  )

  return (
    <div className="space-y-6">
      {/* Queue Navigation */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2">
          <button
            onClick={() => setActiveQueue('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeQueue === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ({applications.length})
          </button>

          {queues.map(({ id, label, status, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveQueue(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap inline-flex items-center gap-2 transition-colors ${
                activeQueue === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
              title={description}
            >
              <Icon className="w-4 h-4" />
              {label} ({queueCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((app) => (
            <AdminApplicationCard
              key={app._id?.toString()}
              application={app}
              onStatusChange={onStatusChange}
              onRequestDocuments={onRequestDocuments}
              onMatchContractor={onMatchContractor}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No applications in this queue</p>
          <p className="text-sm text-gray-500 mt-1">
            {activeQueue === 'all'
              ? 'All queues are empty'
              : 'All applications have moved past this stage'}
          </p>
        </div>
      )}
    </div>
  )
}
