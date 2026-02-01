'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { Filter, Mail, Search, RefreshCw } from 'lucide-react'

interface ContractorFromDB {
  _id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  license_number: string
  service_areas: string[]
  approved: boolean
  approval_fee_paid: boolean
  approval_fee_amount: number
  total_projects_completed: number
  status: 'pending' | 'details_requested' | 'awaiting_state_approval' | 'invoice_sent' | 'payment_pending' | 'approved' | 'suspended' | 'deactivated'
  state_approved: boolean
  onboarding_date: string
  created_at: string
  updated_at: string
}

const STATUS_LABELS: Record<string, string> = {
  'pending': 'Pending Review',
  'details_requested': 'Details Requested',
  'awaiting_state_approval': 'Awaiting State Approval',
  'invoice_sent': 'Invoice Sent',
  'payment_pending': 'Payment Pending',
  'approved': 'Approved - Active',
  'suspended': 'Suspended',
  'deactivated': 'Deactivated'
}

const STATUS_STYLES: Record<string, string> = {
  'pending': 'bg-amber-50 text-amber-700 ring-amber-200',
  'details_requested': 'bg-blue-50 text-blue-700 ring-blue-200',
  'awaiting_state_approval': 'bg-purple-50 text-purple-700 ring-purple-200',
  'invoice_sent': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'payment_pending': 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  'approved': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'suspended': 'bg-orange-50 text-orange-700 ring-orange-200',
  'deactivated': 'bg-gray-100 text-gray-700 ring-gray-200'
}

