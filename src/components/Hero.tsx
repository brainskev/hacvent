'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary py-20 md:py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in">
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <p className="text-sm font-semibold">💰 Rebate amounts vary by location and program eligibility</p>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Get Approved for Energy-Efficient HVAC Rebates Easily
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90">
              We help homeowners navigate rebate programs seamlessly, free of charge. Maximize your energy savings with verified contractors and simplified rebate applications.
            </p>
            
            {/* Key Features */}
            <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg">Verified HVAC contractors nationwide</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg">Simplified rebate claim process</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg">Track your rebate status in real-time</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/eligibility-check" className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center group touch-manipulation text-sm sm:text-base">
                Check Your Eligibility
                <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contractor-onboarding" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 text-center touch-manipulation text-sm sm:text-base">
                Join Our Contractor Network
              </Link>
            </div>
          </div>

          {/* Right Content - Image Section */}
          <div className="relative animate-slide-up">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl overflow-hidden">
              {/* HVAC Professional Image */}
              <div className="relative aspect-square bg-gradient-to-br from-white/20 to-white/5 rounded-xl overflow-hidden mb-6">
                <Image
                  src="/Professinal-HVAC-installation.jpg"
                  alt="Professional HVAC technician installing energy-efficient heating and cooling system"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.opacity = '0'
                  }}
                />
                {/* Fallback gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white/80 text-sm font-semibold">Professional HVAC Installation</p>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
                  <div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
                  <div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
                  <div className="text-2xl sm:text-3xl font-bold text-white">10K+</div>
                  <div className="text-xs sm:text-sm text-white/80">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
