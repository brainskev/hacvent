import React from 'react'
import { Phone, Mail, MapPin, Star, CheckCircle } from 'lucide-react'

interface Contractor {
  id: string
  name: string
  company: string
  rating: number
  reviews: number
  specialties: string[]
  location: string
  phone: string
  email: string
  verified: boolean
}

const mockContractor: Contractor = {
  id: '1',
  name: 'John Martinez',
  company: 'Cool Breeze HVAC Solutions',
  rating: 4.9,
  reviews: 127,
  specialties: ['Heat Pumps', 'Central AC', 'Ductless Systems'],
  location: 'San Francisco, CA',
  phone: '(415) 555-0123',
  email: 'john@coolbreezehvac.com',
  verified: true
}

const ContractorCard: React.FC = () => {
  return (
    <div className="card bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{mockContractor.company}</h3>
          <p className="text-gray-600">Lead Technician: {mockContractor.name}</p>
        </div>
        {mockContractor.verified && (
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Verified</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(mockContractor.rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-900">{mockContractor.rating}</span>
        <span className="text-gray-600">({mockContractor.reviews} reviews)</span>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-2">
          {mockContractor.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
          <span>{mockContractor.location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
          <a href={`tel:${mockContractor.phone}`} className="hover:text-primary transition-colors">
            {mockContractor.phone}
          </a>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-5 h-5 text-primary flex-shrink-0" />
          <a href={`mailto:${mockContractor.email}`} className="hover:text-primary transition-colors">
            {mockContractor.email}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-outline text-sm py-2">
          View Profile
        </button>
        <button className="btn-primary text-sm py-2">
          Message
        </button>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <span className="font-semibold">Status:</span> Your contractor is ready to start your project
        </p>
      </div>
    </div>
  )
}

export default ContractorCard
