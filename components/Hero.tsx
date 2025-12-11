import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, CheckCircle } from 'lucide-react'

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Claim Your HVAC Rebates Easily Across the US
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90">
              Connect with certified contractors and maximize your energy savings through streamlined rebate applications.
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
              <Link href="/signup" className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center group touch-manipulation text-sm sm:text-base">
                Get Started
                <ArrowRight className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/faq" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 text-center touch-manipulation text-sm sm:text-base">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="relative animate-slide-up">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Placeholder for HVAC/Energy images */}
              <div className="aspect-square bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-32 h-32 text-white/50" />
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                  <div className="text-2xl sm:text-3xl font-bold text-white">$5K+</div>
                  <div className="text-xs sm:text-sm text-white/80">Avg. Rebate</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
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
