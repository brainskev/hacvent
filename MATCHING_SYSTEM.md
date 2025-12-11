# ThermoGrid Hybrid Matching System - Quick Reference

## 🎯 Overview

The hybrid matching system connects HVAC customers with verified contractors while protecting privacy until selection.

## 📊 Key Components

### 1. Customer Dashboard (`/dashboard`)

**Three Tabs:**
- **Overview**: Project timeline, eligibility results, quick actions
- **Contractors**: Browse and select from shortlisted contractors
- **Documents**: Upload rebate documentation, track applications

**Key Features:**
- Eligibility summary showing total savings across all programs
- 3-5 matched contractors based on location and requirements
- Real-time notifications for important updates
- One-click contractor selection
- Consultation request functionality

### 2. Contractor Dashboard (`/contractor-dashboard`)

**Main Features:**
- Filter projects: All, Shortlisted, Selected, In Progress
- Search projects by type or location
- Two visibility levels:
  - **Shortlisted**: Limited project info (privacy-protected)
  - **Selected**: Full customer contact details

**Project Card States:**
- 🟣 **Shortlisted**: Customer reviewing options, limited details visible
- 🟢 **Selected**: Customer chose you, full access granted
- 🟡 **In Progress**: Active installation
- ⚪ **Completed**: Project finished

### 3. Project Details (`/project/[id]`)

**Tabs:**
- **Overview**: Timeline, requirements, rebate programs
- **Documents**: Shared document center
- **Communication**: Messaging (coming soon)

**Dynamic Sidebar:**
- Customers see contractor profile
- Contractors see customer contact info (if selected)

## 🔒 Privacy Protection

### What Contractors See BEFORE Selection:
✅ Project type (e.g., "Central Heat Pump")
✅ Rebate amount ($4,300)
✅ General location (San Francisco, CA)
✅ Project requirements
✅ Estimated start date

❌ Customer name
❌ Exact address
❌ Phone number
❌ Email address

### What Contractors See AFTER Selection:
✅ Everything above, PLUS:
✅ Customer full name
✅ Complete address
✅ Phone number
✅ Email address
✅ Direct messaging access

## 🔔 Notification System

### Notification Types:
- **Success** (Green): Contractor selection, rebate approval
- **Info** (Blue): New matches, document uploads
- **Warning** (Yellow): Missing documents, action required
- **Error** (Red): Application issues, urgent attention

### Key Triggers:
- Customer selects contractor
- New contractor match
- Document upload request
- Rebate status change
- Consultation scheduled

## 📝 Component Reference

### ShortlistCard
```tsx
<ShortlistCard
  contractor={contractorData}
  onSelect={handleSelect}
  onRequestConsultation={handleConsult}
  isSelected={isSelected}
  showActions={true}
/>
```

**Props:**
- `contractor`: Full contractor object with ratings, certs, etc.
- `onSelect`: Function called when "Select Contractor" clicked
- `onRequestConsultation`: Function for consultation requests
- `isSelected`: Boolean to show selected state
- `showActions`: Show/hide action buttons

### ProjectCard
```tsx
<ProjectCard
  project={projectData}
  onViewDetails={handleView}
  onAcceptProject={handleAccept}
  onRequestInfo={handleRequest}
/>
```

**Props:**
- `project`: Project object with visibility property
- `onViewDetails`: Navigate to project details page
- `onAcceptProject`: Contractor accepts selected project
- `onRequestInfo`: Request more info from customer

### EligibilitySummary
```tsx
<EligibilitySummary
  result={eligibilityData}
  onProceed={handleProceed}
/>
```

**Props:**
- `result`: Eligibility results with rebate breakdown
- `onProceed`: Callback for "Proceed to Contractor Selection"

### ProjectProgress
```tsx
<ProjectProgress
  steps={projectSteps}
  currentStep={activeStepIndex}
/>
```

**Props:**
- `steps`: Array of step objects with status
- `currentStep`: Optional current step index

