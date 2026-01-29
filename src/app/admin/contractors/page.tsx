'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Filter, Mail, Search } from 'lucide-react'

type ContractorStatus =
  | 'info-pending'
  | 'docs-requested'
  | 'docs-received'
  | 'state-submission-in-progress'
  | 'approved-payment-required'
  | 'active-ready-for-matching'

interface StatusEntry {
  status: ContractorStatus
  at: string
  note?: string
}

interface DocumentItem {
  id: string
  name: string
  status: 'requested' | 'received' | 'verified'
  updatedAt: string
}

interface EmailLog {
  id: string
  subject: string
  sentAt: string
}

interface ContractorRecord {
  id: string
  businessName: string
  licenseNumber: string
  status: ContractorStatus
  docsReceived: boolean
  paymentStatus: 'pending' | 'paid'
  lastUpdated: string
  documents: DocumentItem[]
  statusHistory: StatusEntry[]
  emails: EmailLog[]
}

const STATUS_LABELS: Record<ContractorStatus, string> = {
  'info-pending': 'Info Pending',
  'docs-requested': 'Docs Requested',
  'docs-received': 'Docs Received',
  'state-submission-in-progress': 'State Submission In Progress',
  'approved-payment-required': 'Approved – Payment Required',
  'active-ready-for-matching': 'Active – Ready for Matching'
}

const STATUS_STYLES: Record<ContractorStatus, string> = {
  'info-pending': 'bg-gray-100 text-gray-700 ring-gray-200',
  'docs-requested': 'bg-amber-50 text-amber-700 ring-amber-200',
  'docs-received': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'state-submission-in-progress': 'bg-purple-50 text-purple-700 ring-purple-200',
  'approved-payment-required': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'active-ready-for-matching': 'bg-sky-50 text-sky-700 ring-sky-200'
}

const initialContractors: ContractorRecord[] = [
  {
    id: 'CON-4001',
    businessName: 'BrightSpark HVAC',
    licenseNumber: 'LIC-8842',
    status: 'docs-requested',
    docsReceived: false,
    paymentStatus: 'pending',
    lastUpdated: '2026-01-21',
    documents: [
      { id: 'doc-1', name: 'License', status: 'requested', updatedAt: '2026-01-18' },
      { id: 'doc-2', name: 'Insurance', status: 'requested', updatedAt: '2026-01-18' }
    ],
    statusHistory: [
      { status: 'info-pending', at: '2026-01-15' },
      { status: 'docs-requested', at: '2026-01-18', note: 'Requested license and insurance.' }
    ],
    emails: [{ id: 'email-1', subject: 'License & insurance request', sentAt: '2026-01-18' }]
  },
  {
    id: 'CON-3993',
    businessName: 'NorthPeak Heating',
    licenseNumber: 'LIC-2305',
    status: 'approved-payment-required',
    docsReceived: true,
    paymentStatus: 'pending',
    lastUpdated: '2026-01-19',
    documents: [
      { id: 'doc-3', name: 'License', status: 'verified', updatedAt: '2026-01-10' },
      { id: 'doc-4', name: 'Insurance', status: 'verified', updatedAt: '2026-01-10' }
    ],
    statusHistory: [
      { status: 'docs-received', at: '2026-01-10' },
      { status: 'approved-payment-required', at: '2026-01-19' }
    ],
    emails: [{ id: 'email-2', subject: 'Approval & invoice', sentAt: '2026-01-19' }]
  }
]

