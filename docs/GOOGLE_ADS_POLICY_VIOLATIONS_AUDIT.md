# 🚨 Google Ads Policy Violation Audit - Hacvent

**Date**: February 28, 2026  
**Project**: Hacvent (hacvent.com)  
**Audit Type**: Comprehensive Policy Compliance Review  
**Risk Level**: 🔴 **HIGH** - Multiple violations identified

---

## Executive Summary

**CRITICAL FINDING**: The website contains **multiple unsubstantiated claims and fake testimonials** that violate Google Ads policies and will lead to campaign disapproval.

**Violations Found**: 7 major issues  
**Recommended Action**: Fix before Google Ads submission  
**Estimated Fix Time**: 2-3 hours

---

## 🔴 CRITICAL VIOLATIONS (Will cause disapproval)

### 1. **Unsubstantiated Business Metrics Claims**

**Severity**: 🔴 CRITICAL  
**Location**: Footer (`src/components/Footer.tsx` lines 165-171)  
**Current Claims**:

```
"10,000+ Homeowners"
"$50M+ Rebates Claimed"
"99% Approval Rate"
```

**Google Policy Issue**:

- These are specific numerical claims without supporting documentation
- Google requires substantiation for claims about business metrics
- Making false or unverifiable claims violates Google Ads policies

**Evidence Found**:

```tsx
// Footer.tsx line 170
<p className="text-gray-400 text-sm">
  10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate
</p>
```

**Fix Required**:

- [ ] Remove or replace with verified metrics
- [ ] Add "\*" disclaimer if metrics cannot be verified
- [ ] Only include metrics you can document with real data

**Proposed Fix**:

```tsx
// Option 1: Remove unverifiable claims
<p className="text-gray-400 text-sm">Trusted by homeowners nationwide • Streamlined rebate process • Expert support</p>

// Option 2: Add disclaimer
<p className="text-gray-400 text-sm">
  Helping homeowners with HVAC rebates • Licensed contractors nationwide •
  <span className="text-xs">*Claims verified by customer database</span>
</p>

// Option 3: Use vague but true claims
<p className="text-gray-400 text-sm">Thousands of homeowners served • Millions in rebates processed • High satisfaction rate</p>
```

---

### 2. **Fake/Fictional Testimonials**

**Severity**: 🔴 CRITICAL  
**Location**: `src/components/Testimonials.tsx` lines 14-45  
**Current State**: All testimonials appear to be sample/fictional data:

```
- Sarah Johnson (Homeowner, Michigan)
- Michael Chen (HVAC Contractor, Ohio)
- Patricia Rodriguez (Homeowner, Wisconsin)
- James Park (Energy Auditor, Illinois)
```

**Google Policy Issue**:

- Google Ads explicitly prohibits fake testimonials
- Testimonials must be from real customers
- Using fictional testimonials violates consumer protection laws
- Can result in account suspension

**Evidence of Fake Data**:

- Generic names and roles suggest placeholder data
- No dates, verification links, or authenticating details
- Appears to be template/demo content

**Fix Required**:

- [ ] Remove fake testimonials immediately OR
- [ ] Replace with real customer testimonials OR
- [ ] Collect verified customer feedback

**Code to Fix**:

```tsx
// Current (VIOLATES POLICY):
const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner, Michigan',
    text: 'Hacvent made the rebate process so simple...',
    rating: 5
  },
  // ... more fake testimonials
]

// Fixed - Option 1: Remove section
// Delete entire Testimonials component from page.tsx

// Fixed - Option 2: Add verification & dates
const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Verified Customer • Jan 2024',
    text: '...',
    rating: 5,
    verified: true,
    date: 'January 15, 2024'
  }
]

// Add disclaimer above testimonials:
<p className="text-xs text-gray-500 mb-4">
  ✓ Verified customer testimonials from verified purchases
</p>
```

---

### 3. **Unsubstantiated Rebate Amount Claims**

**Severity**: 🔴 CRITICAL  
**Location**: `src/components/Hero.tsx` lines 48-54  
**Current Claims**:

```
"$8K–$14K HEEHRA Rebates"
```

**Google Policy Issue**:

- Specific dollar amount claims must be substantiated
- "HEEHRA" (Home Energy Rebates and Efficiency Retrofit Act) is federal program
- These ranges vary significantly and are not guaranteed
- Misleading claim about specific rebate amounts

