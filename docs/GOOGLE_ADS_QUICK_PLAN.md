# 🎯 Hacvent Google Ads - Quick Action Plan

**Date**: February 28, 2026  
**Project**: Hacvent (HVAC Rebate Service)  
**Status**: 80% Ready for Google Ads Launch

---

## ✅ What's Already in Place

### Website & Content

- ✅ Professional homepage with hero, features, testimonials
- ✅ Clear value proposition: "Get Approved for HVAC Rebates Easily"
- ✅ All required pages: Privacy, Terms, Contact, FAQ, Support
- ✅ Business information: Hacvent by Marxma LLC
- ✅ Physical address: 2055 Limestone Rd STE 200-C, Wilmington, DE 19808
- ✅ Contact methods: Phone (+1-719-530-4900) and Email (support@hacvent.com)
- ✅ Footer with links to legal pages
- ✅ Organization & Service Schema markup

### Technical SEO

- ✅ Proper meta tags on homepage
- ✅ Canonical URLs set to hacvent.com
- ✅ Responsive mobile design
- ✅ Clear navigation and site structure
- ✅ Structured data markup (Organization, LocalBusiness, Service)

### Security & Trust

- ✅ Professional design and branding
- ✅ Clear Terms of Service with disclaimers
- ✅ Privacy Policy with data protection info
- ✅ Contact page with full address and phone
- ✅ Testimonials and benefits section for trust

---

## ⏳ TODO: Critical (Required Before Campaign Launch)

### 1. Deploy Website & Verify HTTPS (1 hour)

**Status**: PENDING  
**Action Items**:

- [ ] Confirm hacvent.com is live and accessible
- [ ] Verify HTTPS is enabled (URL should start with `https://`)
- [ ] Test that all pages load correctly
- [ ] Check that forms submit without errors
- [ ] Test responsive design on mobile

**How to Verify**:

```bash
# Check if site is accessible
curl -I https://hacvent.com

# Check SSL certificate
openssl s_client -connect hacvent.com:443
```

---

### 2. Create Sitemap & Robots.txt (30 minutes)

**Status**: PENDING  
**Action Items**:

- [ ] Generate `public/sitemap.xml` with all pages
- [ ] Create `public/robots.txt` allowing Google crawl
- [ ] Test sitemap with Google Search Console

**Files to Create**:

**`public/sitemap.xml`**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hacvent.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://hacvent.com/eligibility-check</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://hacvent.com/customer-intake</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://hacvent.com/contractor-onboarding</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://hacvent.com/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://hacvent.com/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://hacvent.com/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://hacvent.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

**`public/robots.txt`**:

```
User-agent: *
Allow: /

Sitemap: https://hacvent.com/sitemap.xml
```

---

### 3. Set Up Google Search Console (30 minutes)

**Status**: PENDING  
**Action Items**:

- [ ] Go to https://search.google.com/search-console
- [ ] Add property for hacvent.com
- [ ] Verify ownership (via DNS record or HTML file)
- [ ] Submit sitemap.xml
- [ ] Monitor for indexing issues

**Steps**:

1. Sign in with Google account
2. Click "Add Property"
3. Enter `https://hacvent.com`
4. Choose verification method (DNS recommended)
5. Add DNS TXT record to domain
6. Wait for verification (can take 24-48 hours)
7. Submit sitemap.xml

---

### 4. Set Up Google Analytics 4 (45 minutes)

**Status**: PENDING  
**Action Items**:

- [ ] Create Google Analytics 4 property at https://analytics.google.com
- [ ] Get measurement ID (starts with "G-")
- [ ] Add measurement ID to website
- [ ] Set up conversion tracking for forms
- [ ] Test that events are being tracked

**Implementation in Layout**:
Add to `src/app/layout.tsx` (in head section):

```tsx
export const metadata: Metadata = {
  // ... existing metadata ...
  other: {
    'google-site-verification': 'YOUR_VERIFICATION_CODE_HERE',
  },
}

// In the Layout component JSX:
<Script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YOUR_MEASUREMENT_ID');
    `,
  }}
