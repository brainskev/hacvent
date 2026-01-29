'use client'

import React from 'react'
import { X, Download, AlertCircle } from 'lucide-react'

interface DocumentPreviewModalProps {
  isOpen: boolean
  fileName: string
  documentId: string
  documentType: string
  size: number
  onClose: () => void
}

export function DocumentPreviewModal({
  isOpen,
  fileName,
  documentId,
  documentType,
  size,
  onClose
}: DocumentPreviewModalProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    // Use our secure proxy endpoint instead of exposing Cloudinary URL
    const userId = (window as any).__appContext?.userId
    if (!userId) return
    window.location.href = `/api/customer/documents/download/${documentId}?userId=${userId}`
    // Close modal after initiating download
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{fileName}</h3>
            <p className="text-xs text-gray-600 mt-1">{documentType}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-blue-600 mx-auto" />
            <div>
              <p className="text-gray-900 font-semibold text-lg">Document Ready</p>
              <p className="text-sm text-gray-600 mt-2">
                {(size / 1024).toFixed(1)} KB
              </p>
              <p className="text-xs text-gray-500 mt-4 max-w-sm mx-auto">
                Click the Download button to view, save, or open this document in your default application.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
