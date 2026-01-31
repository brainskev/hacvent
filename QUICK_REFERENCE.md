# 📋 Quick Reference - Home Page Components

## Component Files & Status

| Component    | File                              | Status      | Purpose                                  |
| ------------ | --------------------------------- | ----------- | ---------------------------------------- |
| Hero         | `src/components/Hero.tsx`         | ✅ Updated  | Main landing section with headline & CTA |
| HowItWorks   | `src/components/HowItWorks.tsx`   | ✨ NEW      | 4-step process explanation               |
| Benefits     | `src/components/Benefits.tsx`     | ✨ NEW      | Key benefits with stats                  |
| Testimonials | `src/components/Testimonials.tsx` | ✨ NEW      | Social proof & trust badges              |
| FAQSection   | `src/components/FAQSection.tsx`   | ✅ Enhanced | Q&A with FAQ schema                      |
| CTASection   | `src/components/CTASection.tsx`   | ✅ Enhanced | Final conversion section                 |
| Footer       | `src/components/Footer.tsx`       | ✅ Enhanced | Links & LocalBusiness schema             |
| Home Page    | `src/app/page.tsx`                | ✅ Updated  | Main page with schema markup             |
| Layout       | `src/app/layout.tsx`              | ✅ Updated  | Meta tags & viewport                     |

## Usage in Home Page

```tsx
// In src/app/page.tsx
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <Layout>
      <Hero /> {/* Section 1 */}
      <HowItWorks /> {/* Section 2 */}
      <Benefits /> {/* Section 3 */}
      <Testimonials /> {/* Section 4 */}
      <FAQSection /> {/* Section 5 */}
      <CTASection /> {/* Section 6 */}
    </Layout>
  );
}
```

## Key Props & Customization

### Hero Component

```tsx
// No props - fully self-contained
// Customize by editing:
- Headline text
- Subheadline text
- CTA button links (/eligibility-check, /contractor-onboarding)
- Stats display (10K+, $5K+)
```

### HowItWorks Component

```tsx
// No props - self-contained
// Steps array contains:
- Number (1-4)
- Title
- Description
- Icon component
// Customize by editing the steps array
```

### Benefits Component

```tsx
// No props - self-contained
// Benefits array contains:
- Title
- Description
- Icon
- Highlight text
// Trust stats displayed at bottom
// Customize by editing arrays
```

### Testimonials Component

```tsx
// No props - self-contained
// Testimonials array contains:
-Name - Role - Text - Rating(1 - 5);
// Trust badges shown below
// Customize testimonials array
```

### FAQSection Component

```tsx
// No props - self-contained
// FAQ items contain:
-Question - Answer;
// Includes FAQ schema (JSON-LD)
// Customize faqData array
```

### CTASection Component

```tsx
// No props - self-contained
// Features array customizable
// Customize:
- Main headline
- Subheadline
- CTA button links
- Feature descriptions
```

## Meta Tags & SEO (layout.tsx)

```tsx
export const metadata: Metadata = {
  title: "ThermoGrid - Get Approved for HVAC Rebates...",
  description: "Connect with certified HVAC contractors...",
  keywords: "HVAC rebates, energy-efficient...",
  // ... plus Open Graph, Twitter, canonical
};
```

## Schema Markup Locations

| Schema Type   | Location         | Purpose                      |
| ------------- | ---------------- | ---------------------------- |
| Organization  | `page.tsx`       | Company info, contact        |
| Service       | `page.tsx`       | Service details, area served |
| FAQ           | `FAQSection.tsx` | Q&A rich snippets            |
| LocalBusiness | `Footer.tsx`     | Address, phone, location     |

## Styling System

All components use **Tailwind CSS**:

### Spacing

- Sections: `py-16 md:py-24` (mobile to desktop)
- Inner: `container-custom` (max-width container)
- Cards: `p-6 md:p-8` (responsive padding)

### Colors

- Primary: `from-primary to-secondary` (gradient)
- Text: `text-gray-900` (dark) to `text-gray-600` (light)
- Backgrounds: `bg-white`, `bg-gray-50`, `gradient-primary`

### Typography

- H1: `text-6xl font-bold`
- H2: `text-5xl font-bold`
- H3: `text-xl font-bold`
- Body: `text-base md:text-lg`

### Responsive Patterns

```tsx
// Mobile-first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"

// Sizing
py-16 md:py-24       // Padding vertical
px-6 md:px-8         // Padding horizontal
w-5 md:w-6           // Icon sizing
text-sm md:text-base // Font sizing
```

## CTA Links & Routing

