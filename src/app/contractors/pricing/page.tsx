import type { Metadata } from 'next'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { ArrowRight, ClipboardCheck, FileText, Mail, ShieldCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contractor Services & Pricing | Hacvent',
  description: 'Review Hacvent contractor referral, administrative, onboarding, and verification services and published pricing.',
  alternates: {
    canonical: 'https://hacvent.com/contractors/pricing',
  },
  openGraph: {
    title: 'Contractor Services & Pricing | Hacvent',
    description: 'Published pricing for Hacvent contractor referral and administrative services.',
    url: 'https://hacvent.com/contractors/pricing',
    type: 'website',
  },
}

const referralFees = [
  { projectValue: '$2,500-$4,499', fee: '$150' },
  { projectValue: '$4,500-$7,999', fee: '$250' },
  { projectValue: '$8,000-$14,999', fee: '$400' },
  { projectValue: '$15,000 and above', fee: '$600' },
]

const steps = [
  'Contractor reviews Hacvent\'s services and published pricing.',
  'Contractor contacts Hacvent to discuss participation and applicable service terms.',
  'Hacvent and the contractor agree on the applicable services, pricing, and fee conditions.',
  'Hacvent provides the agreed referral or administrative services.',
  'When a fee becomes due under the agreed terms, Hacvent invoices the contractor.',
  'The contractor pays Hacvent using the payment method provided with the invoice.',
]

