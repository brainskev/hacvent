# Hacvent Branding Guide

## Logo Overview

Hacvent's professional brand identity consists of two logo assets:

### 1. Main Logo (`/public/hacvent-logo.svg`)

- **Size**: 200x200px (scalable SVG)
- **Usage**: Primary logo for headers, footers, print materials, and brand applications
- **Design Elements**:
  - **H-Shape**: Represents HVAC ductwork and airflow - the core of heating/cooling systems
  - **Thermostat Accent**: Red/gold circle on the right representing temperature control and energy efficiency
  - **Color Scheme**: Professional blues with energetic accents

### 2. Favicon (`/public/favicon-hacvent.svg`)

- **Size**: 32x32px (optimized for browser tabs and favicons)
- **Usage**: Website favicon, small logo displays, app icons
- **Design**: Simplified H-shape with thermostat indicator, optimized for visibility at small sizes

## Color Palette

| Color        | Hex Code                          | Usage                          | Description                          |
| ------------ | --------------------------------- | ------------------------------ | ------------------------------------ |
| Primary Blue | #0066CC                           | Main brand color, backgrounds  | Professional, trustworthy foundation |
| Cyan Accent  | #00B4D8                           | Secondary elements, highlights | Modern, energy-forward accent        |
| Energy Red   | #FF006E                           | Thermostat indicator, CTAs     | Action and emphasis                  |
| Gold         | #FFB703                           | Efficiency indicator, accents  | Premium, efficiency messaging        |
| White        | #FFFFFF                           | Text, contrast                 | Clean, readable contrast             |
| Dark Gray    | #0F172A (from Tailwind slate-900) | Text on light backgrounds      | Primary text color                   |

## Branding Assets Location

```
/public/
├── hacvent-logo.svg      # Main brand logo (200x200px)
└── favicon-hacvent.svg   # Browser favicon (32x32px)
```

## Implementation Guide

### Logo in Website

The logo can be implemented in multiple ways:

1. **Current Implementation** (Header.tsx):

   ```tsx
   <div className="bg-gradient-primary p-1.5 sm:p-2 rounded-lg">
     <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
   </div>
   <span className="text-xl sm:text-2xl font-bold">Hacvent</span>
   ```

2. **With SVG Logo** (Alternative):
   ```tsx
   <img src="/hacvent-logo.svg" alt="Hacvent" className="h-8 w-8" />
   <span className="text-xl sm:text-2xl font-bold">Hacvent</span>
   ```

### Next.js Favicon Setup

Add to `next.config.js` or in `app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: "/favicon-hacvent.svg",
    apple: "/favicon-hacvent.svg",
  },
};
```

## Brand Message

**Tagline**: "Empowering energy efficiency nationwide"

**Description**: Hacvent connects homeowners with certified HVAC contractors and simplifies energy-efficient rebate claims across 50+ state programs. Owned by Marxma LLC.

## Typography

- **Primary Font**: Default Next.js/Tailwind font stack
- **Headlines**: Bold weight (font-bold)
- **Body Text**: Regular weight
- **Emphasis**: Semi-bold (font-semibold) or bold

## Social Media Handles

- **Facebook**: facebook.com/hacvent
- **Twitter/X**: twitter.com/hacvent
- **LinkedIn**: linkedin.com/company/hacvent

## Contact Information

- **Email**: support@hacvent.com
- **Website**: hacvent.com
- **Phone**: 1-800-HVAC-REBATE (1-800-482-2732)

## Logo Design Rationale

### H-Shape Element

- **Represents**: HVAC ductwork, airflow, and system connectivity
- **Symbolism**: Air distribution through homes, the core of HVAC systems
- **Scalability**: Works well at any size, remains recognizable and professional

### Thermostat Accent

- **Represents**: Temperature control and energy management
- **Colors**: Red/gold thermometer icon suggests heat, efficiency, and action
- **Position**: Right side indicates forward progress and energy direction

### Color Psychology

- **Blue**: Trust, professionalism, stability - key for financial/rebate services
- **Cyan**: Modern, tech-forward, innovation - appropriate for digital platform
- **Red**: Energy, action, urgency - calls attention to opportunities
- **Gold**: Premium quality, value, efficiency rewards

## Branding Guidelines

### Do's

✅ Use the official logo files provided  
✅ Maintain the H-shape and thermostat elements  
✅ Preserve the color scheme  
✅ Use "Hacvent" (proper capitalization)  
✅ Include "Owned by Marxma LLC" in formal contexts  
✅ Apply the brand consistently across all touchpoints

### Don'ts

❌ Don't modify or alter the logo design  
❌ Don't change the primary color scheme  
❌ Don't use only the letter "H" without context  
❌ Don't combine with competitor logos  
❌ Don't use outdated "ThermoGrid" branding  
❌ Don't create variations without approval

## File Export Information

**Current Files**:

- `hacvent-logo.svg` - Main logo (scalable, 200x200px baseline)
- `favicon-hacvent.svg` - Favicon version (32x32px optimized)

**Format**: SVG (Scalable Vector Graphics)

- ✅ Resolution independent (scales to any size)
- ✅ Small file size
- ✅ Perfect for web and digital use
- ✅ Easy to modify colors if needed
- ✅ Fast loading on websites

**Alternative Formats** (can be generated from SVG):

- PNG with transparency (for raster needs)
- WebP format (for optimized web delivery)
- ICO format (for legacy favicon support)

## Integration Checklist

- [x] Logo SVG files created
- [x] Color palette defined
- [x] Homepage branding updated
- [x] Header branding updated
- [x] Footer branding updated
- [x] Admin panel branding updated
- [x] Meta tags and OG images updated
- [x] Email templates updated
- [ ] Favicon linked in HTML head (optional next step)
- [ ] Social media profiles updated (external step)
- [ ] Print materials updated (external step)
- [ ] Deployment to production

---

**Created**: 2024  
**Branding Status**: Active  
**Ownership**: Marxma LLC  
**Domain**: hacvent.com
