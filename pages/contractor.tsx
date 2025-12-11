import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { Building2, FileCheck, Users, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function ContractorPortal() {
  // TODO: Replace with actual authentication check
  const contractor = {
    name: 'Cool Breeze HVAC Solutions',
    verified: false,
    pendingVerification: true
  }

  return (
    <>
      <Head>
        <title>Contractor Portal - ThermoGrid</title>
        <meta name="description" content="Join ThermoGrid's network of certified HVAC contractors" />
      </Head>
      
      <Layout>
        {/* Hero Section for Contractors */}
        <section className="bg-gradient-to-br from-secondary-dark via-secondary to-primary py-16">
          <div className="container-custom text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Grow Your HVAC Business with ThermoGrid
            </h1>
            <p className="text-xl mb-6 text-white/90">
              Connect with customers seeking energy-efficient upgrades and rebate-qualified installations
            </p>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Benefits Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Join ThermoGrid?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Qualified Leads</h3>
                <p className="text-gray-600">
                  Connect with homeowners actively seeking HVAC upgrades and rebate-eligible installations
                </p>
              </div>

              <div className="card text-center">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Streamlined Process</h3>
                <p className="text-gray-600">
                  Simplified rebate documentation and application process saves you time and reduces errors
                </p>
              </div>

              <div className="card text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Grow Revenue</h3>
                <p className="text-gray-600">
                  Access additional revenue through rebate certification services and premium job matching
                </p>
              </div>
            </div>
          </div>

          {/* Verification Status / Sign Up */}
          <div className="max-w-4xl mx-auto">
            {contractor.verified ? (
              /* Verified Contractor Dashboard */
              <ContractorDashboard />
            ) : contractor.pendingVerification ? (
              /* Pending Verification */
              <div className="card bg-yellow-50 border-2 border-yellow-300">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Verification in Progress
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Thank you for submitting your application! Our team is reviewing your documentation.
                      This typically takes 3-5 business days.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Business license submitted</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Insurance documents submitted</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-gray-700">Awaiting EPA certification verification</span>
                      </div>
                    </div>
                    <button className="btn-outline">
                      View Application Status
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Sign Up Form */
              <ContractorSignUpForm />
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

// Contractor Sign-Up Form Component
const ContractorSignUpForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with API
    alert('Application submitted! You will receive a confirmation email shortly.')
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Join Our Contractor Network
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input type="text" required className="input-field" placeholder="Your Company Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License Number *
              </label>
              <input type="text" required className="input-field" placeholder="License #" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input type="text" required className="input-field" placeholder="Primary Contact" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input type="tel" required className="input-field" placeholder="(555) 123-4567" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input type="email" required className="input-field" placeholder="contact@company.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area (Cities/Zip Codes) *
              </label>
              <textarea required className="input-field" rows={3} placeholder="e.g., San Francisco, Oakland, San Jose"></textarea>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Certifications & Specialties
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-gray-700">EPA Section 608 Certified</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-gray-700">NATE Certified</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-gray-700">Heat Pump Specialist</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-primary" />
              <span className="text-gray-700">Rebate Program Experience</span>
            </label>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Required Documents
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License (PDF)
              </label>
              <input type="file" accept=".pdf" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Certificate (PDF)
              </label>
              <input type="file" accept=".pdf" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                EPA/NATE Certifications (PDF)
              </label>
              <input type="file" accept=".pdf" className="input-field" />
            </div>
          </div>
        </div>

        {/* Rebate Certification Option */}
        <div className="card bg-primary/5 border-2 border-primary/30">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Become a Rebate-Certified Contractor
          </h3>
          <p className="text-gray-700 mb-4">
            Get priority access to rebate-eligible jobs and additional training. One-time certification fee: $299
          </p>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5 text-primary" />
            <span className="font-medium text-gray-900">Yes, I want to become rebate-certified</span>
          </label>
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" required className="w-4 h-4 text-primary mt-1" />
            <span className="text-sm text-gray-700">
              I agree to ThermoGrid's Terms of Service and acknowledge that all information provided is accurate *
            </span>
          </label>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  )
}

// Contractor Dashboard Component
const ContractorDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="text-3xl font-bold mb-2">12</div>
          <div className="text-white/90">Active Jobs</div>
        </div>
        <div className="card bg-gradient-to-br from-secondary to-secondary-dark text-white">
          <div className="text-3xl font-bold mb-2">48</div>
          <div className="text-white/90">Completed</div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl font-bold mb-2">4.9</div>
          <div className="text-white/90">Rating</div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-3xl font-bold mb-2">5</div>
          <div className="text-white/90">New Leads</div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Installation Orders</h2>
        {/* TODO: Map through actual jobs from API */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Heat Pump Installation</h3>
                <p className="text-gray-600">San Francisco, CA 94105</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                $3,500 Rebate Eligible
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-4">
              Residential property seeking central heat pump installation. Customer pre-approved for federal and state rebates.
            </p>
            <button className="btn-primary text-sm py-2">
              View Details & Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
