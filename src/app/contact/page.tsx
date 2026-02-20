import React from 'react'
import Layout from '@/components/Layout'

export default function ContactPage() {
  return (
    <Layout>
      <section className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Reach out to our team for general questions, partnerships, or press inquiries.
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">General Contact</h2>
              <p>
                Email: <a className="text-primary hover:underline" href="mailto:support@hacvent.com">support@hacvent.com</a><br />
                Phone: <a className="text-primary hover:underline" href="tel:+17195304900">+1 (719) 530-4900</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Mailing Address</h2>
              <p>
                Hacvent (Marxma LLC)<br />
                2055 Limestone Rd STE 200-C<br />
                Wilmington, DE 19808
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
