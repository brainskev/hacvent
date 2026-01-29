'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

type FormState = {
  company_name: string
  contact_name: string
  email: string
  phone: string
  license_number: string
  service_areas: string
}

const initialState: FormState = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  license_number: '',
  service_areas: '',
}

export default function ContractorOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 2

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setError(null)
    // Validate current step
    if (currentStep === 1) {
      if (!form.company_name || !form.license_number || !form.service_areas) {
        setError('Please complete all company information')
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contractors/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      // Redirect to contractor success page
      router.push(`/contractor/application-received?id=${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-primary py-12 md:py-14">
        <div className="container-custom text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Partner with Hacvent</h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Complete this simple {totalSteps}-step form to join our contractor network
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === currentStep
                      ? 'bg-white text-secondary scale-110'
                      : step < currentStep
                      ? 'bg-white/80 text-secondary'
                      : 'bg-white/30 text-white'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 2 && (
                  <div className={`w-12 h-1 mx-1 ${step < currentStep ? 'bg-white/80' : 'bg-white/30'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentStep === 1 && 'Company Details'}
                    {currentStep === 2 && 'Contact Information'}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">Step {currentStep} of {totalSteps}</p>
                </div>
                <div className="text-sm font-semibold text-secondary">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 md:p-6">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-800">
                  <p className="font-semibold mb-1">✗ Error</p>
                  <p>{error}</p>
                </div>
              )}

              {/* Step 1: Company Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="label">Company Name *</label>
                    <input
                      name="company_name"
                      value={form.company_name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Great Lakes Comfort Systems"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">License Number *</label>
                    <input
                      name="license_number"
                      value={form.license_number}
                      onChange={handleChange}
                      className="input"
                      placeholder="MI-HVAC-2026-001"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be active and approved for Michigan rebate programs
                    </p>
                  </div>
                  <div>
                    <label className="label">Service Areas (Counties) *</label>
                    <textarea
                      name="service_areas"
                      value={form.service_areas}
                      onChange={handleChange}
                      className="input min-h-[100px] resize-none"
                      placeholder="Wayne, Oakland, Macomb, Washtenaw"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      List the Michigan counties you service, separated by commas
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="label">Primary Contact Name *</label>
                    <input
                      name="contact_name"
                      value={form.contact_name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Tom Anderson"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="tom@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="(313) 555-0101"
                      required
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Application Review Process</h4>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>We'll verify your license against the Michigan state rebates portal</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>If already approved for rebate programs, you'll get instant access</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>If not approved, we'll handle the approval process for you (may include approval fee)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary py-3 px-6 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 btn-secondary py-3"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                By submitting, you agree to our terms and conditions.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
