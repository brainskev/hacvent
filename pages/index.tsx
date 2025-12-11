import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import FAQSection from '@/components/FAQSection'
import EligibilityChecker from '@/components/EligibilityChecker'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Head>
        <title>ThermoGrid - Claim Your HVAC Rebates Easily Across the US</title>
        <meta name="description" content="Connect with certified HVAC contractors and simplify your rebate claims. Get expert support for energy-efficient upgrades nationwide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Layout>
        <Hero />
        <EligibilityChecker />
        <FAQSection />
        <CTASection />
      </Layout>
    </>
  )
}
