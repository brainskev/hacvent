'use client'

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FolderOpen, 
  DollarSign,
  BarChart3,
  Menu,
  X,
  LogOut
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Contractors', href: '/admin/contractors', icon: Briefcase },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ]

  return (
    <>
      <Head>
        <title>{`${title} | ThermoGrid Admin`}</title>
        <meta name="description" content="Admin dashboard for ThermoGrid HVAC rebate platform" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ThermoGrid Admin</span>
            </Link>
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-64 min-h-screen">
          {/* Top bar */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">admin@hacvent.com</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