export default function ContractorPricingPage() {
  return (
    <Layout>
      <main>
        <section className="bg-gradient-to-br from-secondary to-primary py-14 md:py-20">
          <div className="container-custom text-white">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80 mb-4">For independent HVAC contractors</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-5">Contractor Services &amp; Pricing</h1>
              <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
                Hacvent helps independent HVAC contractors connect with homeowners seeking HVAC installations and energy-efficiency improvements. We also provide administrative assistance with rebate documentation for qualifying projects.
              </p>
            </div>
          </div>
        </section>

        <section className="container-custom py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <Users className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Referral connections</h2>
                <p className="text-sm text-gray-600 leading-relaxed">Connect with potential customers seeking qualifying HVAC projects.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <FileText className="w-8 h-8 text-secondary mb-4" aria-hidden="true" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Paperwork assistance</h2>
                <p className="text-sm text-gray-600 leading-relaxed">Coordinate qualifying completed project paperwork submissions.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" aria-hidden="true" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Onboarding support</h2>
                <p className="text-sm text-gray-600 leading-relaxed">Complete contractor onboarding and verification where required.</p>
              </div>
            </div>

            <section aria-labelledby="referral-fees" className="mb-14">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Published fee schedule</p>
                <h2 id="referral-fees" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Contractor referral fees</h2>
                <p className="text-gray-600 leading-relaxed">
                  The following fees apply to qualifying referred projects, subject to the applicable contractor service agreement. All amounts are in USD.
                </p>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full min-w-[480px] text-left">
                  <caption className="sr-only">Hacvent referral fee schedule by HVAC project value</caption>
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-gray-900">HVAC project value</th>
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-gray-900">Referral fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {referralFees.map((tier) => (
                      <tr key={tier.projectValue}>
                        <td className="px-5 py-4 text-gray-700">{tier.projectValue}</td>
                        <td className="px-5 py-4 font-bold text-gray-900">{tier.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-950 leading-relaxed">
                <strong>Fee timing to confirm:</strong> The current public materials do not document whether a referral fee becomes payable when a lead is delivered, a contract is signed, or an installation is completed. The applicable contractor service agreement controls this condition, and contractors should confirm it with Hacvent before participating.
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
              <section aria-labelledby="administrative-services" className="border border-gray-200 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="administrative-services" className="text-xl font-bold text-gray-900">Administrative services</h2>
                    <p className="text-2xl font-bold text-secondary mt-2">$25 per project</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Completed project paperwork submission: <strong className="text-gray-900">$25 per project</strong>. This fee covers Hacvent&apos;s administrative assistance with qualifying completed project paperwork submissions.
                </p>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  Hacvent does not guarantee rebate eligibility, approval, or payment. The current public materials do not establish whether this fee is additional to a referral fee; confirm the relationship in the applicable service agreement.
                </p>
              </section>

              <section aria-labelledby="onboarding" className="border border-gray-200 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="onboarding" className="text-xl font-bold text-gray-900">Contractor onboarding</h2>
                    <p className="text-2xl font-bold text-primary mt-2">$50 one-time fee</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Contractor onboarding and verification: <strong className="text-gray-900">$50 one-time fee, where applicable</strong>. This fee applies only where onboarding and verification services are required.
                </p>
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  It does not mean every contractor must pay this fee. Applicability and payment conditions are confirmed before the relevant service begins.
                </p>
              </section>
            </div>

            <section aria-labelledby="how-it-works" className="mb-14">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">The contractor relationship</p>
                <h2 id="how-it-works" className="text-2xl md:text-3xl font-bold text-gray-900">How it works</h2>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">{index + 1}</span>
                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-gray-500 leading-relaxed">
                Payment arrangements are confirmed directly with Hacvent. This page does not provide a contractor payment portal or automated checkout.
              </p>
            </section>

            <section aria-labelledby="what-contractors-pay-for" className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 mb-8">
              <h2 id="what-contractors-pay-for" className="text-2xl font-bold text-gray-900 mb-4">What contractors pay for</h2>
              <p className="text-gray-600 leading-relaxed mb-5">Contractor payments compensate Hacvent for its own services:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3"><span className="text-primary font-bold" aria-hidden="true">✓</span><span>Referral services associated with qualifying HVAC projects.</span></li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold" aria-hidden="true">✓</span><span>Administrative assistance with qualifying rebate paperwork.</span></li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold" aria-hidden="true">✓</span><span>Contractor onboarding and verification, where applicable.</span></li>
              </ul>
              <p className="text-sm text-gray-500 mt-5 leading-relaxed">The applicable fee, payment trigger, and invoicing terms should be agreed upon before the contractor participates in the relevant service.</p>
            </section>

            <section aria-labelledby="does-not-collect" className="border-l-4 border-secondary bg-blue-50 p-6 md:p-8 mb-14">
              <h2 id="does-not-collect" className="text-2xl font-bold text-gray-900 mb-4">What Hacvent does not collect</h2>
              <ul className="space-y-3 text-gray-700 leading-relaxed">
                <li>Homeowners pay independent contractors directly for HVAC installation work.</li>
                <li>Rebate payments are handled according to the relevant program&apos;s rules and paid to the designated recipient.</li>
                <li>Hacvent does not use its contractor-fee payment process to collect or distribute HVAC installation payments or rebate funds on behalf of third parties.</li>
                <li>Hacvent does not guarantee rebate eligibility, approval, or payment.</li>
                <li>Hacvent is an independent business, not a government agency or rebate program administrator.</li>
              </ul>
            </section>

            <section aria-labelledby="pricing-questions" className="bg-gray-900 text-white rounded-xl p-7 md:p-10 text-center">
              <Mail className="w-9 h-9 text-primary mx-auto mb-4" aria-hidden="true" />
              <h2 id="pricing-questions" className="text-2xl md:text-3xl font-bold mb-3">Questions about pricing?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-6">
                Contact Hacvent before engaging its services so we can confirm participation, applicable fees, payment timing, and invoicing terms.
              </p>
              <a href="mailto:sales@hacvent.com" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Contact Hacvent at sales@hacvent.com
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="text-xs text-gray-400 mt-4">Hacvent contractor services are provided by Marxma LLC.</p>
            </section>

            <p className="text-center text-sm text-gray-500 mt-8">
              Ready to apply? <Link href="/contractor-onboarding" className="text-primary font-semibold hover:underline">Start contractor onboarding</Link>.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  )
}
