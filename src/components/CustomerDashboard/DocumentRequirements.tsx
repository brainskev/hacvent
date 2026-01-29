'use client'

import React from 'react'
import { DocumentType } from '@/lib/types'

const DOCUMENT_CATEGORIES = {
  income: {
    title: 'Income Verification',
    types: [
      { value: DocumentType.INCOME_TAX_FORM, label: 'Tax Form (1040, W2, 1099)' },
      { value: DocumentType.WAGE_STATEMENT, label: 'Recent Wage Statements' },
      { value: DocumentType.RETIREMENT_INCOME_PROOF, label: 'Retirement Income Proof' },
      { value: DocumentType.GOVERNMENT_ASSISTANCE_PROOF, label: 'Government Assistance' },
      { value: DocumentType.UNEMPLOYMENT_BENEFITS, label: 'Unemployment Benefits' }
    ]
  },
  ownership: {
    title: 'Proof of Ownership',
    types: [
      { value: DocumentType.PROPERTY_TAX_BILL, label: 'Property Tax Bill' },
      { value: DocumentType.HOME_INSURANCE_STATEMENT, label: 'Home Insurance Statement' },
      { value: DocumentType.MORTGAGE_STATEMENT, label: 'Mortgage Statement' }
    ]
  }
}

export function DocumentRequirements() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">Documents Needed</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income Verification */}
        <div>
          <p className="text-xs font-semibold text-blue-800 mb-2">Choose 1 - Income Verification:</p>
          <ul className="space-y-1">
            {DOCUMENT_CATEGORIES.income.types.map((doc) => (
              <li key={doc.value} className="text-xs text-blue-700 flex gap-2">
                <span className="text-blue-400">•</span>
                <span>{doc.label}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Proof of Ownership */}
        <div>
          <p className="text-xs font-semibold text-blue-800 mb-2">Choose 1 - Proof of Ownership:</p>
          <ul className="space-y-1">
            {DOCUMENT_CATEGORIES.ownership.types.map((doc) => (
              <li key={doc.value} className="text-xs text-blue-700 flex gap-2">
                <span className="text-blue-400">•</span>
                <span>{doc.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