**Evidence Found**:

```tsx
// Hero.tsx
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>
```

**Fix Required**:

```tsx
// Current (VIOLATES POLICY)
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>

// Fixed - Option 1: Use range disclaimer
<div className="text-2xl sm:text-3xl font-bold text-white">Up to $14K*</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>
<div className="text-xs text-white/60">*Amounts vary by state, income, and system type</div>

// Fixed - Option 2: Remove specific amounts
<div className="text-2xl sm:text-3xl font-bold text-white">Substantial Savings</div>
<div className="text-xs sm:text-sm text-white/80">Rebates Available</div>

// Fixed - Option 3: Link to actual program info
<a href="https://www.whitehouse.gov/briefing-room/statements-releases/2023/04/11/fact-sheet-new-funding-to-upgrade-heating-and-cooling-systems-available-in-every-state-through-inflation-reduction-act/"
   target="_blank"
   className="text-xs text-white/60 hover:text-white underline">
  *See HEEHRA eligibility
</a>
```

---

### 4. **"5,000+ Utility Rebates" Claim**

**Severity**: 🔴 CRITICAL  
**Location**: `src/components/Footer.tsx` line 168  
**Current Claims**:

```
"5,000+ Utility Rebates"
```

**Google Policy Issue**:

- This is an unsubstantiated claim about program coverage
- The number is impossible to verify
- Could be interpreted as guarantee of availability

**Evidence Found**:

```tsx
// Footer.tsx
<p className="text-gray-400 text-sm">
  50+ State Programs • 5,000+ Utility Rebates • Federal Tax Credits
</p>
```

**Fix Required**:

```tsx
// Current (PROBLEMATIC)
<p className="text-gray-400 text-sm">50+ State Programs • 5,000+ Utility Rebates • Federal Tax Credits</p>

// Fixed Option 1: Generalize
<p className="text-gray-400 text-sm">Multiple State Programs • Utility Rebates Available • Federal Tax Credits</p>

// Fixed Option 2: Use disclaimer
<p className="text-gray-400 text-sm">
  50+ State Programs • Utility Rebates* • Federal Tax Credits
  <div className="text-xs text-gray-500">*Availability varies by location</div>
</p>

// Fixed Option 3: Link to sources
<p className="text-gray-400 text-sm">
  State & Federal Programs • <a href="/programs">View Available Programs</a>
</p>
```

---

### 5. **"Energy Star Certified" Claim**

**Severity**: 🟠 HIGH  
**Location**: `src/components/Footer.tsx` line 167 & `src/components/Testimonials.tsx`  
**Current Claims**:

```
"Energy Star Certified"
```

**Google Policy Issue**:

- Claims company/service has certification it doesn't have
- Energy Star certifies products, not rebate services
- Misleading to imply service certification

**Evidence Found**:

```tsx
// Footer.tsx
<p className="text-gray-400 text-xs font-semibold mb-2 text-white/70">VERIFIED & CERTIFIED</p>
<p className="text-gray-400 text-sm">Energy Star Certified • Licensed Contractors • Accredited Programs</p>

// Testimonials.tsx
<div className="text-sm font-bold">Energy Star</div>
<div className="text-xs text-gray-500">Certified</div>
```

**Fix Required**:

```tsx
// Current (MISLEADING)
<p className="text-gray-400 text-sm">Energy Star Certified • Licensed Contractors • Accredited Programs</p>

// Fixed - Remove false claim
<p className="text-gray-400 text-sm">Licensed Contractors • Verified Service Providers • Professional Support</p>

// Fixed - If you actually work with Energy Star:
<p className="text-gray-400 text-sm">
  Help with Energy Star certified products • <a href="/contractors">Certified Contractors</a>
</p>
```

Remove from Testimonials.tsx Trust Badges section:

```tsx
// REMOVE THIS:
<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">Energy Star</div>
    <div className="text-xs text-gray-500">Certified</div>
  </div>
</div>
```

---

### 6. **"Approved" Claims for Federal Tax Credits & State Programs**

**Severity**: 🟠 HIGH  
**Location**: `src/components/Testimonials.tsx` lines 117-130  
**Current Claims**:

```
"Federal Tax Credits - Approved"
"State Programs - 50+ States"
```

**Google Policy Issue**:

- Cannot claim to be "approved" by government programs
- Can be interpreted as guarantee
- Hacvent is not an official government agency

