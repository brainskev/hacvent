'use client'

import React from 'react'
import { User, Loader } from 'lucide-react'

interface DashboardHeaderProps {
  isLoaded: boolean
  userName: string
  userEmail?: string
}

export function DashboardHeader({ isLoaded, userName, userEmail }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              {isLoaded ? (
                <>
                  <h1 className="text-xl font-bold text-gray-900">
                    Welcome, {userName}
                  </h1>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </>
              ) : (
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
