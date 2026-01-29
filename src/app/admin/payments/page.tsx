'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { DollarSign, Mail, StickyNote } from 'lucide-react'

interface InvoiceItem {
  id: string
  contractor: string
  amount: number
  status: 'pending' | 'paid'
  note?: string
  updatedAt: string
}

const initialInvoices: InvoiceItem[] = [
  { id: 'INV-2201', contractor: 'BrightSpark HVAC', amount: 250, status: 'pending', updatedAt: '2026-01-20' },
  { id: 'INV-2197', contractor: 'NorthPeak Heating', amount: 250, status: 'paid', updatedAt: '2026-01-18', note: 'Paid via ACH' }
]

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)
  const [noteDraft, setNoteDraft] = useState('')

  const updateInvoice = (id: string, updater: (current: InvoiceItem) => InvoiceItem) => {
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? updater(invoice) : invoice)))
    setSelectedInvoice((current) => (current && current.id === id ? updater(current) : current))
  }

  const handleMarkPaid = (id: string) => {
    updateInvoice(id, (invoice) => ({ ...invoice, status: 'paid', updatedAt: new Date().toISOString().slice(0, 10) }))
  }

  const handleSendInvoice = (id: string) => {
    updateInvoice(id, (invoice) => ({ ...invoice, updatedAt: new Date().toISOString().slice(0, 10) }))
  }

  const handleSaveNote = (id: string) => {
    if (!noteDraft.trim()) return
    updateInvoice(id, (invoice) => ({ ...invoice, note: noteDraft.trim(), updatedAt: new Date().toISOString().slice(0, 10) }))
    setNoteDraft('')
  }

  const pendingCount = invoices.filter((invoice) => invoice.status === 'pending').length
  const outstandingBalance = invoices.filter((invoice) => invoice.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <AdminLayout title="Payments & Invoicing">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Payments</p>
              <h1 className="text-2xl font-semibold text-gray-900">Payments & invoicing</h1>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Pending approval fees</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Outstanding balance</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">${outstandingBalance.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Paid invoices</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{invoices.filter((invoice) => invoice.status === 'paid').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contractor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{invoice.id}</div>
                      <div className="text-xs text-gray-500">Updated {invoice.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{invoice.contractor}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      <button
                        onClick={() => handleSendInvoice(invoice.id)}
                        className="text-blue-700 hover:text-blue-900 mr-3"
                      >
                        Send invoice
                      </button>
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
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

      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice management</p>
              <h3 className="text-lg font-semibold text-gray-900">{selectedInvoice.id}</h3>
              <p className="text-sm text-gray-600">{selectedInvoice.contractor}</p>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-sm font-semibold text-gray-900">${selectedInvoice.amount.toLocaleString()}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${selectedInvoice.status === 'paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <button
                onClick={() => handleMarkPaid(selectedInvoice.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <DollarSign className="h-4 w-4" />
                Mark invoice paid
              </button>
              <button
                onClick={() => handleSendInvoice(selectedInvoice.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                Send invoice email
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment notes</p>
                {selectedInvoice.note && (
                  <p className="mt-2 text-sm text-gray-700">{selectedInvoice.note}</p>
                )}
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Add payment note"
                />
                <button
                  onClick={() => handleSaveNote(selectedInvoice.id)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <StickyNote className="h-4 w-4" />
                  Save note
                </button>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 text-right">
              <button
                onClick={() => setSelectedInvoice(null)}
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
