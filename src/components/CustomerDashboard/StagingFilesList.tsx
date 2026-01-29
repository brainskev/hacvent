'use client'

import React from 'react'
import { FileText, Trash2, Check, FileX2 } from 'lucide-react'
import { DocumentType } from '@/lib/types'

interface StagingFile {
  id: string
  file: File
  documentType: string
  documentLabel: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
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

interface StagingFilesListProps {
  stagingFiles: StagingFile[]
  isUploading: boolean
  onUpdateFile: (id: string, updates: Partial<StagingFile>) => void
  onRemoveFile: (id: string) => void
  onSubmit: () => void
  getDocumentTypeLabel: (type: string) => string
  getDocumentTypeHint: (type: string) => string
}

export function StagingFilesList({
  stagingFiles,
  isUploading,
  onUpdateFile,
  onRemoveFile,
  onSubmit,
  getDocumentTypeLabel,
  getDocumentTypeHint
}: StagingFilesListProps) {
  if (stagingFiles.length === 0) return null

  const allUploaded = stagingFiles.every(f => f.status === 'success')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Files to Upload ({stagingFiles.length})
        </h3>
        {allUploaded && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full ring-1 ring-emerald-200">
            <Check className="w-3 h-3" />
            All Uploaded
          </span>
        )}
      </div>

      {stagingFiles.map((staging) => (
        <div
          key={staging.id}
          className="p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {staging.file.name}
                </p>
                {staging.status === 'success' && (
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                )}
                {staging.status === 'error' && (
                  <FileX2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-600">
                {(staging.file.size / 1024).toFixed(1)}KB
              </p>

              {/* Document Type Selector */}
              {staging.status === 'pending' && !staging.documentType && (
                <div className="mt-2">
                  <select
                    value={staging.documentType}
                    onChange={(e) =>
                      onUpdateFile(staging.id, {
                        documentType: e.target.value,
                        documentLabel: getDocumentTypeLabel(e.target.value)
                      })
                    }
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Choose document type...</option>
                    <optgroup label="Income Verification">
                      {DOCUMENT_CATEGORIES.income.types.map((doc) => (
                        <option key={doc.value} value={doc.value}>
                          {doc.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Proof of Ownership">
                      {DOCUMENT_CATEGORIES.ownership.types.map((doc) => (
                        <option key={doc.value} value={doc.value}>
                          {doc.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {staging.documentType && (
                    <p className="text-xs text-blue-600 mt-1">
                      ℹ️ {getDocumentTypeHint(staging.documentType)}
                    </p>
                  )}
                </div>
              )}

              {/* Document Type Badge */}
              {staging.documentType && (
                <div className="mt-2">
                  <span className="inline-block text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded ring-1 ring-blue-200">
                    {staging.documentLabel}
                  </span>
                </div>
              )}

              {/* Upload Progress */}
              {staging.status === 'uploading' && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${staging.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                    {staging.progress}%
                  </span>
                </div>
              )}

              {/* Error Message */}
              {staging.status === 'error' && (
                <p className="text-xs text-rose-600 mt-2">{staging.error}</p>
              )}
            </div>

            {/* Remove Button */}
            {staging.status !== 'uploading' && (
              <button
                onClick={() => onRemoveFile(staging.id)}
                disabled={isUploading}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      {!allUploaded && (
        <button
          onClick={onSubmit}
          disabled={isUploading || stagingFiles.some(f => !f.documentType)}
          className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Submit Documents'}
        </button>
      )}
    </div>
  )
}
