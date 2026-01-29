'use client'

import React from 'react'
import { Upload, AlertCircle } from 'lucide-react'

interface UploadZoneProps {
  isDragging: boolean
  isUploading: boolean
  error: string | null
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onErrorClear: () => void
}

export function UploadZone({
  isDragging,
  isUploading,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  fileInputRef,
  onFileSelect,
  onErrorClear
}: UploadZoneProps) {
  return (
    <div className="space-y-3">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
          <button
            onClick={onErrorClear}
            className="text-rose-600 hover:text-rose-700 font-semibold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileSelect}
          disabled={isUploading}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.docx"
        />
        <div className="flex flex-col items-center justify-center py-3">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-900">
            {isDragging ? 'Drop files here' : 'Drag & drop documents or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, or Word • Up to 10MB each</p>
        </div>
      </div>
    </div>
  )
}