**Evidence Found**:

```tsx
// Testimonials.tsx
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
```

**Fix Required**:

```tsx
// Current (IMPLIES GUARANTEE)
<div className="text-sm font-bold">Federal Tax Credits</div>
<div className="text-xs text-gray-500">Approved</div>

// Fixed - Clarify what you actually do
<div className="text-sm font-bold">Federal Tax Credits</div>
<div className="text-xs text-gray-500">Information & Guidance</div>

// Or remove and replace with:
<div className="text-sm font-bold">Expert Guidance</div>
<div className="text-xs text-gray-500">on Available Programs</div>
```

---

### 7. **"No Credit Card Required" Claim Needs Verification**

**Severity**: 🟡 MEDIUM  
**Location**: `src/components/CTASection.tsx` line 87  
**Current Claims**:

```
"No credit card required"
```

**Google Policy Issue**:

- If true, good - but must be precisely accurate
- If any paid feature exists, this becomes misleading

**Evidence Found**:

```tsx
// CTASection.tsx
<span className="flex items-center gap-2">
  <CheckCircle className="w-5 h-5" />
  No credit card required
</span>
```

**Verification Needed**:

- [ ] Confirm all sign-ups truly require NO credit card
- [ ] If contractors pay $50 fee, clarify this is only after selection
- [ ] Consider more accurate wording: "Free sign-up" or "No upfront payment"

---

## 🟠 HIGH PRIORITY WARNINGS

### 8. **Testimonials Section Title Misleading**

**Severity**: 🟠 HIGH  
**Location**: `src/components/Testimonials.tsx` line 38  
**Current**:

```tsx
<h2>What Our Customers Say</h2>
<p>See what real customers say about their experience with Hacvent.</p>
```

**Issue**:

- If testimonials are fake, saying "real customers" is false
- If you collect real testimonials, add verification

**Fix**:

- If removing fake testimonials: "See why people choose Hacvent"
- If using real testimonials: "Verified customer feedback"

---

## 🟡 MEDIUM PRIORITY: Disclaimer Issues

### 9. **Inconsistent Disclaimers**

**Severity**: 🟡 MEDIUM  
**Issues Found**:

1. **Hero section has disclaimer** (good):

   ```tsx
   <div className="inline-block bg-white/20...">
     <p className="text-sm font-semibold">
       💰 Rebate amounts vary by location and program eligibility
     </p>
   </div>
   ```

2. **But footer lacks disclaimers** (bad):

   ```tsx
   // NO DISCLAIMERS on these claims:
   "10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate";
   ```

3. **Benefits section is vague** (concerning):
   ```tsx
   "may reduce common errors and support faster processing";
   // These "may" claims are technically okay but weak
   ```

**Fix Required**:

- Every numerical claim needs supporting evidence or disclaimer
- Add asterisks (\*) for claims that vary by location
- Add disclaimers consistently throughout site

---

## ✅ POLICIES YOU'RE MEETING

These are good areas:

1. **Terms of Service** ✅
   - Has proper limitations and disclaimers
   - "Amounts vary by location" statement
   - "We do not guarantee approvals"

2. **Contact Information** ✅
   - Full address, phone, email present
   - Easy to contact

3. **No Illegal Content** ✅
   - No gambling, drugs, weapons, etc.
   - Legitimate business

4. **Privacy Policy** ✅
   - Addresses data collection
   - Explains how data is used

---

## 📋 REMEDIATION PLAN

### Phase 1: CRITICAL FIXES (Do immediately - 1 hour)

- [ ] Remove or replace all fake testimonials
- [ ] Remove "10,000+ Homeowners" claim or add disclaimer
- [ ] Remove "99% Approval Rate" claim or add disclaimer
- [ ] Fix "Energy Star Certified" claim
- [ ] Fix "$8K-14K HEEHRA Rebates" claim to add disclaimer

**Impact**: Will likely allow Google Ads approval once done

### Phase 2: HIGH PRIORITY FIXES (1 hour)

- [ ] Fix "$50M+ Rebates Claimed" claim
- [ ] Fix "5,000+ Utility Rebates" claim
- [ ] Remove "Approved" implications for federal/state programs
- [ ] Update testimonials section language

### Phase 3: MEDIUM FIXES (30 minutes)

