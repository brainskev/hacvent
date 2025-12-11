import React, { useState } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  type: string
  uploadedDate: string
}

const mockFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'Installation_Invoice.pdf',
    type: 'Invoice',
    uploadedDate: '2024-11-15'
  },
  {
    id: '2',
    name: 'Product_Specifications.pdf',
    type: 'Specifications',
    uploadedDate: '2024-11-15'
  }
]

const DocumentUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    // TODO: Handle file upload
    console.log('Files dropped:', e.dataTransfer.files)
    alert('File upload functionality will be implemented with backend API')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Handle file upload
    console.log('Files selected:', e.target.files)
    alert('File upload functionality will be implemented with backend API')
  }

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Rebate Documents
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <input
          type="file"
          id="file-upload"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
          Select Files
        </label>
        <p className="text-sm text-gray-500 mt-4">
          Accepted formats: PDF, JPG, PNG, DOC (Max 10MB per file)
        </p>
      </div>

      {/* Required Documents Checklist */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Purchase invoice with itemized costs</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Product model and serial numbers</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Manufacturer certification sheets (AHRI)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Contractor license and insurance information</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">Installation certification form</span>
          </li>
        </ul>
      </div>

      {/* Uploaded Files List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="card flex items-center justify-between hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <File className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {file.type} • Uploaded {file.uploadedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {files.length === 0 && (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentUpload
