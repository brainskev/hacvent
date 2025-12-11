import React from 'react'
import { DollarSign, Home, Zap, CheckCircle, AlertCircle } from 'lucide-react'

interface RebateProgram {
  name: string
  amount: number
  eligible: boolean
  requirements?: string[]
}

interface EligibilityResult {
  totalSavings: number
  federalCredit: number
  stateRebate: number
  utilityRebate: number
  manufacturerRebate: number
  programs: RebateProgram[]
  location: string
  systemType: string
  efficiencyRating?: string
}

interface EligibilitySummaryProps {
  result: EligibilityResult
  onProceed?: () => void
}

const EligibilitySummary: React.FC<EligibilitySummaryProps> = ({ result, onProceed }) => {
  return (
    <div className="space-y-6">
      {/* Total Savings Card */}
      <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="text-center">
          <Zap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 animate-pulse-slow" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            ${result.totalSavings.toLocaleString()}
          </h2>
          <p className="text-white/90 text-base sm:text-lg">Total Available Rebates</p>
          <p className="text-white/80 text-xs sm:text-sm mt-2">Based on your location and system requirements</p>
        </div>
      </div>

      {/* System Info */}
      <div className="card bg-blue-50 border-2 border-blue-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Your System Details
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <p className="text-gray-900">{result.location}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">System Type:</span>
            <p className="text-gray-900">{result.systemType}</p>
          </div>
          {result.efficiencyRating && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700">Efficiency Rating:</span>
              <p className="text-gray-900">{result.efficiencyRating}</p>
            </div>
          )}
        </div>
      </div>

      {/* Rebate Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Rebate Breakdown
        </h3>
        <div className="space-y-3">
          {result.federalCredit > 0 && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Federal Tax Credit</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                ${result.federalCredit.toLocaleString()}
              </span>
            </div>
          )}

          {result.stateRebate > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">State Rebate</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                ${result.stateRebate.toLocaleString()}
              </span>
            </div>
          )}

          {result.utilityRebate > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Utility Company Rebate</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                ${result.utilityRebate.toLocaleString()}
              </span>
            </div>
          )}

          {result.manufacturerRebate > 0 && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Manufacturer Rebate</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                ${result.manufacturerRebate.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Eligible Programs */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligible Programs</h3>
        <div className="space-y-4">
          {result.programs.map((program, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                program.eligible
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {program.eligible ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-gray-900">{program.name}</span>
                </div>
                <span className={`font-bold ${program.eligible ? 'text-green-600' : 'text-gray-400'}`}>
                  ${program.amount.toLocaleString()}
                </span>
              </div>
              {program.requirements && program.requirements.length > 0 && (
                <ul className="ml-7 text-sm text-gray-600 space-y-1">
                  {program.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {onProceed && (
        <button onClick={onProceed} className="btn-primary w-full py-4 text-lg">
          Proceed to Contractor Selection
        </button>
      )}
    </div>
  )
}

export default EligibilitySummary