export default function ContractorApplicationsPage() {
  const [contractors, setContractors] = useState<ContractorFromDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [selectedContractor, setSelectedContractor] = useState<ContractorFromDB | null>(null)

  useEffect(() => {
    fetchContractors()
  }, [])

  const fetchContractors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/contractors')
      if (!response.ok) throw new Error('Failed to fetch contractors')
      const data = await response.json()
      setContractors(data.contractors || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredContractors = useMemo(() => {
    return contractors.filter((contractor) => {
      const matchesSearch = contractor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || contractor.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [contractors, searchTerm, statusFilter])

  const handleApprove = async (contractorId: string) => {
    // TODO: Implement API call to update contractor status
    alert('Approve functionality - API integration needed')
  }

  const handleSuspend = async (contractorId: string) => {
    // TODO: Implement API call to suspend contractor
    alert('Suspend functionality - API integration needed')
  }

  // ==================== Workflow Handler Functions ====================

  const handleRequestDetails = async (contractorId: string) => {
    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_details',
          status: 'details_requested'
        })
      })

      if (!response.ok) throw new Error('Failed to request details')

      const result = await response.json()
      alert(`✅ Details request email sent to ${result.contractor.email}`)
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to send email'}`)
    }
  }

  const handleMarkStateApproved = async (contractorId: string) => {
    const contractor = contractors.find((c) => c._id === contractorId)
    if (!contractor) return

    // If coming from pending status, this is the fast-track path (already state approved)
    const isFastTrack = contractor.status === 'pending'

    if (isFastTrack) {
      const confirmed = confirm(
        `Mark ${contractor.company_name} as already state-approved?\n\n` +
          `This will:\n` +
          `• Set state_approved = true\n` +
          `• Skip fee requirement\n` +
          `• Activate immediately\n` +
          `• Send welcome email`
      )
      if (!confirmed) return
    }

    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isFastTrack ? 'mark_state_approved_fast_track' : 'mark_state_approved',
          state_approved: true,
          status: isFastTrack ? 'approved' : 'invoice_sent',
          approved: isFastTrack
        })
      })

      if (!response.ok) throw new Error('Failed to mark as state approved')

      const result = await response.json()
      if (isFastTrack) {
        alert(`✅ ${contractor.company_name} activated!\n\nWelcome email sent to ${result.contractor.email}`)
      } else {
        alert(`✅ State approval confirmed!\n\nInvoice email sent to ${result.contractor.email}`)
      }
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update contractor'}`)
    }
  }

  const handleMarkSubmittedToState = async (contractorId: string) => {
    const confirmed = confirm(
      "Confirm that you have manually submitted this contractor's application to the state portal.\n\n" +
        'Status will change to "Awaiting State Approval"'
    )
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_submitted_to_state',
          status: 'awaiting_state_approval'
        })
      })

      if (!response.ok) throw new Error('Failed to update status')

      alert('✅ Status updated to "Awaiting State Approval"')
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update status'}`)
    }
  }

  const handleMarkPaymentReceived = async (contractorId: string) => {
    const confirmed = confirm(
      'Confirm that payment has been received.\n\n' +
        'Status will change to "Payment Pending" (verification stage)'
    )
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_payment_received',
          status: 'payment_pending',
          approval_fee_paid: true
        })
      })

      if (!response.ok) throw new Error('Failed to mark payment')

      alert('✅ Payment marked as received!\n\nVerify funds cleared before final activation.')
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to update payment status'}`)
    }
  }

  const handleFinalApproval = async (contractorId: string) => {
    const contractor = contractors.find((c) => c._id === contractorId)
    if (!contractor) return

    const confirmed = confirm(
      `Activate ${contractor.company_name}?\n\n` +
        `This will:\n` +
        `• Set status to "Approved - Active"\n` +
        `• Enable customer matching\n` +
        `• Send welcome email\n\n` +
        `Make sure payment has cleared!`
    )
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'final_approval',
          status: 'approved',
          approved: true
        })
      })

      if (!response.ok) throw new Error('Failed to activate contractor')

      const result = await response.json()
      alert(`🎉 ${contractor.company_name} is now active!\n\nWelcome email sent to ${result.contractor.email}`)
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to activate contractor'}`)
    }
  }

  const handleReactivate = async (contractorId: string) => {
    const contractor = contractors.find((c) => c._id === contractorId)
    if (!contractor) return

    const confirmed = confirm(`Reactivate ${contractor.company_name}?`)
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/contractors/${contractorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reactivate',
          status: 'approved',
          approved: true
        })
      })

      if (!response.ok) throw new Error('Failed to reactivate')

      alert(`✅ ${contractor.company_name} reactivated!`)
      setSelectedContractor(null)
      fetchContractors()
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to reactivate'}`)
    }
  }

  return (
    <AdminLayout title="Contractor Applications">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Contractor Management</p>
              <h1 className="text-2xl font-semibold text-gray-900">All Contractors</h1>
              <p className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${contractors.length} total contractors`}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by company, license, or contact"
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
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
              <button
                onClick={fetchContractors}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800 font-semibold">Error loading contractors</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading contractors...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && contractors.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <p className="text-gray-600 text-lg">No contractors found</p>
            <p className="text-gray-500 text-sm mt-2">New contractor applications will appear here</p>
          </div>
        )}

        {/* Contractors Table */}
        {!loading && !error && contractors.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">License</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service Areas</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Projects</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContractors.map((contractor) => (
                    <tr key={contractor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{contractor.company_name}</div>
                        <div className="text-xs text-gray-500">{contractor.contact_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{contractor.license_number}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{contractor.email}</div>
                        <div className="text-xs text-gray-500">{contractor.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contractor.service_areas.slice(0, 2).map((area, idx) => (
                            <span key={idx} className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                              {area}
                            </span>
                          ))}
                          {contractor.service_areas.length > 2 && (
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{contractor.service_areas.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[contractor.status]}`}>
                          {STATUS_LABELS[contractor.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center font-semibold">
                        {contractor.total_projects_completed}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${contractor.approval_fee_paid ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'}`}>
                          {contractor.approval_fee_paid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">
                        <button
                          onClick={() => setSelectedContractor(contractor)}
                          className="text-primary hover:text-primary-dark"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Results Info */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredContractors.length} of {contractors.length} contractors
              </p>
            </div>
          </div>
        )}
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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contractor Details</p>
              <h3 className="text-lg font-semibold text-gray-900">{selectedContractor.company_name}</h3>
              <p className="text-sm text-gray-600">
                License: {selectedContractor.license_number}
              </p>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              {/* Contact Information */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Contact Information</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Contact:</span> {selectedContractor.contact_name}</p>
                  <p><span className="font-medium">Email:</span> {selectedContractor.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedContractor.phone}</p>
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-2">
                  {selectedContractor.service_areas.map((area, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[selectedContractor.status]}`}>
                    {STATUS_LABELS[selectedContractor.status]}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Projects Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedContractor.total_projects_completed}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Approval Fee</p>
                  <p className={`text-sm font-semibold ${selectedContractor.approval_fee_paid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ${selectedContractor.approval_fee_amount} - {selectedContractor.approval_fee_paid ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Approved</p>
                  <p className={`text-sm font-semibold ${selectedContractor.approved ? 'text-emerald-600' : 'text-gray-600'}`}>
                    {selectedContractor.approved ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Quick Actions</p>
                <div className="space-y-3">
                  {/* Status-based workflow actions */}
                  {selectedContractor.status === 'pending' && (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-900 mb-2">Two Approval Paths Available:</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleRequestDetails(selectedContractor._id)}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            📋 Request Submission Details
                          </button>
                          <p className="text-xs text-blue-700 px-2">→ Sends email for state approval documents</p>
                          
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <button
                              onClick={() => handleMarkStateApproved(selectedContractor._id)}
                              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              ✓ Mark as Already State-Approved
                            </button>
                            <p className="text-xs text-emerald-700 px-2 mt-1">→ Immediate activation, no fee</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedContractor.status === 'details_requested' && (
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-amber-900 mb-2">⏳ Waiting for contractor documents</p>
                        <p className="text-xs text-amber-700">Once received, submit to state portal manually.</p>
                      </div>
                      <button
                        onClick={() => handleMarkSubmittedToState(selectedContractor._id)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        🚀 Mark as Submitted to State
                      </button>
                    </div>
                  )}

                  {selectedContractor.status === 'awaiting_state_approval' && (
                    <div className="space-y-2">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-purple-900 mb-2">⏱️ Pending state review</p>
                        <p className="text-xs text-purple-700">Check state portal for approval status.</p>
                      </div>
                      <button
                        onClick={() => window.open('https://michigan.gov/hvac-portal', '_blank')}
                        className="w-full rounded-lg bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-200 border border-purple-300"
                      >
                        🔗 Check State Portal
                      </button>
                      <button
                        onClick={() => handleMarkStateApproved(selectedContractor._id)}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        ✓ Confirm State Approval Received
                      </button>
                    </div>
                  )}

                  {selectedContractor.status === 'invoice_sent' && (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-900 mb-2">💰 Invoice sent: ${selectedContractor.approval_fee_amount}</p>
                        <p className="text-xs text-blue-700">Waiting for payment confirmation.</p>
                      </div>
                      <button
                        onClick={() => handleMarkPaymentReceived(selectedContractor._id)}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        ✓ Mark Payment Received
                      </button>
                    </div>
                  )}

                  {selectedContractor.status === 'payment_pending' && (
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-amber-900 mb-2">⏳ Payment processing</p>
                        <p className="text-xs text-amber-700">Verify payment has cleared before activating.</p>
                      </div>
                      <button
                        onClick={() => handleFinalApproval(selectedContractor._id)}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        🎉 Activate Contractor Account
                      </button>
                    </div>
                  )}

                  {selectedContractor.status === 'approved' && (
                    <div className="space-y-2">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-emerald-900 mb-2">✓ Active & receiving customer matches</p>
                      </div>
                      <button
                        onClick={() => handleSuspend(selectedContractor._id)}
                        className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                      >
                        ⏸️ Suspend Contractor
                      </button>
                    </div>
                  )}

                  {selectedContractor.status === 'suspended' && (
                    <div className="space-y-2">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-orange-900 mb-2">⏸️ Currently suspended</p>
                        <p className="text-xs text-orange-700">Not receiving customer matches.</p>
                      </div>
                      <button
                        onClick={() => handleReactivate(selectedContractor._id)}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        ▶️ Reactivate Contractor
                      </button>
                    </div>
                  )}

                  {/* Universal actions (always available) */}
                  <div className="border-t border-gray-200 pt-3">
                    <button
                      onClick={() => window.open(`mailto:${selectedContractor.email}`, '_blank')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 border border-gray-300"
                    >
                      <Mail className="h-4 w-4" />
                      Send Custom Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
              <span>
                Joined: {new Date(selectedContractor.onboarding_date).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedContractor(null)}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
