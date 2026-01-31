import React from 'react'
import Link from 'next/link'
import { Headphones, FileCheck, Users, ArrowRight, CheckCircle } from 'lucide-react'

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-dark via-primary to-secondary">
      <div className="container-custom">
        {/* Main CTA */}
        <div className="text-center text-white mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Start Saving on Your HVAC System Today
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            No hidden fees. No obligations. Just honest guidance to maximize your rebate potential.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/eligibility-check"
              className="bg-white text-primary hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center group text-base"
            >
              Check Eligibility Now
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contractor-onboarding"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-center text-base"
            >
              Are You a Contractor?
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Simple Process</h3>
            <p className="text-white/80">
              We handle the paperwork and guide you through every step of the rebate application process.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Verified Contractors</h3>
            <p className="text-white/80">
              All our contractors are licensed, insured, and experienced with rebate-eligible installations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Dedicated Support</h3>
            <p className="text-white/80">
              Our team is here to help you every step of the way, from eligibility to rebate approval.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-white/80 text-sm mb-6 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Free to get started
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Trusted by 10,000+ homeowners
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default CTASection
