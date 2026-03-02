'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import AdminLayout from '@/components/AdminLayout'
import { AdminCustomersHeader } from '@/components/AdminCustomers/AdminCustomersHeader'
import { CustomersTable } from '@/components/AdminCustomers/CustomersTable'
import {
  CustomerStatus,
  CustomerRecord
} from '@/types/admin'

function AdminCustomersContent() {
  const router = useRouter()
  const { isLoaded } = useAuth()
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all')

  const normalizeStatus = (status?: string): CustomerStatus => {
    const normalized = (status || '').toLowerCase().replace(/_/g, '-')
    const statusMap: Record<string, CustomerStatus> = {
      'preliminary-eligibility': 'preliminary-eligible',
      'preliminary-eligible': 'preliminary-eligible',
      'documents-requested': 'docs-requested',
      'docs-requested': 'docs-requested',
      'documents-received': 'docs-received',
      'docs-received': 'docs-received',
      'submitted-to-program': 'state-submission-in-progress',
      'state-submission-in-progress': 'state-submission-in-progress',
      approved: 'approved',
      'contractor-matched': 'matched',
      matched: 'matched',
      'installation-in-progress': 'installation-in-progress',
      completed: 'completed'
    }
    return statusMap[normalized] || 'preliminary-eligible'
  }

  const formatDate = (value?: string) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString()
  }

  const getDisplayName = (app: any) => {
    const fullName =
      app.fullName ||
      app.customerName ||
      app.name ||
      [app.first_name, app.last_name].filter(Boolean).join(' ').trim()

    if (fullName) return fullName

    const email: string | undefined = app.email || app.customerEmail
    if (email && email.includes('@')) {
      return email.split('@')[0]
    }

    return 'Unknown Customer'
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/applications')
        if (response.status === 401 || response.status === 403) {
          router.replace('/customer-dashboard')
          return
        }
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.applications) {
            // Group applications by customer (customerId)
            const customerMap = new Map<string, any[]>()
            data.applications.forEach((app: any) => {
              const customerId = String(app.customerId || app.userId || app._id || 'unknown')
              if (!customerMap.has(customerId)) {
                customerMap.set(customerId, [])
              }
              customerMap.get(customerId)!.push(app)
            })

            // Convert to CustomerRecord format
            const customerRecords: CustomerRecord[] = Array.from(customerMap.entries()).map(([customerId, applications]) => {
              const latestApp = applications[0]
              const status = normalizeStatus(latestApp.status)
              const fullName = getDisplayName(latestApp)
              const location =
                latestApp.serviceArea ||
                [latestApp.city, latestApp.state].filter(Boolean).join(', ') ||
                latestApp.location ||
                '—'

              return {
                id: String(customerId),
                name: fullName,
                location,
                status,
                lastUpdated: formatDate(latestApp.updatedAt || latestApp.createdAt),
                actionRequired: status === 'docs-requested' || status === 'preliminary-eligible',
                documents: [],
                requiredDocuments: [],
                statusHistory: [],
                notes: [],
                emails: [],
                applications
              }
            })

            setCustomers(customerRecords)
          }
        }
        if (!response.ok) {
          console.error('Failed to fetch applications:', response.status)
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const appEmails = (customer.applications || [])
        .map((app: any) => app.email || app.customerEmail || '')
        .join(' ')

      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appEmails.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout title="Customer Intake Queue">
      <AdminCustomersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <CustomersTable
        customers={filteredCustomers}
        loading={loading}
        searchTerm={searchTerm}
        onSelectCustomer={(customer) => router.push(`/admin/customers/${encodeURIComponent(customer.id)}`)}
      />
    </AdminLayout>
  )
}

export default function AdminCustomersPage() {
  return <AdminCustomersContent />
}
