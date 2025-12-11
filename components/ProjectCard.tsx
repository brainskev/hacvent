import React from 'react'
import { MapPin, DollarSign, Home, Calendar, Eye, Lock, CheckCircle } from 'lucide-react'

interface Project {
  id: string
  customerName?: string // Only visible if contractor is selected
  location: string // Full address only if selected, otherwise just city/zip
  systemType: string
  rebateAmount: number
  status: 'shortlisted' | 'selected' | 'consultation-scheduled' | 'in-progress' | 'completed'
  postedDate: string
  estimatedStart?: string
  visibility: 'limited' | 'full' // Limited = shortlisted, Full = selected by customer
  projectDetails?: string
  requirements: string[]
  contactInfo?: {
    phone: string
    email: string
  }
}

interface ProjectCardProps {
  project: Project
  onViewDetails: (projectId: string) => void
  onAcceptProject?: (projectId: string) => void
  onRequestInfo?: (projectId: string) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onAcceptProject,
  onRequestInfo
}) => {
  const getStatusColor = () => {
    switch (project.status) {
      case 'selected':
        return 'bg-green-100 text-green-800'
      case 'consultation-scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  const getStatusText = () => {
    switch (project.status) {
      case 'shortlisted':
        return 'You\'re Shortlisted'
      case 'selected':
        return 'Selected by Customer'
      case 'consultation-scheduled':
        return 'Consultation Scheduled'
      case 'in-progress':
        return 'Installation In Progress'
      case 'completed':
        return 'Completed'
      default:
        return project.status
    }
  }

  const isLimitedView = project.visibility === 'limited'

  return (
    <div className={`card hover:shadow-xl transition-all ${
      project.status === 'selected' ? 'border-2 border-primary ring-2 ring-primary/20' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {project.systemType} Installation
          </h3>
          {isLimitedView ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Limited details until selected</span>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-gray-700 font-medium">{project.customerName}</p>
          )}
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Rebate Amount - Always Visible */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-3 sm:p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-medium">Total Rebate Value</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            ${project.rebateAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{project.location}</span>
        </div>
        
        {project.estimatedStart && (
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Target start: {project.estimatedStart}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-gray-700 text-sm">
          <Home className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Posted {project.postedDate}</span>
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">Project Requirements:</h4>
        <div className="space-y-1">
          {project.requirements.slice(0, isLimitedView ? 2 : undefined).map((req, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{req}</span>
            </div>
          ))}
          {isLimitedView && project.requirements.length > 2 && (
            <p className="text-sm text-gray-500 italic">
              + {project.requirements.length - 2} more requirements
            </p>
          )}
        </div>
      </div>

      {/* Contact Info - Only visible if selected */}
      {!isLimitedView && project.contactInfo && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Customer Contact:</h4>
          <div className="space-y-1 text-sm text-gray-700">
            <p>📞 {project.contactInfo.phone}</p>
            <p>📧 {project.contactInfo.email}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {isLimitedView ? (
          <>
            <button
              onClick={() => onRequestInfo?.(project.id)}
              className="btn-outline text-sm py-2"
            >
              Request More Info
            </button>
            <button
              onClick={() => onViewDetails(project.id)}
              className="btn-secondary text-sm py-2 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onViewDetails(project.id)}
              className="btn-outline text-sm py-2"
            >
              View Full Details
            </button>
            {project.status === 'selected' && onAcceptProject && (
              <button
                onClick={() => onAcceptProject(project.id)}
                className="btn-primary text-sm py-2"
              >
                Accept Project
              </button>
            )}
            {project.status === 'consultation-scheduled' && (
              <button className="btn-primary text-sm py-2">
                View Schedule
              </button>
            )}
            {(project.status === 'in-progress' || project.status === 'completed') && (
              <button className="btn-primary text-sm py-2">
                Update Status
              </button>
            )}
          </>
        )}
      </div>

      {/* Info Message */}
      {isLimitedView && (
        <p className="mt-4 text-xs text-gray-500 text-center italic">
          You'll receive full customer details once they select you as their contractor
        </p>
      )}
    </div>
  )
}

export default ProjectCard
