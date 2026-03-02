# 🔧 Google Ads Violations - Quick Fix Guide

**Priority**: 🔴 CRITICAL - Must fix before Google Ads launch  
**Estimated Time**: 2-3 hours  
**Difficulty**: Easy - Mostly text replacements

---

## 📋 Quick Checklist

- [ ] Remove fake testimonials (10 min)
- [ ] Fix footer metrics claims (10 min)
- [ ] Fix hero rebate claims (10 min)
- [ ] Fix certification claims (10 min)
- [ ] Review all pages for claims (20 min)
- [ ] Add missing disclaimers (20 min)
- [ ] Legal review (optional, 30 min)
- [ ] Test website (10 min)

---

## 🔴 FIX #1: Fake Testimonials (CRITICAL)

**File**: `src/components/Testimonials.tsx`  
**Risk**: 🔴 Account suspension if approved  
**Time**: 10 minutes

### ⏭️ OPTION A: Delete Testimonials Section (RECOMMENDED)

**Step 1**: Remove from `src/app/page.tsx`

Find this line:

```tsx
<Testimonials />
```

Delete it (or comment it out):

```tsx
{
  /* <Testimonials /> */
}
```

**Step 2**: Delete the component file (optional)

```bash
rm src/components/Testimonials.tsx
```

### OR ⏭️ OPTION B: Replace with Real Testimonials

**If you have real customers**, replace the testimonials array:

```tsx
// BEFORE (FAKE - VIOLATES POLICY):
const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Homeowner, Michigan",
    text: "Hacvent made the rebate process so simple...",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "HVAC Contractor, Ohio",
    text: "As a contractor, I love how Hacvent streamlines...",
    rating: 5,
  },
  // ... more fake testimonials
];

// AFTER (VERIFIED):
const testimonials: Testimonial[] = [
  {
    name: "[Real Customer Name]",
    role: "Verified Customer • [Date]",
    text: "[Their actual testimonial text]",
    rating: 5,
    verified: true,
    date: "[Verification Date]",
  },
  // Only real customer testimonials
];
```

**Add verification notice**:

```tsx
// Add this below the section header:
<p className="text-xs text-gray-500 mb-4 text-center">
  ✓ Verified customer testimonials
</p>
```

---

## 🔴 FIX #2: Footer Metrics Claims (CRITICAL)

**File**: `src/components/Footer.tsx` (lines 165-171)  
**Risk**: 🔴 Disapproval  
**Time**: 10 minutes

### Current Code (VIOLATES POLICY):

```tsx
<p className="text-gray-400 text-sm">
  10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate
</p>
```

### Fix Options:

**OPTION A: Remove unverifiable claims (SAFEST)**

```tsx
<p className="text-gray-400 text-sm">
  Connecting Homeowners with Contractors • Expert Support • Simplified Rebates
</p>
```

**OPTION B: Add disclaimers**

```tsx
<p className="text-gray-400 text-sm">
  Trusted by homeowners nationwide<sup>*</sup> • Expert support • Simplified
  rebates
  <br />
  <span className="text-xs text-gray-500">
    *Based on customer submissions to state programs
  </span>
</p>
```

**OPTION C: Use vague but true language**

```tsx
<p className="text-gray-400 text-sm">
  Helping homeowners across the country • Thousands served •
  <a href="/testimonials" className="hover:text-primary underline">
    See customer reviews
  </a>
</p>
```

---

## 🔴 FIX #3: Hero Rebate Amount Claims (CRITICAL)

**File**: `src/components/Hero.tsx` (lines 48-54)  
**Risk**: 🔴 Disapproval  
**Time**: 10 minutes

### Current Code (VIOLATES POLICY):

```tsx
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>
```

### Fix Options:

**OPTION A: Add proper disclaimer (RECOMMENDED)**

```tsx
<div className="text-2xl sm:text-3xl font-bold text-white">Up to $14,000</div>
<div className="text-xs sm:text-sm text-white/80">
  in potential HVAC rebates
  <br/>
  <span className="text-xs text-white/60">
    *Amounts vary by state, income, system type, and program eligibility
  </span>
</div>
```

