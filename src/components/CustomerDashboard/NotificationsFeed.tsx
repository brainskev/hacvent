'use client'

import React from 'react'
import { INotification } from '@/lib/types'
import { Bell, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react'

interface NotificationsFeedProps {
  notifications: INotification[]
  onMarkAsRead?: (notificationId: string) => Promise<void>
}

export function NotificationsFeed({ notifications, onMarkAsRead }: NotificationsFeedProps) {
  const getNotificationIcon = (type: INotification['type']) => {
    switch (type) {
      case 'approval':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      case 'rejection':
        return <AlertCircle className="w-5 h-5 text-rose-600" />
      case 'document-request':
        return <AlertCircle className="w-5 h-5 text-amber-600" />
      case 'status-update':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: INotification['type'], viewed: boolean) => {
    const baseColor = viewed ? 'bg-gray-50' : 'bg-blue-50'
    switch (type) {
      case 'approval':
        return viewed ? 'bg-gray-50' : 'bg-emerald-50'
      case 'rejection':
        return viewed ? 'bg-gray-50' : 'bg-rose-50'
      case 'document-request':
        return viewed ? 'bg-gray-50' : 'bg-amber-50'
      case 'status-update':
        return viewed ? 'bg-gray-50' : 'bg-blue-50'
      default:
        return baseColor
    }
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return d.toLocaleDateString()
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Bell className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">No notifications yet</p>
          <p className="text-sm text-gray-500 mt-1">
            You'll receive updates here as your application progresses
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Updates & Notifications</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => {
          const notificationId = notification._id?.toString() || notification.subject
          return (
          <div
            key={notificationId}
            className={`p-4 transition-colors ${getNotificationColor(notification.type, notification.dashboardViewed)}`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-1">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{notification.subject}</h3>
                  {!notification.dashboardViewed && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.body}</p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(notification.createdAt)}
                  </p>
                  {!notification.dashboardViewed && onMarkAsRead && (
                    <button
                      onClick={() => onMarkAsRead(notificationId)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                  {notification.emailSent && (
                    <span className="text-xs text-gray-500">
                      ✓ Email sent {notification.emailSentAt ? formatDate(notification.emailSentAt) : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}
