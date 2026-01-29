'use client'

import React from 'react'
import { IDocument, DocumentStatus } from '@/lib/types'
import { Check, FileText, FileX2, Eye } from 'lucide-react'
import { DocumentPreviewModal } from './DocumentPreviewModal'

interface UploadedDocumentsListProps {
  documents: IDocument[]
  getDocumentTypeLabel: (type: string) => string
}

export function UploadedDocumentsList({
  documents,
  getDocumentTypeLabel
}: UploadedDocumentsListProps) {
  const [selectedDoc, setSelectedDoc] = React.useState<IDocument | null>(null)

  if (documents.length === 0) return null

  const getDocumentIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.VERIFIED:
        return <Check className="w-4 h-4 text-emerald-600" />
      case DocumentStatus.UPLOADED:
        return <FileText className="w-4 h-4 text-blue-600" />
      case DocumentStatus.REJECTED:
        return <FileX2 className="w-4 h-4 text-rose-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadgeColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.VERIFIED:
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      case DocumentStatus.UPLOADED:
        return 'bg-blue-50 text-blue-700 ring-blue-200'
      case DocumentStatus.REJECTED:
        return 'bg-rose-50 text-rose-700 ring-rose-200'
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-200'
    }
  }

  return (
    <>
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Submitted Documents ({documents.length})
        </h3>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc._id?.toString()}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-white rounded-lg border border-emerald-200 hover:from-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getDocumentIcon(doc.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-gray-600">
                    {getDocumentTypeLabel(doc.documentType)} • {(doc.size / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg ring-1 ring-blue-200 transition-colors"
                  title="Preview document"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 whitespace-nowrap ${getStatusBadgeColor(doc.status)}`}
                >
                  {doc.status === 'verified' && <Check className="w-3 h-3 mr-1" />}
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDoc && (
        <DocumentPreviewModal
          isOpen={!!selectedDoc}
          fileName={selectedDoc.fileName}
          documentId={selectedDoc._id?.toString() || ''}
          documentType={selectedDoc.documentType}
          size={selectedDoc.size || 0}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  )
}
