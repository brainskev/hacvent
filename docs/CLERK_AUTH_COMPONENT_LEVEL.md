# Clerk Authentication - Component-Level Protection

## Overview

Instead of middleware (which has compatibility issues with Clerk 6.36.10), we use **component-level authentication checks** with the `useAuth()` hook. This is more reliable and gives us granular control.

## How It Works

### 1. **ClerkProvider** (Root Level)

- Wraps entire app in `src/app/layout.tsx`
- Enables Clerk throughout the application
- Manages session tokens

### 2. **Component-Level Checks** (Page Level)

- Each protected page uses `useAuth()` hook
- Checks if user is signed in
- Shows loading state while checking
- Redirects to sign-up if not authenticated

### 3. **Automatic Redirects**

- After sign-up → `/customer-intake`
- After sign-in → `/customer-intake`
- Unauthenticated access to protected pages → `/sign-up`

## Auth Flow

```
┌─────────────────────────────────────────┐
│  User visits eligibility check page     │
│  (public - no auth required)            │
└─────────────────────────────────────────┘
                ↓
        (completes check)
                ↓
┌─────────────────────────────────────────┐
│  Click "Continue"                       │
│  Redirect to /sign-up                   │
│  (Clerk form loads)                     │
└─────────────────────────────────────────┘
                ↓
        (creates account)
                ↓
┌─────────────────────────────────────────┐
│  Clerk stores session token             │
│  Redirects to /customer-intake          │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│  Customer intake page loads             │
│  useAuth() checks: isLoaded, isSignedIn │
│  ✓ User authenticated                   │
│  ✓ Show form                            │
└─────────────────────────────────────────┘
```

## Protected Pages

### Customer Intake

```tsx
// src/app/customer-intake/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomerIntake() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return <LoadingState />;
  }

  // Don't render if not signed in
  if (!isSignedIn) {
    return null;
  }

  // Render protected content
  return <IntakeForm />;
}
```

## Using the Auth Helper

For reusable protection, use the `ProtectedPage` component:

```tsx
// src/lib/auth.tsx
import { ProtectedPage } from "@/lib/auth";

// In your page
export default function MyProtectedPage() {
  return (
    <ProtectedPage>
      <YourContent />
    </ProtectedPage>
  );
}
```

## Getting User Information

### In Components

```tsx
import { useAuth, useUser } from "@clerk/nextjs";

export default function MyComponent() {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();

  return <div>{user && <p>Welcome {user.firstName}!</p>}</div>;
}
```

### Storing with Application Data

```tsx
const { userId } = useAuth();

const application = {
  customerId: userId, // Link to Clerk user ID
  applicationNumber: "APP-001",
  status: "preliminary-eligibility",
  // ... other fields
};
```

## Routes and Access

| Route                 | Auth Required | Purpose                        |
| --------------------- | ------------- | ------------------------------ |
| `/`                   | No            | Landing page                   |
| `/eligibility-check`  | No            | Eligibility quiz               |
| `/sign-up`            | No            | Clerk registration             |
| `/sign-in`            | No            | Clerk login                    |
| `/customer-intake`    | **Yes**       | Intake form (uses `useAuth()`) |
| `/customer-dashboard` | **Yes**       | User dashboard                 |
| `/admin/**`           | **Yes**       | Admin area                     |

## Environment Setup

Required in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/customer-intake
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/customer-intake
```

## Authentication Lifecycle

### When User Signs Up

1. User submits form in Clerk component
2. Clerk creates account
3. Session token created and stored in httpOnly cookie
4. Automatic redirect to `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (/customer-intake)
5. Component mounts → `useAuth()` checks auth
6. `isSignedIn` is now true → renders page

### When User Signs In

1. User logs in via /sign-in
2. Clerk validates credentials
3. Session token created
4. Redirects to `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (/customer-intake)
5. Same flow as sign-up

### When User Accesses Protected Page Without Auth

1. Page loads → component mounts
2. `useEffect` runs → checks `isLoaded` and `isSignedIn`
3. `isSignedIn` is false
4. `router.push('/sign-up')` → redirects to sign-up
5. User sees Clerk sign-up form

### When User Signs Out

1. User clicks sign-out button
2. Clerk clears session token
3. Can manually redirect: `router.push('/')`

## Sign-Out Example

```tsx
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Error Handling

### User tries to access /customer-intake without signing in:

```
1. Page renders
2. useEffect checks isLoaded && !isSignedIn
3. Condition is true
4. router.push('/sign-up')
5. User redirected to sign-up
```

### User signs up:

```
1. Fills Clerk form
2. Clerk creates account
3. Session stored in cookie
4. Redirects to /customer-intake
5. useEffect runs: isSignedIn is now true
6. Page renders normally
```

## Best Practices

✅ **Do**:

- Use `useAuth()` for protecting pages
- Check `isLoaded` before checking `isSignedIn`
- Show loading state while auth initializes
- Store Clerk `userId` in database
- Redirect after sign-out

❌ **Don't**:

- Access protected content without auth check
- Forget `'use client'` directive on auth pages
- Store sensitive data in localStorage
- Trust client-side checks alone for sensitive operations

## Future: Role-Based Access Control

When implementing admin roles:

```tsx
import { useAuth } from "@clerk/nextjs";

export function AdminPage() {
  const { userId, orgRole } = useAuth();

  // Check if user is admin
  if (orgRole !== "admin") {
    return <div>Access Denied</div>;
  }

  return <AdminContent />;
}
```

## Files Using Auth

- `src/app/layout.tsx` - ClerkProvider wrapper
- `src/app/customer-intake/page.tsx` - useAuth() check
- `src/app/customer-dashboard/page.tsx` - useAuth() check
- `src/app/admin/page.tsx` - useAuth() check (TODO: add role check)
- `src/lib/auth.tsx` - Helper components and hooks

## Testing

### Test Unauth Access

1. Open incognito window
2. Go to `/customer-intake`
3. Should redirect to `/sign-up`

### Test Sign-Up

1. Go to `/sign-up`
2. Fill form and submit
3. Should redirect to `/customer-intake`
4. Form should be visible

### Test Sign-In

1. Go to `/sign-in`
2. Enter credentials
3. Should redirect to `/customer-intake`

### Test Sign-Out

1. Add sign-out button (using code example above)
2. Click to sign out
3. Should redirect to home
4. Try accessing `/customer-intake`
5. Should redirect to `/sign-up`

## Troubleshooting

| Issue                  | Solution                                              |
| ---------------------- | ----------------------------------------------------- |
| Pages show 404         | Check all env vars are set correctly                  |
| Auth always redirects  | Verify Clerk keys in `.env.local`                     |
| User data is undefined | Ensure useAuth/useUser are in 'use client' components |
| Redirect loops         | Check redirect URLs in .env config                    |

## No Middleware, No Problems

By using component-level protection:

- ✅ No middleware compatibility issues
- ✅ Granular control per page
- ✅ Clear auth flow
- ✅ Easy to debug
- ✅ Works reliably with Clerk 6.36.10
