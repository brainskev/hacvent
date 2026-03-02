# 🔄 Google Ads Violations - Before & After Code Examples

**Purpose**: Show exact code changes needed to fix violations  
**Format**: Side-by-side comparisons  
**Implementation**: Copy-paste ready

---

## 1️⃣ TESTIMONIALS COMPONENT

### ❌ BEFORE (VIOLATES POLICY)

**File**: `src/components/Testimonials.tsx`

```tsx
"use client";

import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Homeowner, Michigan",
      text: "Hacvent made the rebate process so simple. The team handled everything for me and I was able to access rebates I didn't know about. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "HVAC Contractor, Ohio",
      text: "As a contractor, I love how Hacvent streamlines rebate documentation. My customers are happier and we close deals faster. Best partnership we've made.",
      rating: 5,
    },
    {
      name: "Patricia Rodriguez",
      role: "Homeowner, Wisconsin",
      text: "I was intimidated by the rebate application process, but Hacvent's team guided me every step and made it easy to understand.",
      rating: 5,
    },
    {
      name: "James Park",
      role: "Energy Auditor, Illinois",
      text: "Hacvent connects homeowners with the best rebate opportunities. Their platform is intuitive and their support team is fantastic.",
      rating: 5,
    },
  ];
  // ... rest of component
};
```

### ✅ AFTER OPTION A: DELETE TESTIMONIALS

**File**: `src/app/page.tsx`

```tsx
"use client";

import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
// REMOVE THIS LINE:
// import Testimonials from '@/components/Testimonials'
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Layout>
        <Hero />
        <HowItWorks />
        <Benefits />
        {/* REMOVE OR COMMENT OUT THIS LINE: */}
        {/* <Testimonials /> */}
        <FAQSection />
        <CTASection />
      </Layout>
    </>
  );
}
```

### ✅ AFTER OPTION B: REPLACE WITH REAL TESTIMONIALS

**File**: `src/components/Testimonials.tsx`

```tsx
"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string; // ADD THIS
  verified: boolean; // ADD THIS
}

const Testimonials: React.FC = () => {
  // ONLY INCLUDE REAL, VERIFIED CUSTOMER TESTIMONIALS
  const testimonials: Testimonial[] = [
    {
      name: "[Real Customer Name]",
      role: "Verified Customer • [Location]",
      text: "[Their actual testimonial about real experience]",
      rating: 5,
      date: "January 15, 2024",
      verified: true,
    },
    // Add more REAL verified testimonials only
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            What Verified Customers Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See what real customers say about their experience with Hacvent.
          </p>
          {/* ADD THIS VERIFICATION BADGE */}
          <p className="text-xs text-green-600 mt-4 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verified customer testimonials from verified purchases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative"
            >
              {/* VERIFICATION BADGE */}
              {testimonial.verified && (
                <div className="absolute top-3 right-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              )}

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              <div>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-600">{testimonial.role}</div>
                <div className="text-xs text-gray-500 mt-2">
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
```

---

## 2️⃣ FOOTER METRICS CLAIMS

### ❌ BEFORE (VIOLATES POLICY)

**File**: `src/components/Footer.tsx` (lines 164-171)

```tsx
<div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 md:pt-12">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        VERIFIED & CERTIFIED
      </p>
      <p className="text-gray-400 text-sm">
        Energy Star Certified • Licensed Contractors • Accredited Programs
      </p>
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        COVERAGE
      </p>
      <p className="text-gray-400 text-sm">
        50+ State Programs • 5,000+ Utility Rebates • Federal Tax Credits
      </p>
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        TRUSTED BY
      </p>
      <p className="text-gray-400 text-sm">
        10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate
      </p>
    </div>
  </div>

  <div className="text-center pt-6 border-t border-gray-800">
    <p className="text-gray-400 text-sm">
      &copy; {currentYear} Hacvent by Marxma LLC. All rights reserved.
    </p>
  </div>
</div>
```

### ✅ AFTER (COMPLIANT)

**File**: `src/components/Footer.tsx` (lines 164-171)

```tsx
<div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 md:pt-12">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        OUR SERVICES
      </p>
      <p className="text-gray-400 text-sm">
        Expert Guidance • Licensed Contractors • Simplified Process
      </p>
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        COVERAGE
      </p>
      <p className="text-gray-400 text-sm">
        Multiple State Programs • Utility Rebates • Federal Tax Credits
      </p>
    </div>
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
        COMMITMENT
      </p>
      <p className="text-gray-400 text-sm">
        Trusted by homeowners nationwide • Quality support • Verified
        contractors
      </p>
    </div>
  </div>

  <div className="text-center pt-6 border-t border-gray-800">
    <p className="text-gray-400 text-sm">
      &copy; {currentYear} Hacvent by Marxma LLC. All rights reserved.
    </p>
  </div>
</div>
```

---

## 3️⃣ HERO REBATE CLAIMS

### ❌ BEFORE (VIOLATES POLICY)

**File**: `src/components/Hero.tsx` (lines 47-54)

```tsx
{
  /* Stats Cards */
}
<div className="grid grid-cols-2 gap-3 sm:gap-4">
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
    <div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>
  </div>
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">10K+</div>
    <div className="text-xs sm:text-sm text-white/80">Happy Customers</div>
  </div>
</div>;
```

### ✅ AFTER OPTION A: WITH DISCLAIMER

**File**: `src/components/Hero.tsx` (lines 47-54)

