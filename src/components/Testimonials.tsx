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
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner, Michigan',
      text: 'Hacvent made the rebate process so simple. I saved over $4,500 on my new HVAC system and everything was handled for me. Highly recommend!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'HVAC Contractor, Ohio',
      text: 'As a contractor, I love how Hacvent streamlines rebate documentation. My customers are happier and we close deals faster. Best partnership we\'ve made.',
      rating: 5
    },
    {
      name: 'Patricia Rodriguez',
      role: 'Homeowner, Wisconsin',
      text: 'I was intimidated by the rebate application process, but Hacvent\'s team guided me every step. Got approved in just 8 weeks!',
      rating: 5
    },
    {
      name: 'James Park',
      role: 'Energy Auditor, Illinois',
      text: 'Hacvent connects homeowners with the best rebate opportunities. Their platform is intuitive and their support team is fantastic.',
      rating: 5
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Trusted by Thousands of Homeowners & Contractors
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See what real customers say about their experience with Hacvent.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                <div className="text-xs text-gray-500">Certified</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">Federal Tax Credits</div>
                <div className="text-xs text-gray-500">Approved</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">State Programs</div>
                <div className="text-xs text-gray-500">50+ States</div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="font-semibold text-gray-600 text-center">
                <div className="text-sm font-bold">Utility Rebates</div>
                <div className="text-xs text-gray-500">5000+ Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
