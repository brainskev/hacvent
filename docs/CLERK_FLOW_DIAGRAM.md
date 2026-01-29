# Clerk Authentication - Complete Flow Diagram

## User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: User on Website                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  Landing Page (/)   │ ← Public Route
                    └─────────────────────┘
                              ↓
                 ┌────────────────────────────┐
                 │  Browse FAQ, Learn More    │
                 └────────────────────────────┘
                              ↓
              ┌──────────────────────────────────┐
              │  Click "Check Eligibility"       │
              └──────────────────────────────────┘
                              ↓
         ┌────────────────────────────────────────────┐
         │ Eligibility Check Page (/eligibility-check)│ ← Public
         │ Answer 5 questions                         │
         └────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │ Check Results    │
                    └──────────────────┘
                         ↙          ↘
          ┌─────────────────┐   ┌──────────────────┐
          │ Not Eligible    │   │ Eligible         │
          │ (show reasons)  │   │ "Continue" btn   │
          └─────────────────┘   └──────────────────┘
                                         ↓
        ┌────────────────────────────────────────────────┐
        │ middleware.ts checks auth status               │
        │ User NOT authenticated                         │
        └────────────────────────────────────────────────┘
                              ↓
      ┌────────────────────────────────────────────────────┐
      │  Redirect to Sign-Up Page (/sign-up)               │
      │  ✓ Public Route (can access without auth)          │
      │  ✓ Shows Clerk sign-up form                        │
      │  ✓ Fields: Email, Password, Name                   │
      └────────────────────────────────────────────────────┘
                              ↓
                 ┌──────────────────────────┐
                 │  User Creates Account    │
                 │  (Clerk handles auth)    │
                 └──────────────────────────┘
                              ↓
      ┌────────────────────────────────────────────────────┐
      │  Clerk creates session token                       │
      │  Stores in httpOnly cookie                         │
      │  Redirects to /customer-intake                     │
      └────────────────────────────────────────────────────┘
                              ↓
        ┌────────────────────────────────────────────────┐
        │ middleware.ts checks auth status               │
        │ User IS authenticated                          │
        │ ✓ Allow access to /customer-intake             │
        └────────────────────────────────────────────────┘
                              ↓
      ┌────────────────────────────────────────────────────┐
      │  Customer Intake Page (/customer-intake)           │
      │  ✓ Protected Route (requires auth)                 │
      │  ✓ Page checks useAuth() hook:                     │
      │    - if (!isSignedIn) redirect to /sign-up         │
      │  ✓ User sees form (Step 1, 2, 3)                  │
      │  ✓ Stores userId in application record            │
      └────────────────────────────────────────────────────┘
                              ↓
           ┌──────────────────────────────────┐
           │  User Submits Intake Form         │
           │  Application created in MongoDB  │
           │  customerId: clerk user ID        │
           └──────────────────────────────────┘
                              ↓
      ┌────────────────────────────────────────────────────┐
      │  Application Received Page                         │
      │  (/application-received)                           │
      │  Shows confirmation                                │
      └────────────────────────────────────────────────────┘
                              ↓
      ┌────────────────────────────────────────────────────┐
      │  User Can Now Access:                              │
      │  ✓ /customer-dashboard (see their applications)    │
      │  ✓ /admin/** (if admin role)                       │
      └────────────────────────────────────────────────────┘
```

## State Transitions

```
┌──────────────┐
│   NOT SIGNED IN
│ (Public routes OK)
│ Can access: /, /eligibility-check, /sign-up
│ Cannot: /customer-intake, /customer-dashboard
└──────────────┘
        ↓
   [Sign Up]
        ↓
┌──────────────┐
│   SIGNED IN
│ (All routes OK)
│ Can access: all routes
│ Middleware allows /customer-intake
└──────────────┘
        ↓
   [Sign Out]
        ↓
┌──────────────┐
│   NOT SIGNED IN
└──────────────┘
```

## Route Access Matrix

```
Route                 | Not Signed In | Signed In
────────────────────────────────────────────────
/                     | ✓ Allow       | ✓ Allow
/faq                  | ✓ Allow       | ✓ Allow
/eligibility-check    | ✓ Allow       | ✓ Allow
/sign-up              | ✓ Allow       | → Redirect to /customer-intake
/sign-in              | ✓ Allow       | → Redirect to /customer-intake
/customer-intake      | ✗ Redirect    | ✓ Allow
/customer-dashboard   | ✗ Redirect    | ✓ Allow
/admin/**             | ✗ Redirect    | ✓ Allow (if admin role)
```

## Auth Check Points

```
1. MIDDLEWARE LEVEL (middleware.ts)
   ├─ Public routes: Always allow
   ├─ Protected routes: Check auth
   └─ If not auth: Redirect to /sign-up

2. COMPONENT LEVEL (useAuth hook)
   ├─ Check isLoaded (auth state ready)
   ├─ Check isSignedIn
   └─ Render loading, redirect, or content

3. DATA LEVEL (when saving)
   ├─ Get userId from useAuth()
   ├─ Store in database
   └─ Link application to user
```

## Component Auth Flow

```
ComponentMount
    ↓
useEffect() triggers
    ↓
useAuth() hook returns { isLoaded, isSignedIn, userId }
    ↓
isLoaded === false?
    ├─ YES → Show loading state
    └─ NO → Continue
         ↓
    isSignedIn === false?
        ├─ YES → router.push('/sign-up')
        └─ NO → Render component
```

## Data Flow After Sign-Up

```
User Signs Up
    ↓
Clerk Creates Account
    ↓
Session Token Generated
    ↓
Token Stored in Cookie (httpOnly)
    ↓
Redirect to /customer-intake
    ↓
Middleware Validates Token
    ↓
Component Checks useAuth()
    ↓
userId Available
    ↓
User Submits Application
    ↓
customerId = userId (from Clerk)
    ↓
Data Saved to MongoDB
    ↓
User Can View in Dashboard
```

## Middleware Decision Tree

```
Request to Protected Route
    ↓
Does Clerk Session Exist?
    ├─ YES → Allow request
    └─ NO → Check if public route
            ├─ YES (public) → Allow request
            └─ NO (protected) → Redirect to /sign-up
```

## Future Flow (with roles)

```
For Contractors:
    ↓
User Signs Up on /contractor-onboarding
    ↓
Clerk Creates Account + Sets Role
    ↓
Middleware checks userId AND contractor role
    ↓
Allow access to /contractor/** routes
    ↓
Access to contractor dashboard

For Admins:
    ↓
Admin created in Clerk dashboard (manual)
    ↓
Admin logs in via /sign-in
    ↓
Clerk checks admin role
    ↓
Middleware verifies role
    ↓
Allow access to /admin/** routes
    ↓
Access to admin panel
```

## File Organization

```
src/app/
├─ layout.tsx                          ← ClerkProvider wrapper
├─ page.tsx                            ← Landing (public)
├─ eligibility-check/
│  └─ page.tsx                         ← Public, redirects to /sign-up
├─ sign-up/
│  └─ [[...sign-up]]/page.tsx          ← Clerk form (public)
├─ sign-in/
│  └─ [[...sign-in]]/page.tsx          ← Clerk form (public)
├─ customer-intake/
│  └─ page.tsx                         ← Protected, checks useAuth()
├─ customer-dashboard/
│  └─ page.tsx                         ← Protected
└─ admin/
   └─ page.tsx                         ← Protected

middleware.ts                          ← Route protection layer
```

---

**Status**: ✅ Implementation complete
**Auth Provider**: Clerk (free tier available)
**Session Storage**: httpOnly cookies (secure)
**Auth Checks**: Middleware + Component level
