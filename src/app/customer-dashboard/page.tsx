'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Layout from '@/components/Layout'
import { ProtectedPage } from '@/lib/auth'
import { ApplicationStatus, IDocument } from '@/lib/types'
import { mockApplications, mockNotifications } from '@/components/CustomerDashboard/mockData'
import { DashboardHeader } from '@/components/CustomerDashboard/DashboardHeader'
import { DashboardAlerts } from '@/components/CustomerDashboard/DashboardAlerts'
import { SectionTabs, DashboardSection } from '@/components/CustomerDashboard/SectionTabs'
import { ProjectSelector } from '@/components/CustomerDashboard/ProjectSelector'
import { TimelineSection } from '@/components/CustomerDashboard/TimelineSection'
import { DocumentsSection } from '@/components/CustomerDashboard/DocumentsSection'
import { NotificationsSection } from '@/components/CustomerDashboard/NotificationsSection'

export default function CustomerDashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<DashboardSection>('timeline')
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [isActionRequired, setIsActionRequired] = useState(true)
  const [applications, setApplications] = useState(mockApplications)
  const [selectedApplicationId, setSelectedApplicationId] = useState(
    mockApplications[0]?._id?.toString() || ''
  )
  const [notifications, setNotifications] = useState(mockNotifications)

  const userName = isLoaded && user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'Loading...'
  const userEmail = isLoaded && user ? user.emailAddresses[0]?.emailAddress : ''

  const getIntakeStorageKey = (id: string) => `intakeCompleted:${id}`
  const intakeCompleted =
    isLoaded && user && typeof window !== 'undefined'
      ? window.localStorage.getItem(getIntakeStorageKey(user.id)) === 'true'
      : false

  const selectedApplication = useMemo(
    () => applications.find((app) => app._id?.toString() === selectedApplicationId) || applications[0],
    [applications, selectedApplicationId]
  )

  const updateApplicationStatusForDocuments = (applicationId: string, docCount: number) => {
    if (!applicationId || docCount === 0) return
    setApplications((current) =>
      current.map((app) =>
        app._id?.toString() === applicationId && app.status === ApplicationStatus.DOCUMENTS_REQUESTED
          ? { ...app, status: ApplicationStatus.DOCUMENTS_RECEIVED, updatedAt: new Date() }
          : app
      )
    )
  }

  useEffect(() => {
    if (!searchParams) return
    const section = searchParams.get('section')
    if (section === 'documents' || section === 'timeline' || section === 'notifications') {
      setActiveSection(section)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isLoaded || !user || !selectedApplicationId) return

    const applicationId = selectedApplicationId
    const userId = user.id

    if (typeof window !== 'undefined') {
      ;(window as any).__appContext = {
        applicationId,
        userId
      }
    }

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/customer/documents?applicationId=${applicationId}&userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.documents) {
            setDocuments(data.documents)
            if (data.documents.length > 0) {
              setIsActionRequired(false)
            }
            updateApplicationStatusForDocuments(applicationId, data.documents.length)
          }
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err)
      }
    }

    fetchDocuments()
  }, [isLoaded, user, selectedApplicationId])

  const handleFileUpload = async (files: File[], documentType: string) => {
    console.log(`Uploading ${files.length} files as ${documentType}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleDocumentsRefresh = async () => {
    try {
      const applicationId = (window as any).__appContext?.applicationId
      const userId = (window as any).__appContext?.userId
      if (!applicationId || !userId) return

      const response = await fetch(`/api/customer/documents?applicationId=${applicationId}&userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.documents) {
          setDocuments(data.documents)
          setIsActionRequired(data.documents.length === 0)
          updateApplicationStatusForDocuments(applicationId, data.documents.length)
        }
      }
    } catch (err) {
      console.error('Failed to refresh documents:', err)
    }
  }

  const handleMarkNotificationRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        (notification._id?.toString() || notification.subject) === notificationId
          ? { ...notification, dashboardViewed: true, viewedAt: new Date() }
          : notification
      )
    )
  }

  const handleNewProject = () => {
    router.push('/customer-intake')
  }

  return (
    <ProtectedPage>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
          <DashboardHeader isLoaded={isLoaded} userName={userName} userEmail={userEmail} />
          <DashboardAlerts
            intakeCompleted={intakeCompleted}
            applicationStatus={selectedApplication?.status}
            documentsCount={documents.length}
            activeSection={activeSection}
            onViewDocuments={() => setActiveSection('documents')}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProjectSelector
              applications={applications}
              selectedApplicationId={selectedApplicationId}
              onChange={setSelectedApplicationId}
              onNewProject={handleNewProject}
            />
            <SectionTabs activeSection={activeSection} onChange={setActiveSection} />

            {activeSection === 'timeline' && selectedApplication && (
              <TimelineSection
                application={selectedApplication}
                onNavigateToActions={() => setActiveSection('documents')}
              />
            )}

            {activeSection === 'documents' && selectedApplication && (
              <DocumentsSection
                applicationStatus={selectedApplication.status}
                isActionRequired={isActionRequired}
                documents={documents}
                onUpload={handleFileUpload}
                onDocumentsRefresh={handleDocumentsRefresh}
              />
            )}

            {activeSection === 'notifications' && (
              <NotificationsSection
                notifications={notifications.filter(
                  (notification) => notification.applicationId?.toString() === selectedApplicationId
                )}
                onMarkAsRead={handleMarkNotificationRead}
              />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedPage>
  )
}
