'use client'

import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { CheckCircle, MapPin, Phone, Mail, Briefcase } from 'lucide-react'

interface Contractor {
  _id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  service_areas: string[]
  total_projects_completed: number
  onboarding_date: string
}

export default function ContractorListDemo() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchContractors()
  }, [])

  const fetchContractors = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/contractors?approved=true')
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch contractors')
      
      setContractors(data.contractors || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredContractors = contractors.filter(c => 
    filter === '' || 
    c.company_name.toLowerCase().includes(filter.toLowerCase()) ||
    c.service_areas.some(area => area.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-primary py-12 md:py-14">
        <div className="container-custom text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Approved Contractors</h1>
          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
            Licensed and approved HVAC contractors ready to help you with your energy-efficient upgrades
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="container-custom py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          {/* Search/Filter */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by company name or service area..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input max-w-md"
            />
            <p className="text-sm text-gray-500 mt-2">
              Showing {filteredContractors.length} of {contractors.length} approved contractors
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading contractors...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-800 font-semibold">Error loading contractors</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredContractors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {filter ? 'No contractors match your search' : 'No approved contractors found'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {filter ? 'Try adjusting your search terms' : 'Check back soon as we onboard new contractors'}
              </p>
            </div>
          )}

          {/* Contractors Grid */}
          {!loading && !error && filteredContractors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContractors.map((contractor) => (
                <div
                  key={contractor._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {contractor.company_name}
                      </h3>
                      <p className="text-sm text-gray-600">{contractor.contact_name}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${contractor.phone}`} className="hover:text-primary">
                        {contractor.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${contractor.email}`} className="hover:text-primary truncate">
                        {contractor.email}
                      </a>
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Service Areas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contractor.service_areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {contractor.total_projects_completed}
                      </span>
                      <span>completed projects</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          {!loading && !error && contractors.length > 0 && (
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Want to work with these contractors?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Complete our eligibility check to get matched with qualified contractors in your area
              </p>
              <a
                href="/eligibility-check"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Check Your Eligibility
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