/>
```

**Conversion Goals**:

- Application submission (customer intake form)
- Eligibility check completion
- Contractor onboarding
- Contact form submission

---

### 5. Create Google Business Profile (20 minutes)

**Status**: PENDING  
**Action Items**:

- [ ] Go to https://google.com/business
- [ ] Create profile for Hacvent
- [ ] Add business address: 2055 Limestone Rd STE 200-C, Wilmington, DE 19808
- [ ] Add phone: +1 (719) 530-4900
- [ ] Add email: support@hacvent.com
- [ ] Add business category: "Energy Consultant" or "Contractor"
- [ ] Add description and photo
- [ ] Verify business (via postcard)

---

### 6. Set Up Google Ads Account (45 minutes)

**Status**: PENDING  
**Action Items**:

- [ ] Create Google Ads account at https://ads.google.com
- [ ] Add billing information (valid credit card)
- [ ] Link to website (hacvent.com)
- [ ] Link to Google Analytics property
- [ ] Create conversion tracking code
- [ ] Add conversion pixel to thank you pages

---

## 🎨 TODO: Content Preparation (1-2 hours)

### 7. Prepare Ad Copy & Keywords

**Status**: PENDING

**Primary Keywords** (to target):

```
- HVAC rebates
- Energy efficient HVAC
- HVAC contractor matching
- Home energy rebates
- Federal HVAC tax credits
- Rebate programs by state
- HVAC upgrades
- Energy savings programs
- [State] HVAC rebates (MI, CA, TX, etc.)
```

**Sample Ad Copy** (90 characters for headline, 30 for description):

**Ad 1 - Rebate Eligibility**

- Headline 1: "Get Approved for HVAC Rebates"
- Headline 2: "Free Eligibility Check"
- Headline 3: "Save Up to $14,000"
- Description: "Check if you qualify for HVAC rebates in your state. Certified contractors. No hidden fees."

**Ad 2 - Contractor Matching**

- Headline 1: "Find Certified HVAC Contractors"
- Headline 2: "Free Contractor Matching"
- Headline 3: "Local, Verified Professionals"
- Description: "Connect with licensed HVAC contractors near you. Get quotes. Save money on upgrades."

**Ad 3 - Energy Savings**

- Headline 1: "Save on Energy Bills"
- Headline 2: "HVAC Rebates + Contractors"
- Headline 3: "Maximize Your Rebates"
- Description: "Hacvent helps homeowners find rebates and contractors. Free guidance. Instant matching."

---

### 8. Prepare Landing Pages

**Status**: PENDING

**Create/Optimize These Landing Pages**:

1. `/` (Homepage) - Already exists ✅
2. `/customer-intake` - For lead capture ✅
3. `/eligibility-check` - For eligibility ads ✅
4. Potential: Create dedicated lead pages

**Each should have**:

- Clear headline matching ad copy
- Unique value proposition
- Form capturing key info
- Social proof (testimonials/stats)
- Trust signals (privacy, security)
- Clear CTA button

---

### 9. Prepare Tracking UTM Parameters

**Status**: PENDING

**Format**: `https://hacvent.com/[page]?utm_source=google&utm_medium=cpc&utm_campaign=[campaign_name]&utm_content=[ad_variant]&utm_term=[keyword]`

**Examples**:

- `/customer-intake?utm_source=google&utm_medium=cpc&utm_campaign=brand&utm_term=hacvent`
- `/eligibility-check?utm_source=google&utm_medium=cpc&utm_campaign=hvac_rebates&utm_term=hvac+rebates`

---

## 💰 TODO: Campaign Planning (1 hour)

### 10. Budget & Bidding Strategy

**Status**: PENDING

**Recommended Starting Budget**:

- Daily budget: $20-50/day (start low)
- Monthly: ~$600-1,500/month
- Test period: 30-60 days

**Bidding Strategy**:

- Start with Manual CPC ($2-5 per click)
- Move to Maximize Clicks after initial data
- Eventually optimize for Conversion Value

**Example First Month**:

```
Week 1-2: $10/day (testing)
Week 3-4: $30/day (if performing well)
Month 2: $50-100/day (based on performance)
```

---

### 11. Audience & Geographic Targeting

**Status**: PENDING

**Geographic Targeting**:

