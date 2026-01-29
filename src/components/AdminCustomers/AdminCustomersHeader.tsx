'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'
import { CustomerStatus, STATUS_LABELS } from '@/types/admin'

interface AdminCustomersHeaderProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | CustomerStatus
  onStatusFilterChange: (value: 'all' | CustomerStatus) => void
}

export function AdminCustomersHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: AdminCustomersHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Customer intake</p>
          <h1 className="text-2xl font-semibold text-gray-900">Customer applications</h1>
          <p className="text-sm text-gray-600">Manage intake status, document requests, and communications.</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, location, or ID"
              className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value as CustomerStatus | 'all')}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
