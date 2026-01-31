'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is an HVAC rebate?",
    answer: "An HVAC rebate is a financial incentive offered by utility companies, government agencies, or manufacturers to encourage homeowners to upgrade to energy-efficient heating, ventilation, and air conditioning systems. These rebates can significantly reduce the upfront cost of a new HVAC system."
  },
  {
    question: "How much can I save with HVAC rebates?",
    answer: "Rebate amounts vary by location, system type, and efficiency rating, but typically range from $500 to $5,000 or more. Federal tax credits can provide additional savings of up to 30% of the system cost. Contact us to get a personalized estimate for your area."
  },
  {
    question: "Am I eligible for HVAC rebates?",
    answer: "Eligibility depends on factors including your location, current system age, new system efficiency rating (SEER, HSPF, AFUE), and income level for certain programs. Use our eligibility checker tool above to find out what rebates you qualify for."
  },
  {
    question: "How long does the rebate process take?",
    answer: "The timeline varies, but typically takes 6-12 weeks from installation to receiving your rebate. Our platform streamlines this process by helping you submit all necessary documentation correctly the first time, reducing delays."
  },
  {
    question: "Do I need to use a specific contractor?",
    answer: "Most rebate programs require installation by a licensed, certified HVAC contractor. Hacvent connects you with pre-verified contractors in your area who are familiar with rebate requirements and can ensure proper documentation."
  },
  {
    question: "What documentation do I need for rebate claims?",
    answer: "Typical requirements include: proof of purchase/invoice, installation certification, product specifications (model and serial numbers), manufacturer certification sheets, and contractor license information. Our dashboard provides a checklist specific to your rebate program."
  },
  {
    question: "Can I combine multiple rebates?",
    answer: "Yes! In many cases, you can stack federal tax credits, state rebates, utility rebates, and manufacturer rebates. Our platform helps identify all available incentives and ensures you don't miss any opportunities to maximize your savings."
  },
  {
    question: "What if my rebate application is denied?",
    answer: "We help you avoid denials by ensuring all documentation is correct before submission. If issues arise, our support team will work with you and the rebate program to resolve them. Common reasons for denial include incomplete paperwork or missed deadlines."
  }
]

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // JSON-LD Schema markup for FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions About HVAC Rebates
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about claiming your HVAC rebates and finding energy-efficient contractors.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                className="w-full px-6 md:px-8 py-4 md:py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900 text-left pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-primary">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 md:px-8 py-4 md:py-5 bg-white border-t border-gray-100"
                >
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-700 mb-4">Can't find what you're looking for?</p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Contact Our Support Team
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
