'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Bell } from 'lucide-react'

export type DashboardSection = 'timeline' | 'documents' | 'notifications'

interface SectionTabsProps {
  activeSection: DashboardSection
  onChange: (section: DashboardSection) => void
}

const tabs = [
  { id: 'timeline' as const, label: 'Timeline', icon: CheckCircle2 },
  { id: 'documents' as const, label: 'Documents', icon: AlertCircle },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell }
]

export function SectionTabs({ activeSection, onChange }: SectionTabsProps) {
  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeSection === id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
