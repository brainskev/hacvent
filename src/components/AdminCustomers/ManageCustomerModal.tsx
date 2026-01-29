'use client'

import React from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import { CustomerRecord, CustomerStatus, STATUS_LABELS } from '@/types/admin'

interface ManageCustomerModalProps {
  customer: CustomerRecord | null
  statusDraft: CustomerStatus
  noteDraft: string
  emailDraft: { subject: string; body: string }
  onStatusChange: (status: CustomerStatus) => void
  onNoteDraftChange: (note: string) => void
  onEmailDraftChange: (subject: string, body: string) => void
  onStatusUpdate: (customerId: string, status: CustomerStatus) => void
  onRequestDocuments: (customerId: string) => void
  onAddNote: (customerId: string) => void
  onSendEmail: (customerId: string) => void
  onClose: () => void
  onProjectChange: (appId: string) => void
  mapApplicationStatusToCustomerStatus: (appStatus: string) => CustomerStatus
}

export function ManageCustomerModal({
  customer,
  statusDraft,
  noteDraft,
  emailDraft,
  onStatusChange,
  onNoteDraftChange,
  onEmailDraftChange,
  onStatusUpdate,
  onRequestDocuments,
  onAddNote,
  onSendEmail,
  onClose,
  onProjectChange,
  mapApplicationStatusToCustomerStatus
}: ManageCustomerModalProps) {
  if (!customer) return null

  const selectedApp = customer.applications?.find((a) => a._id === customer.selectedApplicationId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manage customer</p>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-600">
            {customer.location} · {customer.id}
          </p>

          {/* Project selector for multiple projects */}
          {customer.applications && customer.applications.length > 1 && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Select Project
              </label>
              <select
                value={customer.selectedApplicationId}
                onChange={(e) => onProjectChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {customer.applications.map((app: any) => (
                  <option key={app._id} value={app._id}>
                    {app.applicationNumber} • {app.serviceArea} •{' '}
                    {STATUS_LABELS[mapApplicationStatusToCustomerStatus(app.status)]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Customer Contact Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Customer Information</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 text-gray-900">{selectedApp?.customerEmail || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <span className="ml-2 text-gray-900">{selectedApp?.customerPhone || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Application #:</span>
                <span className="ml-2 text-gray-900 font-mono">{selectedApp?.applicationNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Update status</p>
            <select
              value={statusDraft}
              onChange={(event) => onStatusChange(event.target.value as CustomerStatus)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onStatusUpdate(customer.id, statusDraft)}
              className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              Save status
            </button>
          </div>

          {/* Documents */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Documents</p>
            <p className="text-sm text-gray-600">{customer.requiredDocuments.join(', ')}</p>
            <button
              onClick={() => onRequestDocuments(customer.id)}
              className="mt-3 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            >
              Request documents
            </button>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Add admin note</p>
            <textarea
              value={noteDraft}
              onChange={(event) => onNoteDraftChange(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Add internal note"
            />
            <button
              onClick={() => onAddNote(customer.id)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Save note
            </button>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Send email update</p>
            <input
              value={emailDraft.subject}
              onChange={(event) => onEmailDraftChange(event.target.value, emailDraft.body)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Email subject"
            />
            <button
              onClick={() => onSendEmail(customer.id)}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
            >
              <Mail className="h-3.5 w-3.5" />
              Send email
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
          <span>Latest update: {customer.lastUpdated}</span>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
