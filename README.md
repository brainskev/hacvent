# ThermoGrid 🌿

**Connecting HVAC customers with contractors and simplifying rebate claims across the US**

ThermoGrid is a modern web platform built with Next.js that helps homeowners navigate HVAC rebate programs, connects them with certified contractors, and streamlines the rebate application process.

![ThermoGrid](https://via.placeholder.com/1200x400/4CAF50/FFFFFF?text=ThermoGrid+-+HVAC+Rebates+Made+Easy)

## ✨ Features

### 🎯 Hybrid Matching System
- **Smart Contractor Matching**: Automated shortlisting based on location, certifications, ratings, and availability
- **Customer Selection Control**: Customers review shortlisted contractors and choose their preferred professional
- **Privacy Protection**: Sensitive customer details hidden until contractor is selected
- **Dual Dashboard System**: Separate optimized experiences for customers and contractors

### For Customers
- **🏠 Homepage**: Eye-catching landing page with hero banner, FAQ section, and eligibility checker
- **📊 Enhanced Dashboard**: 
  - View complete rebate eligibility results with program breakdown
  - Browse shortlisted contractors with ratings, certifications, and experience
  - Select preferred contractor from matched professionals
  - Track project progress through all stages
  - Real-time notifications for project updates
  - Tab-based navigation (Overview, Contractors, Documents)
- **✅ Eligibility Checker**: Quick form to check available rebates based on location and system details
- **📚 Comprehensive FAQ**: Searchable knowledge base with 23+ detailed questions about HVAC rebates
- **📝 Document Upload**: Drag-and-drop interface for uploading required rebate documentation
- **🔔 Notification System**: Bell icon with unread count, dropdown notification center

### For Contractors
- **🔧 Contractor Dashboard**: 
  - View shortlisted and selected projects
  - Access limited details for shortlisted projects (privacy-protected)
  - Full customer contact info once selected
  - Filter projects by status (Shortlisted, Selected, In Progress)
  - Search functionality for projects
  - Real-time notifications for new matches
- **📋 Project Visibility System**: 
  - **Shortlisted**: See project requirements and rebate value, but limited customer info
  - **Selected**: Full access to customer contact details and project information
- **💼 Project Management**: Track installation progress, upload documents, update status
- **💰 Revenue Tracking**: View total value of active projects

### Design & UX
- **🎨 Renewable Energy Theme**: Green (#4CAF50), Blue (#2196F3), and neutral color scheme
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **✨ Smooth Animations**: Fade-in, slide-up, and transition effects throughout
- **♿ Accessible**: Semantic HTML and ARIA labels for better accessibility

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thermogrid.git
   cd thermogrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
thermogrid/
├── components/                    # Reusable React components
│   ├── Header.tsx                # Main navigation header with notifications
│   ├── Footer.tsx                # Site footer with links
│   ├── Layout.tsx                # Page layout wrapper
│   ├── Hero.tsx                  # Homepage hero section
│   ├── FAQSection.tsx            # FAQ accordion component
│   ├── EligibilityChecker.tsx    # Rebate eligibility form
│   ├── CTASection.tsx            # Call-to-action section
│   ├── RebateTracker.tsx         # Dashboard rebate status cards
│   ├── DocumentUpload.tsx        # File upload interface with drag-and-drop
│   ├── ContractorCard.tsx        # Basic contractor profile card
│   ├── ShortlistCard.tsx         # Enhanced contractor card for matching
│   ├── ProjectCard.tsx           # Project listing card with visibility controls
│   ├── EligibilitySummary.tsx    # Rebate eligibility results display
│   ├── ProjectProgress.tsx       # Visual timeline progress tracker
│   └── NotificationCenter.tsx    # Notification bell and alert banners
├── pages/                         # Next.js pages (routes)
│   ├── _app.tsx                  # App wrapper with global styles
│   ├── _document.tsx             # HTML document structure
│   ├── index.tsx                 # Homepage
│   ├── dashboard.tsx             # Enhanced customer dashboard with tabs
│   ├── contractor-dashboard.tsx  # Contractor project management dashboard
│   ├── contractor.tsx            # Contractor portal/sign-up
│   ├── faq.tsx                   # FAQ page
│   └── project/
│       └── [id].tsx              # Dynamic project details page
├── styles/                        # Global styles
│   ├── globals.css               # Tailwind base + custom styles
│   └── fonts.css                 # Font imports
├── public/                        # Static assets (add images here)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

## 🎯 Key Pages

### Homepage (`/`)
- Hero section with main value proposition
- Eligibility checker form
- FAQ section with most common questions
- Call-to-action section with feature highlights

### Customer Dashboard (`/dashboard`)
- **Overview Tab**: 
  - Project timeline with visual progress steps
  - Rebate eligibility summary with program breakdown
  - Total savings calculation
  - Quick actions sidebar
- **Contractors Tab**: 
  - Shortlisted contractor cards with ratings and certifications
  - Contractor selection interface
  - Consultation request functionality
  - Privacy-protected browsing
- **Documents Tab**: 
  - Rebate application status tracker
  - Document upload center with drag-and-drop
  - Required documents checklist

### Contractor Dashboard (`/contractor-dashboard`)
- Project filtering (All, Shortlisted, Selected, In Progress)
- Search functionality for projects
- Project cards with visibility controls:
  - Limited view for shortlisted projects
  - Full view with customer contact for selected projects
- Stats overview (Shortlisted, Selected, In Progress, Total Value)
- Real-time notifications for new opportunities
- Active project progress tracking

### Project Details (`/project/[id]`)
- Comprehensive project information view
- Works for both customers and contractors
- **Overview Tab**: Timeline, requirements, rebate programs
- **Documents Tab**: Centralized document management
- **Communication Tab**: Messaging interface (coming soon)
- Context-aware sidebar (contractor info for customers, customer info for contractors)

### Contractor Portal (`/contractor`)
- Sign-up form for new contractors
- Verification status tracking
- Certification options and rebate specialist program

### FAQ Page (`/faq`)
- Searchable FAQ database (23+ questions)
- Category filtering (General, Eligibility, Application, etc.)
- Expandable/collapsible question cards
- Contact support section

## 🎨 Theme Customization

The color scheme is defined in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#4CAF50',  // Green
    light: '#81C784',
    dark: '#388E3C',
  },
  secondary: {
    DEFAULT: '#2196F3',  // Blue
    light: '#64B5F6',
    dark: '#1976D2',
  },
  neutral: {
    light: '#F5F5F5',   // Light gray
    DEFAULT: '#E0E0E0',
    dark: '#757575',
  },
}
```

Custom utility classes are available in `styles/globals.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outlined button style
- `.card` - Card container with shadow
- `.input-field` - Form input styling

