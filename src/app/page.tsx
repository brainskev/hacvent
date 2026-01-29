'use client'

import React from 'react'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FAQSection />
      <CTASection />
    </Layout>
  )
}
