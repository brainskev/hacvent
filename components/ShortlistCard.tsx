import React from 'react'
import { Star, MapPin, CheckCircle, Award, MessageCircle, Phone, Mail } from 'lucide-react'

interface Contractor {
  id: string
  name: string
  company: string
  rating: number
  reviews: number
  certifications: string[]
  specialties: string[]
  location: string
  distance: string
  phone: string
  email: string
  verified: boolean
  availability: 'Available Now' | 'Available Soon' | 'Booked'
  yearsExperience: number
  completedProjects: number
  profileImage?: string
}

interface ShortlistCardProps {
  contractor: Contractor
  onSelect: (contractorId: string) => void
  onRequestConsultation: (contractorId: string) => void
  isSelected?: boolean
  showActions?: boolean
}

const ShortlistCard: React.FC<ShortlistCardProps> = ({
  contractor,
  onSelect,
  onRequestConsultation,
  isSelected = false,
  showActions = true
}) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available Now':
        return 'bg-green-100 text-green-800'
      case 'Available Soon':
        return 'bg-yellow-100 text-yellow-800'
      case 'Booked':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`card hover:shadow-2xl transition-all duration-300 ${isSelected ? 'border-2 border-primary ring-4 ring-primary/20' : ''}`}>
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full font-semibold text-xs sm:text-sm shadow-lg">
          Selected
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        {/* Profile Image Placeholder */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
          {contractor.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">{contractor.company}</h3>
              <p className="text-sm sm:text-base text-gray-600 truncate">{contractor.name}</p>
            </div>
            {contractor.verified && (
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary hidden sm:inline">Verified</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(contractor.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-900">{contractor.rating}</span>
            <span className="text-xs sm:text-sm text-gray-600">({contractor.reviews})</span>
          </div>
        </div>
      </div>

      {/* Availability & Location */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span>{contractor.distance} away</span>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full text-center ${getAvailabilityColor(contractor.availability)}`}>
          {contractor.availability}
        </span>
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-gray-700">Certifications:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {contractor.certifications.map((cert, index) => (
            <span
              key={index}
              className="bg-secondary/10 text-secondary px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Specialties:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {contractor.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Experience Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{contractor.yearsExperience}+</div>
          <div className="text-xs text-gray-600">Years Experience</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{contractor.completedProjects}+</div>
          <div className="text-xs text-gray-600">Projects Completed</div>
        </div>
      </div>

      {/* Contact Info (visible when selected) */}
      {isSelected && (
        <div className="space-y-2 mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-primary" />
            <a href={`tel:${contractor.phone}`} className="hover:text-primary transition-colors">
              {contractor.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4 text-primary" />
            <a href={`mailto:${contractor.email}`} className="hover:text-primary transition-colors">
              {contractor.email}
            </a>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="grid grid-cols-2 gap-3">
          {!isSelected ? (
            <>
              <button
                onClick={() => onRequestConsultation(contractor.id)}
                className="btn-outline text-sm py-2 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Consult
              </button>
              <button
                onClick={() => onSelect(contractor.id)}
                className="btn-primary text-sm py-2"
              >
                Select Contractor
              </button>
            </>
          ) : (
            <button
              onClick={() => onRequestConsultation(contractor.id)}
              className="btn-primary text-sm py-2 col-span-2 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Message Contractor
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ShortlistCard
