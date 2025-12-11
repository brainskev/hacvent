import React from 'react'
import Link from 'next/link'
import { Headphones, FileCheck, Users, ArrowRight } from 'lucide-react'

const CTASection: React.FC = () => {
  return (
    <section className="py-16 gradient-primary">
      <div className="container-custom">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of homeowners who have saved on their HVAC upgrades with ThermoGrid
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simple Process</h3>
            <p className="text-white/80">
              We handle the paperwork and guide you through every step of the rebate application process.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Contractors</h3>
            <p className="text-white/80">
              All our contractors are licensed, insured, and experienced with rebate-eligible installations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
            <p className="text-white/80">
              Our team is here to help you every step of the way, from eligibility to rebate approval.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link href="/signup" className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center group touch-manipulation text-sm sm:text-base">
            Create Free Account
            <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/contractor" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 text-center touch-manipulation text-sm sm:text-base">
            I'm a Contractor
          </Link>
        </div>

        <p className="text-center text-white/80 text-xs sm:text-sm mt-6 sm:mt-8 px-4">
          No credit card required • Free to get started • Trusted by 10,000+ homeowners
        </p>
      </div>
    </section>
  )
}

export default CTASection