### NotificationCenter
```tsx
<NotificationCenter
  notifications={notificationsArray}
  onMarkAsRead={handleMarkRead}
  onClearAll={handleClearAll}
/>
```

**Props:**
- `notifications`: Array of notification objects
- `onMarkAsRead`: Mark individual notification as read
- `onClearAll`: Clear all notifications

### AlertBanner
```tsx
<AlertBanner
  type="info"
  title="Action Required"
  message="Please complete this task"
  onDismiss={handleDismiss}
  actionLabel="Do It Now"
  onAction={handleAction}
/>
```

**Props:**
- `type`: 'success' | 'warning' | 'info' | 'error'
- `title`: Banner headline
- `message`: Descriptive text
- `onDismiss`: Optional close button handler
- `actionLabel`: Optional action button text
- `onAction`: Optional action button handler

## 🔄 Typical User Flows

### Customer Journey:
1. Land on homepage → Check eligibility
2. See $4,300 total savings
3. Navigate to dashboard
4. Review 3 matched contractors
5. Select "Cool Breeze HVAC Solutions"
6. Contractor receives notification
7. Schedule consultation
8. Installation proceeds
9. Upload documents
10. Track rebate approvals

### Contractor Journey:
1. Complete verification
2. Get shortlisted for project
3. See limited project details
4. Wait for customer selection
5. Receive "You were selected!" notification
6. Access full customer contact info
7. Accept project
8. Schedule installation
9. Complete work
10. Upload certification docs

## 🎨 Design System

### Color Usage:
- **Primary (Green #4CAF50)**: Main actions, success states
- **Secondary (Blue #2196F3)**: Info, links, alternate actions
- **Yellow**: Warnings, in-progress states
- **Red**: Errors, urgent actions
- **Purple**: Shortlisted status
- **Green**: Selected/completed status

### Common Patterns:
- Cards with hover effects: `card hover:shadow-xl`
- Primary buttons: `btn-primary`
- Outline buttons: `btn-outline`
- Status badges: Rounded full with appropriate color
- Icons from lucide-react for consistency

## 🧪 Testing Scenarios

### Test as Customer:
1. Visit `/dashboard`
2. Switch between tabs (Overview, Contractors, Documents)
3. Click "Select Contractor" on different contractors
4. Verify selected state (green border, checkmark)
5. Request consultation
6. Check notifications dropdown

### Test as Contractor:
1. Visit `/contractor-dashboard`
2. Filter by "Shortlisted" - see limited info
3. Filter by "Selected" - see full customer details
4. Click "View Details" on project
5. Verify contact info only shows for selected projects
6. Accept project
7. Check notifications

### Test Project Details:
1. Navigate to `/project/1`
2. Switch between tabs
3. Verify sidebar shows correct info based on role
4. Test document upload
5. Check progress timeline

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Stacked layouts, full-width cards
- **Tablet**: 768px - 1024px - 2-column grids
- **Desktop**: ≥ 1024px - 3-column grids, side-by-side layouts

## 🚨 Common Issues & Solutions

**Issue**: Contractor sees full customer details while shortlisted
**Solution**: Check `project.visibility` property - must be 'limited' for shortlisted

**Issue**: Notifications not updating
**Solution**: State management - ensure notifications array is updated correctly

**Issue**: Selected contractor doesn't show in customer view
**Solution**: Verify `selectedContractor` state matches contractor ID

**Issue**: Project progress not displaying
**Solution**: Check that steps array has proper status values: 'completed', 'in-progress', 'pending', 'blocked'

## 🔗 Quick Links

- Customer Dashboard: `/dashboard`
- Contractor Dashboard: `/contractor-dashboard`
- Project Details: `/project/[id]`
- FAQ: `/faq`
- Homepage: `/`

## 📞 Support

For development questions:
- Check component files in `/components`
- Review page implementations in `/pages`
- Refer to README.md for full documentation
- Check TypeScript interfaces for data structures

---

Last Updated: December 11, 2025
Version: 2.0 (Hybrid Matching System)
