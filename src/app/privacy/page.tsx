import React from 'react'
import Layout from '@/components/Layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: February 20, 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Hacvent is operated by Marxma LLC. This Privacy Policy explains how we collect, use,
              and protect your information when you use hacvent.com and related services.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Information We Collect</h2>
              <p>
                We collect information you provide directly, such as your name, email address, phone number,
                address, and details about your HVAC project. We also collect technical data such as IP address,
                browser type, and usage data to improve the site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Use Information</h2>
              <p>
                We use your information to provide eligibility checks, connect you with contractors, manage
                documentation, communicate about your application, and improve our services. We may also use
                data for analytics and compliance.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sharing of Information</h2>
              <p>
                We share information with service providers, contractors, and program administrators only as
                needed to fulfill your requests. We do not sell your personal data.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cookies and Analytics</h2>
              <p>
                We use cookies and similar technologies to maintain sessions and understand site usage. You can
                control cookies through your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Choices</h2>
              <p>
                You can request access, corrections, or deletion of your data by contacting us at
                support@hacvent.com.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact</h2>
              <p>
                Hacvent (Marxma LLC)<br />
                2055 Limestone Rd STE 200-C<br />
                Wilmington, DE 19808<br />
                support@hacvent.com<br />
                +1 (719) 530-4900
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
