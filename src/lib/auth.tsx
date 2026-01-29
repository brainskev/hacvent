'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedPageProps {
  children: ReactNode
}

/**
 * Wrapper component for pages that require authentication
 * Automatically redirects unauthenticated users to sign-up
 * Shows loading state while checking auth status
 */
export function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-up')
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while auth is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null
  }

  // Render protected content
  return <>{children}</>
}

/**
 * Utility hook to check if user can access admin pages
 * TODO: Add role-based access control when admin roles are implemented
 */
export function useRequireAuth() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-up')
    }
  }, [isLoaded, isSignedIn, router])

  return { isLoaded, isSignedIn, userId }
}