export default function ContractorApplicationsPage() {
  const [contractors, setContractors] = useState<ContractorRecord[]>(initialContractors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ContractorStatus>('all')
  const [selectedContractor, setSelectedContractor] = useState<ContractorRecord | null>(null)
  const [statusDraft, setStatusDraft] = useState<ContractorStatus>('info-pending')

  useEffect(() => {
    if (selectedContractor) {
      setStatusDraft(selectedContractor.status)
    }
  }, [selectedContractor])

  const filteredContractors = useMemo(() => {
    return contractors.filter((contractor) => {
      const matchesSearch =
        contractor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || contractor.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [contractors, searchTerm, statusFilter])

  const updateContractor = (id: string, updater: (current: ContractorRecord) => ContractorRecord) => {
    setContractors((prev) => prev.map((contractor) => (contractor.id === id ? updater(contractor) : contractor)))
    setSelectedContractor((current) => (current && current.id === id ? updater(current) : current))
  }

  const handleStatusUpdate = (id: string, status: ContractorStatus, note?: string) => {
    updateContractor(id, (contractor) => ({
      ...contractor,
      status,
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...contractor.statusHistory, { status, at: new Date().toISOString().slice(0, 10), note }]
    }))
  }

  const handleRequestDocs = (id: string) => {
    updateContractor(id, (contractor) => ({
      ...contractor,
      status: 'docs-requested',
      lastUpdated: new Date().toISOString().slice(0, 10),
      docsReceived: false,
      statusHistory: [...contractor.statusHistory, { status: 'docs-requested', at: new Date().toISOString().slice(0, 10), note: 'Requested license & insurance.' }],
      emails: [...contractor.emails, { id: `email-${Date.now()}`, subject: 'License & insurance request', sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleDocsReceived = (id: string) => {
    updateContractor(id, (contractor) => ({
      ...contractor,
      docsReceived: true,
      documents: contractor.documents.map((doc) => ({ ...doc, status: 'received', updatedAt: new Date().toISOString().slice(0, 10) })),
      status: 'docs-received',
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...contractor.statusHistory, { status: 'docs-received', at: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleSendEmail = (id: string, subject: string) => {
    updateContractor(id, (contractor) => ({
      ...contractor,
      emails: [...contractor.emails, { id: `email-${Date.now()}`, subject, sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  return (
    <AdminLayout title="Contractor Applications">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Contractor onboarding</p>
              <h1 className="text-2xl font-semibold text-gray-900">Contractor applications</h1>
              <p className="text-sm text-gray-600">Track contractor documents, approvals, and payment status.</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by business, license, or ID"
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as ContractorStatus | 'all')}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="all">All statuses</option>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Business name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">License number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Docs received</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContractors.map((contractor) => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{contractor.businessName}</div>
                      <div className="text-xs text-gray-500">{contractor.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{contractor.licenseNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[contractor.status]}`}>
                        {STATUS_LABELS[contractor.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${contractor.docsReceived ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                        {contractor.docsReceived ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{contractor.paymentStatus}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      <Link href={`/admin/contractors/${contractor.id}`} className="text-primary hover:text-primary-dark mr-3">
                        View
                      </Link>
                      <button
                        onClick={() => setSelectedContractor(contractor)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedContractor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedContractor(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manage contractor</p>
              <h3 className="text-lg font-semibold text-gray-900">{selectedContractor.businessName}</h3>
              <p className="text-sm text-gray-600">License {selectedContractor.licenseNumber} · {selectedContractor.id}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Update status</p>
                <select
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value as ContractorStatus)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleStatusUpdate(selectedContractor.id, statusDraft)}
                  className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Save status
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Documents</p>
                <p className="mt-2 text-sm text-gray-600">License & insurance</p>
                <button
                  onClick={() => handleRequestDocs(selectedContractor.id)}
                  className="mt-3 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Request license & insurance
                </button>
                <button
                  onClick={() => handleDocsReceived(selectedContractor.id)}
                  className="mt-2 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Mark documents received
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Emails</p>
                <button
                  onClick={() => handleSendEmail(selectedContractor.id, 'Approval email')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send approval email
                </button>
                <button
                  onClick={() => handleSendEmail(selectedContractor.id, 'Invoice email')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send invoice email
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</p>
                <button
                  onClick={() => updateContractor(selectedContractor.id, (contractor) => ({ ...contractor, paymentStatus: contractor.paymentStatus === 'paid' ? 'pending' : 'paid' }))}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Mark payment {selectedContractor.paymentStatus === 'paid' ? 'pending' : 'received'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
              <span>Last update: {selectedContractor.lastUpdated}</span>
              <button
                onClick={() => setSelectedContractor(null)}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