| CTA                     | Link                     | Purpose              |
| ----------------------- | ------------------------ | -------------------- |
| Check Your Eligibility  | `/eligibility-check`     | Main conversion      |
| Join Contractor Network | `/contractor-onboarding` | B2B signup           |
| Start Free Check        | `/eligibility-check`     | Secondary conversion |
| Contact Support         | `/contact`               | Support contact      |
| FAQ Link                | `/faq`                   | Full FAQ page        |

## Icons Used (lucide-react)

| Icon           | Used In      | Purpose           |
| -------------- | ------------ | ----------------- |
| CheckCircle    | Hero, CTA    | Feature indicator |
| ArrowRight     | Buttons      | Call to action    |
| ChevronDown/Up | FAQ          | Expand/collapse   |
| Star           | Testimonials | Ratings           |
| DollarSign     | Benefits     | Money/savings     |
| Clock          | Benefits     | Time savings      |
| Headphones     | Benefits/CTA | Support           |
| TrendingUp     | Benefits     | Growth            |
| FileCheck      | CTA          | Process step      |
| Users          | CTA          | Community         |
| MapPin         | Footer       | Location          |
| Phone          | Footer       | Contact           |
| Mail           | Footer       | Email             |
| Leaf           | Footer       | Brand             |
| Plus more...   | Various      | Section visuals   |

## Custom CSS Classes

These are available from Tailwind in your project:

```css
.container-custom    /* Max-width container with padding */
.card               /* Card styling */
.section-title      /* H2 styling */
.section-subtitle   /* Subheading styling */
.btn-primary        /* Primary button */
.gradient-primary   /* Primary gradient */
.animate-fade-in    /* Fade animation */
.animate-slide-up   /* Slide up animation */
```

## Build & Development

### Installation

```bash
npm install
# All dependencies included in package.json
```

### Development

```bash
npm run dev
# Starts Next.js dev server
# Visit: http://localhost:3000
```

### Build

```bash
npm run build
# Builds production version
# Next.js optimizes automatically
```

### Production

```bash
npm start
# Starts Next.js production server
```

## Common Customizations

### Change Primary Color

Edit `tailwind.config.js`:

```js
colors: {
  primary: '#YOUR_COLOR',
  'primary-dark': '#DARKER_SHADE',
}
```

### Update Company Name

Search & replace "ThermoGrid" with your name in:

- `src/components/Footer.tsx`
- `src/app/layout.tsx`
- `src/components/Hero.tsx`

### Change Headlines

Edit each component's text strings:

- `Hero.tsx`: Line with H1 text
- Each section component: H2 text

### Update Statistics

In `src/components/Benefits.tsx`:

- Edit the stats numbers
- In Testimonials: Update trust stats

### Add Images

1. Place images in `public/` folder
2. Import or reference in components
3. Add alt text for SEO
4. Optimize format (WebP recommended)

## Accessibility Checklist

- ✅ Semantic HTML tags
- ✅ Proper heading hierarchy
- ✅ ARIA labels on buttons
- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Screen reader ready
- ✅ Focus indicators
- ✅ Touch targets 44px+

## Performance Checklist

- ✅ Lazy loading ready
- ✅ Image optimization structure
- ✅ CSS minification (Tailwind)
- ✅ No render blocking
- ✅ Semantic HTML
- ✅ Minimal JavaScript
- ✅ SVG icons
- ✅ Mobile optimized

## Troubleshooting

| Issue                 | Solution                          |
| --------------------- | --------------------------------- |
| Component not showing | Check import path in page.tsx     |
| Styling looks off     | Verify Tailwind CSS is loaded     |
| Schema not validating | Check JSON-LD syntax in component |
| Mobile looks broken   | Test in DevTools device mode      |
| Links not working     | Verify next/link imports          |
| Build errors          | Check for TypeScript errors       |

## Documentation Files

| Document                      | Purpose                          |
| ----------------------------- | -------------------------------- |
| HOME_PAGE_IMPLEMENTATION.md   | Complete implementation guide    |
| HOME_PAGE_VISUAL_GUIDE.md     | Layout diagrams and structure    |
| HOME_PAGE_DEPLOYMENT_GUIDE.md | Testing and deployment checklist |
| HOME_PAGE_PROJECT_SUMMARY.md  | Project overview and status      |
| (This file)                   | Quick reference card             |

---

**Quick Start Command**:

```bash
npm run dev
# Open http://localhost:3000 to see home page
```

**Deploy Command**:

```bash
npm run build && npm start
```

---

_Last Updated: January 31, 2026_  
_Status: 🎉 Production Ready_
