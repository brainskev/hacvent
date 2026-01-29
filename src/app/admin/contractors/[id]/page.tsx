'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { CheckCircle2, FileText, Mail, Receipt } from 'lucide-react'

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

interface PaymentEntry {
  id: string
  description: string
  amount: number
  status: 'pending' | 'paid'
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
  contactName: string
  email: string
  phone: string
  licenseNumber: string
  serviceAreas: string[]
  status: ContractorStatus
  lastUpdated: string
  documents: DocumentItem[]
  paymentHistory: PaymentEntry[]
  assignedProjects: string[]
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

const mockContractors: ContractorRecord[] = [
  {
    id: 'CON-4001',
    businessName: 'BrightSpark HVAC',
    contactName: 'Nina Patel',
    email: 'nina@brightspark.com',
    phone: '(555) 988-3321',
    licenseNumber: 'LIC-8842',
    serviceAreas: ['Ann Arbor', 'Ypsilanti'],
    status: 'docs-requested',
    lastUpdated: '2026-01-21',
    documents: [
      { id: 'doc-1', name: 'License', status: 'requested', updatedAt: '2026-01-18' },
      { id: 'doc-2', name: 'Insurance', status: 'requested', updatedAt: '2026-01-18' }
    ],
    paymentHistory: [
      { id: 'pay-1', description: 'Approval fee', amount: 250, status: 'pending', updatedAt: '2026-01-19' }
    ],
    assignedProjects: ['CUS-1018'],
    statusHistory: [
      { status: 'info-pending', at: '2026-01-15' },
      { status: 'docs-requested', at: '2026-01-18', note: 'Requested license and insurance.' }
    ],
    emails: [{ id: 'email-1', subject: 'License & insurance request', sentAt: '2026-01-18' }]
  }
]

export default function ContractorDetailPage() {
  const params = useParams()
  const contractorId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const initialContractor = useMemo(() => mockContractors.find((contractor) => contractor.id === contractorId), [contractorId])
  const [contractor, setContractor] = useState<ContractorRecord | null>(initialContractor ?? null)
  const [statusDraft, setStatusDraft] = useState<ContractorStatus>(contractor?.status ?? 'info-pending')

  if (!contractor) {
    return (
      <AdminLayout title="Contractor Details">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Contractor not found.
        </div>
      </AdminLayout>
    )
  }

  const updateContractor = (updater: (current: ContractorRecord) => ContractorRecord) => {
    setContractor((prev) => (prev ? updater(prev) : prev))
  }

  const handleStatusUpdate = () => {
    updateContractor((current) => ({
      ...current,
      status: statusDraft,
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: statusDraft, at: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleRequestDocs = () => {
    updateContractor((current) => ({
      ...current,
      status: 'docs-requested',
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: 'docs-requested', at: new Date().toISOString().slice(0, 10), note: 'Requested license & insurance.' }],
      emails: [...current.emails, { id: `email-${Date.now()}`, subject: 'License & insurance request', sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleApprove = () => {
    updateContractor((current) => ({
      ...current,
      status: 'approved-payment-required',
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: 'approved-payment-required', at: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleSendInvoice = () => {
    updateContractor((current) => ({
      ...current,
      emails: [...current.emails, { id: `email-${Date.now()}`, subject: 'Invoice email', sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleMarkPaid = () => {
    updateContractor((current) => ({
      ...current,
      paymentHistory: current.paymentHistory.map((payment) => ({ ...payment, status: 'paid', updatedAt: new Date().toISOString().slice(0, 10) }))
    }))
  }

  if (!contractor) return null

  return (
    <AdminLayout title="Contractor Details">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contractor profile</p>
              <h1 className="text-2xl font-semibold text-gray-900">{contractor.businessName}</h1>
              <p className="text-sm text-gray-600">{contractor.contactName} · {contractor.email}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[contractor.status]}`}>
              {STATUS_LABELS[contractor.status]}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
              <p className="mt-1 font-medium text-gray-900">{contractor.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">License</p>
              <p className="mt-1 font-medium text-gray-900">{contractor.licenseNumber}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Service areas</p>
              <p className="mt-1 font-medium text-gray-900">{contractor.serviceAreas.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Status timeline</h2>
              <div className="mt-4 space-y-4">
                {contractor.statusHistory.map((entry, index) => (
                  <div key={`${entry.status}-${index}`} className="flex items-start gap-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${index === contractor.statusHistory.length - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{STATUS_LABELS[entry.status]}</p>
                      <p className="text-xs text-gray-500">{entry.at}</p>
                      {entry.note && <p className="text-xs text-gray-600 mt-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              <div className="mt-4 space-y-3">
                {contractor.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">Updated {doc.updatedAt}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : doc.status === 'received' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Assigned projects</h2>
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {contractor.assignedProjects.length === 0 ? (
                  <p className="text-sm text-gray-500">No assigned projects yet.</p>
                ) : (
                  contractor.assignedProjects.map((project) => (
                    <div key={project} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{project}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Admin actions</h2>
              <div className="mt-4 space-y-3">
                <button
                  onClick={handleRequestDocs}
                  className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Send document request
                </button>
                <button
                  onClick={handleApprove}
                  className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Mark contractor approved
                </button>
                <button
                  onClick={handleSendInvoice}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Trigger invoice email
                </button>
                <button
                  onClick={handleMarkPaid}
                  className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                >
                  Mark payment received
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Update status</h2>
              <select
                value={statusDraft}
                onChange={(event) => setStatusDraft(event.target.value as ContractorStatus)}
                className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
              >
                Save status update
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Payment history</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                {contractor.paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500">Updated {payment.updatedAt}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                      <Receipt className="h-3.5 w-3.5" />
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Communication log</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                {contractor.emails.length === 0 ? (
                  <p className="text-sm text-gray-500">No emails sent yet.</p>
                ) : (
                  contractor.emails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{email.subject}</p>
                        <p className="text-xs text-gray-500">Sent {email.sentAt}</p>
                      </div>
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
