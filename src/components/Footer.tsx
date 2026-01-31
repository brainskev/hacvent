import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  // Organization schema for footer
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Hacvent',
    'image': '/hacvent-logo.svg',
    'description': 'HVAC rebate assistance and certified contractor matching service. By Marxma LLC.',
    'url': 'https://hacvent.com',
    'telephone': '+1-800-555-1234',
    'email': 'support@hacvent.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Energy Way',
      'addressLocality': 'San Francisco',
      'addressRegion': 'CA',
      'postalCode': '94105',
      'addressCountry': 'US'
    },
    'sameAs': [
      'https://facebook.com/hacvent',
      'https://twitter.com/hacvent',
      'https://linkedin.com/company/hacvent'
    ]
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/hacvent-logo.svg"
                  alt="Hacvent"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">Hacvent</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Connecting homeowners with certified HVAC contractors and simplifying energy-efficient rebate claims across 50+ state programs. By Marxma LLC.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/hacvent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/hacvent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/hacvent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/eligibility-check" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link href="/customer-dashboard" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/contractor-onboarding" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contractor Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Energy Way<br />San Francisco, CA 94105<br />United States
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+18005551234" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  1-800-555-1234
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:support@hacvent.com" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  support@hacvent.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 md:pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">VERIFIED & CERTIFIED</p>
              <p className="text-gray-400 text-sm">Energy Star Certified • Licensed Contractors • Accredited Programs</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">COVERAGE</p>
              <p className="text-gray-400 text-sm">50+ State Programs • 5,000+ Utility Rebates • Federal Tax Credits</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">TRUSTED BY</p>
              <p className="text-gray-400 text-sm">10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate</p>
            </div>
          </div>
          
          <div className="text-center pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Hacvent. All rights reserved. Owned by Marxma LLC. | Empowering energy efficiency nationwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
