import { notFound } from 'next/navigation'

export default function Page() {
  notFound()
}

/*
'use client'

import React from 'react'
import AdminLayout from '@/components/AdminLayout'
import { BarChart3 } from 'lucide-react'

export default function AdminReports() {
  return (
    <AdminLayout title="Reports">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h2>
        <p className="text-gray-600">
          Revenue analytics and performance reports will be available here soon.
        </p>
      </div>
    </AdminLayout>
  )
}
*/
