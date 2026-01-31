'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { CheckCircle, Clock, FileText, Shield, DollarSign } from 'lucide-react'

export default function ContractorApplicationReceived() {
  const searchParams = useSearchParams()
  const [referenceId, setReferenceId] = useState<string>('')
  const referenceCode = useMemo(() => {
    if (!referenceId) return ''
    const suffix = referenceId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()
    return `HV-${suffix}`
  }, [referenceId])

  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get('id')
      if (id) {
        setReferenceId(id)
      }
    }
  }, [searchParams])

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-12 md:py-16">
        <div className="container-custom text-white text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-4 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Application Submitted!</h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Thank you for your interest in joining our contractor network. We're reviewing your application now.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Reference ID Card */}
          {referenceCode && (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 border-l-4 border-secondary">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">Your Application Reference Code</h2>
              <p className="text-2xl font-bold text-secondary tracking-widest font-mono">{referenceCode}</p>
              <p className="text-sm text-gray-600 mt-2">Please save this code for tracking your application status</p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Process</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">1. License Verification</h3>
                  <p className="text-gray-600 text-sm">
                    We'll verify your contractor license and credentials against the <strong>Michigan state rebates portal</strong> to confirm you're approved for rebate programs. This typically takes <strong>2-3 business days</strong>.
                  </p>
                  <p className="text-sm text-red-600 font-semibold mt-2">
                    We do not yet have your license copy — instructions to submit it will be emailed to you shortly.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">2. Background & Insurance Check</h3>
                  <p className="text-gray-600 text-sm">
                    We'll review your insurance coverage, business history, and references to ensure you meet our quality standards. We want to protect both contractors and homeowners.
                  </p>
                  <p className="text-sm text-red-600 font-semibold mt-2">
                    You’ll receive an email with instructions to provide your insurance documents.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">3. Approval & Fee Invoice</h3>
                  <p className="text-gray-600 text-sm">
                    Final approval depends on submission of your <strong>license</strong> and <strong>insurance</strong> documents. If approved, we'll send an invoice for any required approval fees. Once paid, you'll gain full access to our customer matching system and can start receiving leads immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              You will receive instructions via email to submit any missing documents. No action is required at this time.
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>State Portal Verification:</strong> Your contractor license must be active and approved for Michigan HVAC rebate programs.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>Approval Fee:</strong> If your verification is successful, you may receive an invoice for a one-time approval fee (if applicable based on state requirements).</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>Response Time:</strong> We'll notify you of our decision within 5 business days.</span>
              </li>
            </ul>
          </div>

          {/* Timeline Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Expected Timeline
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>Within 24 hours:</strong> Application receipt confirmation</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>2-3 business days:</strong> State portal verification complete</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>3-5 business days:</strong> Final approval decision</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2 flex-shrink-0">•</span>
                <span><strong>Upon approval:</strong> Instant access to customer matching system</span>
              </li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Questions About Your Application?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Our contractor relations team is available to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:contractors@hacvent.com" className="btn-secondary py-2 px-4 text-sm">
                Email Contractor Support
              </a>
              <a href="tel:+1234567890" className="btn-secondary py-2 px-4 text-sm">
                Call Us
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Monday - Friday: 8:00 AM - 7:00 PM EST
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
