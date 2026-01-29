'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { CheckCircle, ArrowRight, AlertCircle, Info } from 'lucide-react'

type EligibilityForm = {
  zip_code: string
  household_size: string
  income_range: string
  homeowner_status: string
  upgrade_type: string
}

type EligibilityResult = 'eligible' | 'additional_info' | 'not_eligible' | null

export default function EligibilityCheck() {
  const router = useRouter()
  const [form, setForm] = useState<EligibilityForm>({
    zip_code: '',
    household_size: '1-2',
    income_range: 'below_80',
    homeowner_status: 'owner',
    upgrade_type: 'hvac',
  })
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<EligibilityResult>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    
    // Simulate eligibility check
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Income-based eligibility logic (primary determinant)
    const isOwner = form.homeowner_status === 'owner'
    const isLowIncome = form.income_range === 'below_80'
    const isMidIncome = form.income_range === '80_150'
    const isHighIncome = form.income_range === 'above_150'
    const isHvacOrHeatPump = form.upgrade_type === 'hvac' || form.upgrade_type === 'heat_pump'
    
    // Determine eligibility based primarily on income
    if (isLowIncome) {
      // Below 80% AMI - most likely to qualify for rebate programs
      if (isHvacOrHeatPump) {
        setResult('eligible')
      } else {
        // Other upgrade types for low income may still qualify
        setResult('additional_info')
      }
    } else if (isMidIncome) {
      // 80-150% AMI - moderate income programs available
      if (isOwner && isHvacOrHeatPump) {
        setResult('eligible')
      } else if (isHvacOrHeatPump) {
        setResult('additional_info')
      } else {
        setResult('additional_info')
      }
    } else if (isHighIncome) {
      // Above 150% AMI - limited programs available
      if (isOwner && isHvacOrHeatPump) {
        setResult('additional_info')
      } else {
        setResult('not_eligible')
      }
    } else {
      setResult('not_eligible')
    }
    
    setChecking(false)
  }

  const handleContinue = () => {
    // Redirect to Clerk sign-up after eligibility check passes
    router.push('/sign-up?redirect_url=/customer-intake')
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-12 md:py-14">
        <div className="container-custom text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Quick Eligibility Check</h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Answer a few questions to see if you may qualify for available rebate and incentive programs based on your location and household details.
          </p>
          <p className="text-xs text-white/70 mt-3">This takes less than a minute</p>
        </div>
      </section>

      {/* Form Section */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          {!result ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Eligibility Questions</h2>
                <p className="text-gray-600 mt-1 text-sm">Help us determine your rebate eligibility</p>
              </div>

              {/* Form Body */}
              <div className="p-5 md:p-6">
                <div className="space-y-5">
                  <div>
                    <label className="label">ZIP Code *</label>
                    <input 
                      type="text" 
                      name="zip_code" 
                      value={form.zip_code} 
                      onChange={handleChange} 
                      className="input" 
                      placeholder="48201" 
                      maxLength={5}
                      pattern="[0-9]{5}"
                      required 
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your 5-digit ZIP code</p>
                  </div>

                  <div>
                    <label className="label">Household Size *</label>
                    <select name="household_size" value={form.household_size} onChange={handleChange} className="input" required>
                      <option value="1-2">1-2 people</option>
                      <option value="3-4">3-4 people</option>
                      <option value="5+">5 or more people</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Annual Household Income Range *</label>
                    <select name="income_range" value={form.income_range} onChange={handleChange} className="input" required>
                      <option value="below_80">Below 80% AMI (Area Median Income)</option>
                      <option value="80_150">80-150% AMI</option>
                      <option value="above_150">Above 150% AMI</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">AMI varies by location and household size</p>
                  </div>

                  <div>
                    <label className="label">Homeownership Status *</label>
                    <select name="homeowner_status" value={form.homeowner_status} onChange={handleChange} className="input" required>
                      <option value="owner">I own this property</option>
                      <option value="renter">I rent this property</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Type of Upgrade *</label>
                    <select name="upgrade_type" value={form.upgrade_type} onChange={handleChange} className="input" required>
                      <option value="hvac">HVAC System</option>
                      <option value="heat_pump">Heat Pump</option>
                      <option value="insulation">Insulation</option>
                      <option value="other">Other Energy Efficiency Upgrades</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-3 text-base mt-6" disabled={checking}>
                  {checking ? 'Checking...' : 'Check Eligibility'}
                </button>

                <p className="text-center text-gray-400 text-xs mt-4">
                  Results are preliminary and subject to final verification.
                </p>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {result === 'eligible' ? (
                <>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-8 border-b border-green-200 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-green-900">Great News!</h2>
                    <p className="text-green-800 mt-2 font-semibold">You may be eligible for rebate and incentive programs.</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-6 space-y-3">
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold mr-2 flex-shrink-0">✓</span>
                        <p className="text-gray-700 text-sm">Based on your income level and upgrade type, you appear to qualify for multiple rebate programs.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold mr-2 flex-shrink-0">✓</span>
                        <p className="text-gray-700 text-sm">Potential savings range from <strong>$1,000 - $8,000+</strong> depending on system type and efficiency.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold mr-2 flex-shrink-0">✓</span>
                        <p className="text-gray-700 text-sm">We'll connect you with approved contractors who can help maximize your rebates.</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-900 mb-2 text-sm">Next Step</h3>
                      <p className="text-blue-800 text-sm">Complete the full intake form so we can verify your eligibility and match you with qualified contractors.</p>
                    </div>

                    <button onClick={handleContinue} className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2">
                      Continue to Full Application <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-gray-400 text-xs mt-4">
                      Results are preliminary and subject to final verification by program administrators.
                    </p>
                  </div>
                </>
              ) : result === 'additional_info' ? (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-8 border-b border-blue-200 text-center">
                    <Info className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-blue-900">Additional Review Needed</h2>
                    <p className="text-blue-800 mt-2 font-semibold">Additional information is required to determine eligibility.</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-6 space-y-3">
                      <p className="text-gray-700 text-sm">
                        Based on your responses, we need more details to confirm your eligibility for rebate programs.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-primary font-bold mr-2 flex-shrink-0">•</span>
                          <span>Your situation may qualify for specific programs that require additional verification</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary font-bold mr-2 flex-shrink-0">•</span>
                          <span>Our team will review your complete application in detail</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary font-bold mr-2 flex-shrink-0">•</span>
                          <span>Alternative financing options may be available</span>
                        </li>
                      </ul>
                    </div>

                    <button onClick={handleContinue} className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2">
                      Continue to Full Application <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-gray-400 text-xs mt-4">
                      Results are preliminary and subject to final verification by program administrators.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-8 border-b border-orange-200 text-center">
                    <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-orange-900">No Match Found</h2>
                    <p className="text-orange-800 mt-2 font-semibold">No matching programs are available at this time.</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-6 space-y-3">
                      <p className="text-gray-700 text-sm">
                        Based on the information provided, you may not currently qualify for available rebate programs. This could be due to:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-orange-600 font-bold mr-2 flex-shrink-0">•</span>
                          <span>Income level above program thresholds</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-600 font-bold mr-2 flex-shrink-0">•</span>
                          <span>The type of upgrade you selected may not be included in current programs</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-600 font-bold mr-2 flex-shrink-0">•</span>
                          <span>Program eligibility criteria or funding availability has changed</span>
                        </li>
                      </ul>
                      <p className="text-gray-700 text-sm mt-4">
                        However, we still encourage you to submit a full application. Programs change frequently, and our team will check for any updates or alternative options.
                      </p>
                    </div>

                    <button onClick={handleContinue} className="w-full btn-secondary py-3 text-base flex items-center justify-center gap-2">
                      Submit Application Anyway <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-gray-400 text-xs mt-4">
                      Results are preliminary and subject to final verification by program administrators.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
