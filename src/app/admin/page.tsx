'use client'

import React from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { FileText, Link2, Users, Wrench, DollarSign, ClipboardCheck, Sparkles } from 'lucide-react'

const overviewMetrics = [
  { label: 'Active customer applications', value: 128 },
  { label: 'Customers awaiting documents', value: 34 },
  { label: 'Contractors awaiting documents', value: 12 },
  { label: 'Applications in state review', value: 22 },
  { label: 'Projects in installation', value: 17 },
  { label: 'Payments pending', value: 9 }
]

const quickLinks = [
  { label: 'Customer intake', href: '/admin/customers', icon: Users },
  { label: 'Contractor applications', href: '/admin/contractors', icon: Wrench },
  { label: 'Matching & active projects', href: '/admin/projects', icon: Link2 },
  { label: 'Post-installation & rebate filing', href: '/admin/rebates', icon: FileText },
  { label: 'Payments & invoicing', href: '/admin/payments', icon: DollarSign }
]

export default function AdminOverviewPage() {
  return (
    <AdminLayout title="Admin Overview">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Admin overview</p>
              <h1 className="text-2xl font-semibold text-gray-900">Operational snapshot</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">High-level metrics with quick navigation to each queue.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overviewMetrics.map((metric) => (
            <div key={metric.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Queues</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <link.icon className="h-4 w-4 text-gray-500" />
                  {link.label}
                </span>
                <span className="text-xs text-gray-400">View</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
