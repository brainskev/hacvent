import React from 'react'
import Link from 'next/link'
import { Menu, X, Leaf } from 'lucide-react'

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

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
            <Link href="/faq" className="text-gray-700 hover:text-primary font-medium transition-colors">
              FAQ
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Customer
            </Link>
            <Link href="/contractor-dashboard" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Contractor
            </Link>
            <Link href="/login" className="btn-outline text-sm py-2 px-4">
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Sign Up
            </Link>
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
                href="/faq" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Customer Dashboard
              </Link>
              <Link 
                href="/contractor-dashboard" 
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contractor Dashboard
              </Link>
              <Link 
                href="/login" 
                className="btn-outline text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn-primary text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
