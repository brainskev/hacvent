'use client'

import React from 'react'
import { CheckCircle, FileCheck, Zap, Wrench } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ReactNode
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Eligibility Check',
      description: 'Answer a few simple questions about your home and current HVAC system to instantly see what rebates you qualify for in your area.',
      icon: <CheckCircle className="w-12 h-12" />
    },
    {
      number: 2,
      title: 'Document Submission',
      description: 'Upload required documents securely through our dashboard. We guide you on exactly what is needed for your specific rebate programs.',
      icon: <FileCheck className="w-12 h-12" />
    },
    {
      number: 3,
      title: 'Approval & Contractor Matching',
      description: 'Our platform matches you with certified, verified HVAC contractors in your area who are familiar with rebate requirements.',
      icon: <Zap className="w-12 h-12" />
    },
    {
      number: 4,
      title: 'Installation & Completion',
      description: 'Work with your contractor to complete the installation. We handle rebate submission and track your application status in real-time.',
      icon: <Wrench className="w-12 h-12" />
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How Our Rebate Process Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Get your HVAC rebates approved in four simple steps. Our streamlined process removes the complexity and confusion.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector Line (hidden on mobile) */}
              {step.number < steps.length && (
                <div className="hidden lg:block absolute top-16 left-[calc(100%+0px)] w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {/* Card */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                {/* Icon */}
                <div className="text-primary mb-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to start your rebate journey?
          </p>
          <a
            href="/eligibility-check"
            className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Start Your Free Eligibility Check
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
