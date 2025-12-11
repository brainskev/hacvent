import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import ProjectCard from '@/components/ProjectCard'
import ProjectProgress from '@/components/ProjectProgress'
import NotificationCenter, { AlertBanner, Notification } from '@/components/NotificationCenter'
import { Briefcase, TrendingUp, Star, DollarSign, Filter, Search } from 'lucide-react'

export default function ContractorDashboard() {
  // TODO: Replace with actual authentication check
  const contractor = {
    name: 'John Martinez',
    company: 'Cool Breeze HVAC Solutions',
    email: 'john@coolbreezehvac.com',
    verified: true,
    rating: 4.9,
    completedProjects: 230
  }

  const [filterStatus, setFilterStatus] = useState<'all' | 'shortlisted' | 'selected' | 'in-progress'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock projects - TODO: Fetch from API
  const projects = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      location: 'San Francisco, CA 94105',
      systemType: 'Central Heat Pump',
      rebateAmount: 4300,
      status: 'selected' as const,
      postedDate: '2024-12-08',
      estimatedStart: '2025-01-05',
      visibility: 'full' as const,
      projectDetails: 'Replace existing 15-year-old AC unit with high-efficiency heat pump system',
      requirements: [
        'SEER 18+ heat pump installation',
        'EPA 608 certification required',
        'Rebate documentation assistance needed',
        'Post-installation inspection coordination'
      ],
      contactInfo: {
        phone: '(415) 555-7890',
        email: 'sarah.johnson@email.com'
      }
    },
    {
      id: '2',
      location: 'Oakland, CA',
      systemType: 'Ductless Mini-Split',
      rebateAmount: 2800,
      status: 'shortlisted' as const,
      postedDate: '2024-12-10',
      estimatedStart: '2025-01-15',
      visibility: 'limited' as const,
      requirements: [
        'Multi-zone ductless system',
        'ENERGY STAR certified equipment',
        'Wall penetration and mounting',
        'State rebate application assistance'
      ]
    },
    {
      id: '3',
      customerName: 'Michael Torres',
      location: 'San Mateo, CA 94403',
      systemType: 'Central AC Upgrade',
      rebateAmount: 1500,
      status: 'in-progress' as const,
      postedDate: '2024-11-20',
      estimatedStart: '2024-12-15',
      visibility: 'full' as const,
      projectDetails: 'Upgrade to high-efficiency central AC unit',
      requirements: [
        'SEER 16+ central AC unit',
        'Existing ductwork inspection',
        'Federal tax credit documentation',
        'Smart thermostat installation included'
      ],
      contactInfo: {
        phone: '(650) 555-4321',
        email: 'mtorres@email.com'
      }
    },
    {
      id: '4',
      location: 'Berkeley, CA',
      systemType: 'Heat Pump Water Heater',
      rebateAmount: 1200,
      status: 'shortlisted' as const,
      postedDate: '2024-12-11',
      estimatedStart: '2025-01-20',
      visibility: 'limited' as const,
      requirements: [
        'Heat pump water heater installation',
        'Electrical upgrade may be needed',
        'Utility rebate application',
        '2-hour service window required'
      ]
    }
  ]

  // Mock notifications - TODO: Fetch from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'You were selected!',
      message: 'Sarah Johnson selected you for their Central Heat Pump project.',
      timestamp: '1 hour ago',
      read: false,
      actionLabel: 'View Project',
      actionUrl: '/contractor-dashboard'
    },
    {
      id: '2',
      type: 'info',
      title: 'New Project Match',
      message: 'You\'ve been shortlisted for a Ductless Mini-Split installation in Oakland.',
      timestamp: '3 hours ago',
      read: false,
      actionLabel: 'Review',
      actionUrl: '/contractor-dashboard'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Document Required',
      message: 'Please upload installation certificate for Project #3',
      timestamp: '1 day ago',
      read: true,
      actionLabel: 'Upload',
      actionUrl: '/contractor-dashboard'
    }
  ])

  // Sample project progress for active project
  const activeProjectSteps = [
    {
      id: '1',
      title: 'Customer Selected You',
      description: 'Sarah Johnson chose you for this project',
      status: 'completed' as const,
      completedDate: '2024-12-09'
    },
    {
      id: '2',
      title: 'Initial Consultation',
      description: 'Meet with customer to assess site and provide quote',
      status: 'completed' as const,
      completedDate: '2024-12-12'
    },
    {
      id: '3',
      title: 'Equipment Ordered',
      description: 'Order SEER 18 heat pump system and materials',
      status: 'in-progress' as const,
      estimatedDate: '2024-12-18'
    },
    {
      id: '4',
      title: 'Installation',
      description: 'Complete heat pump installation',
      status: 'pending' as const,
      estimatedDate: '2025-01-05'
    },
    {
      id: '5',
      title: 'Inspection & Documentation',
      description: 'Final inspection and rebate paperwork',
      status: 'pending' as const,
      estimatedDate: '2025-01-08'
    },
    {
      id: '6',
      title: 'Project Complete',
      description: 'Customer sign-off and payment',
      status: 'pending' as const,
      estimatedDate: '2025-01-10'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      project.systemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    shortlisted: projects.filter(p => p.status === 'shortlisted').length,
    selected: projects.filter(p => p.status === 'selected').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    totalValue: projects.reduce((sum, p) => p.visibility === 'full' ? sum + p.rebateAmount : sum, 0)
  }

  const handleViewDetails = (projectId: string) => {
    // TODO: Navigate to project details page or open modal
    console.log('Viewing project:', projectId)
  }

  const handleAcceptProject = (projectId: string) => {
    // TODO: API call to accept project
    console.log('Accepting project:', projectId)
  }

  const handleRequestInfo = (projectId: string) => {
    // TODO: API call to request more info from customer
    console.log('Requesting more info for project:', projectId)
  }

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <>
      <Head>
        <title>Contractor Dashboard - ThermoGrid</title>
        <meta name="description" content="Manage your HVAC installation projects and rebate applications" />
      </Head>
      
      <Layout>
        <div className="bg-gradient-to-br from-secondary/5 to-primary/5 py-8 sm:py-12">
          <div className="container-custom">
            {/* Header with Notifications */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {contractor.company}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Welcome back, {contractor.name}
                </p>
              </div>
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationRead}
                onClearAll={handleClearAllNotifications}
              />
            </div>

            {/* Alert Banner */}
            {stats.selected > 0 && (
              <div className="mb-6">
                <AlertBanner
                  type="success"
                  title="Congratulations! You have new selected projects"
                  message={`${stats.selected} customer${stats.selected > 1 ? 's have' : ' has'} chosen you for their HVAC project.`}
                  actionLabel="View Projects"
                  onAction={() => setFilterStatus('selected')}
                />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mb-2 opacity-80" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.shortlisted}</div>
                <div className="text-white/90 text-xs sm:text-sm">Shortlisted</div>
              </div>
              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mb-2 opacity-80" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.selected}</div>
                <div className="text-white/90 text-xs sm:text-sm">Selected</div>
              </div>
              <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mb-2 opacity-80" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.inProgress}</div>
                <div className="text-white/90 text-xs sm:text-sm">In Progress</div>
              </div>
              <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mb-2 opacity-80" />
                <div className="text-2xl sm:text-3xl font-bold mb-1">${stats.totalValue.toLocaleString()}</div>
                <div className="text-white/90 text-xs sm:text-sm">Total Value</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Project Listings */}
              <div className="lg:col-span-2">
                {/* Filters and Search */}
                <div className="card mb-6">
                  <div className="flex flex-col gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                      />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="input-field text-sm sm:text-base"
                      >
                        <option value="all">All Projects</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project Cards */}
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {filterStatus === 'all' ? 'All Projects' :
                     filterStatus === 'shortlisted' ? 'Projects Where You\'re Shortlisted' :
                     filterStatus === 'selected' ? 'Projects Where You\'re Selected' :
                     'Projects In Progress'}
                  </h2>

                  {filteredProjects.length === 0 ? (
                    <div className="card text-center py-12">
                      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No projects found
                      </h3>
                      <p className="text-gray-600">
                        {filterStatus === 'all' 
                          ? 'Check back soon for new project matches!'
                          : `No ${filterStatus} projects at the moment.`}
                      </p>
                    </div>
                  ) : (
                    filteredProjects.map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onViewDetails={handleViewDetails}
                        onAcceptProject={handleAcceptProject}
                        onRequestInfo={handleRequestInfo}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contractor Profile */}
                <div className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                      {contractor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contractor.company}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{contractor.rating}</span>
                        <span className="text-gray-600">({contractor.completedProjects} projects)</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-outline text-sm py-2 w-full">
                    Edit Profile
                  </button>
                </div>

                {/* Active Project Progress */}
                {stats.selected > 0 || stats.inProgress > 0 ? (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Current Project Progress
                    </h3>
                    <ProjectProgress steps={activeProjectSteps} />
                  </div>
                ) : null}

                {/* Quick Actions */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="btn-primary text-sm py-2 w-full">
                      Update Availability
                    </button>
                    <button className="btn-outline text-sm py-2 w-full">
                      Upload Certifications
                    </button>
                    <button className="btn-outline text-sm py-2 w-full">
                      View Earnings
                    </button>
                    <button className="btn-outline text-sm py-2 w-full">
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* Info Card */}
                <div className="card bg-blue-50 border-2 border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    💡 Project Visibility
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong>Shortlisted:</strong> Limited project details visible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span><strong>Selected:</strong> Full customer contact info revealed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Customer privacy protected until selection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
