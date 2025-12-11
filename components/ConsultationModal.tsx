import React, { useState } from 'react'
import { X, Calendar, Clock, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react'

interface Contractor {
  id: string
  name: string
  company: string
  phone: string
  email: string
}

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  contractor: Contractor | null
  onSubmit: (data: ConsultationFormData) => void
}

export interface ConsultationFormData {
  contractorId: string
  preferredDate: string
  preferredTime: string
  contactMethod: 'phone' | 'email' | 'either'
  phone: string
  email: string
  message: string
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  contractor,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    contractorId: contractor?.id || '',
    preferredDate: '',
    preferredTime: '',
    contactMethod: 'either',
    phone: '',
    email: '',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen || !contractor) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, contractorId: contractor.id })
    setIsSubmitted(true)
    
    // Reset form and close after 2 seconds
    setTimeout(() => {
      setFormData({
        contractorId: '',
        preferredDate: '',
        preferredTime: '',
        contactMethod: 'either',
        phone: '',
        email: '',
        message: ''
      })
      setIsSubmitted(false)
      onClose()
    }, 2000)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {isSubmitted ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                Consultation Requested!
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-2">
                {contractor.company} will contact you soon to schedule your consultation.
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                You'll receive a confirmation email shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-start justify-between z-10">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Request Consultation
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {contractor.company} - {contractor.name}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Contact Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Your Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="input-field text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="input-field text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Schedule */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Preferred Schedule
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={today}
                        className="input-field text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        <Clock className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Preferred Time
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="input-field text-sm sm:text-base"
                        required
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (8am - 12pm)</option>
                        <option value="afternoon">Afternoon (12pm - 5pm)</option>
                        <option value="evening">Evening (5pm - 8pm)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Method Preference */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors flex-1">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={formData.contactMethod === 'phone'}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary"
                      />
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm sm:text-base font-medium">Phone</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors flex-1">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === 'email'}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary"
                      />
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm sm:text-base font-medium">Email</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors flex-1">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="either"
                        checked={formData.contactMethod === 'either'}
                        onChange={handleChange}
                        className="text-primary focus:ring-primary"
                      />
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span className="text-sm sm:text-base font-medium">Either</span>
                    </label>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Additional Information (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific questions or concerns you'd like to discuss..."
                    rows={4}
                    className="input-field resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Info Banner */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-green-800">
                    <CheckCircle className="inline w-4 h-4 mr-1" />
                    <strong>Note:</strong> This is a free consultation to discuss your HVAC needs and available rebates. 
                    No obligation to proceed.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all touch-manipulation text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl touch-manipulation text-sm sm:text-base"
                  >
                    Request Consultation
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ConsultationModal
