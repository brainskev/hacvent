'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { AdminCustomersHeader } from '@/components/AdminCustomers/AdminCustomersHeader'
import { CustomersTable } from '@/components/AdminCustomers/CustomersTable'
import {
  CustomerStatus,
  CustomerRecord,
  STATUS_LABELS
} from '@/types/admin'

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/applications')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.applications) {
            // Group applications by customer (customerId)
            const customerMap = new Map<string, any[]>()
            
            data.applications.forEach((app: any) => {
              const customerId = app.customerId
              if (!customerMap.has(customerId)) {
                customerMap.set(customerId, [])
              }
              customerMap.get(customerId)!.push(app)
            })

            // Transform grouped applications to customer records
            const transformedCustomers: CustomerRecord[] = Array.from(customerMap.entries()).map(([customerId, apps]) => {
              // Sort applications by createdAt descending to get most recent
              const sortedApps = apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              const mostRecentApp = sortedApps[0]
              
              return {
                id: customerId,
                name: mostRecentApp.customerName || 'Unknown',
                location: mostRecentApp.serviceArea || 'Unknown',
                status: mapApplicationStatusToCustomerStatus(mostRecentApp.status),
                lastUpdated: new Date(mostRecentApp.updatedAt).toISOString().slice(0, 10),
                actionRequired: mostRecentApp.status === 'DOCUMENTS_REQUESTED',
                documents: [],
                requiredDocuments: ['Utility Bill', 'Proof of Ownership', 'Tax Return'],
                statusHistory: [{ 
                  status: mapApplicationStatusToCustomerStatus(mostRecentApp.status), 
                  at: new Date(mostRecentApp.createdAt).toISOString().slice(0, 10) 
                }],
                notes: [],
                emails: [],
                applications: sortedApps,
                selectedApplicationId: mostRecentApp._id
              }
            })
            
            setCustomers(transformedCustomers)
          }
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Map application status to customer status
  const mapApplicationStatusToCustomerStatus = (appStatus: string): CustomerStatus => {
    const statusMap: Record<string, CustomerStatus> = {
      'PRELIMINARY_ELIGIBILITY': 'preliminary-eligible',
      'DOCUMENTS_REQUESTED': 'docs-requested',
      'DOCUMENTS_RECEIVED': 'docs-received',
      'SUBMITTED_TO_PROGRAM': 'state-submission-in-progress',
      'APPROVED': 'approved',
      'CONTRACTOR_MATCHED': 'matched',
      'INSTALLATION_IN_PROGRESS': 'installation-in-progress',
      'COMPLETED': 'completed'
    }
    return statusMap[appStatus] || 'preliminary-eligible'
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [customers, searchTerm, statusFilter])

  return (
    <AdminLayout title="Customer Intake">
      <div className="space-y-6">
        <AdminCustomersHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => setStatusFilter(value as CustomerStatus | 'all')}
        />

        <CustomersTable
          customers={filteredCustomers}
          loading={loading}
          searchTerm={searchTerm}
          onSelectCustomer={(customer) => router.push(`/admin/customers/${encodeURIComponent(customer.id)}`)}
        />
      </div>
    </AdminLayout>
  )
}
