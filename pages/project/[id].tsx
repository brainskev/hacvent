import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import ProjectProgress from '@/components/ProjectProgress'
import DocumentUpload from '@/components/DocumentUpload'
import ShortlistCard from '@/components/ShortlistCard'
import { AlertBanner } from '@/components/NotificationCenter'
import { 
  ArrowLeft, MapPin, DollarSign, Calendar, User, 
  Phone, Mail, FileText, MessageCircle, CheckCircle 
} from 'lucide-react'

export default function ProjectDetails() {
  const router = useRouter()
  const { id } = router.query
  
  // TODO: Determine if user is customer or contractor from auth
  const [userType] = useState<'customer' | 'contractor'>('customer')
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'communication'>('overview')

  // Mock project data - TODO: Fetch from API based on project ID
  const project = {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '(415) 555-7890',
    location: '456 Oak Street, San Francisco, CA 94105',
    systemType: 'Central Heat Pump',
    currentSystem: '15-year-old central AC unit',
    rebateAmount: 4300,
    status: 'in-progress',
    createdDate: '2024-12-08',
    estimatedStart: '2025-01-05',
    estimatedCompletion: '2025-01-10',
    projectDetails: 'Replace existing 15-year-old AC unit with high-efficiency heat pump system. Property is a single-family home with existing ductwork in good condition. Customer is interested in maximizing available rebates and reducing energy costs.',
    requirements: [
      'SEER 18+ heat pump installation',
      'HSPF 10+ heating efficiency',
      'EPA 608 certification required',
      'Smart thermostat integration',
      'Rebate documentation assistance needed',
      'Post-installation inspection coordination',
      'Ductwork inspection and minor repairs if needed'
    ],
    rebatePrograms: [
      {
        name: 'Federal Tax Credit 25C',
        amount: 2000,
        status: 'pending',
        requirements: 'Installation certificate, AHRI number, efficiency ratings'
      },
      {
        name: 'California Energy Upgrade Program',
        amount: 1500,
        status: 'pending',
        requirements: 'Income verification, contractor certification, inspection'
      },
      {
        name: 'PG&E Energy Efficiency Rebate',
        amount: 800,
        status: 'pending',
        requirements: 'Post-installation inspection, meter readings'
      }
    ],
    selectedContractor: {
      id: '1',
      name: 'John Martinez',
      company: 'Cool Breeze HVAC Solutions',
      rating: 4.9,
      reviews: 127,
      certifications: ['EPA 608', 'NATE Certified', 'Rebate Specialist'],
      specialties: ['Heat Pumps', 'Central AC', 'Ductless Systems'],
      location: 'San Francisco, CA',
      distance: '2.3 miles',
      phone: '(415) 555-0123',
      email: 'john@coolbreezehvac.com',
      verified: true,
      availability: 'Available Now' as const,
      yearsExperience: 15,
      completedProjects: 230
    }
  }

  const projectSteps = [
    {
      id: '1',
      title: 'Project Created',
      description: 'Eligibility confirmed and contractor matching initiated',
      status: 'completed' as const,
      completedDate: '2024-12-08'
    },
    {
      id: '2',
      title: 'Contractor Selected',
      description: 'Cool Breeze HVAC Solutions chosen for the project',
      status: 'completed' as const,
      completedDate: '2024-12-09'
    },
    {
      id: '3',
      title: 'Initial Consultation',
      description: 'Site assessment and detailed quote provided',
      status: 'completed' as const,
      completedDate: '2024-12-12'
    },
    {
      id: '4',
      title: 'Equipment Procurement',
      description: 'SEER 18 heat pump system ordered and materials secured',
      status: 'in-progress' as const,
      estimatedDate: '2024-12-18'
    },
    {
      id: '5',
      title: 'Installation Scheduled',
      description: 'Professional HVAC system installation',
      status: 'pending' as const,
      estimatedDate: '2025-01-05'
    },
    {
      id: '6',
      title: 'Final Inspection',
      description: 'System testing and quality verification',
      status: 'pending' as const,
      estimatedDate: '2025-01-06'
    },
    {
      id: '7',
      title: 'Rebate Documentation',
      description: 'Submit all rebate applications with required documents',
      status: 'pending' as const,
      estimatedDate: '2025-01-08'
    },
    {
      id: '8',
      title: 'Project Complete',
      description: 'Final approval and rebate tracking active',
      status: 'pending' as const,
      estimatedDate: '2025-01-10'
    }
  ]

  const handleSendMessage = () => {
    // TODO: Open messaging interface or modal
    console.log('Opening message interface')
  }

  const handleScheduleConsultation = () => {
    // TODO: Open scheduling modal
    console.log('Opening scheduling modal')
  }

  return (
    <>
      <Head>
        <title>Project Details - {project.systemType} | ThermoGrid</title>
        <meta name="description" content="View and manage your HVAC installation project details" />
      </Head>
      
      <Layout>
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
          <div className="container-custom">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>

            {/* Project Header */}
            <div className="card mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.systemType} Installation
                  </h1>
                  <p className="text-gray-600">Project ID: #{project.id}</p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {userType === 'customer' || project.selectedContractor 
                        ? project.location 
                        : 'San Francisco, CA'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Total Rebates</p>
                    <p className="font-semibold text-primary text-lg">
                      ${project.rebateAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-900">{project.estimatedStart}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="font-semibold text-gray-900">{project.estimatedCompletion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Banner for pending actions */}
            {project.status === 'in-progress' && (
              <div className="mb-6">
                <AlertBanner
                  type="info"
                  title="Equipment Being Procured"
                  message="Your contractor is currently ordering the heat pump system. Installation is scheduled for January 5th, 2025."
                />
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
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
              <button
                onClick={() => setActiveTab('communication')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'communication'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Communication
              </button>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'overview' && (
                  <>
                    {/* Project Timeline */}
                    <div className="card">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
                      <ProjectProgress steps={projectSteps} />
                    </div>

                    {/* Project Details */}
                    <div className="card">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Details</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                          <p className="text-gray-700">{project.projectDetails}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Current System</h3>
                          <p className="text-gray-700">{project.currentSystem}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                          <div className="space-y-2">
                            {project.requirements.map((req, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rebate Programs */}
                    <div className="card">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Rebate Programs</h2>
                      <div className="space-y-4">
                        {project.rebatePrograms.map((program, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{program.name}</h3>
                              <span className="text-lg font-bold text-primary">
                                ${program.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {program.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>Required:</strong> {program.requirements}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'documents' && (
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Documents</h2>
                    <DocumentUpload />
                  </div>
                )}

                {activeTab === 'communication' && (
                  <div className="card">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Center Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Real-time messaging will be available in the next update
                      </p>
                      <button onClick={handleSendMessage} className="btn-primary">
                        Contact via Email
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                {userType === 'customer' && project.selectedContractor && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Contractor</h3>
                    <ShortlistCard
                      contractor={project.selectedContractor}
                      onSelect={() => {}}
                      onRequestConsultation={handleSendMessage}
                      isSelected={true}
                      showActions={true}
                    />
                  </div>
                )}

                {userType === 'contractor' && (
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{project.customerName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <a href={`tel:${project.customerPhone}`} className="text-gray-700 hover:text-primary">
                          {project.customerPhone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href={`mailto:${project.customerEmail}`} className="text-gray-700 hover:text-primary">
                          {project.customerEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={handleSendMessage} className="btn-primary text-sm py-2 w-full">
                      Send Message
                    </button>
                    <button onClick={handleScheduleConsultation} className="btn-outline text-sm py-2 w-full">
                      Schedule Meeting
                    </button>
                    <button className="btn-outline text-sm py-2 w-full">
                      Upload Document
                    </button>
                    {userType === 'contractor' && (
                      <button className="btn-outline text-sm py-2 w-full">
                        Update Project Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Summary */}
                <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Project Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Created:</span>
                      <span className="font-semibold">{project.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Status:</span>
                      <span className="font-semibold text-yellow-600">In Progress</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Completion:</span>
                      <span className="font-semibold">{project.estimatedCompletion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Rebates:</span>
                      <span className="font-semibold text-primary">${project.rebateAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
