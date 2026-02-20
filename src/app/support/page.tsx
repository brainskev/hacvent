import React from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <Layout>
      <section className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Support Center</h1>
          <p className="text-gray-600 mb-8">
            Need help with eligibility, your application, or your dashboard? We are here to assist.
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h2>
              <p>
                Email: <a className="text-primary hover:underline" href="mailto:support@hacvent.com">support@hacvent.com</a><br />
                Phone: <a className="text-primary hover:underline" href="tel:+17195304900">+1 (719) 530-4900</a><br />
                Address: 2055 Limestone Rd STE 200-C, Wilmington, DE 19808
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Common Topics</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Eligibility checks and required documentation</li>
                <li>Application status and timelines</li>
                <li>Contractor matching and onboarding</li>
                <li>Account access and dashboard issues</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Self-Serve Resources</h2>
              <p>
                Visit our <Link className="text-primary hover:underline" href="/faq">FAQ page</Link> for quick answers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
