# ⚡ Google Ads Violations - Quick Reference Card

**Print this page** | **Bookmark this** | **Share with team**

---

## 🔴 THE 8 VIOLATIONS (Ranked by Severity)

### CRITICAL - DO THESE FIRST ⚡

```
1. FAKE TESTIMONIALS
   Location: src/components/Testimonials.tsx
   Issue: Sarah Johnson, Michael Chen, etc. are fictional
   Fix: Delete <Testimonials /> from homepage
   Time: 2 minutes
   Risk: Account suspension

2. "10,000+ HOMEOWNERS" CLAIM
   Location: Footer.tsx line 170
   Issue: Unsubstantiated user count
   Fix: Replace with "Trusted by homeowners nationwide"
   Time: 5 minutes
   Risk: Campaign disapproval

3. "99% APPROVAL RATE"
   Location: Footer.tsx line 170
   Issue: Impossible to guarantee (gov't programs decide)
   Fix: Delete this claim completely
   Time: 5 minutes
   Risk: Campaign disapproval

4. "$50M+ REBATES CLAIMED"
   Location: Footer.tsx line 170
   Issue: Unverifiable number
   Fix: Delete or verify with real data
   Time: 5 minutes
   Risk: Campaign disapproval

5. "$8K-$14K HEEHRA REBATES"
   Location: Hero.tsx lines 48-54
   Issue: No disclaimer about variation
   Fix: Add "*Amounts vary by location"
   Time: 10 minutes
   Risk: Campaign disapproval
```

### HIGH - DO NEXT 📋

```
6. "ENERGY STAR CERTIFIED"
   Location: Multiple places
   Issue: Service can't be certified (only products can)
   Fix: Change to "Help with energy-efficient upgrades"
   Time: 10 minutes
   Risk: Ad flag for review

7. "5,000+ UTILITY REBATES"
   Location: Footer.tsx line 168
   Issue: Unverifiable program count
   Fix: Change to "Utility rebates available"
   Time: 5 minutes
   Risk: Ad flag for review

8. "APPROVED" BY FEDERAL/STATE PROGRAMS
   Location: Testimonials.tsx badges
   Issue: Implies government endorsement
   Fix: Change to "Information & Guidance"
   Time: 5 minutes
   Risk: Ad flag for review
```

---

## ⏱️ TOTAL FIX TIME: 50-60 MINUTES

### Phase 1: Critical Fixes (40 min)

- Delete testimonials (2 min)
- Fix footer claims (20 min)
- Fix hero claim (10 min)
- Fix certifications (10 min)

### Phase 2: Final Polish (20 min)

- Add disclaimers (10 min)
- Test website (10 min)

---

## 🔍 WHERE TO FIND EACH VIOLATION

| Violation         | File                                       | Location      |
| ----------------- | ------------------------------------------ | ------------- |
| Fake testimonials | `src/components/Testimonials.tsx`          | Lines 14-45   |
| 10K+ users        | `src/components/Footer.tsx`                | Line 170      |
| 99% approval      | `src/components/Footer.tsx`                | Line 170      |
| $50M rebates      | `src/components/Footer.tsx`                | Line 170      |
| $8K-$14K rebates  | `src/components/Hero.tsx`                  | Lines 48-54   |
| Energy Star       | `src/components/Testimonials.tsx` line 119 | Line 119      |
| 5000+ programs    | `src/components/Footer.tsx`                | Line 168      |
| "Approved by Fed" | `src/components/Testimonials.tsx`          | Lines 122-130 |

---

## ✅ QUICK FIXES (Copy-Paste)

### Fix 1: Remove Testimonials (2 min)

```tsx
// In src/app/page.tsx
// DELETE or COMMENT OUT this line:
// <Testimonials />
```

### Fix 2: Replace Footer Claims (20 min)

```tsx
// FIND:
"10,000+ Homeowners • $50M+ Rebates Claimed • 99% Approval Rate";

// REPLACE WITH:
"Trusted by homeowners nationwide • Expert support • Verified contractors";
```

### Fix 3: Add Hero Disclaimer (10 min)

```tsx
// FIND:
<div className="text-2xl sm:text-3xl font-bold text-white">$8K–$14K</div>
<div className="text-xs sm:text-sm text-white/80">HEEHRA Rebates</div>

// REPLACE WITH:
<div className="text-2xl sm:text-3xl font-bold text-white">Up to $14K</div>
<div className="text-xs sm:text-sm text-white/80">
  Rebates Available<br/>
  <span className="text-xs text-white/60">*Amounts vary by location</span>
</div>
```

### Fix 4: Replace Certifications (10 min)

```tsx
// FIND:
"Energy Star Certified";
"Federal Tax Credits - Approved";
"State Programs - 50+ States";

// REPLACE WITH:
"Expert Guidance";
"Federal & State Programs";
"50+ States Covered";
```

---

## 🎯 DECISION CHECKLIST

Ask yourself these questions:

### ❓ Do you have REAL customer testimonials?

- [ ] YES → Replace fake ones with real ones
- [ ] NO → Delete testimonials section

### ❓ Do you actually have 10,000+ registered users?

- [ ] YES → Keep claim, prepare documentation
- [ ] NO → Delete claim

### ❓ Is your approval rate really 99%?

- [ ] YES → Highly unlikely; recommend deleting
- [ ] NO → Delete claim

### ❓ Have you processed $50M+ in rebates?

- [ ] YES → Keep claim, prepare documentation
- [ ] NO → Delete claim

### ❓ Can users get $8K-$14K in rebates?

- [ ] YES, ALWAYS → Remove the disclaimer
- [ ] DEPENDS ON LOCATION → Add "\*varies by location"
- [ ] VARIES SIGNIFICANTLY → Add full disclaimer

