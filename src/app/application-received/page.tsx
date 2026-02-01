'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Layout from '@/components/Layout'
import { CheckCircle, ArrowRight, FileText, Clock, AlertCircle, Home, Mail } from 'lucide-react'

function ApplicationReceivedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()
  const [referenceId, setReferenceId] = useState<string>('')
  const [shortReference, setShortReference] = useState<string>('')

  const createShortReference = (id: string) => {
    const hex = id.replace(/[^a-f0-9]/gi, '')
    const last = hex.slice(-10) || '0'
    const num = Number.parseInt(last, 16)
    const code = Number.isFinite(num)
      ? num.toString(36).toUpperCase().padStart(6, '0').slice(-6)
      : '000000'
    return `TG-${code}`
  }

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) {
      setReferenceId(id)
      setShortReference(createShortReference(id))
    }
  }, [searchParams])

  const handleGoToDashboard = () => {
    router.push('/customer-dashboard')
  }

  const handleUploadDocuments = () => {
    // Redirect to dashboard and auto-scroll to documents section
    router.push('/customer-dashboard?section=documents')
  }

  return (
    <>
      {/* Success Banner */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-10 md:py-14">
        <div className="container-custom text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse"></div>
              <CheckCircle className="relative w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Received!</h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Your information has been submitted successfully. We're ready to start your rebate journey!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Next Steps Overview */}
            <div className="md:col-span-2 space-y-6">
              {/* Primary CTA Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white shadow-lg">
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-6">
                  <p className="text-2xl font-bold text-white mb-2">🎉 Up to $8,000–$14,000 in Rebates!</p>
                  <p className="text-sm text-white/95">State-administered income-qualified rebates (HEEHRA) for electric HVAC systems can provide substantial savings. Combined with local utility rebates, your total savings could be even higher!</p>
                </div>
                <h2 className="text-2xl font-bold mb-3">What's Next?</h2>
                <p className="text-white/90 mb-6">
                  Your application is in our queue. <strong>To claim these rebates and move forward, we need supporting documents to verify your eligibility.</strong> Don't leave money on the table!
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Upload Required Documents</p>
                      <p className="text-sm text-white/80">Income and property documents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">We Verify Eligibility</p>
                      <p className="text-sm text-white/80">Our team reviews your documents and checks eligibility (24-48 hours)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Get Matched with Contractors</p>
                      <p className="text-sm text-white/80">If eligible,we connect you with certified installers in your area</p>
                    </div>
                  </div>
                </div>

                {isSignedIn && (
                  <button
                    onClick={handleUploadDocuments}
                    className="w-full bg-white text-primary hover:bg-gray-50 font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    Upload Documents Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {/* Reference ID Card */}
              {referenceId && (
                <div className="bg-white rounded-xl border-2 border-emerald-200 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Your Reference Code</h3>
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mb-4">
                    <p className="text-3xl font-bold text-emerald-700 tracking-widest font-mono">
                      {shortReference}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Full ID: {referenceId}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Save this code - you'll need it to reference your application in your dashboard and when contacting support.
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Expected Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1.5"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Today - Next Step</p>
                      <p className="text-xs text-gray-600">Upload documents to your dashboard</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mt-1.5"></div>
                      <div className="w-0.5 h-12 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">24-48 Hours</p>
                      <p className="text-xs text-gray-600">We verify your eligibility and documents</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mt-1.5"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">2-3 Business Days</p>
                      <p className="text-xs text-gray-600">Contractors are matched and reach out to you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Quick Info */}
            <div className="space-y-4">
              {/* Required Documents */}
              <div className="bg-blue-50 rounded-xl border-2 border-blue-300 p-4 shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents Needed 🔒
                </h4>
                <p className="text-xs text-blue-800 font-semibold mb-3">⚠️ Required to claim $8,000–$14,000 in rebates</p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Tax returns (last year)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Recent utility bill</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Property proof</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Current HVAC info</span>
                  </li>
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 font-medium">📌 Upload now to start your 24-48 hour verification process</p>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Have Questions?
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  Our support team is here to help guide you through the process.
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:support@hacvent.com"
                    className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                  <p className="text-xs text-amber-600">
                    Response within 2 hours during business hours
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Pro Tip
                </h4>
                <p className="text-sm text-gray-600">
                  Complete your dashboard profile for faster processing and better contractor matches.
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
            <p className="text-sm">
              🔒 Your information is secure. We use enterprise-grade encryption and never share your data without permission.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ApplicationReceived() {
  return (
    <Layout>
      <Suspense fallback={<div className="container-custom py-10 md:py-14" />}> 
        <ApplicationReceivedContent />
      </Suspense>
    </Layout>
  )
}