**OPTION B: Remove specific numbers**

```tsx
<div className="text-2xl sm:text-3xl font-bold text-white">Substantial Rebates</div>
<div className="text-xs sm:text-sm text-white/80">
  Available in Your State
  <br/>
  <a href="/eligibility-check" className="text-white hover:underline text-xs">
    Check your eligibility
  </a>
</div>
```

**OPTION C: Link to official program**

```tsx
<div className="text-2xl sm:text-3xl font-bold text-white">$2,000–$14,000+</div>
<div className="text-xs sm:text-sm text-white/80">
  <a
    href="https://www.whitehouse.gov/briefing-room/statements-releases/2023/04/11/fact-sheet-new-funding-to-upgrade-heating-and-cooling-systems-available-in-every-state-through-inflation-reduction-act/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    HEEHRA Program Details
  </a>
  <br/>
  <span className="text-xs text-white/60">*See official program requirements</span>
</div>
```

---

## 🟠 FIX #4: Energy Star Certification Claim

**File**: `src/components/Testimonials.tsx` (Partner section)  
**Risk**: 🟠 Likely disapproval  
**Time**: 10 minutes

### Current Code (MISLEADING):

```tsx
<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">Energy Star</div>
    <div className="text-xs text-gray-500">Certified</div>
  </div>
</div>
```

### Fix Options:

**OPTION A: Remove (SAFEST)**

```tsx
// DELETE this entire section
// and replace with:

<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">Licensed Contractors</div>
    <div className="text-xs text-gray-500">Verified & Insured</div>
  </div>
</div>
```

**OPTION B: Clarify what you actually do**

```tsx
<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">Energy Star</div>
    <div className="text-xs text-gray-500">Product Guidance</div>
  </div>
</div>
```

---

## 🟠 FIX #5: Government Program Claims

**File**: `src/components/Testimonials.tsx` (Partner section)  
**Risk**: 🟠 Likely disapproval  
**Time**: 5 minutes

### Current Code (IMPLIES GUARANTEE):

```tsx
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

### Fix:

```tsx
<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">Federal & State</div>
    <div className="text-xs text-gray-500">Program Guidance</div>
  </div>
</div>

<div className="flex items-center justify-center py-4">
  <div className="font-semibold text-gray-600 text-center">
    <div className="text-sm font-bold">50+ States</div>
    <div className="text-xs text-gray-500">Covered</div>
  </div>
</div>
```

---

## 🟠 FIX #6: $50M+ Rebates Claim

**File**: `src/components/Footer.tsx` (Partner verification section)  
**Risk**: 🟠 Likely disapproval  
**Time**: 5 minutes

### Current Code (UNSUBSTANTIATED):

```tsx
<p className="text-gray-400 text-sm">
  10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate
</p>
```

### Fix:

Replace with one of the options from **FIX #2** above (they're the same claim).

---

## 🟠 FIX #7: 5,000+ Utility Rebates Claim

**File**: `src/components/Footer.tsx` (Coverage section)  
**Risk**: 🟠 Likely disapproval  
**Time**: 5 minutes

### Current Code (UNVERIFIABLE):

```tsx
<p className="text-gray-400 text-sm">
  50+ State Programs • 5,000+ Utility Rebates • Federal Tax Credits
</p>
```

### Fix Options:

**OPTION A: Generalize (SAFEST)**

```tsx
<p className="text-gray-400 text-sm">
  State & Federal Programs • Multiple Rebate Sources • Tax Credits Available
</p>
```

**OPTION B: Add disclaimer**

```tsx
<p className="text-gray-400 text-sm">
  50+ State Programs • Utility Rebates * • Federal Tax Credits
  <br />
  <span className="text-xs text-gray-500">
    *Availability varies by location
  </span>
</p>
```

**OPTION C: Link to program database**

```tsx
<p className="text-gray-400 text-sm">
  <a href="/programs" className="hover:text-primary">
    Browse available programs
  </a>{" "}
  •
  <a href="/contractors" className="hover:text-primary">
    Find contractors
  </a>{" "}
  •
  <a href="/faq" className="hover:text-primary">
    Learn more
  </a>
