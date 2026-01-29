# Step 2: Quote Comparison View - Planning & Readiness

**Current Status**: Ready to begin (Step 1 complete)

## Overview

Step 2 focuses on enabling customers to compare multiple quotes they've received from different contractors. This includes a side-by-side comparison interface and the ability to filter, sort, and analyze quotes based on various criteria.

## What Step 1 Provided (Ready to Use)

### API Data Available
```
GET /api/quotes/list?status=sent,viewed
```
Returns all quotes customer has received with:
- Total cost
- Net cost (after rebates)
- Equipment brand and model
- Warranty years
- Timeline (start date, completion days)
- Rebate assistance option
- Financing options
- Special notes

### Quote Table Structure
```
quotes {
  id: UUID
  quote_number: string
  contractor_id: UUID
  customer_id: UUID
  total_cost: number
  net_cost: number
  equipment_brand: string
  equipment_model: string
  warranty_years: number
  estimated_start_date: date
  estimated_completion_days: number
  includes_rebate_assistance: boolean
  includes_financing: boolean
  financing_options: string
  special_notes: string
  status: 'sent' | 'viewed' | 'accepted' | 'rejected'
  created_at: timestamp
  sent_at: timestamp
}
```

### Related Data Available
```
contractors {
  name: string
  company: string
  rating: number
  completed_projects: number
  verified: boolean
}
```

## Components to Build for Step 2

### 1. Quote Comparison Component
**File**: `components/QuoteComparison.tsx`

Features:
- Side-by-side quote display (2-4 quotes at a time)
- Highlight differences in costs
- Compare timelines
- Compare rebate/financing options
- Visual indicators for best value
- Expandable details view

Props:
```typescript
interface QuoteComparisonProps {
  quotes: Quote[]
  selectedQuotes: string[] // quote IDs
  onSelectQuote: (quoteId: string) => void
  onDeselectQuote: (quoteId: string) => void
  onAcceptQuote: (quoteId: string) => void
  onRejectQuote: (quoteId: string, reason: string) => void
}
```

### 2. Quote Filter Component
**File**: `components/QuoteFilters.tsx`

Features:
- Filter by contractor
- Filter by price range (total or net)
- Filter by timeline
- Filter by warranty years
- Filter by rebate/financing availability

Props:
```typescript
interface QuoteFiltersProps {
  quotes: Quote[]
  onFilterChange: (filters: QuoteFilter) => void
  activeFilters: QuoteFilter
}

interface QuoteFilter {
  contractor?: string[]
  minCost?: number
  maxCost?: number
  timeline?: { min: number; max: number }
  warranty?: { min: number; max: number }
  rebateAssistance?: boolean
  financing?: boolean
}
```

### 3. Quote Sort Component
**File**: `components/QuoteSort.tsx`

Sort options:
- Lowest total cost
- Lowest net cost (after rebates)
- Fastest timeline
- Longest warranty
- Newest quote
- Highest contractor rating

Props:
```typescript
interface QuoteSortProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

type SortOption = 'total-cost' | 'net-cost' | 'timeline' | 'warranty' | 'newest' | 'rating'
```

### 4. Enhanced Customer Dashboard
**File**: Update `pages/dashboard.tsx`

Add "Quotes" tab with:
- Display all received quotes
- Quote filter and sort controls
- Quote comparison view
- Accept/reject actions
- Visual status indicators

### 5. Quote Detail Modal
**File**: `components/QuoteDetailModal.tsx`

Shows expanded details:
- Full contractor info with rating
- Complete cost breakdown
- Timeline details
- Rebate details
- Financing options
- Special notes from contractor
- Action buttons (Accept/Reject)

## Database Queries Needed

### 1. Get Customer's Quotes with Contractor Data
```sql
SELECT 
  q.*,
  c.name as contractor_name,
  c.company,
  c.rating,
  c.completed_projects,
  c.verified
FROM quotes q
JOIN contractors c ON q.contractor_id = c.id
WHERE q.customer_id = $1
  AND q.status IN ('sent', 'viewed')
ORDER BY q.created_at DESC
```

