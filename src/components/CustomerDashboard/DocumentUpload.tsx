'use client'

import React from 'react'
import { ApplicationStatus, IDocument, DocumentType } from '@/lib/types'
import { FileText } from 'lucide-react'
import { DocumentRequirements } from './DocumentRequirements'
import { UploadZone } from './UploadZone'
import { StagingFilesList } from './StagingFilesList'
import { UploadedDocumentsList } from './UploadedDocumentsList'

interface StagingFile {
  id: string
  file: File
  documentType: string
  documentLabel: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface DocumentUploadProps {
  applicationStatus: ApplicationStatus
  isActionRequired: boolean
  documents: IDocument[]
  requestedDocumentTypes?: string[]
  onUpload?: (files: File[], documentType: string) => Promise<void>
  onDocumentsRefresh?: () => Promise<void>
}

const DOCUMENT_CATEGORIES = {
  income: {
    types: [
      { value: DocumentType.INCOME_TAX_FORM, label: 'Tax Form (1040, W2, 1099)', hint: 'Most recent year. 1040 + Schedule 1 if self-employed.' },
      { value: DocumentType.WAGE_STATEMENT, label: 'Recent Wage Statements', hint: 'Paystubs from the past 30 days' },
      { value: DocumentType.RETIREMENT_INCOME_PROOF, label: 'Retirement Income Proof', hint: 'Pension, Social Security, 401K, or IRA statement' },
      { value: DocumentType.GOVERNMENT_ASSISTANCE_PROOF, label: 'Government Assistance', hint: 'Social Security, veteran benefits, worker\'s comp' },
      { value: DocumentType.UNEMPLOYMENT_BENEFITS, label: 'Unemployment Benefits', hint: 'Unemployment or strike benefits proof' }
    ]
  },
  ownership: {
    types: [
      { value: DocumentType.PROPERTY_TAX_BILL, label: 'Property Tax Bill', hint: 'Recent bill with your name and address' },
      { value: DocumentType.HOME_INSURANCE_STATEMENT, label: 'Home Insurance Statement', hint: 'Front page with recent date, your name and address' },
      { value: DocumentType.MORTGAGE_STATEMENT, label: 'Mortgage Statement', hint: 'Current statement with your name and address' }
    ]
  }
}

export function DocumentUpload({
  applicationStatus,
  isActionRequired,
  documents,
  requestedDocumentTypes = [],
  onUpload,
  onDocumentsRefresh
}: DocumentUploadProps) {
  const [stagingFiles, setStagingFiles] = React.useState<StagingFile[]>([])
  const [uploadedDocs, setUploadedDocs] = React.useState<IDocument[]>(documents)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setUploadedDocs(documents)
  }, [documents])

  const getDocumentTypeLabel = (type: string): string => {
    for (const category of Object.values(DOCUMENT_CATEGORIES)) {
      const found = category.types.find(doc => doc.value === type)
      if (found) return found.label
    }
    return type
  }

  const getDocumentTypeHint = (type: string): string => {
    for (const category of Object.values(DOCUMENT_CATEGORIES)) {
      const found = category.types.find(doc => doc.value === type)
      if (found) return found.hint
    }
    return ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const processFiles = (files: FileList) => {
    const newFiles: StagingFile[] = []
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setError(`${file.name} - Invalid file type. Please use PDF, JPG, PNG, or Word documents.`)
        return
      }
      if (file.size > maxSize) {
        setError(`${file.name} - File too large. Maximum 10MB.`)
        return
      }

      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        documentType: '',
        documentLabel: '',
        progress: 0,
        status: 'pending',
      })
    })

    setStagingFiles([...stagingFiles, ...newFiles])
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setError(null)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  const updateStagingFile = (id: string, updates: Partial<StagingFile>) => {
    setStagingFiles(files => files.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const removeStagingFile = (id: string) => {
    setStagingFiles(files => files.filter(f => f.id !== id))
  }

  const submitFiles = async () => {
    const incomplete = stagingFiles.filter(f => !f.documentType)
    if (incomplete.length > 0) {
      setError('Please select a document type for all files')
      return
    }

    setError(null)

    const applicationId = (window as any).__appContext?.applicationId
    const userId = (window as any).__appContext?.userId

    if (!applicationId || !userId) {
      setError('Application context not found. Please refresh the page and try again.')
      return
    }

    let uploadSuccessCount = 0
    let uploadFailureCount = 0

    for (const staging of stagingFiles) {
      if (staging.status === 'success') continue

      try {
        updateStagingFile(staging.id, { status: 'uploading' })

        const formData = new FormData()
        formData.append('file', staging.file)
        formData.append('documentType', staging.documentType)
        formData.append('applicationId', applicationId)
        formData.append('userId', userId)

        const response = await fetch('/api/customer/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Upload failed')
        }

        updateStagingFile(staging.id, { status: 'success', progress: 100 })
        uploadSuccessCount++

        if (onUpload) {
          await onUpload([staging.file], staging.documentType)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        updateStagingFile(staging.id, { status: 'error', error: message })
        uploadFailureCount++
      }
    }

    if (uploadFailureCount === 0 && uploadSuccessCount > 0) {
      if (onDocumentsRefresh) {
        await onDocumentsRefresh()
      }

      setTimeout(() => {
        setStagingFiles([])
        setError(null)
      }, 1000)
    } else if (uploadFailureCount > 0) {
      setError(`${uploadFailureCount} file(s) failed to upload. Please try again.`)
    }
  }

  const isUploading = stagingFiles.some(f => f.status === 'uploading')

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
      </div>

      {/* Upload Section */}
      <div className="mb-6 space-y-4">
        <DocumentRequirements />

        <UploadZone
          isDragging={isDragging}
          isUploading={isUploading}
          error={error}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onErrorClear={() => setError(null)}
        />

        <StagingFilesList
          stagingFiles={stagingFiles}
          isUploading={isUploading}
          onUpdateFile={updateStagingFile}
          onRemoveFile={removeStagingFile}
          onSubmit={submitFiles}
          getDocumentTypeLabel={getDocumentTypeLabel}
          getDocumentTypeHint={getDocumentTypeHint}
        />
      </div>

      {/* Uploaded Documents */}
      <UploadedDocumentsList
        documents={uploadedDocs}
        getDocumentTypeLabel={getDocumentTypeLabel}
      />

      {/* Empty State */}
      {documents.length === 0 && stagingFiles.length === 0 && !isActionRequired && (
        <div className="text-center py-8 text-gray-600">
          <p className="text-sm">No documents have been submitted.</p>
        </div>
      )}
    </div>
  )
}
