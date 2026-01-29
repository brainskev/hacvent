'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { ArrowLeft, Mail, CheckCircle, AlertCircle, File, Download, Eye, X } from 'lucide-react'
import { CustomerStatus, STATUS_LABELS, STATUS_STYLES } from '@/types/admin'

interface Document {
  _id: string
  documentType: string
  status: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  verifiedBy?: string
  rejectionReason?: string
}

interface Application {
  _id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  applicationNumber: string
  status: string
  serviceArea: string
  createdAt: string
  updatedAt: string
  rebatePortalEmail?: string
  rebatePortalPassword?: string
  documents?: Document[]
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  // Get the id from params (Next.js passes it as a string for dynamic routes)
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const customerId = rawId ? decodeURIComponent(rawId as string) : undefined

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [statusDraft, setStatusDraft] = useState<string>('')
  const [noteDraft, setNoteDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState({ subject: '', body: '' })
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null)
  const [rebateInfo, setRebateInfo] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const normalizeStatus = (status: string) => status.toLowerCase().replace(/_/g, '-')

  const deriveStatus = (status: string, documents?: Document[]) => {
    const normalized = normalizeStatus(status)
    const hasDocs = (documents?.length || 0) > 0

    if (hasDocs && ['preliminary-eligibility', 'documents-requested'].includes(normalized)) {
      return 'documents-received'
    }

    return normalized
  }

  // Map status values
  const statusMap: Record<string, CustomerStatus> = {
    'preliminary-eligibility': 'preliminary-eligible',
    'documents-requested': 'docs-requested',
    'documents-received': 'docs-received',
    'submitted-to-program': 'state-submission-in-progress',
    approved: 'approved',
    'contractor-matched': 'matched',
    'installation-in-progress': 'installation-in-progress',
    completed: 'completed'
  }

  const reverseStatusMap: Record<CustomerStatus, string> = {
    'preliminary-eligible': 'preliminary-eligibility',
    'docs-requested': 'documents-requested',
    'docs-received': 'documents-received',
    'state-submission-in-progress': 'submitted-to-program',
    approved: 'approved',
    matched: 'contractor-matched',
    'installation-in-progress': 'installation-in-progress',
    completed: 'completed'
  }

  // Helper: Get document count by status
  const getDocStats = (app: Application) => {
    const docs = app.documents || []
    return {
      total: docs.length,
      verified: docs.filter((d) => d.status === 'verified').length,
      pending: docs.filter((d) => d.status === 'uploaded').length,
      rejected: docs.filter((d) => d.status === 'rejected').length
    }
  }

  // Helper: Check if all required docs are verified
  const allDocsVerified = (app: Application) => {
    const stats = getDocStats(app)
    return stats.total > 0 && stats.pending === 0 && stats.rejected === 0
  }

