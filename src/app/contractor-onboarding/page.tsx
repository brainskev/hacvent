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
  const [form, setForm] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Validate all fields
    if (!form.company_name || !form.contact_name || !form.email || !form.phone || !form.license_number || !form.service_areas) {
      setError('Please complete all required fields')
      setSubmitting(false)
      return
    }

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
            Join our contractor network and get matched with qualified homeowners seeking HVAC upgrades
          </p>
          <div className="mt-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 max-w-lg mx-auto">
            <p className="text-sm font-semibold text-white">💼 Connect with customers eligible for $8K–$14K in rebates</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Contractor Application</h2>
              <p className="text-gray-600 mt-1 text-sm">Complete all fields below to join our network</p>
            </div>

            {/* Form Body */}
            <div className="p-5 md:p-6">
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-800">
                  <p className="font-semibold mb-1">✗ Error</p>
                  <p>{error}</p>
                </div>
              )}

              {/* All Fields in One View */}
              <div className="space-y-5">
                {/* Company Information Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-sm">1</span>
                    Company Information
                  </h3>
                  <div className="space-y-4">
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
                        className="input min-h-[80px] resize-none"
                        placeholder="Wayne, Oakland, Macomb, Washtenaw"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        List the Michigan counties you service, separated by commas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-sm">2</span>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 text-sm">Application Review Process</h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">1.</span>
                      <span>We confirm your status with applicable energy-efficiency and rebate programs.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2.</span>
                      <span>If already approved for rebate programs, you'll start receiving qualified customer matches immediately.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>If not approved, we'll handle the approval process for you (we charge a small $50 fee).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full btn-secondary py-3 text-base font-semibold"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
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
