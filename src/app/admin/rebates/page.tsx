'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { FileCheck2, FileUp, Flag, HelpCircle } from 'lucide-react'

interface RebateProject {
  id: string
  customer: string
  contractor: string
  status: 'awaiting-docs' | 'paperwork-submitted' | 'state-feedback' | 'paid'
  updatedAt: string
}

const initialProjects: RebateProject[] = [
  { id: 'PRJ-3001', customer: 'Derrick Coleman', contractor: 'NorthPeak Heating', status: 'awaiting-docs', updatedAt: '2026-01-20' },
  { id: 'PRJ-2994', customer: 'Mia Hernandez', contractor: 'BrightSpark HVAC', status: 'paperwork-submitted', updatedAt: '2026-01-18' },
  { id: 'PRJ-2989', customer: 'Samantha Reed', contractor: 'BrightSpark HVAC', status: 'state-feedback', updatedAt: '2026-01-16' }
]

const STATUS_LABELS: Record<RebateProject['status'], string> = {
  'awaiting-docs': 'Awaiting install docs',
  'paperwork-submitted': 'Rebate paperwork submitted',
  'state-feedback': 'State feedback requests',
  paid: 'Paid by state'
}

const STATUS_STYLES: Record<RebateProject['status'], string> = {
  'awaiting-docs': 'bg-amber-50 text-amber-700 ring-amber-200',
  'paperwork-submitted': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'state-feedback': 'bg-purple-50 text-purple-700 ring-purple-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
}

export default function RebatesPage() {
  const [projects, setProjects] = useState<RebateProject[]>(initialProjects)

  const updateProject = (id: string, updater: (current: RebateProject) => RebateProject) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? updater(project) : project)))
  }

  const markSubmitted = (id: string) => {
    updateProject(id, (project) => ({ ...project, status: 'paperwork-submitted', updatedAt: new Date().toISOString().slice(0, 10) }))
  }

  const requestInfo = (id: string) => {
    updateProject(id, (project) => ({ ...project, status: 'state-feedback', updatedAt: new Date().toISOString().slice(0, 10) }))
  }

  const markPaid = (id: string) => {
    updateProject(id, (project) => ({ ...project, status: 'paid', updatedAt: new Date().toISOString().slice(0, 10) }))
  }

  return (
    <AdminLayout title="Post-Installation & Rebate Filing">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Post-installation</p>
              <h1 className="text-2xl font-semibold text-gray-900">Rebate filing pipeline</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Track paperwork submission, state feedback, and rebate payments.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contractor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{project.id}</div>
                      <div className="text-xs text-gray-500">Updated {project.updatedAt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{project.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{project.contractor}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[project.status]}`}>
                        {STATUS_LABELS[project.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      <button
                        onClick={() => markSubmitted(project.id)}
                        className="text-blue-700 hover:text-blue-900 mr-3"
                      >
                        Submit rebate
                      </button>
                      <button
                        onClick={() => requestInfo(project.id)}
                        className="text-amber-700 hover:text-amber-900 mr-3"
                      >
                        Request info
                      </button>
                      <button
                        onClick={() => markPaid(project.id)}
                        className="text-emerald-700 hover:text-emerald-900"
                      >
                        Mark paid
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">Upload final paperwork</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">Attach install certificates and rebate forms before submission.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">Manual submission flag</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">Mark when rebate claims are sent manually to the state.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-700">State feedback</p>
            </div>
            <p className="mt-2 text-sm text-gray-500">Log additional state requests and resubmissions.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
