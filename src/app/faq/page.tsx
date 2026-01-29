'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  id: number
  category: string
  question: string
  answer: string
}

const faqDatabase: FAQItem[] = [
  // General Questions
  {
    id: 1,
    category: 'General',
    question: 'What is an HVAC rebate?',
    answer: 'An HVAC rebate is a financial incentive offered by utility companies, government agencies, or manufacturers to encourage homeowners to upgrade to energy-efficient heating, ventilation, and air conditioning systems. These rebates can significantly reduce the upfront cost of a new HVAC system, typically ranging from $500 to $5,000 or more depending on the system type and efficiency rating.'
  },
  {
    id: 2,
    category: 'General',
    question: 'What types of HVAC rebates are available?',
    answer: 'There are several types of rebates available: Federal Tax Credits (up to 30% of system cost), State Energy Rebates (varies by state), Utility Company Rebates (offered by local utilities), Manufacturer Rebates (promotional incentives), and Local Municipality Programs (city or county-specific programs). Many of these can be combined to maximize your savings.'
  },
  {
    id: 3,
    category: 'General',
    question: 'How much can I save with HVAC rebates?',
    answer: 'Savings vary significantly based on your location, system type, and efficiency rating. On average, homeowners can save between $1,000 and $8,000 when combining multiple rebates. Federal tax credits alone can provide up to 30% back on qualifying systems. High-efficiency heat pumps often qualify for the highest rebates, sometimes exceeding $10,000 when stacking federal, state, and utility incentives.'
  },
  // Eligibility
  {
    id: 4,
    category: 'Eligibility',
    question: 'Am I eligible for HVAC rebates?',
    answer: 'Eligibility depends on several factors: your geographic location, the age and condition of your current system, the efficiency rating of the new system (SEER, HSPF, AFUE ratings), your property type (residential vs commercial), and sometimes your household income for certain programs. Most programs require professional installation by a licensed contractor and specific minimum efficiency ratings.'
  },
  {
    id: 5,
    category: 'Eligibility',
    question: 'What efficiency ratings qualify for rebates?',
    answer: 'Minimum efficiency requirements vary by program, but generally: Air Conditioners need a minimum SEER rating of 15-16, Heat Pumps require SEER 15+ and HSPF 8.5+, and Furnaces need AFUE ratings of 95%+ for gas or 97%+ for oil. Federal tax credits often require higher standards, such as SEER 16+ for AC and heat pumps. Always check specific program requirements as they can vary.'
  },
  {
    id: 6,
    category: 'Eligibility',
    question: 'Do income limits apply to rebate programs?',
    answer: 'Some programs, particularly those funded by the Inflation Reduction Act, have income-based tiers. Low- to moderate-income households may qualify for higher rebate amounts or point-of-sale discounts. Federal programs typically use 80% and 150% of area median income as thresholds. However, many utility and manufacturer rebates have no income restrictions at all.'
  },
  // Application Process
  {
    id: 7,
    category: 'Application',
    question: 'How long does the rebate application process take?',
    answer: 'The timeline varies by program. Most rebates take 6-12 weeks from the date of complete application submission to receiving payment. Some utility rebates can be processed in 4-6 weeks, while federal tax credits are claimed on your annual tax return. Pre-approval programs may add 2-3 weeks before installation. Hacvent helps streamline this process by ensuring all documentation is correct from the start.'
  },
  {
    id: 8,
    category: 'Application',
    question: 'What documentation do I need for rebate claims?',
    answer: 'Required documentation typically includes: itemized purchase invoice with system model and price, product specifications sheet with efficiency ratings (SEER, HSPF, AFUE), AHRI certification certificate, contractor license and insurance information, installation certification form signed by contractor, proof of payment, property ownership verification, and sometimes photos of the installed equipment. Hacvent provides a checklist specific to your chosen rebate programs.'
  },
  {
    id: 9,
    category: 'Application',
    question: 'Can I apply for rebates after installation?',
    answer: 'Most programs require application within 30-90 days after installation, though requirements vary. Some programs require pre-approval before installation begins. It\'s crucial to check specific program deadlines before starting your project. Federal tax credits can be claimed on your tax return filed in the year following installation. Hacvent recommends identifying rebate programs and understanding their requirements before purchasing equipment.'
  },
  {
    id: 10,
    category: 'Application',
    question: 'What if my rebate application is denied?',
    answer: 'Common reasons for denial include incomplete documentation, missed deadlines, equipment not meeting efficiency requirements, or installation by uncertified contractors. If denied, you typically have 30-60 days to appeal with corrected information. Hacvent helps prevent denials by pre-checking all requirements and ensuring complete, accurate submissions. Our support team can assist with appeals if issues arise.'
  },
  // Contractors
  {
    id: 11,
    category: 'Contractors',
    question: 'Do I need to use a specific contractor?',
    answer: 'Most rebate programs require installation by a licensed, insured HVAC contractor. Some programs have additional requirements such as EPA Section 608 certification, NATE certification, or participation in specific training programs. Hacvent connects you with pre-verified contractors in your area who meet all rebate program requirements and have experience with rebate-eligible installations.'
  },
  {
    id: 12,
    category: 'Contractors',
    question: 'How do I find a qualified contractor?',
    answer: 'Hacvent maintains a network of pre-vetted, licensed, and insured HVAC contractors experienced with rebate programs. When you sign up, we match you with contractors in your area based on your project type, location, and rebate requirements. All contractors in our network have verified credentials, insurance, and positive customer reviews.'
  },
  {
    id: 13,
    category: 'Contractors',
    question: 'Will my contractor handle the rebate paperwork?',
    answer: 'Many contractors will assist with rebate paperwork, but the level of support varies. Hacvent contractors are specifically trained on rebate documentation requirements. We also provide a centralized platform where you and your contractor can collaborate on paperwork, upload documents, and track application status, ensuring nothing falls through the cracks.'
  },
  // Stacking & Combining
  {
    id: 14,
    category: 'Stacking',
    question: 'Can I combine multiple rebates?',
    answer: 'Yes! In most cases, you can "stack" federal tax credits, state rebates, utility rebates, and manufacturer incentives. This is one of the best ways to maximize savings. For example, a heat pump installation might qualify for a $2,000 federal tax credit, $1,500 state rebate, $1,000 utility rebate, and $500 manufacturer rebate, totaling $5,000 in savings. Hacvent identifies all stackable rebates available in your area.'
  },
  {
    id: 15,
    category: 'Stacking',
    question: 'Are there any restrictions on stacking rebates?',
    answer: 'While most programs allow stacking, some have restrictions. Federal tax credits can almost always be combined with other programs. Some state programs prohibit combining with certain utility rebates. Manufacturer rebates typically have no restrictions. Hacvent\'s platform automatically identifies compatible rebate combinations and flags any restrictions for your specific situation.'
  },
  // Federal Programs
  {
    id: 16,
    category: 'Federal',
    question: 'What is the federal HVAC tax credit?',
    answer: 'The Inflation Reduction Act provides a 30% tax credit (up to $2,000) for qualified HVAC systems through 2032. This includes central air conditioners, heat pumps, furnaces, and biomass stoves meeting minimum efficiency requirements. The credit covers equipment costs and installation. Unlike rebates, tax credits reduce your tax liability and are claimed on your federal tax return.'
  },
  {
    id: 17,
    category: 'Federal',
    question: 'What is the difference between a tax credit and a rebate?',
    answer: 'Tax credits reduce the amount of tax you owe to the federal government and are claimed when filing your tax return. Rebates are direct payments or checks you receive after purchase, typically from utilities, states, or manufacturers. Tax credits can sometimes result in a refund if they exceed your tax liability. Rebates are received regardless of tax situation. Both can be combined to maximize savings.'
  },
  {
    id: 18,
    category: 'Federal',
    question: 'How do I claim the federal HVAC tax credit?',
    answer: 'To claim the federal HVAC tax credit, complete IRS Form 5695 when filing your annual tax return. You\'ll need: manufacturer certification statement showing the product qualifies, itemized receipt or invoice showing system cost, and installation details. Keep all documentation for at least 7 years. Hacvent provides properly formatted documentation packages that include everything your tax preparer needs.'
  },
  // Timing & Planning
  {
    id: 19,
    category: 'Timing',
    question: 'When is the best time to apply for HVAC rebates?',
    answer: 'The best time depends on your situation. Many programs operate on a fiscal year (October-September) and may run out of funds. Spring and fall are often less busy installation seasons, potentially offering better contractor availability and prices. However, don\'t wait too long - apply for rebates immediately after installation while documentation is fresh. Some programs have specific application windows, so check deadlines first.'
  },
  {
    id: 20,
    category: 'Timing',
    question: 'Are HVAC rebates available year-round?',
    answer: 'Most rebate programs operate year-round, but availability can change. Some programs have annual funding caps and close once funds are exhausted (often by late summer). Federal tax credits are available through 2032. Manufacturer rebates are promotional and may be seasonal. Utility programs typically run continuously but may adjust amounts periodically. Hacvent tracks program availability in real-time and alerts you to time-sensitive opportunities.'
  },
  // Hacvent Specific
  {
    id: 21,
    category: 'Hacvent',
    question: 'How does Hacvent help with rebates?',
    answer: 'Hacvent simplifies the entire rebate process: we identify all rebates you qualify for in your area, match you with certified contractors experienced in rebate installations, provide document checklists and templates, offer a centralized dashboard to upload and track all paperwork, submit applications on your behalf when possible, and provide status tracking and support throughout the approval process. Our goal is to maximize your savings while minimizing hassle.'
  },
  {
    id: 22,
    category: 'Hacvent',
    question: 'Is Hacvent free to use?',
    answer: 'Yes! Hacvent is free for homeowners. There are no fees to create an account, check eligibility, or use our contractor matching service. We earn a small fee from contractors in our network and some rebate program administrators. For homeowners, our service is completely free - we make money only when you successfully complete a project.'
  },
  {
    id: 23,
    category: 'Hacvent',
    question: 'How do I get started with Hacvent?',
    answer: 'Getting started is easy: 1) Create a free account, 2) Use our eligibility checker to enter your ZIP code and basic home information, 3) Review available rebates and estimated savings, 4) Get matched with qualified contractors in your area, 5) Choose your contractor and schedule installation, 6) Upload required documents to your dashboard, 7) We help submit your rebate applications, 8) Track approval status and receive your rebates. The entire process is guided with clear next steps at each stage.'
  }
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [openId, setOpenId] = useState<number | null>(null)

  const categories = ['All', 'General', 'Eligibility', 'Application', 'Contractors', 'Stacking', 'Federal', 'Timing', 'Hacvent']

  const filteredFAQs = faqDatabase.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="container-custom text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Everything you need to know about HVAC rebates and Hacvent
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary/10 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No questions found matching your search. Try different keywords.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="card cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <button
                      className="flex-shrink-0 text-primary hover:text-primary-dark transition-colors"
                      aria-label={openId === faq.id ? "Collapse" : "Expand"}
                    >
                      {openId === faq.id ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  
                  {openId === faq.id && (
                    <div className="mt-4 text-gray-700 leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Our support team is here to help you with any questions about HVAC rebates or using Hacvent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@hacvent.com" className="btn-primary">
                Email Support
              </a>
              <a href="tel:+18005551234" className="btn-outline">
                Call Us: 1-800-555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