- Start with top states: CA, TX, FL, NY, MI
- Expand to all 50 states as budget allows
- Consider metro areas vs. rural

**Audience Segments**:

- Age: 25-65 (homeowners)
- Income: Middle to upper income
- Interests: Home improvement, energy efficiency
- Keywords: HVAC, rebates, contractors

---

## 🧪 TODO: Testing & Verification (1-2 hours)

### 12. Pre-Launch Testing

**Status**: PENDING

**Functional Testing**:

- [ ] Test all forms (customer intake, contractor onboarding, contact)
- [ ] Verify form submissions work
- [ ] Check thank you pages appear after submission
- [ ] Test on mobile, tablet, desktop
- [ ] Test in Chrome, Firefox, Safari, Edge

**Performance Testing**:

```bash
# Run PageSpeed Insights
# Target: 75+ score on mobile and desktop
# Go to: https://pagespeed.web.dev/
```

**Mobile Testing**:

```bash
# Google Mobile-Friendly Test
# Go to: https://search.google.com/test/mobile-friendly
```

---

### 13. Compliance Review

**Status**: PENDING

**Checklist**:

- [ ] Review all ad copy for accuracy
- [ ] Verify all claims with data
- [ ] Check landing page relevance to ads
- [ ] Ensure forms don't have unnecessary fields
- [ ] Verify privacy policy is accessible
- [ ] Check all contact info is correct
- [ ] Review Terms of Service completeness

---

## 📊 ESTIMATED TIMELINE

```
Week 1 (Now):
- Deploy website ✅
- Create sitemap/robots.txt ✅
- Set up Google Search Console ✅
  Total: 1 hour ⏱

Week 2:
- Set up Google Analytics ✅
- Create Google Business Profile ✅
- Prepare ad copy & keywords ✅
  Total: 2 hours ⏱

Week 3:
- Set up Google Ads account ✅
- Create campaign structure ✅
- Add conversion tracking ✅
- Final compliance review ✅
  Total: 1.5 hours ⏱

Week 4:
- Soft launch with $10/day budget
- Monitor performance
- Optimize based on data

Week 5+:
- Scale budget based on ROI
- A/B test ads and landing pages
- Expand to new keywords/states
```

---

## 📊 Key Metrics to Track

| Metric                   | Target | How to Check                   |
| ------------------------ | ------ | ------------------------------ |
| Click-Through Rate (CTR) | 3-5%   | Google Ads dashboard           |
| Cost-Per-Click (CPC)     | $2-8   | Google Ads dashboard           |
| Conversion Rate          | 5-15%  | Google Analytics               |
| Cost-Per-Lead            | $15-40 | Calculate: Spend ÷ Conversions |
| Quality Score            | 7+     | Google Ads keyword details     |
| Page Load Time           | <3 sec | PageSpeed Insights             |
| Mobile Score             | 75+    | PageSpeed Insights             |

---

## ⚠️ Common Pitfalls to Avoid

❌ **Don't**:

- Launch with high daily budget immediately
- Use overly broad keywords (target long-tail)
- Ignore landing page relevance to ads
- Make unsupported claims about rebate amounts
- Forget to verify Google Search Console
- Use auto-bidding before gathering enough data
- Neglect mobile testing

✅ **Do**:

- Test with low budget first ($10-20/day)
- Use specific, high-intent keywords
- Create dedicated landing pages for ads
- Use disclaimers: "Rebates vary by location"
- Verify all analytics and conversion tracking
- Monitor and adjust daily
- Test across all devices

---

## 🚀 Next Steps (Priority Order)

1. **TODAY**: Review this document, confirm readiness
2. **THIS WEEK**: Deploy website, create sitemap, set up Search Console
3. **NEXT WEEK**: Set up Analytics, Google Business, prepare ads
4. **WEEK 3**: Set up Google Ads account, create campaigns
5. **WEEK 4**: Soft launch with $10-20/day budget
6. **ONGOING**: Monitor, optimize, scale

---

**Last Updated**: February 28, 2026  
**Next Review**: March 7, 2026 (after immediate tasks)  
**Overall Status**: 🟡 80% READY - Awaiting infrastructure setup
