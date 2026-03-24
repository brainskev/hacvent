import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

interface AdminRootLayoutProps {
  children: React.ReactNode
}

export default async function AdminRootLayout({ children }: AdminRootLayoutProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const isAdmin = await isAdminRequest()
  if (!isAdmin) {
    redirect('/customer-dashboard')
  }

  return <>{children}</>
}
