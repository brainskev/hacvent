'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Layout from '@/components/Layout'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

type FormState = {
  name: string
  phone: string
  email: string
  property_address: string
  property_type: string
  project_size: string
  hvac_type: string
  preferred_contact_method: string
}

const initialState: FormState = {
  name: '',
  phone: '',
  email: '',
  property_address: '',
  property_type: 'single_family',
  project_size: 'medium',
  hvac_type: 'heat_pump',
  preferred_contact_method: 'email',
}

export default function CustomerIntake() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn, userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stepChangeTimeRef = React.useRef<number>(0)
  const isNewProject = searchParams?.get('new') === 'true'

  const totalSteps = 3

  const getIntakeStorageKey = (id: string) => `intakeCompleted:${id}`
  const getIntakeDraftKey = (id: string) => `intakeDraft:${id}`

  // Check authentication
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to sign-up if not authenticated
      router.push('/sign-up?redirect_url=/customer-intake')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    if (typeof window === 'undefined') return

    // Only redirect if not explicitly starting a new project
    if (!isNewProject) {
      const completed = window.localStorage.getItem(getIntakeStorageKey(userId))
      if (completed) {
        router.push('/customer-dashboard')
      }
    }
  }, [isLoaded, isSignedIn, userId, router, isNewProject])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return
    if (typeof window === 'undefined') return

    const draftKey = getIntakeDraftKey(userId)
    window.localStorage.removeItem(draftKey)

    return () => {
      window.localStorage.removeItem(draftKey)
    }
  }, [isLoaded, isSignedIn, userId])

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <Layout>
        <div className="container-custom py-14 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    )
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from submitting the form while editing fields
    if (e.key === 'Enter' && currentStep < totalSteps) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleNext = () => {
    setError(null)
    // Validate current step before moving forward
    if (currentStep === 1) {
      if (!form.name || !form.email || !form.phone) {
        setError('Please fill in all contact information')
        return
      }
    } else if (currentStep === 2) {
      if (!form.property_address || !form.property_type || !form.project_size) {
        setError('Please complete all property information')
        return
      }
    }
    // Track when we change steps to ignore auto-submit events
    stepChangeTimeRef.current = Date.now()
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handleBack = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // Ignore submit events that fire within 100ms of a step change (likely accidental)
    const timeSinceStepChange = Date.now() - stepChangeTimeRef.current
    if (timeSinceStepChange < 100) {
      e.preventDefault()
      return
    }
    
    e.preventDefault()
    
    // Only allow submission on the final step
    if (currentStep !== totalSteps) {
      return
    }
    
    setError(null)
    
    // Validate step 3 before submission
    if (!form.hvac_type) {
      setError('Please select an HVAC system type')
      return
    }
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      if (typeof window !== 'undefined' && userId) {
        window.localStorage.setItem(getIntakeStorageKey(userId), 'true')
      }
      // Redirect to success page with reference ID
      router.push(`/application-received?id=${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-12 md:py-14">
        <div className="container-custom text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Start Your HVAC Rebate Project</h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Complete this simple {totalSteps}-step form to get started
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === currentStep
                      ? 'bg-white text-primary scale-110'
                      : step < currentStep
                      ? 'bg-white/80 text-primary'
                      : 'bg-white/30 text-white'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
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
          <form 
            onSubmit={handleSubmit} 
            onKeyDown={handleKeyDown}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentStep === 1 && 'Contact Information'}
                    {currentStep === 2 && 'Property Details'}
                    {currentStep === 3 && 'Project Information'}
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">Step {currentStep} of {totalSteps}</p>
                </div>
                <div className="text-sm font-semibold text-primary">
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

              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Jane Doe"
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
                      placeholder="you@example.com"
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
                      placeholder="(313) 555-1234"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Preferred Contact Method *</label>
                    <select
                      name="preferred_contact_method"
                      value={form.preferred_contact_method}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="sms">SMS/Text</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Property Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="label">Property Address *</label>
                    <textarea
                      name="property_address"
                      value={form.property_address}
                      onChange={handleChange}
                      className="input min-h-[100px] resize-none"
                      placeholder="123 Main Street, Detroit, MI 48201"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Include street address, city, state, and ZIP code</p>
                  </div>
                  <div>
                    <label className="label">Property Type *</label>
                    <select
                      name="property_type"
                      value={form.property_type}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="single_family">Single Family Home</option>
                      <option value="multi_family">Multi-Family</option>
                      <option value="condo">Condo</option>
                      <option value="mobile_home">Mobile Home</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Project Size *</label>
                    <select
                      name="project_size"
                      value={form.project_size}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="small">Small (Single Room/Area)</option>
                      <option value="medium">Medium (Multiple Rooms)</option>
                      <option value="large">Large (Whole House)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: HVAC Details */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="label">HVAC System Type *</label>
                    <select
                      name="hvac_type"
                      value={form.hvac_type}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="heat_pump">Heat Pump</option>
                      <option value="central_ac">Central Air Conditioning</option>
                      <option value="furnace">Furnace</option>
                      <option value="boiler">Boiler</option>
                      <option value="ductless">Ductless Mini-Split</option>
                    </select>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Before You Submit</h4>
                    <p className="text-blue-800 text-sm mb-2">
                      After submitting, we'll need some additional information to apply for rebates on your behalf:
                    </p>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Proof of income (for income-based rebates)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Property ownership documentation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Current utility bills</span>
                      </li>
                    </ul>
                    <p className="text-blue-800 text-sm mt-3 font-semibold">
                      Once you qualify, we'll match you with approved contractors.
                    </p>
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
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                By submitting, you agree to be contacted about your project and rebate eligibility.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
