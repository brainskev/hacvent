'use client'

import React from 'react'
import { INotification } from '@/lib/types'
import { NotificationsFeed } from '@/components/CustomerDashboard/NotificationsFeed'

interface NotificationsSectionProps {
  notifications: INotification[]
  onMarkAsRead: (notificationId: string) => Promise<void>
}

export function NotificationsSection({ notifications, onMarkAsRead }: NotificationsSectionProps) {
  return (
    <NotificationsFeed
      notifications={notifications}
      onMarkAsRead={onMarkAsRead}
    />
  )
}
