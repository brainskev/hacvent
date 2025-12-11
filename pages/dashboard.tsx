import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import RebateTracker from '@/components/RebateTracker'
import DocumentUpload from '@/components/DocumentUpload'
import ShortlistCard from '@/components/ShortlistCard'
import EligibilitySummary from '@/components/EligibilitySummary'
import ProjectProgress from '@/components/ProjectProgress'
import NotificationCenter, { AlertBanner, Notification } from '@/components/NotificationCenter'
import ConsultationModal, { ConsultationFormData } from '@/components/ConsultationModal'
import { User, FileText, Users, Settings, Target, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  // TODO: Replace with actual authentication check
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    memberSince: 'November 2024'
  }

  const [loading, setLoading] = useState(true)
  const [eligibilityResult, setEligibilityResult] = useState<any>(null)
  const [contractorShortlist, setContractorShortlist] = useState<any[]>([])
  const [projectSteps, setProjectSteps] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any>(null)

  const [selectedContractor, setSelectedContractor] = useState<string | null>(null)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [consultationContractor, setConsultationContractor] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'contractors' | 'documents'>('overview')
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // For demo, we'll use customer1@thermogrid.com
      // TODO: Replace with actual authenticated user
      const demoEmail = 'customer1@thermogrid.com'

      // 1. Get customer profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', demoEmail)
        .single()

      if (!profile) {
        console.log('No profile found - using mock data')
        setLoading(false)
        return
      }

      // 2. Get customer record
      const { data: customer } = await supabase
        .from('customers')
        .select('id, city, state, zip_code')
        .eq('profile_id', profile.id)
        .single()

      if (!customer) {
        console.log('No customer found')
        setLoading(false)
        return
      }

      // 3. Get current project
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (project) {
        setCurrentProject(project)

        // 4. Get eligibility results
        const { data: eligibility } = await supabase
          .from('eligibility_results')
          .select('*')
          .eq('project_id', project.id)
          .single()

        // 5. Get project rebates with program details
        const { data: rebates } = await supabase
          .from('project_rebates')
          .select(`
            *,
            rebate_programs (
              program_name,
              requirements,
              description
            )
          `)
          .eq('project_id', project.id)

        if (eligibility && rebates) {
          setEligibilityResult({
            totalSavings: eligibility.total_savings,
            federalCredit: eligibility.federal_credit,
            stateRebate: eligibility.state_rebate,
            utilityRebate: eligibility.utility_rebate,
            manufacturerRebate: eligibility.manufacturer_rebate,
            location: eligibility.location,
            systemType: eligibility.system_type,
            efficiencyRating: eligibility.efficiency_rating,
            programs: rebates.map(r => ({
              name: r.rebate_programs.program_name,
              amount: r.amount,
              eligible: true,
              requirements: r.rebate_programs.requirements || []
            }))
          })
        }

        // 6. Get contractor shortlist
        const { data: shortlist } = await supabase
          .from('contractor_shortlist')
          .select(`
            match_score,
            visibility,
            contractors (
              id,
              company_name,
              rating,
              total_reviews,
              city,
              state,
              years_experience,
              completed_projects,
              availability,
              status,
              profiles (
                full_name,
                phone,
                email
              )
            )
          `)
          .eq('project_id', project.id)
          .order('match_score', { ascending: false })

        if (shortlist) {
          // Get certifications and specialties for each contractor
          const contractorsWithDetails = await Promise.all(
            shortlist.map(async (item: any) => {
              const contractor = item.contractors

              // Get certifications
              const { data: certs } = await supabase
                .from('contractor_certifications')
                .select('certification_name')
                .eq('contractor_id', contractor.id)
                .eq('verified', true)

              // Get specialties
              const { data: specs } = await supabase
                .from('contractor_specialties')
                .select('specialty_name')
                .eq('contractor_id', contractor.id)

              return {
                id: contractor.id,
                name: contractor.profiles.full_name,
                company: contractor.company_name,
                rating: contractor.rating,
                reviews: contractor.total_reviews,
                certifications: certs?.map(c => c.certification_name) || [],
                specialties: specs?.map(s => s.specialty_name) || [],
                location: `${contractor.city}, ${contractor.state}`,
                distance: '2.3 miles', // TODO: Calculate real distance
                phone: contractor.profiles.phone || '',
                email: contractor.profiles.email,
                verified: contractor.status === 'verified',
                availability: contractor.availability === 'available_now' ? 'Available Now' as const : 
                             contractor.availability === 'available_soon' ? 'Available Soon' as const :
                             'Booked' as const,
                yearsExperience: contractor.years_experience,
                completedProjects: contractor.completed_projects
              }
            })
          )

          setContractorShortlist(contractorsWithDetails)
        }

        // 7. Get project steps
        const { data: steps } = await supabase
          .from('project_steps')
          .select('*')
          .eq('project_id', project.id)
          .order('step_number', { ascending: true })

        if (steps && steps.length > 0) {
          setProjectSteps(steps.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            status: s.status as 'completed' | 'in-progress' | 'pending',
            completedDate: s.completed_date,
            estimatedDate: s.estimated_date
          })))
        }
      }

      // 8. Get notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (notifs) {
        setNotifications(notifs.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          timestamp: formatTimestamp(n.created_at),
          read: n.read,
          actionLabel: n.action_label || undefined,
          actionUrl: n.action_url || undefined
        })))
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    return date.toLocaleDateString()
  }

  const handleSelectContractor = async (contractorId: string) => {
    try {
      if (!currentProject) return

      await supabase
        .from('projects')
        .update({ 
          selected_contractor_id: contractorId,
          status: 'consultation_scheduled'
        })
        .eq('id', currentProject.id)
      
      setSelectedContractor(contractorId)
      console.log('Selected contractor:', contractorId)
    } catch (error) {
      console.error('Error selecting contractor:', error)
    }
  }

  const handleRequestConsultation = (contractorId: string) => {
    const contractor = contractorShortlist.find(c => c.id === contractorId)
    if (contractor) {
      setConsultationContractor(contractor)
      setShowConsultationModal(true)
      console.log('Requesting consultation with:', contractorId)
    }
  }

  const handleConsultationSubmit = async (data: ConsultationFormData) => {
    try {
      if (!currentProject || !consultationContractor) return

      // Get customer ID
      const demoEmail = 'customer1@thermogrid.com'
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', demoEmail)
        .single()

      if (!profile) return

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('profile_id', profile.id)
        .single()

      if (!customer) return

      // Insert consultation request
      await supabase
        .from('consultations')
        .insert({
          project_id: currentProject.id,
          contractor_id: consultationContractor.id,
          customer_id: customer.id,
          preferred_date: data.preferredDate,
          preferred_time: data.preferredTime,
          contact_method: data.contactMethod,
          phone_number: data.phone,
          email: data.email,
          message: data.message,
          status: 'requested'
        })

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'success',
          title: 'Consultation Requested!',
          message: `${consultationContractor.company} will contact you soon to schedule your consultation.`,
          action_label: 'View Details',
          action_url: '#contractors'
        })

      // Refresh notifications
      fetchDashboardData()

      console.log('Consultation request submitted:', data)
    } catch (error) {
      console.error('Error submitting consultation request:', error)
    }
  }

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id)
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleClearAllNotifications = async () => {
    try {
      const notificationIds = notifications.map(n => n.id)
      await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .in('id', notificationIds)
      
      setNotifications([])
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Customer Dashboard - ThermoGrid</title>
          <meta name="description" content="Track your HVAC rebate applications and manage your account" />
        </Head>
        <Layout>
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
            <div className="container-custom">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-600">Loading your dashboard...</p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Customer Dashboard - ThermoGrid</title>
        <meta name="description" content="Track your HVAC rebate applications and manage your account" />
      </Head>
      
      <Layout>
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container-custom">
            {/* Welcome Section with Notifications */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Track your rebate applications and manage your project
                </p>
              </div>
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationRead}
                onClearAll={handleClearAllNotifications}
              />
            </div>

            {/* Alert Banner */}
            {!selectedContractor && (
              <div className="mb-6">
                <AlertBanner
                  type="info"
                  title="Action Required: Select Your Contractor"
                  message="Review the matched contractors below and select one to proceed with your HVAC installation."
                  actionLabel="View Contractors"
                  onAction={() => setActiveTab('contractors')}
                />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
                <Sparkles className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">
                  ${eligibilityResult?.totalSavings?.toLocaleString() || '0'}
                </div>
                <div className="text-white/90 text-sm">Total Savings</div>
              </div>
              <div className="card bg-gradient-to-br from-secondary to-secondary-dark text-white">
                <Target className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{contractorShortlist.length}</div>
                <div className="text-white/90 text-sm">Matched Contractors</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <FileText className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">
                  {eligibilityResult?.programs?.length || 0}
                </div>
                <div className="text-white/90 text-sm">Eligible Programs</div>
              </div>
              <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <Users className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{selectedContractor ? '1' : '0'}</div>
                <div className="text-white/90 text-sm">Selected</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Project Overview
              </button>
              <button
                onClick={() => setActiveTab('contractors')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'contractors'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Select Contractor {!selectedContractor && '⚠️'}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'documents'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Project Progress */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Your Project Timeline
                    </h2>
                    {projectSteps.length > 0 ? (
                      <ProjectProgress steps={projectSteps} />
                    ) : (
                      <div className="card text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Active Project
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start by checking your eligibility for HVAC rebates.
                        </p>
                        <button className="btn-primary">
                          Check Eligibility
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Eligibility Summary */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Your Rebate Eligibility
                    </h2>
                    {eligibilityResult ? (
                      <EligibilitySummary 
                        result={eligibilityResult}
                        onProceed={() => setActiveTab('contractors')}
                      />
                    ) : (
                      <div className="card text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Rebate Eligibility Check
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Complete the eligibility checker to see how much you can save.
                        </p>
                        <button className="btn-primary">
                          Start Eligibility Check
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Account Info */}
                  <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Account Info</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Member since {user.memberSince}
                    </p>
                    <button className="btn-outline text-sm py-2 w-full">
                      Edit Profile
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('contractors')}
                        className="btn-primary text-sm py-2 w-full"
                      >
                        {selectedContractor ? 'View Selected Contractor' : 'Select Contractor'}
                      </button>
                      <button className="btn-outline text-sm py-2 w-full text-left">
                        💬 Contact Support
                      </button>
                      <button className="btn-outline text-sm py-2 w-full text-left">
                        📄 Download Reports
                      </button>
                      <button className="btn-outline text-sm py-2 w-full text-left">
                        🔔 Notification Settings
                      </button>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                    <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our support team is here to assist you with any questions.
                    </p>
                    <button className="btn-primary text-sm py-2 w-full">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contractors' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedContractor ? 'Your Selected Contractor' : 'Choose Your Contractor'}
                  </h2>
                  <p className="text-gray-600">
                    {selectedContractor 
                      ? 'You can message your contractor below or change your selection.'
                      : 'We\'ve matched you with the top verified contractors in your area based on certifications, ratings, and availability.'
                    }
                  </p>
                </div>

                {contractorShortlist.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {contractorShortlist.map((contractor) => (
                      <ShortlistCard
                        key={contractor.id}
                        contractor={contractor}
                        onSelect={handleSelectContractor}
                        onRequestConsultation={handleRequestConsultation}
                        isSelected={selectedContractor === contractor.id}
                        showActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <Users className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Contractors Matched Yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Complete your eligibility check and we'll match you with verified contractors in your area.
                    </p>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="btn-primary"
                    >
                      Back to Overview
                    </button>
                  </div>
                )}

                {!selectedContractor && (
                  <div className="mt-8 card bg-blue-50 border-2 border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      💡 How Contractor Matching Works
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>All contractors are verified with proper licenses and certifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Matched based on your location, rebate requirements, and system type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Contractors cannot see your contact details until you select them</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>Request consultations to discuss your project before selecting</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Document Center
                  </h2>
                  <p className="text-gray-600">
                    Upload all required documents for your rebate applications
                  </p>
                </div>
                <DocumentUpload />
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Your Rebate Applications
                  </h3>
                  <RebateTracker />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Consultation Modal */}
        <ConsultationModal
          isOpen={showConsultationModal}
          onClose={() => {
            setShowConsultationModal(false)
            setConsultationContractor(null)
          }}
          contractor={consultationContractor}
          onSubmit={handleConsultationSubmit}
        />
      </Layout>
    </>
  )
}
