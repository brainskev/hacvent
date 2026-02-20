'use client'

import React from 'react'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Benefits from '@/components/Benefits'
import Testimonials from '@/components/Testimonials'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'

// Organization Schema for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Hacvent',
  'url': 'https://hacvent.com',
  'logo': '/hacvent-logo.svg',
  'description': 'Connect with certified HVAC contractors and maximize your energy-efficient rebate programs across 50+ states. By Marxma LLC.',
  'sameAs': [
    'https://facebook.com/hacvent',
    'https://twitter.com/hacvent',
    'https://linkedin.com/company/hacvent'
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Customer Support',
    'telephone': '+1-719-530-4900',
    'email': 'support@hacvent.com'
  },
  'areaServed': 'US',
  'serviceType': 'HVAC Rebate Service'
}

// Service Schema for SEO
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': 'HVAC Rebate Assistance',
  'description': 'We help homeowners maximize their HVAC rebates and connect with verified contractors.',
  'provider': {
    '@type': 'Organization',
    'name': 'Hacvent',
    'parentOrganization': 'Marxma LLC'
  },
  'areaServed': 'US',
  'serviceType': 'Energy Rebate Service'
}

export default function Home() {
  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Layout>
        <Hero />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </Layout>
    </>
  )
}
