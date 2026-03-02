'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  image?: string
}

const Testimonials: React.FC = () => {
  // Testimonials will be added after collecting verified customer reviews
  const testimonials: Testimonial[] = []

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Partner Programs & Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We connect homeowners with rebate programs across the United States.
          </p>
        </div>

        {/* Testimonials Grid - Hidden until we have verified reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" style={{ display: 'none' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-600">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Section */}
        <div className="mt-16 md:mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted Partners & Programs
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We work with major utility companies, government programs, and manufacturers to ensure you get every dollar you deserve.
            </p>
          </div>

          {/* Partner Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 px-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">Energy Star</div>
                <div className="text-xs text-gray-500">Eligible Products</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">Federal Programs</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">State Programs</div>
                <div className="text-xs text-gray-500">Nationwide</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">Utility Rebates</div>
                <div className="text-xs text-gray-500">Multiple Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
