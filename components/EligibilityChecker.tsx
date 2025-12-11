import React, { useState } from 'react'
import { MapPin, Home, DollarSign, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { EligibilityService, EligibilityInput, formatCurrency } from '@/lib/eligibility'
import { useRouter } from 'next/router'

const EligibilityChecker: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<EligibilityInput>({
    address: '',
    city: '',
    state: 'California',
    zipCode: '',
    homeType: 'single-family',
    ownership: true,
    systemAge: '11-15',
    currentSystemType: 'Central AC',
    desiredSystemType: 'Central Heat Pump',
    desiredEfficiency: 'SEER 16',
    householdIncome: undefined,
    householdSize: undefined
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const eligibilityCheck = await EligibilityService.checkEligibility(formData)

      if (eligibilityCheck.success && eligibilityCheck.result) {
        setResult(eligibilityCheck.result)
        
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        setError(eligibilityCheck.error || 'Unable to check eligibility')
      }
    } catch (err) {
      console.error('Error checking eligibility:', err)
      setError('An error occurred while checking eligibility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Check Your Rebate Eligibility</h2>
            <p className="section-subtitle">
              Answer a few quick questions to discover available HVAC rebates in your area
            </p>
          </div>

          <div className="card bg-gradient-to-br from-white to-neutral-light border-2 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ZIP Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-2" />
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter your ZIP code"
                  className="input-field"
                  required
                  maxLength={5}
                  pattern="[0-9]{5}"
                />
              </div>

              {/* Home Type */}
              <div>
                <label htmlFor="homeType" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Home className="w-5 h-5 text-primary mr-2" />
                  Home Type
                </label>
                <select
                  id="homeType"
                  name="homeType"
                  value={formData.homeType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select your home type</option>
                  <option value="single-family">Single-Family Home</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="condo">Condo/Apartment</option>
                  <option value="manufactured">Manufactured Home</option>
                </select>
              </div>

              {/* System Age */}
              <div>
                <label htmlFor="systemAge" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <DollarSign className="w-5 h-5 text-primary mr-2" />
                  Current HVAC System Age
                </label>
                <select
                  id="systemAge"
                  name="systemAge"
                  value={formData.systemAge}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select system age</option>
                  <option value="0-5">0-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                  <option value="no-system">No existing system</option>
                </select>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="inline-block mr-2 w-5 h-5 animate-spin" />
                    Checking Eligibility...
                  </>
                ) : (
                  <>
                    Check My Eligibility
                    <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Get a quick estimate. Complete details on your dashboard.
              </p>
            </form>
          </div>

          {/* Simple Results Section */}
          {result && (
            <div id="results" className="mt-8 card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-600 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Great News!</h3>
                  <p className="text-gray-600">You may qualify for rebates</p>
                </div>
              </div>

              {/* Total Savings */}
              <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-300">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Estimated Savings Range</p>
                  <p className="text-5xl font-bold text-green-600">{formatCurrency(result.totalSavings)}</p>
                  <p className="text-sm text-gray-500 mt-2">Based on your location and home type</p>
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6">
                Found {result.programs.length} eligible rebate program{result.programs.length !== 1 ? 's' : ''} for your area
              </p>

              {/* CTA */}
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn-primary w-full"
              >
                Get Matched with Contractors
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Rebates</h3>
              <p className="text-gray-600 text-sm">Discover federal, state, and utility rebates in your area</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Maximum Savings</h3>
              <p className="text-gray-600 text-sm">Stack multiple rebates to maximize your total savings</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Contractors</h3>
              <p className="text-gray-600 text-sm">Connect with certified HVAC professionals near you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EligibilityChecker