</p>
```

---

## 🟡 FIX #8: Verify "No Credit Card Required"

**File**: `src/components/CTASection.tsx` (line 87)  
**Risk**: 🟡 Could be flagged if untrue  
**Time**: 5 minutes (verify) + action

### Current Code:

```tsx
<span className="flex items-center gap-2">
  <CheckCircle className="w-5 h-5" />
  No credit card required
</span>
```

### Verification Checklist:

- [ ] Starting eligibility check doesn't require credit card? → YES, keep text
- [ ] Creating homeowner account doesn't require credit card? → YES, keep text
- [ ] Contractor onboarding has $50 fee but only after selection? → Clarify text

### If contractor fee applies, fix to:

```tsx
<span className="flex items-center gap-2">
  <CheckCircle className="w-5 h-5" />
  Free homeowner sign-up
</span>

<span className="flex items-center gap-2">
  <CheckCircle className="w-5 h-5" />
  Optional services* available
</span>

<!-- Add disclaimer: -->
<div className="text-xs text-white/60 mt-2">
  *Contractors pay $50 processing fee after initial approval
</div>
```

---

## 📝 Updating Testimonials Section Title

**File**: `src/components/Testimonials.tsx` (if keeping the component)  
**Risk**: 🟡 Could be flagged as dishonest  
**Time**: 2 minutes

### If keeping with REAL testimonials:

```tsx
// Keep this (with verified testimonials only):
<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
  What Our Customers Say
</h2>
<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
  See what verified customers say about their experience with Hacvent.
</p>
```

### If removing section entirely:

```tsx
// No changes needed - just delete the component import
```

---

## ✅ Implementation Checklist

### Phase 1: Critical Fixes (40 minutes)

Priority - Do these FIRST:

- [ ] Remove or verify testimonials (10 min)
- [ ] Fix footer metrics "10,000+" claim (5 min)
- [ ] Fix hero "$8K-14K" rebate claim (10 min)
- [ ] Fix "Energy Star Certified" claim (5 min)
- [ ] Fix "99% Approval Rate" claim (5 min)

### Phase 2: High Priority (20 minutes)

Do these next:

- [ ] Fix "Federal Tax Credits Approved" text (5 min)
- [ ] Fix "State Programs 50+ States" claim (5 min)
- [ ] Fix "$50M+ Rebates Claimed" claim (5 min)
- [ ] Review all claims on pages (5 min)

### Phase 3: Medium Priority (20 minutes)

Do these before launch:

- [ ] Add disclaimers where needed (10 min)
- [ ] Verify "No credit card" claim (5 min)
- [ ] Check footer for all claims (5 min)

### Phase 4: Final (10 minutes)

Before submitting to Google:

- [ ] Test website functionality
- [ ] Check mobile responsiveness
- [ ] Read over all text for accuracy
- [ ] Final compliance review

---

## 🧪 Testing After Fixes

1. **Visual Test**: Browse entire website
   - Verify all text displays properly
   - Check mobile viewport
   - Verify links work

2. **Content Audit**:
   - Search for any remaining big number claims
   - Check for "guarantee" language
   - Look for unverified certifications

3. **Policy Check**:
   - Read Google Ads policy (linked above)
   - Ask: "Would I believe this without evidence?"
   - Is every claim something you can defend?

4. **Before Submission**:
   - Have legal review copy (optional but recommended)
   - Get second opinion on claims
   - Document any substantiation for claims you keep

---

## 📞 If You Have Questions

**Before you claim something, ask:**

1. Can I prove this with real data?
2. Is this guaranteed or varies by location/individual?
3. Could someone misunderstand this claim?
4. Would Google require documentation for this?

✅ If YES to proof → Keep it with asterisks if it varies  
❌ If NO to proof → Remove or generalize  
⚠️ If MAYBE varies → Add disclaimer

---

**Ready to implement?** Start with Phase 1 (40 minutes).  
After completing all fixes: Your site will be compliant with Google Ads policies.

**Questions?** Review the detailed audit document: `GOOGLE_ADS_POLICY_VIOLATIONS_AUDIT.md`
