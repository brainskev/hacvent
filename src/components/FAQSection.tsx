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
    answer: "Most rebate programs require installation by a licensed, certified HVAC contractor. ThermoGrid connects you with pre-verified contractors in your area who are familiar with rebate requirements and can ensure proper documentation."
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

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Most Asked Questions About HVAC Rebates</h2>
          <p className="section-subtitle">
            Get answers to common questions about claiming your HVAC rebates
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="card cursor-pointer" onClick={() => toggleFAQ(index)}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <button
                  className="flex-shrink-0 text-primary hover:text-primary-dark transition-colors"
                  aria-label={openIndex === index ? "Collapse" : "Expand"}
                >
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>
              </div>
              
              {openIndex === index && (
                <div className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="/faq" className="btn-primary inline-block">
            View All FAQs
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