### 2. Get Quote Comparison Stats
```sql
SELECT 
  MIN(total_cost) as lowest_total,
  MAX(total_cost) as highest_total,
  MIN(net_cost) as lowest_net,
  MAX(net_cost) as highest_net,
  MIN(estimated_completion_days) as fastest_timeline,
  MAX(estimated_completion_days) as longest_timeline,
  AVG(warranty_years) as avg_warranty
FROM quotes
WHERE customer_id = $1 AND status IN ('sent', 'viewed')
```

## API Endpoints to Create

### GET `/api/customer/quotes`
List all quotes for customer with optional filters/sorting

Request:
```json
{
  "sort": "net-cost" | "total-cost" | "timeline" | "warranty" | "newest" | "rating",
  "filters": {
    "contractorIds": ["id1", "id2"],
    "minCost": 3000,
    "maxCost": 8000,
    "minTimeline": 3,
    "maxTimeline": 10,
    "rebateAssistance": true,
    "financing": true
  },
  "limit": 20,
  "offset": 0
}
```

Response:
```json
{
  "quotes": [
    {
      "id": "uuid",
      "quote_number": "QT-xxx",
      "contractor": {
        "name": "...",
        "company": "...",
        "rating": 4.9,
        "completed_projects": 150,
        "verified": true
      },
      "total_cost": 8500,
      "net_cost": 4200,
      "timeline": 7,
      "warranty_years": 5,
      "rebate_assistance": true,
      "financing_options": "...",
      "status": "viewed",
      "created_at": "2024-12-12T10:30:00Z"
    }
  ],
  "stats": {
    "lowest_total": 6000,
    "highest_total": 9500,
    "lowest_net": 3200,
    "fastest_timeline": 3,
    "avg_rating": 4.7
  }
}
```

## UI/UX Considerations

### 1. Comparison Table Layout
- Sticky contractor name header
- Color-coded cost indicators (green=lowest, red=highest)
- Checkmarks for included features
- Expandable details

### 2. Visual Hierarchy
- Highlight best value (lowest net cost)
- Highlight best timeline
- Highlight best warranty
- Highlight best rated contractor

### 3. Decision Making
- Cost savings calculator
- Timeline comparison
- Risk indicators (new vs verified contractors)
- Customer reviews/ratings

## Acceptance Criteria

- [ ] Can filter quotes by contractor, price, timeline
- [ ] Can sort by different criteria
- [ ] Side-by-side comparison shows 2-4 quotes clearly
- [ ] Can see full quote details in modal
- [ ] Can accept/reject quotes with reasons
- [ ] Status updates are reflected immediately
- [ ] Responsive on mobile (single column)
- [ ] No TypeScript errors
- [ ] Proper error handling for API calls

## Data Flow

```
Customer receives quotes (Step 1 complete)
    ↓
Customer views "Quotes" tab on dashboard
    ↓
Shows all received quotes with filters/sort
    ↓
Customer selects 2-4 quotes for comparison
    ↓
Side-by-side comparison displayed
    ↓
Customer clicks on quote for full details
    ↓
Modal shows all details + Accept/Reject buttons
    ↓
Customer accepts quote
    ↓
/api/quotes/[id] PATCH with status=accepted
    ↓
Contractor notified (Step 1 - already integrated)
    ↓
Move to Step 3: Contractor Selection & Scheduling
```

## Implementation Order

1. **Create API endpoint**: `/api/customer/quotes` with filtering/sorting
2. **Build Filter component**: Quote filtering controls
3. **Build Sort component**: Quote sorting controls
4. **Build Comparison component**: Side-by-side quote display
5. **Build Quote Detail modal**: Expanded quote information
6. **Add Quotes tab to dashboard**: Integrate all components
7. **Testing**: Full quote comparison flow

## Estimated Effort

- Filter Component: 1-2 hours
- Sort Component: 30 minutes
- Comparison Component: 2-3 hours
- API Endpoint: 1 hour
- Dashboard Integration: 1 hour
- Testing: 1 hour

**Total: 6-8 hours**

## Dependencies

✅ All satisfied by Step 1:
- Quote data structure
- API framework
- Notification system
- Contractor data linked to quotes
- Status tracking

---

**Ready to start Step 2 whenever you're ready!**