## 🔌 API Integration Points

The following areas are ready for backend API integration:

### 🎯 Matching System
- **Contractor Matching Algorithm** (`pages/dashboard.tsx`):
  - `contractorShortlist` - Auto-generate based on location, certifications, ratings
  - Scoring algorithm: proximity, certification match, availability, customer ratings
  - Real-time updates when contractor status changes

- **Contractor Selection** (`pages/dashboard.tsx`):
  - `handleSelectContractor()` - Update project with selected contractor
  - Trigger notifications to both customer and contractor
  - Update project visibility for contractor

### Customer Features
- **Eligibility Checker** (`components/EligibilityChecker.tsx`):
  - `handleSubmit()` - Check rebate eligibility based on ZIP, home type, and system age
  - Return eligible programs, requirements, and total savings
  
- **Dashboard** (`pages/dashboard.tsx`):
  - `eligibilityResult` - Fetch customer's rebate eligibility
  - `contractorShortlist` - Get matched contractors (top 3-5)
  - `projectSteps` - Fetch project timeline and current status
  - `notifications` - Real-time notification feed
  
- **Rebate Tracker** (`components/RebateTracker.tsx`):
  - Replace `mockRebates` with API call to fetch user's rebate applications
  
- **Document Upload** (`components/DocumentUpload.tsx`):
  - `handleDrop()` and `handleFileInput()` - Upload files to cloud storage (S3/Azure)
  - `removeFile()` - Delete uploaded documents

