'use client'

import React from 'react'
import { DollarSign, Clock, Headphones, TrendingUp } from 'lucide-react'

interface BenefitCard {
  title: string
  description: string
  icon: React.ReactNode
  highlight?: string
}

const Benefits: React.FC = () => {
  const benefits: BenefitCard[] = [
    {
      title: 'Maximize Your Rebates',
      description: 'We identify all available federal, state, and utility rebates you qualify for. Stack multiple incentives to save $5,000+.',
      icon: <DollarSign className="w-12 h-12" />,
      highlight: 'Save up to $5,000+'
    },
    {
      title: 'Save Time & Energy',
      description: 'No more chasing paperwork. Our platform handles document management and submission so you can focus on your installation.',
      icon: <Clock className="w-12 h-12" />,
      highlight: 'Reduce approval time'
    },
    {
      title: 'Free Expert Guidance',
      description: 'Access to HVAC specialists and rebate program experts. Get answers to all your questions at no cost.',
      icon: <Headphones className="w-12 h-12" />,
      highlight: 'Expert support included'
    },
    {
      title: 'Guaranteed Results',
      description: 'Our verification process ensures accurate submissions, reducing denial rates and getting you paid faster.',
      icon: <TrendingUp className="w-12 h-12" />,
      highlight: '99% approval rate'
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Why Choose Hacvent for Your Rebate
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We simplify the entire HVAC rebate process so you get approved faster and save more money.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
            >
              {/* Accent Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon */}
              <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Highlight Badge */}
              {benefit.highlight && (
                <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {benefit.highlight}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-gray-200">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">$50M+</div>
            <p className="text-gray-600">Rebates Claimed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99%</div>
            <p className="text-gray-600">Approval Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-gray-600">State Programs</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Benefits
