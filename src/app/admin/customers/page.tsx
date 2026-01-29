'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Filter, Mail, MessageSquare, Search } from 'lucide-react'

type CustomerStatus =
  | 'preliminary-eligible'
  | 'docs-requested'
  | 'docs-received'
  | 'state-submission-in-progress'
  | 'approved'
  | 'matched'
  | 'installation-in-progress'
  | 'completed'

interface StatusEntry {
  status: CustomerStatus
  at: string
  note?: string
}

interface DocumentItem {
  id: string
  name: string
  status: 'requested' | 'uploaded' | 'verified'
  updatedAt: string
}

interface NoteItem {
  id: string
  body: string
  createdAt: string
}

interface EmailLog {
  id: string
  subject: string
  sentAt: string
}

interface CustomerRecord {
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
}

const STATUS_LABELS: Record<CustomerStatus, string> = {
  'preliminary-eligible': 'Preliminary Eligible',
  'docs-requested': 'Docs Requested',
  'docs-received': 'Docs Received',
  'state-submission-in-progress': 'State Submission In Progress',
  approved: 'Approved',
  matched: 'Matched',
  'installation-in-progress': 'Installation In Progress',
  completed: 'Completed'
}

const STATUS_STYLES: Record<CustomerStatus, string> = {
  'preliminary-eligible': 'bg-blue-50 text-blue-700 ring-blue-200',
  'docs-requested': 'bg-amber-50 text-amber-700 ring-amber-200',
  'docs-received': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'state-submission-in-progress': 'bg-purple-50 text-purple-700 ring-purple-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  matched: 'bg-sky-50 text-sky-700 ring-sky-200',
  'installation-in-progress': 'bg-orange-50 text-orange-700 ring-orange-200',
  completed: 'bg-gray-100 text-gray-700 ring-gray-200'
}

