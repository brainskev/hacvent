'use client'

import React from 'react'
import { IApplication } from '@/lib/types'
import { Plus } from 'lucide-react'

interface ProjectSelectorProps {
  applications: IApplication[]
  selectedApplicationId: string
  onChange: (applicationId: string) => void
  onNewProject: () => void
}

export function ProjectSelector({
  applications,
  selectedApplicationId,
  onChange,
  onNewProject
}: ProjectSelectorProps) {
  if (applications.length <= 1) return null

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Select Project
        </label>
        <select
          value={selectedApplicationId}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {applications.map((app) => (
            <option key={app._id?.toString()} value={app._id?.toString()}>
              {app.applicationNumber} • {app.serviceArea}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={onNewProject}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 whitespace-nowrap"
      >
        <Plus className="h-4 w-4" />
        Start new project
      </button>
    </div>
  )
}