### Contractor Features
- **Contractor Dashboard** (`pages/contractor-dashboard.tsx`):
  - `projects` - Fetch projects where contractor is shortlisted or selected
  - `handleAcceptProject()` - Accept selected project and confirm availability
  - `handleRequestInfo()` - Request additional project details from customer
  - `notifications` - New project matches and customer selections
  
- **Project Visibility** (`components/ProjectCard.tsx`):
  - Enforce privacy rules: limited view for shortlisted, full view for selected
  - Real-time updates when customer selects contractor
  
- **Contractor Sign-Up** (`pages/contractor.tsx`):
  - `handleSubmit()` in `ContractorSignUpForm` - Submit contractor application
  - Upload certifications and licenses

### Project Management
- **Project Details** (`pages/project/[id].tsx`):
  - Fetch project by ID with role-based access control
  - Update project status and milestones
  - Document sharing between customer and contractor
  - Messaging/communication logs

### Notifications
- **NotificationCenter** (`components/NotificationCenter.tsx`):
  - Real-time push notifications (WebSocket/Server-Sent Events)
  - Mark as read/unread
  - Action URLs for quick navigation
  - Types: contractor selection, document requests, rebate approvals, etc.

### Authentication & Authorization
- Header component includes login/signup links
- Dashboard pages need authentication guards
- Role-based access: customer vs contractor views
- Session management and JWT tokens

### Suggested Backend Endpoints
```
# Eligibility & Matching
POST   /api/eligibility/check           - Check rebate eligibility
POST   /api/matching/generate            - Generate contractor shortlist
POST   /api/projects/select-contractor   - Customer selects contractor

# Customer Endpoints
GET    /api/customer/dashboard           - Get dashboard data
GET    /api/customer/projects            - Get customer's projects
GET    /api/rebates/user/:id             - Get user's rebate applications
POST   /api/rebates/apply                - Submit new rebate application

# Contractor Endpoints
GET    /api/contractor/dashboard         - Get contractor dashboard data
GET    /api/contractor/projects          - Get projects (shortlisted + selected)
POST   /api/contractor/accept/:projectId - Accept selected project
POST   /api/contractor/request-info      - Request more project details

# Projects
GET    /api/projects/:id                 - Get project details (role-based)
PUT    /api/projects/:id/status          - Update project status
GET    /api/projects/:id/timeline        - Get project timeline/progress

# Documents
POST   /api/documents/upload             - Upload documents
GET    /api/documents/project/:projectId - Get project documents
DELETE /api/documents/:id                - Delete document

# Notifications
GET    /api/notifications                - Get user notifications
PUT    /api/notifications/:id/read       - Mark notification as read
DELETE /api/notifications/clear          - Clear all notifications
WS     /ws/notifications                 - WebSocket for real-time updates

# Authentication
POST   /api/auth/login                   - User login
POST   /api/auth/register                - User registration
POST   /api/auth/logout                  - User logout
GET    /api/auth/me                      - Get current user
POST   /api/contractor/register          - Register new contractor
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Pages

1. Create a new file in `pages/` directory
2. Import and use the `Layout` component
3. Add navigation link in `components/Header.tsx`

Example:
```tsx
import Layout from '@/components/Layout'

