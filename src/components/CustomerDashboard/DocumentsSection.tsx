'use client'

import React from 'react'
import { ApplicationStatus, IDocument } from '@/lib/types'
import { DocumentUpload } from '@/components/CustomerDashboard/DocumentUpload'

interface DocumentsSectionProps {
  applicationStatus: ApplicationStatus
  isActionRequired: boolean
  documents: IDocument[]
  onUpload: (files: File[], documentType: string) => Promise<void>
  onDocumentsRefresh: () => Promise<void>
}

export function DocumentsSection({
  applicationStatus,
  isActionRequired,
  documents,
  onUpload,
  onDocumentsRefresh
}: DocumentsSectionProps) {
  return (
    <div className="space-y-6">
      <DocumentUpload
        applicationStatus={applicationStatus}
        isActionRequired={isActionRequired}
        documents={documents}
        requestedDocumentTypes={['tax-return', 'proof-of-ownership', 'utility-bill']}
        onUpload={onUpload}
        onDocumentsRefresh={onDocumentsRefresh}
      />
    </div>
  )
}