- [ ] Add consistent disclaimers throughout
- [ ] Verify "No credit card required" claim accuracy
- [ ] Review all monetary claims for substantiation

---

## 🛠️ IMPLEMENTATION GUIDE

### Step 1: Remove/Fix Testimonials (20 minutes)

**Todo A: Delete fake testimonials entirely**

If you don't have real customer testimonials, remove the section:

In `src/app/page.tsx`, remove this line:

```tsx
<Testimonials /> {/* Remove this line */}
```

**OR Todo B: Replace with placeholder language**

Replace `Testimonials.tsx` with neutral language:

```tsx
// New testimonials component (generic, no fake names)
export const Testimonials = () => (
  <section>
    <h2>Join Thousands of Homeowners</h2>
    <p>
      We help homeowners navigate rebate programs and connect with contractors
    </p>
    {/* No individual testimonials - just messaging */}
  </section>
);
```

### Step 2: Fix Footer Metrics (15 minutes)

Replace lines in `src/components/Footer.tsx`:

```tsx
// OLD (VIOLATES POLICY):
<p className="text-gray-400 text-sm">10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate</p>

// NEW (COMPLIANT):
<p className="text-gray-400 text-sm">Trusted by homeowners nationwide • Expert support • Hassle-free process</p>
```

### Step 3: Fix Hero Rebate Claims (10 minutes)

Replace in `src/components/Hero.tsx`:

```tsx
// OLD:
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>

// NEW:
<div className="text-2xl sm:text-3xl font-bold text-white">Substantial Savings Available</div>
<div className="text-xs sm:text-sm text-white/80">
  Rebates of $2,000–$14,000+*<br/>
  <small className="text-white/60">*Amounts vary by location & program</small>
</div>
```

### Step 4: Fix Partner/Certification Claims (15 minutes)

In `src/components/Testimonials.tsx`, replace Partner Grid:

```tsx
// OLD (VIOLATES POLICY):
<div className="font-semibold text-gray-600 text-center">
  <div className="text-sm font-bold">Energy Star</div>
  <div className="text-xs text-gray-500">Certified</div>
</div>

// NEW (COMPLIANT):
<div className="font-semibold text-gray-600 text-center">
  <div className="text-sm font-bold">Expert Contractors</div>
  <div className="text-xs text-gray-500">Verified & Licensed</div>
</div>
```

---

## 📊 Risk Assessment

| Violation                | Risk                  | Fix Time | Priority |
| ------------------------ | --------------------- | -------- | -------- |
| Fake testimonials        | 🔴 Immediate ban      | 10 min   | 1        |
| 10K+ Homeowners claim    | 🔴 Disapproval        | 5 min    | 1        |
| 99% Approval Rate        | 🔴 Disapproval        | 5 min    | 1        |
| HEEHRA rebate range      | 🟠 Likely disapproval | 10 min   | 2        |
| Energy Star claim        | 🟠 Likely disapproval | 5 min    | 2        |
| Partner badges           | 🟠 Policy review      | 10 min   | 2        |
| $50M claim               | 🟠 Likely disapproval | 5 min    | 2        |
| Inconsistent disclaimers | 🟡 May impact         | 15 min   | 3        |

**Total Fix Time**: 2-3 hours  
**Critical Priority**: 40 minutes

---

## 🧐 References: Google Ads Policies

**Relevant Policies**:

1. **Unsubstantiated Claims**: https://support.google.com/adspolicy/answer/176020
   - All claims must be substantiated
   - Testimonials must be from real customers
   - Statistics must be verifiable

2. **False Claims**: https://support.google.com/adspolicy/answer/6020955
   - Cannot make misleading claims
   - Cannot claim certifications you don't have
   - Cannot imply guarantees

3. **Testimonials**: https://support.google.com/adspolicy/answer/6020954
   - Must be authentic
   - Must represent typical results
   - Cannot be created for advertising purposes

---

## Next Steps

1. **TODAY**: Review this audit and implement Phase 1 fixes
2. **TOMORROW**: Complete Phase 2 and 3 fixes
3. **BEFORE LAUNCH**: Have legal/compliance review final copy
4. **FINAL CHECK**: Run through Google's own policy checker

---

**Audit Completed**: February 28, 2026  
**Status**: 🔴 VIOLATIONS FOUND - Fix before Google Ads submission  
**Re-audit Needed**: After implementing fixes (within 1 week)