  // Fetch customer's applications and their documents
  useEffect(() => {
    if (!customerId) {
      console.log('❌ No customerId provided')
      setLoading(false)
      return
    }

    const fetchApplicationsWithDocuments = async () => {
      try {
        console.log('📡 Fetching applications for customerId:', customerId)
        setLoading(true)
        
        // Fetch applications
        const response = await fetch(`/api/admin/applications`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.applications && Array.isArray(data.applications)) {
          // Filter for this customer
          const customerApps = data.applications.filter((app: any) => app.customerId === customerId)
          console.log(`📡 Found ${customerApps.length} applications for this customer`)
          
          // Sort by createdAt descending (most recent first)
          customerApps.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          
          // Fetch documents for each application
          const appsWithDocs = await Promise.all(
            customerApps.map(async (app: any) => {
              try {
                const docsResponse = await fetch(`/api/customer/documents?applicationId=${app._id}&userId=${customerId}`)
                if (docsResponse.ok) {
                  const docsData = await docsResponse.json()
                  console.log(`📄 Found ${docsData.documents?.length || 0} documents for application ${app.applicationNumber}`)
                  const derivedStatus = deriveStatus(app.status, docsData.documents || [])
                  return {
                    ...app,
                    status: derivedStatus,
                    documents: docsData.documents || []
                  }
                }
              } catch (err) {
                console.error(`Failed to fetch documents for app ${app._id}:`, err)
              }
              return {
                ...app,
                status: deriveStatus(app.status, []),
                documents: []
              }
            })
          )
          
          setApplications(appsWithDocs)
          
          if (appsWithDocs.length > 0) {
            setSelectedApp(appsWithDocs[0])
            const status = statusMap[appsWithDocs[0].status] || 'preliminary-eligible'
            setStatusDraft(status)
            setRebateInfo({
              email: appsWithDocs[0].rebatePortalEmail || '',
              password: appsWithDocs[0].rebatePortalPassword || ''
            })
          }
        }
      } catch (err) {
        console.error('❌ Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationsWithDocuments()
  }, [customerId])

  const handleStatusUpdate = async () => {
    if (!selectedApp) return

    // Check if trying to move to state submission or beyond without rebate info
    const stateSubmissionStatuses = ['state-submission-in-progress', 'approved', 'matched', 'installation-in-progress', 'completed']
    if (stateSubmissionStatuses.includes(statusDraft) && !rebateInfo.email) {
      alert('❌ Cannot proceed to State Submission without filling in Rebate Application Info first.\n\nPlease enter the rebate portal email and password.')
      return
    }

    try {
      const applicationStatus = reverseStatusMap[statusDraft as CustomerStatus]
      const response = await fetch(`/api/admin/applications/${selectedApp._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStatus: applicationStatus,
          adminId: '000000000000000000000000',
          reason: noteDraft || undefined,
          override: true
        })
      })

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === selectedApp._id ? { ...app, status: applicationStatus, updatedAt: new Date().toISOString() } : app))
        )
        setSelectedApp({ ...selectedApp, status: applicationStatus, updatedAt: new Date().toISOString() })
        setStatusDraft(statusMap[applicationStatus])
        alert('Status updated successfully')
      }
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status')
    }
  }

  const handleSendEmail = async () => {
    if (!selectedApp || !emailDraft.subject.trim()) return

    try {
      console.log('Sending email to:', selectedApp.customerEmail)
      console.log('Subject:', emailDraft.subject)
      alert('Email sent successfully (console logged)')
      setEmailDraft({ subject: '', body: '' })
    } catch (err) {
      console.error('Failed to send email:', err)
      alert('Failed to send email')
    }
  }

  const handleSaveRebateInfo = async () => {
    if (!selectedApp) return

    try {
      const response = await fetch(`/api/admin/applications/${selectedApp._id}/rebate-info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rebatePortalEmail: rebateInfo.email,
          rebatePortalPassword: rebateInfo.password
        })
      })

      if (response.ok) {
        setSelectedApp({
          ...selectedApp,
          rebatePortalEmail: rebateInfo.email,
          rebatePortalPassword: rebateInfo.password
        })
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApp._id
              ? { ...app, rebatePortalEmail: rebateInfo.email, rebatePortalPassword: rebateInfo.password }
              : app
          )
        )
        alert('Rebate application info saved')
      }
    } catch (err) {
      console.error('Failed to save rebate info:', err)
      alert('Failed to save rebate info')
    }
  }

  const handleDocumentDownload = (documentId: string) => {
    if (!customerId) return
    const encodedUserId = encodeURIComponent(customerId)
    window.location.href = `/api/customer/documents/download/${documentId}?userId=${encodedUserId}`
    setViewingDoc(null)
  }

  const handleVerifyDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${docId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', verifiedBy: '000000000000000000000000' })
      })

      if (response.ok) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) => ({
            ...app,
            documents: app.documents?.map((doc) =>
              doc._id === docId ? { ...doc, status: 'verified' } : doc
            )
          }))
        )
        if (selectedApp) {
          setSelectedApp({
            ...selectedApp,
            documents: selectedApp.documents?.map((doc) =>
              doc._id === docId ? { ...doc, status: 'verified' } : doc
            )
          })
        }
        alert('Document verified successfully')
      }
    } catch (err) {
      console.error('Failed to verify document:', err)
      alert('Failed to verify document')
    }
  }

  const handleRejectDocument = async (docId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    try {
      const response = await fetch(`/api/admin/documents/${docId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionReason })
      })

      if (response.ok) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) => ({
            ...app,
            documents: app.documents?.map((doc) =>
              doc._id === docId ? { ...doc, status: 'rejected', rejectionReason } : doc
            )
          }))
        )
        if (selectedApp) {
          setSelectedApp({
            ...selectedApp,
            documents: selectedApp.documents?.map((doc) =>
              doc._id === docId ? { ...doc, status: 'rejected', rejectionReason } : doc
            )
          })
        }
        setSelectedDocId(null)
        setRejectionReason('')
        alert('Document rejected successfully')
      }
    } catch (err) {
      console.error('Failed to reject document:', err)
      alert('Failed to reject document')
    }
  }

  const handleAddNote = () => {
    if (!noteDraft.trim()) return
    console.log('Adding note:', noteDraft)
    alert('Note added (console logged)')
    setNoteDraft('')
  }

  if (loading) {
    return (
      <AdminLayout title="Customer Details">
        <div className="flex justify-center py-12">
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </AdminLayout>
    )
  }

  if (applications.length === 0) {
    return (
      <AdminLayout title="Customer Details">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="bg-red-50 border-2 border-red-300 rounded p-4 text-red-900">
            <p className="font-bold text-lg">🔍 No applications found</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const docStats = selectedApp ? getDocStats(selectedApp) : { total: 0, verified: 0, pending: 0, rejected: 0 }

  return (
    <AdminLayout title="Customer Details">
      <div className="space-y-6">
        {/* Header with Back */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {selectedApp && (
          <>
            {/* Top Section: Header + Right Sidebar (Status, Project Info, Rebate Info) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side */}
              <div className="lg:col-span-3 space-y-6">
                {/* Header Card - Customer contact info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 lg:p-5">
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900">{selectedApp.customerName}</h1>
                  <p className="text-xs text-gray-600 mt-1">{selectedApp.applicationNumber} • {selectedApp.serviceArea}</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Email:</span>
                      <p className="text-gray-900 font-medium text-xs">{selectedApp.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Phone:</span>
                      <p className="text-gray-900 font-medium text-xs">{selectedApp.customerPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Project Selector if multiple */}
                {applications.length > 1 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Switch Project</label>
                    <select
                      value={selectedApp._id}
                      onChange={(e) => {
                        const app = applications.find((a) => a._id === e.target.value)
                        if (app) {
                          setSelectedApp(app)
                          setStatusDraft(statusMap[app.status] || 'preliminary-eligible')
                          setRebateInfo({
                            email: app.rebatePortalEmail || '',
                            password: app.rebatePortalPassword || ''
                          })
                        }
                      }}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {applications.map((app) => (
                        <option key={app._id} value={app._id}>
                          {app.applicationNumber} • {app.serviceArea}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Document Review Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-600" />
                    Document Review
                  </h2>
                  
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{docStats.total}</p>
                      <p className="text-xs text-gray-600">Total Docs</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{docStats.verified}</p>
                      <p className="text-xs text-gray-600">Verified</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{docStats.pending}</p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">{docStats.rejected}</p>
                      <p className="text-xs text-gray-600">Rejected</p>
                    </div>
                  </div>

                  {/* Status Check */}
                  {docStats.total > 0 && (
                    <div className={`rounded-lg p-3 flex items-center gap-2 ${allDocsVerified(selectedApp) ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                      {allDocsVerified(selectedApp) ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <p className="text-sm text-green-800"><strong>Ready to proceed:</strong> All documents verified. Customer can now be submitted to program.</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                          <p className="text-sm text-yellow-800"><strong>Pending review:</strong> {docStats.pending} documents awaiting verification</p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Document List */}
                {docStats.total > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {selectedApp.documents?.map((doc) => (
                        <div key={doc._id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <File className="h-5 w-5 text-gray-400" />
                                <p className="font-medium text-gray-900">{doc.fileName}</p>
                              </div>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span>{doc.documentType}</span>
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                              </div>
                              {doc.rejectionReason && (
                                <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">❌ {doc.rejectionReason}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {/* Status Badge */}
                              {doc.status === 'verified' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  <CheckCircle className="h-3 w-3" /> Verified
                                </span>
                              )}
                              {doc.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                  <X className="h-3 w-3" /> Rejected
                                </span>
                              )}
                              {doc.status === 'uploaded' && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                                  <AlertCircle className="h-3 w-3" /> Pending
                                </span>
                              )}

                              {/* View Button */}
                              <button
                                onClick={() => setViewingDoc(doc)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg ring-1 ring-blue-200 transition-colors"
                                title="View Document"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                            </div>
                          </div>

                          {/* Verification Actions - Inline */}
                          {doc.status === 'uploaded' && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {selectedDocId === doc._id ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why this document is being rejected..."
                                    rows={2}
                                    className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleRejectDocument(doc._id)}
                                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                                    >
                                      Confirm Rejection
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedDocId(null)
                                        setRejectionReason('')
                                      }}
                                      className="flex-1 rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleVerifyDocument(doc._id)}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Verify
                                  </button>
                                  <button
                                    onClick={() => setSelectedDocId(doc._id)}
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 hover:text-red-900"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No documents uploaded yet</p>
                    <p className="text-sm text-gray-500 mt-1">Send email to customer requesting documents</p>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR - Status Management, Project Info, Rebate Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Status Management */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Status Management</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Change Status</label>
                      <select
                        value={statusDraft}
                        onChange={(e) => setStatusDraft(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Reason/Notes</label>
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Why are you changing the status?"
                      />
                    </div>

                    <button
                      onClick={handleStatusUpdate}
                      className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Project Info</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="text-gray-900 font-medium">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applications</p>
                      <p className="text-gray-900 font-medium">{applications.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Service Area</p>
                      <p className="text-gray-900 font-medium">{selectedApp.serviceArea}</p>
                    </div>
                  </div>
                </div>

                {/* Rebate Application Info (Admin Only) */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Rebate Application Info</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Portal Email (Admin Only)</label>
                      <input
                        type="email"
                        value={rebateInfo.email}
                        onChange={(e) => setRebateInfo((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="rebates@provider.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Portal Password (Admin Only)</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={rebateInfo.password}
                          onChange={(e) => setRebateInfo((prev) => ({ ...prev, password: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveRebateInfo}
                      className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                    >
                      Save Rebate Info
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication - below grid, same width as left content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Message
                </h3>

                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={emailDraft.subject}
                      onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Subject"
                    />
                  </div>
                  <textarea
                    value={emailDraft.body}
                    onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Your message..."
                  />
                  <button
                    onClick={handleSendEmail}
                    className="w-full rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Document Preview Modal - Simple like Customer Portal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setViewingDoc(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{viewingDoc.fileName}</h3>
                <p className="text-xs text-gray-600 mt-1">{viewingDoc.documentType}</p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[300px]">
              <div className="text-center space-y-4">
                <File className="w-16 h-16 text-blue-600 mx-auto" />
                <div>
                  <p className="text-gray-900 font-semibold text-lg">Document Ready</p>
                  <div className="mt-2">
                    {viewingDoc.status === 'verified' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </span>
                    )}
                    {viewingDoc.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                        <X className="h-3 w-3" /> Rejected
                      </span>
                    )}
                    {viewingDoc.status === 'uploaded' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-200">
                        <AlertCircle className="h-3 w-3" /> Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-4 max-w-sm mx-auto">
                    Uploaded {new Date(viewingDoc.uploadedAt).toLocaleDateString()}
                  </p>
                  {viewingDoc.rejectionReason && (
                    <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                      Rejection reason: {viewingDoc.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3 justify-end">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDocumentDownload(viewingDoc._id)}
                className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
