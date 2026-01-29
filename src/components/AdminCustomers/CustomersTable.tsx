'use client'

import React from 'react'
import { CustomerRecord, CustomerStatus, STATUS_LABELS, STATUS_STYLES } from '@/types/admin'

interface CustomersTableProps {
  customers: CustomerRecord[]
  loading: boolean
  searchTerm: string
  onSelectCustomer: (customer: CustomerRecord) => void
}

export function CustomersTable({
  customers,
  loading,
  searchTerm,
  onSelectCustomer
}: CustomersTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {loading ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No applications found</p>
          {searchTerm && <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action required</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last updated</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {customer.applications && customer.applications.length > 1
                        ? `${customer.applications.length} projects`
                        : customer.applications?.[0]?.applicationNumber || customer.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{customer.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[customer.status]}`}>
                      {STATUS_LABELS[customer.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${customer.actionRequired ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'}`}>
                      {customer.actionRequired ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.lastUpdated}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold">
                    <button
                      onClick={() => onSelectCustomer(customer)}
                      className="text-primary hover:text-primary-dark font-semibold"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
