import React from 'react'
import { Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react'

interface RebateStatus {
  id: string
  program: string
  amount: string
  status: 'pending' | 'in-review' | 'approved' | 'completed'
  submittedDate: string
  estimatedCompletion: string
}

const mockRebates: RebateStatus[] = [
  {
    id: '1',
    program: 'Federal Tax Credit 25C',
    amount: '$2,000',
    status: 'approved',
    submittedDate: '2024-11-15',
    estimatedCompletion: '2024-12-30'
  },
  {
    id: '2',
    program: 'State Energy Rebate',
    amount: '$1,500',
    status: 'in-review',
    submittedDate: '2024-11-20',
    estimatedCompletion: '2025-01-15'
  },
  {
    id: '3',
    program: 'Utility Company Rebate',
    amount: '$800',
    status: 'pending',
    submittedDate: '2024-12-01',
    estimatedCompletion: '2025-01-30'
  }
]

const RebateTracker: React.FC = () => {
  const getStatusColor = (status: RebateStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'in-review':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: RebateStatus['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5" />
      case 'in-review':
        return <AlertCircle className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      {mockRebates.map((rebate) => (
        <div key={rebate.id} className="card hover:shadow-2xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {rebate.program}
              </h3>
              <p className="text-2xl font-bold text-primary">{rebate.amount}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(rebate.status)}`}>
              {getStatusIcon(rebate.status)}
              {rebate.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-medium">Submitted:</span> {rebate.submittedDate}
            </div>
            <div>
              <span className="font-medium">Est. Completion:</span> {rebate.estimatedCompletion}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ 
                width: rebate.status === 'pending' ? '25%' : 
                       rebate.status === 'in-review' ? '50%' : 
                       rebate.status === 'approved' ? '75%' : '100%'
              }}
            />
          </div>

          <button className="btn-outline text-sm py-2 px-4 w-full">
            View Details
          </button>
        </div>
      ))}
    </div>
  )
}

export default RebateTracker
