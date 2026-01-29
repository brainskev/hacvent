'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth, useClerk } from '@clerk/nextjs'
import { Menu, X, Leaf, LogOut } from 'lucide-react'

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              ThermoGrid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link href="/eligibility-check" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Eligibility Check
            </Link>
            <Link href="/customer-intake" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Homeowners
            </Link>
            <Link href="/contractor-onboarding" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Contractors
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-primary font-medium transition-colors">
              FAQ
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {isSignedIn ? (
                <>
                  <Link
                    href="/customer-dashboard"
                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="inline-flex items-center gap-2 text-gray-700 hover:text-primary font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/eligibility-check" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Eligibility Check
              </Link>
              <Link 
                href="/customer-intake" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Homeowners
              </Link>
              <Link 
                href="/contractor-onboarding" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contractors
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/customer-dashboard"
                      className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        signOut({ redirectUrl: '/' })
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-semibold hover:text-primary transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-primary/90 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