### ❓ Are you certified by Energy Star?

- [ ] YES → Keep as "Energy Star Certified"
- [ ] NO → Delete this claim

---

## 🚨 RISK LEVELS

```
VIOLATION RISK LEVEL
═══════════════════════════════════════

Fake Testimonials        ████████████ 12/10  CRITICAL
$50M Rebates Claim       ███████████░ 11/10  CRITICAL
10K+ Users Claim         ███████████░ 11/10  CRITICAL
99% Approval Rate        ███████████░ 11/10  CRITICAL
$8K-$14K Rebates         ██████████░░ 10/10  HIGH
Energy Star Cert         █████████░░░ 9/10   HIGH
5000+ Rebates            ████████░░░░ 8/10   HIGH
"Approved" Federal       ████████░░░░ 8/10   HIGH

KEY:
████████████ = Account suspension risk
███████████░ = Campaign disapproval
██████████░░ = Likely disapproval
█████████░░░ = Possible flags
```

---

## 📱 WHAT GOOGLE WILL LOOK AT

✗ **Will FAIL Google approval**:

- Fake testimonials
- Unsubstantiated claims (10K+, 99%, $50M)
- False certifications

✗ **Will LIKELY FAIL**:

- Missing disclaimers on rebate amounts
- Unverifiable program counts
- Misleading "approval" language

✓ **Will PASS**:

- Real testimonials (verified)
- Truthful claims (with proof)
- Clear disclaimers
- Honest certifications

---

## 🎯 PRIORITY MATRIX

```
        EASY TO FIX
              ↑
              |
    DELETE    |  FIX FIRST
    CLAIMS   |  (Testimonials)
              |     ↓
              |  ADD DISCLAIMERS
              |
        HARD TO FIX
```

**Fix order**:

1. Delete testimonials (easiest)
2. Remove/fix claims (moderate)
3. Add disclaimers (depends on claims kept)

---

## ✨ BEFORE & AFTER

### BEFORE (NON-COMPLIANT)

```
"10,000+ Homeowners"
"$50M+ Rebates Claimed"
"99% Approval Rate"
"Energy Star Certified"
[Fake testimonials from Sarah Johnson, Michael Chen, etc.]
"$8K–$14K HEEHRA Rebates"
"Federal Tax Credits - Approved"
"5,000+ Utility Rebates"
```

### AFTER (COMPLIANT)

```
"Trusted by homeowners nationwide"
"Help with rebate applications"
"Quality submissions increase approval chances"
"Help with energy-efficient upgrades"
[Remove testimonials section entirely OR use real customer testimonials]
"Up to $14K* in potential rebates (*Amounts vary by location)"
"Federal & State Program Information"
"Rebate programs available in multiple states"
```

---

## 📚 WHICH DOCUMENT TO READ?

**I have 5 minutes:**
→ Read GOOGLE_ADS_VIOLATIONS_EXECUTIVE_SUMMARY.md

**I have 15 minutes:**
→ Read GOOGLE_ADS_VIOLATIONS_SUMMARY.md

**I need to implement fixes:**
→ Use GOOGLE_ADS_CODE_EXAMPLES.md (copy-paste)

**I want full details:**
→ Read GOOGLE_ADS_POLICY_VIOLATIONS_AUDIT.md

**I need a checklist:**
→ Use GOOGLE_ADS_VIOLATIONS_FIX_GUIDE.md

---

## 🚀 NEXT STEPS (In Order)

1. ✏️ **READ** this card (you're doing it!)
2. ✏️ **DECIDE** which claims to keep/remove
3. ✏️ **IMPLEMENT** Phase 1 fixes (40 min)
4. ✏️ **TEST** website functionality (10 min)
5. ✏️ **DEPLOY** changes (5 min)
6. ✏️ **VERIFY** live website is compliant (5 min)
7. ✏️ **LAUNCH** Google Ads campaign 🎉

**Total time: 60 minutes**

---

## 💡 GOLDEN RULE

**If you can't prove it with real data, don't claim it.**

Ask before every claim:

- "Can I show Google proof of this?"
- "Would a lawyer defend this claim?"
- "Would a customer believe this is accurate?"

If "NO" to any question → Remove or generalize the claim.

---

## 📞 TROUBLESHOOTING

**"How do I know if my fix is correct?"**
→ Compare with GOOGLE_ADS_CODE_EXAMPLES.md

**"What if Google still disapproves?"**
→ Contact Google support, reference which policies you fixed

**"Do I need a lawyer?"**
→ For simple text changes: No. For claims needing legal review: Yes.

**"Can I keep the testimonials?"**
→ Only if they're REAL, VERIFIED, and RECENT with dates

**"How long until Google approves?"**
→ Usually 24-48 hours after fixing violations

---

## ✅ SUCCESS CRITERIA

You're done when:

✓ All fake testimonials removed  
✓ All unsubstantiated claims removed  
✓ All claims have disclaimers (if they vary)  
✓ All false certifications removed  
✓ Website tested and working  
✓ No new errors introduced  
✓ Team approves changes

→ **THEN YOU'RE READY FOR GOOGLE ADS** ✅

---

**Print Date**: February 28, 2026  
**Status**: 🔴 Critical Issues - Ready to Fix  
**Estimated Time**: 1 hour  
**Difficulty**: Easy

---

[Full Documentation Index](GOOGLE_ADS_DOCUMENTATION_INDEX.md) | [Detailed Audit](GOOGLE_ADS_POLICY_VIOLATIONS_AUDIT.md) | [Code Examples](GOOGLE_ADS_CODE_EXAMPLES.md)