const initialCustomers: CustomerRecord[] = [
  {
    id: 'CUS-1042',
    name: 'Samantha Reed',
    location: 'Ann Arbor, MI',
    status: 'docs-requested',
    lastUpdated: '2026-01-22',
    actionRequired: true,
    documents: [
      { id: 'doc-1', name: 'Utility Bill', status: 'uploaded', updatedAt: '2026-01-20' },
      { id: 'doc-2', name: 'Proof of Ownership', status: 'requested', updatedAt: '2026-01-18' }
    ],
    requiredDocuments: ['Utility Bill', 'Proof of Ownership', 'Tax Return'],
    statusHistory: [
      { status: 'preliminary-eligible', at: '2026-01-12' },
      { status: 'docs-requested', at: '2026-01-18', note: 'Requested ownership documents.' }
    ],
    notes: [
      { id: 'note-1', body: 'Waiting on proof of ownership.', createdAt: '2026-01-18' }
    ],
    emails: [
      { id: 'email-1', subject: 'Document request sent', sentAt: '2026-01-18' }
    ]
  },
  {
    id: 'CUS-1033',
    name: 'Derrick Coleman',
    location: 'Detroit, MI',
    status: 'state-submission-in-progress',
    lastUpdated: '2026-01-20',
    actionRequired: false,
    documents: [
      { id: 'doc-3', name: 'Utility Bill', status: 'verified', updatedAt: '2026-01-10' },
      { id: 'doc-4', name: 'Tax Return', status: 'verified', updatedAt: '2026-01-10' }
    ],
    requiredDocuments: ['Utility Bill', 'Tax Return'],
    statusHistory: [
      { status: 'preliminary-eligible', at: '2026-01-04' },
      { status: 'docs-received', at: '2026-01-10' },
      { status: 'state-submission-in-progress', at: '2026-01-20' }
    ],
    notes: [],
    emails: [{ id: 'email-2', subject: 'State submission update', sentAt: '2026-01-20' }]
  },
  {
    id: 'CUS-1018',
    name: 'Mia Hernandez',
    location: 'Lansing, MI',
    status: 'approved',
    lastUpdated: '2026-01-19',
    actionRequired: false,
    documents: [
      { id: 'doc-5', name: 'Proof of Ownership', status: 'verified', updatedAt: '2026-01-12' },
      { id: 'doc-6', name: 'Utility Bill', status: 'verified', updatedAt: '2026-01-12' }
    ],
    requiredDocuments: ['Proof of Ownership', 'Utility Bill'],
    statusHistory: [
      { status: 'preliminary-eligible', at: '2026-01-05' },
      { status: 'docs-received', at: '2026-01-12' },
      { status: 'approved', at: '2026-01-19' }
    ],
    notes: [{ id: 'note-2', body: 'Ready for contractor match.', createdAt: '2026-01-19' }],
    emails: [{ id: 'email-3', subject: 'Approval notification', sentAt: '2026-01-19' }]
  }
]

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState({ subject: '', body: '' })
  const [statusDraft, setStatusDraft] = useState<CustomerStatus>('preliminary-eligible')

  useEffect(() => {
    if (selectedCustomer) {
      setStatusDraft(selectedCustomer.status)
      setNoteDraft('')
      setEmailDraft({ subject: '', body: '' })
    }
  }, [selectedCustomer])

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  const updateCustomer = (id: string, updater: (current: CustomerRecord) => CustomerRecord) => {
    setCustomers((prev) => prev.map((customer) => (customer.id === id ? updater(customer) : customer)))
    setSelectedCustomer((current) => (current && current.id === id ? updater(current) : current))
  }

  const handleStatusUpdate = (id: string, status: CustomerStatus, note?: string) => {
    updateCustomer(id, (customer) => ({
      ...customer,
      status,
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...customer.statusHistory, { status, at: new Date().toISOString().slice(0, 10), note }],
      actionRequired: status === 'docs-requested'
    }))
  }

  const handleRequestDocuments = (id: string) => {
    updateCustomer(id, (customer) => ({
      ...customer,
      status: 'docs-requested',
      actionRequired: true,
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...customer.statusHistory, { status: 'docs-requested', at: new Date().toISOString().slice(0, 10), note: 'Requested additional documents.' }],
      emails: [...customer.emails, { id: `email-${Date.now()}`, subject: 'Document request', sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleAddNote = (id: string) => {
    if (!noteDraft.trim()) return
    updateCustomer(id, (customer) => ({
      ...customer,
      notes: [...customer.notes, { id: `note-${Date.now()}`, body: noteDraft.trim(), createdAt: new Date().toISOString().slice(0, 10) }]
    }))
    setNoteDraft('')
  }

  const handleSendEmail = (id: string) => {
    if (!emailDraft.subject.trim()) return
    updateCustomer(id, (customer) => ({
      ...customer,
      emails: [...customer.emails, { id: `email-${Date.now()}`, subject: emailDraft.subject.trim(), sentAt: new Date().toISOString().slice(0, 10) }]
    }))
    setEmailDraft({ subject: '', body: '' })
  }

  return (
    <AdminLayout title="Customer Intake">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Customer intake</p>
              <h1 className="text-2xl font-semibold text-gray-900">Customer applications</h1>
              <p className="text-sm text-gray-600">Manage intake status, document requests, and communications.</p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, location, or ID"
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as CustomerStatus | 'all')}
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action required</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last updated</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{customer.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[customer.status]}`}>
                        {STATUS_LABELS[customer.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${customer.actionRequired ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'}`}>
                        {customer.actionRequired ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.lastUpdated}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      <Link href={`/admin/customers/${customer.id}`} className="text-primary hover:text-primary-dark mr-3">
                        View
                      </Link>
                      <button
                        onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manage customer</p>
              <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
              <p className="text-sm text-gray-600">{selectedCustomer.location} · {selectedCustomer.id}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Update status</p>
                <select
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value as CustomerStatus)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleStatusUpdate(selectedCustomer.id, statusDraft)}
                  className="mt-3 w-full rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Save status
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Documents</p>
                <p className="mt-2 text-sm text-gray-600">{selectedCustomer.requiredDocuments.join(', ')}</p>
                <button
                  onClick={() => handleRequestDocuments(selectedCustomer.id)}
                  className="mt-3 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                >
                  Request documents
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Add admin note</p>
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Add internal note"
                />
                <button
                  onClick={() => handleAddNote(selectedCustomer.id)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Save note
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Send email update</p>
                <input
                  value={emailDraft.subject}
                  onChange={(event) => setEmailDraft((prev) => ({ ...prev, subject: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Email subject"
                />
                <button
                  onClick={() => handleSendEmail(selectedCustomer.id)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send email
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
              <span>Latest update: {selectedCustomer.lastUpdated}</span>
              <button
                onClick={() => setSelectedCustomer(null)}
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