export default function NewPage() {
  return (
    <Layout>
      <div className="container-custom py-12">
        {/* Your content */}
      </div>
    </Layout>
  )
}
```

## 📱 Responsive Design

All components are responsive with mobile-first design:
- **Mobile**: < 768px (stacked layouts, hamburger menu)
- **Tablet**: 768px - 1023px (2-column grids)
- **Desktop**: ≥ 1024px (3-4 column grids, full features)

## 🎭 Sample Data

The application includes mock data for demonstration:
- 3 sample rebate applications in the dashboard
- 1 sample contractor profile
- 23 FAQ entries across 8 categories
- Placeholder statistics and metrics

Replace mock data with real API calls for production.

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
Build the project and deploy the `.next` folder:
```bash
npm run build
npm run start
```

## 🔐 Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=https://api.thermogrid.com
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For questions or support:
- 📧 Email: support@thermogrid.com
- 📱 Phone: 1-800-555-1234
- 🌐 Website: [www.thermogrid.com](https://thermogrid.com)

## 🔐 Security & Privacy Features

### Privacy-Protected Matching
- **Shortlisted Phase**: Contractors see project requirements and rebate value, but NOT:
  - Customer name
  - Exact address (only city/ZIP)
  - Contact information
  - Sensitive property details

- **Selected Phase**: Full access granted only after customer selection:
  - Complete customer contact info
  - Exact property address
  - Project-specific requirements
  - Direct communication channels

### Data Protection
- Document uploads should use encrypted cloud storage
- Customer PII protected until contractor selection
- Role-based access control for all API endpoints
- Session management with secure tokens
- Audit logs for contractor selection and project updates

## 🚀 How the Matching System Works

### For Customers:
1. **Check Eligibility** → Enter ZIP, home type, system age
2. **View Results** → See total savings and eligible programs
3. **Review Contractors** → Browse 3-5 matched professionals with ratings
4. **Select Contractor** → Choose preferred contractor
5. **Collaborate** → Work together on installation and rebate paperwork
6. **Track Progress** → Monitor each stage from order to approval

### For Contractors:
1. **Complete Verification** → Submit licenses and certifications
2. **Get Matched** → Automatically shortlisted for relevant projects
3. **Review Projects** → See limited details of potential jobs
4. **Wait for Selection** → Customer chooses their preferred contractor
5. **Access Full Details** → Receive complete customer info upon selection
6. **Execute Project** → Install system and help with rebate documentation

### Matching Algorithm Factors:
- **Location/Proximity**: Distance from customer property
- **Certifications**: EPA 608, NATE, rebate specialist credentials
- **Experience**: Years in business, completed projects
- **Ratings**: Customer reviews and platform reputation
- **Availability**: Current workload and scheduling
- **Specialty Match**: Heat pumps, ductless, geothermal, etc.

## 🗺️ Roadmap

### ✅ Completed (Current Release)
- [x] Hybrid matching system with privacy protection
- [x] Customer dashboard with contractor selection
- [x] Contractor dashboard with project visibility controls
- [x] Real-time notifications system
- [x] Project progress tracking
- [x] Eligibility summary with rebate breakdown
- [x] Document management system
- [x] Responsive design for all devices

### 🚧 In Development
- [ ] User authentication with JWT and role-based access
- [ ] Real-time messaging between customers and contractors
- [ ] WebSocket integration for live notifications
- [ ] Payment processing for contractor certification
- [ ] Calendar integration for consultation scheduling
- [ ] Mobile-responsive improvements

### 📋 Planned Features
- [ ] Admin dashboard for managing users and applications
- [ ] Email notifications for all project milestones
- [ ] SMS alerts for time-sensitive updates
- [ ] Integration with government rebate APIs
- [ ] Automated rebate form filling
- [ ] Review and rating system after project completion
- [ ] Contractor portfolio and case studies
- [ ] Multi-language support (Spanish, Chinese)
- [ ] Mobile app (React Native)
- [ ] AI-powered chatbot for FAQ
- [ ] Advanced analytics dashboard
- [ ] Referral program for customers and contractors

---

Built with ♥️ by the ThermoGrid Team | Empowering energy efficiency nationwide 🌿
