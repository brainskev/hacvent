'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { Mail, CheckCircle2, ClipboardCheck, FileCheck2, Link2 } from 'lucide-react'

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
  email: string
  phone: string
  address: string
  location: string
  status: CustomerStatus
  lastUpdated: string
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

const mockCustomers: CustomerRecord[] = [
  {
    id: 'CUS-1042',
    name: 'Samantha Reed',
    email: 'samantha.reed@example.com',
    phone: '(555) 219-8844',
    address: '118 Maple Drive, Ann Arbor, MI 48103',
    location: 'Ann Arbor, MI',
    status: 'docs-requested',
    lastUpdated: '2026-01-22',
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
  }
]

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const initialCustomer = useMemo(() => mockCustomers.find((customer) => customer.id === customerId), [customerId])
  const [customer, setCustomer] = useState<CustomerRecord | null>(initialCustomer ?? null)
  const [noteDraft, setNoteDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState({ subject: '', body: '' })
  const [statusDraft, setStatusDraft] = useState<CustomerStatus>(customer?.status ?? 'preliminary-eligible')

  if (!customer) {
    return (
      <AdminLayout title="Customer Details">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Customer not found.
        </div>
      </AdminLayout>
    )
  }

  const updateCustomer = (updater: (current: CustomerRecord) => CustomerRecord) => {
    setCustomer((prev) => (prev ? updater(prev) : prev))
  }

  const handleStatusUpdate = () => {
    if (!customer) return
    updateCustomer((current) => ({
      ...current,
      status: statusDraft,
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: statusDraft, at: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleRequestDocs = () => {
    updateCustomer((current) => ({
      ...current,
      status: 'docs-requested',
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: 'docs-requested', at: new Date().toISOString().slice(0, 10), note: 'Requested additional documents.' }],
      emails: [...current.emails, { id: `email-${Date.now()}`, subject: 'Document request', sentAt: new Date().toISOString().slice(0, 10) }]
    }))
  }

  const handleVerifyDocs = () => {
    updateCustomer((current) => ({
      ...current,
      documents: current.documents.map((doc) => (doc.status === 'uploaded' ? { ...doc, status: 'verified', updatedAt: new Date().toISOString().slice(0, 10) } : doc))
    }))
  }

  const handleAddNote = () => {
    if (!noteDraft.trim()) return
    updateCustomer((current) => ({
      ...current,
      notes: [...current.notes, { id: `note-${Date.now()}`, body: noteDraft.trim(), createdAt: new Date().toISOString().slice(0, 10) }]
    }))
    setNoteDraft('')
  }

  const handleSendEmail = () => {
    if (!emailDraft.subject.trim()) return
    updateCustomer((current) => ({
      ...current,
      emails: [...current.emails, { id: `email-${Date.now()}`, subject: emailDraft.subject.trim(), sentAt: new Date().toISOString().slice(0, 10) }]
    }))
    setEmailDraft({ subject: '', body: '' })
  }

  const handleMatchContractor = () => {
    updateCustomer((current) => ({
      ...current,
      status: 'matched',
      lastUpdated: new Date().toISOString().slice(0, 10),
      statusHistory: [...current.statusHistory, { status: 'matched', at: new Date().toISOString().slice(0, 10), note: 'Matched to contractor.' }]
    }))
  }

  return (
    <AdminLayout title="Customer Details">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer profile</p>
              <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
              <p className="text-sm text-gray-600">{customer.address}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[customer.status]}`}>
              {STATUS_LABELS[customer.status]}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
              <p className="mt-1 font-medium text-gray-900">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
              <p className="mt-1 font-medium text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Last updated</p>
              <p className="mt-1 font-medium text-gray-900">{customer.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Status timeline</h2>
              <div className="mt-4 space-y-4">
                {customer.statusHistory.map((entry, index) => (
+                  <div key={`${entry.status}-${index}`} className="flex items-start gap-3">
+                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${index === customer.statusHistory.length - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
+                    <div>
+                      <p className="text-sm font-semibold text-gray-900">{STATUS_LABELS[entry.status]}</p>
+                      <p className="text-xs text-gray-500">{entry.at}</p>
+                      {entry.note && <p className="text-xs text-gray-600 mt-1">{entry.note}</p>}
+                    </div>
+                  </div>
                 ))}
               </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
               <div className="mt-4 space-y-3">
                 {customer.documents.map((doc) => (
                   <div key={doc.id} className="flex items-center justify-between text-sm">
                     <div>
                       <p className="font-medium text-gray-900">{doc.name}</p>
                       <p className="text-xs text-gray-500">Updated {doc.updatedAt}</p>
                     </div>
                     <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : doc.status === 'uploaded' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                       {doc.status}
                     </span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900">Required documents</h2>
               <div className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                 {customer.requiredDocuments.map((doc) => {
                   const isComplete = customer.documents.some((item) => item.name === doc && item.status === 'verified')
                   return (
                     <div key={doc} className="flex items-center gap-2">
                       <FileCheck2 className={`h-4 w-4 ${isComplete ? 'text-emerald-600' : 'text-gray-300'}`} />
                       <span className="text-gray-700">{doc}</span>
                     </div>
                   )
                 })}
               </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900">Communication log</h2>
               <div className="mt-4 space-y-3 text-sm text-gray-700">
                 {customer.emails.length === 0 ? (
                   <p className="text-sm text-gray-500">No emails sent yet.</p>
                 ) : (
                   customer.emails.map((email) => (
                     <div key={email.id} className="flex items-center justify-between">
                       <div>
                         <p className="font-medium text-gray-900">{email.subject}</p>
                         <p className="text-xs text-gray-500">Sent {email.sentAt}</p>
                       </div>
                       <Link2 className="h-4 w-4 text-gray-400" />
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
                   Request additional documents
                 </button>
                 <button
                   onClick={handleVerifyDocs}
                   className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                 >
                   Mark documents verified
                 </button>
                 <button
                   onClick={handleMatchContractor}
                   className="w-full rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                 >
                   Match customer to contractor
                 </button>
               </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900">Update status</h2>
               <select
                 value={statusDraft}
                 onChange={(event) => setStatusDraft(event.target.value as CustomerStatus)}
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
               <h2 className="text-lg font-semibold text-gray-900">Admin notes</h2>
               <div className="mt-4 space-y-3">
                 {customer.notes.length === 0 ? (
                   <p className="text-sm text-gray-500">No notes yet.</p>
                 ) : (
                   customer.notes.map((note) => (
                     <div key={note.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                       <p className="font-medium text-gray-900">{note.createdAt}</p>
                       <p className="mt-1">{note.body}</p>
                     </div>
                   ))
                 )}
               </div>
               <textarea
                 value={noteDraft}
                 onChange={(event) => setNoteDraft(event.target.value)}
                 rows={3}
                 className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                 placeholder="Add internal note"
               />
               <button
                 onClick={handleAddNote}
                 className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
               >
                 <ClipboardCheck className="h-4 w-4" />
                 Save note
               </button>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
               <h2 className="text-lg font-semibold text-gray-900">Email notification</h2>
               <input
                 value={emailDraft.subject}
                 onChange={(event) => setEmailDraft((prev) => ({ ...prev, subject: event.target.value }))}
                 placeholder="Email subject"
                 className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
               />
               <textarea
                 value={emailDraft.body}
                 onChange={(event) => setEmailDraft((prev) => ({ ...prev, body: event.target.value }))}
                 rows={3}
                 placeholder="Optional message for the log"
                 className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
               />
               <button
                 onClick={handleSendEmail}
                 className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100"
               >
                 <Mail className="h-4 w-4" />
                 Send email update
               </button>
             </div>
           </div>
         </div>
       </div>
     </AdminLayout>
   )
}