```tsx
{
  /* Stats Cards */
}
<div className="grid grid-cols-2 gap-3 sm:gap-4">
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">Up to $14K</div>
    <div className="text-xs sm:text-sm text-white/80">
      Potential HVAC Rebates
    </div>
    <div className="text-xs text-white/60 mt-2">
      *Amounts vary by state & eligibility
    </div>
  </div>
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">Expert</div>
    <div className="text-xs sm:text-sm text-white/80">
      HVAC Guidance & Support
    </div>
  </div>
</div>;
```

### ✅ AFTER OPTION B: CONSERVATIVE

**File**: `src/components/Hero.tsx` (lines 47-54)

```tsx
{
  /* Stats Cards */
}
<div className="grid grid-cols-2 gap-3 sm:gap-4">
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">Maximize</div>
    <div className="text-xs sm:text-sm text-white/80">
      Your Rebate Potential
    </div>
    <a
      href="/eligibility-check"
      className="text-xs text-white hover:underline mt-2 inline-block"
    >
      Check your eligibility →
    </a>
  </div>
  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30 hover:bg-white/30 transition-colors duration-300">
    <div className="text-2xl sm:text-3xl font-bold text-white">5,000+</div>
    <div className="text-xs sm:text-sm text-white/80">Programs Nationwide</div>
  </div>
</div>;
```

---

## 4️⃣ TRUST BADGES / CERTIFICATIONS

### ❌ BEFORE (VIOLATES POLICY)

**File**: `src/components/Testimonials.tsx` (lines 104-135)

```tsx
{
  /* Partner Logo Grid */
}
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 px-4 bg-white rounded-lg border border-gray-200">
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Energy Star</div>
      <div className="text-xs text-gray-500">Certified</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Federal Tax Credits</div>
      <div className="text-xs text-gray-500">Approved</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">State Programs</div>
      <div className="text-xs text-gray-500">50+ States</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Utility Rebates</div>
      <div className="text-xs text-gray-500">5000+ Programs</div>
    </div>
  </div>
</div>;
```

### ✅ AFTER (COMPLIANT)

**File**: `src/components/Testimonials.tsx` (lines 104-135)

```tsx
{
  /* Partner Logo Grid */
}
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 px-4 bg-white rounded-lg border border-gray-200">
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Expert</div>
      <div className="text-xs text-gray-500">Guidance</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Federal & State</div>
      <div className="text-xs text-gray-500">Programs</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">50+ States</div>
      <div className="text-xs text-gray-500">Covered</div>
    </div>
  </div>
  <div className="flex items-center justify-center py-4">
    <div className="font-semibold text-gray-600 text-center">
      <div className="text-sm font-bold">Verified</div>
      <div className="text-xs text-gray-500">Contractors</div>
    </div>
  </div>
</div>;
```

---

## 5️⃣ CTA SECTION CLAIMS

### ❌ BEFORE (NEEDS VERIFICATION)

**File**: `src/components/CTASection.tsx` (line 87)

```tsx
{
  /* Trust Indicators */
}
<div className="mt-12 text-center">
  <p className="text-white/80 text-sm mb-6 flex items-center justify-center gap-6 flex-wrap">
    <span className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      No credit card required
    </span>
    {/* ... more claims ... */}
  </p>
</div>;
```

### ✅ AFTER (VERIFIED & CLEAR)

**File**: `src/components/CTASection.tsx` (line 87)

```tsx
{
  /* Trust Indicators */
}
<div className="mt-12 text-center">
  <p className="text-white/80 text-sm mb-6 flex items-center justify-center gap-6 flex-wrap">
    <span className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      Free to get started
    </span>
    <span className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      Professional support
    </span>
    <span className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      No hidden fees
    </span>
  </p>

  {/* ADD DISCLAIMERS IF NEEDED */}
  <div className="text-xs text-white/60 mt-4">
    *Optional services available for contractors
  </div>
</div>;
```

---

## 6️⃣ FOOTER "VERIFIED & CERTIFIED" SECTION

### ❌ BEFORE (MISLEADING)

**File**: `src/components/Footer.tsx` (lines 165-166)

```tsx
<div>
  <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
    VERIFIED & CERTIFIED
  </p>
  <p className="text-gray-400 text-sm">
    Energy Star Certified • Licensed Contractors • Accredited Programs
  </p>
</div>
```

### ✅ AFTER (ACCURATE)

**File**: `src/components/Footer.tsx` (lines 165-166)

```tsx
<div>
  <p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">
    OUR STANDARDS
  </p>
  <p className="text-gray-400 text-sm">
    Licensed Contractors • Verified Professionals • Secure Process
  </p>
</div>
```

---

## 📋 Quick Copy-Paste Reference

### For Delete Testimonials:

```tsx
// In src/app/page.tsx, remove this line:
import Testimonials from "@/components/Testimonials";

// And remove this line from the JSX:
<Testimonials />;

// Done!
```

### For Fix Footer Claims:

```tsx
// Search for and replace:
"10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate";

// Replace with:
"Trusted by homeowners nationwide • Expert support • Hassle-free process";
```

### For Fix Hero Claims:

```tsx
// Search for and replace:
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>

// Replace with:
<div className="text-2xl sm:text-3xl font-bold text-white">Up to $14K</div>
<div className="text-xs sm:text-sm text-white/80">
  Rebates Available<br/>
  <span className="text-xs text-white/60">*Amounts vary by location</span>
</div>
```

---

## ✅ IMPLEMENTATION STEPS

1. **Choose fix option** from above (A, B, or C)
2. **Copy the new code**
3. **Replace in file** (use Find & Replace for accuracy)
4. **Test thoroughly** (visual check, link verification)
5. **Deploy** when ready

---

**All code is ready to use** - Just copy and paste!

For detailed explanation of WHY these changes are needed, see: `GOOGLE_ADS_POLICY_VIOLATIONS_AUDIT.md`
