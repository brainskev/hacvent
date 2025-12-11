import React from 'react'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

interface ProjectStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  completedDate?: string
  estimatedDate?: string
}

interface ProjectProgressProps {
  steps: ProjectStep[]
  currentStep?: number
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ steps, currentStep }) => {
  const getStepIcon = (status: ProjectStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-white" />
      case 'in-progress':
        return <Clock className="w-6 h-6 text-white animate-pulse" />
      case 'blocked':
        return <AlertCircle className="w-6 h-6 text-white" />
      default:
        return <Circle className="w-6 h-6 text-white" />
    }
  }

  const getStepColor = (status: ProjectStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'in-progress':
        return 'bg-primary'
      case 'blocked':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getConnectorColor = (index: number) => {
    if (index === 0) return 'bg-gray-300'
    const prevStatus = steps[index - 1]?.status
    return prevStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
  }

  return (
    <div className="space-y-1">
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Connector Line */}
          {index > 0 && (
            <div
              className={`absolute left-5 top-0 w-0.5 h-8 -translate-y-8 ${getConnectorColor(index)}`}
            />
          )}

          {/* Step Card */}
          <div className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
            step.status === 'in-progress' 
              ? 'bg-primary/5 border-2 border-primary shadow-md' 
              : 'bg-white border border-gray-200 hover:shadow-md'
          }`}>
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(step.status)}`}>
              {getStepIcon(step.status)}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h4 className={`font-semibold ${
                  step.status === 'in-progress' ? 'text-primary' : 'text-gray-900'
                }`}>
                  {step.title}
                </h4>
                
                {/* Status Badge */}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                  step.status === 'completed' ? 'bg-green-100 text-green-800' :
                  step.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                  step.status === 'blocked' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {step.status === 'completed' ? 'Completed' :
                   step.status === 'in-progress' ? 'In Progress' :
                   step.status === 'blocked' ? 'Action Required' :
                   'Pending'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{step.description}</p>

              {/* Date Info */}
              <div className="text-xs text-gray-500">
                {step.completedDate && (
                  <span>Completed: {step.completedDate}</span>
                )}
                {step.estimatedDate && !step.completedDate && (
                  <span>Expected: {step.estimatedDate}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectProgress
