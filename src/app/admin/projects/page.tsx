'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Link2, Users, Wrench } from 'lucide-react'

interface MatchCandidate {
  id: string
  name: string
  location: string
  requestedAmount: number
}

interface ContractorOption {
  id: string
  name: string
  serviceArea: string
}

type ProjectStatus = 'assigned' | 'installation-in-progress' | 'inspection' | 'completed'

interface ActiveProject {
  id: string
  customer: string
  contractor: string
  status: ProjectStatus
  updatedAt: string
}

const initialCustomers: MatchCandidate[] = [
  { id: 'CUS-1018', name: 'Mia Hernandez', location: 'Lansing, MI', requestedAmount: 6200 },
  { id: 'CUS-1042', name: 'Samantha Reed', location: 'Ann Arbor, MI', requestedAmount: 7500 }
]

const initialContractors: ContractorOption[] = [
  { id: 'CON-4001', name: 'BrightSpark HVAC', serviceArea: 'Ann Arbor, MI' },
  { id: 'CON-3993', name: 'NorthPeak Heating', serviceArea: 'Lansing, MI' }
]

const initialProjects: ActiveProject[] = [
  { id: 'PRJ-3001', customer: 'Derrick Coleman', contractor: 'NorthPeak Heating', status: 'installation-in-progress', updatedAt: '2026-01-21' }
]

export default function MatchingProjectsPage() {
  const [customers, setCustomers] = useState<MatchCandidate[]>(initialCustomers)
  const [contractors] = useState<ContractorOption[]>(initialContractors)
  const [projects, setProjects] = useState<ActiveProject[]>(initialProjects)
  const [selectedContractor, setSelectedContractor] = useState<Record<string, string>>({})

  const assignContractor = (customerId: string) => {
    const contractorId = selectedContractor[customerId]
    const contractor = contractors.find((item) => item.id === contractorId)
    const customer = customers.find((item) => item.id === customerId)
    if (!contractor || !customer) return

    setProjects((prev) => [
      ...prev,
      {
        id: `PRJ-${Date.now()}`,
        customer: customer.name,
        contractor: contractor.name,
        status: 'assigned',
        updatedAt: new Date().toISOString().slice(0, 10)
      }
    ])
    setCustomers((prev) => prev.filter((item) => item.id !== customerId))
  }

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, status, updatedAt: new Date().toISOString().slice(0, 10) }
          : project
      )
    )
  }

  return (
    <AdminLayout title="Matching & Active Projects">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Matching & projects</p>
              <h1 className="text-2xl font-semibold text-gray-900">Assign contractors and track installs</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Customers ready for matching</h2>
            </div>
            <div className="mt-4 space-y-4">
              {customers.length === 0 ? (
                <p className="text-sm text-gray-500">No customers waiting for a match.</p>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.location}</p>
                        <p className="text-xs text-gray-500">Request: ${customer.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <select
                          value={selectedContractor[customer.id] || ''}
                          onChange={(event) =>
                            setSelectedContractor((prev) => ({ ...prev, [customer.id]: event.target.value }))
                          }
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="">Select contractor</option>
                          {contractors.map((contractor) => (
                            <option key={contractor.id} value={contractor.id}>
                              {contractor.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignContractor(customer.id)}
                          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                        >
                          Assign contractor
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Available contractors</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              {contractors.map((contractor) => (
                <div key={contractor.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <div>
                    <p className="font-medium text-gray-900">{contractor.name}</p>
                    <p className="text-xs text-gray-500">{contractor.serviceArea}</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">Available</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Active installations</h2>
          <div className="mt-4 space-y-3">
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500">No active installations yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{project.customer}</p>
                    <p className="text-xs text-gray-500">Contractor: {project.contractor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={project.status}
                      onChange={(event) => updateProjectStatus(project.id, event.target.value as ProjectStatus)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="installation-in-progress">Installation in progress</option>
                      <option value="inspection">Inspection</option>
                      <option value="completed">Completed</option>
                    </select>
                    <span className="text-xs text-gray-500">Updated {project.updatedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
