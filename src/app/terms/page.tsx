import React from 'react'
import Layout from '@/components/Layout'

export default function TermsPage() {
  return (
    <Layout>
      <section className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-6">Last updated: February 20, 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              These Terms govern your use of hacvent.com and related services operated by Marxma LLC.
              By using our site, you agree to these Terms.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Description</h2>
              <p>
                Hacvent provides tools to help homeowners identify rebate programs, connect with contractors,
                and manage documentation. We are not a government agency and do not provide legal or tax advice.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Eligibility and Results</h2>
              <p>
                Rebate amounts and timelines vary by program and location. We do not guarantee approvals or
                specific savings. You are responsible for verifying program requirements.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">User Responsibilities</h2>
              <p>
                You agree to provide accurate information and to use the service lawfully. You are responsible
                for any communications with contractors and program administrators.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Services</h2>
              <p>
                We may link to or integrate with third-party services. Their terms and policies apply to their
                services and we are not responsible for their actions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Marxma LLC is not liable for indirect, incidental, or
                consequential damages arising from your use of the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
              <p>
                Questions about these Terms can be sent to support@hacvent.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
