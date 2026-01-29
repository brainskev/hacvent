# Clerk Authentication Setup Guide

## Overview

Clerk is used for user authentication. After the eligibility check, users must sign up/log in before proceeding to the customer intake form.

## Auth Flow

```
1. User visits "/" → browses eligibility check
                    ↓
2. User completes eligibility check → eligible
                    ↓
3. Click "Continue" → redirects to /sign-up
                    ↓
4. User creates account (Clerk sign-up form)
                    ↓
5. After sign-up → redirects to /customer-intake
                    ↓
6. User completes intake form
```

## Setup Instructions

### 1. Create Clerk Account

- Go to https://dashboard.clerk.com
- Sign up or log in
- Create a new application

### 2. Get API Keys

From the Clerk dashboard:

- Go to Settings → API Keys
- Copy:
  - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - **Secret Key** → `CLERK_SECRET_KEY`

### 3. Configure Environment Variables

Add to `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/customer-intake
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/customer-intake
```

### 4. Configure Allowed Domains

In Clerk dashboard:

- Settings → Domains
- Add your domain(s):
  - Development: `localhost:3001` (or your dev port)
  - Production: `yourdomain.com`

### 5. Restart Dev Server

```bash
npm run dev
```

## Routes

| Route                 | Type                | Purpose                   |
| --------------------- | ------------------- | ------------------------- |
| `/`                   | Public              | Landing page              |
| `/eligibility-check`  | Public              | Eligibility questionnaire |
| `/sign-up`            | Public (forms only) | Clerk sign-up             |
| `/sign-in`            | Public (forms only) | Clerk sign-in             |
| `/customer-intake`    | Protected           | User intake form          |
| `/customer-dashboard` | Protected           | User dashboard            |
| `/admin/**`           | Protected           | Admin area                |

## Protected vs Public Routes

### Public Routes (no auth required)

- `/`
- `/faq`
- `/eligibility-check`
- `/application-received`
- `/sign-up`
- `/sign-in`

### Protected Routes (auth required)

- `/customer-intake`
- `/customer-dashboard`
- `/admin/**`

Protection is handled by:

1. **middleware.ts** - Route-level protection
2. **useAuth() hook** - Component-level checks
3. **Manual redirects** - Explicit auth checks

## Components

### Using useAuth Hook

```tsx
import { useAuth } from "@clerk/nextjs";

export default function MyComponent() {
  const { isLoaded, isSignedIn, user } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome {user?.firstName}!</div>;
}
```

### Using useUser Hook

```tsx
import { useUser } from "@clerk/nextjs";

export default function MyComponent() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return <div>Email: {user?.emailAddresses[0].emailAddress}</div>;
}
```

## User Data Available

From Clerk's `user` object:

```javascript
{
  id: 'user_2Yt...',
  emailAddresses: [
    { emailAddress: 'user@example.com', id: 'idn_...' }
  ],
  firstName: 'John',
  lastName: 'Doe',
  imageUrl: 'https://...',
  createdAt: Date,
  updatedAt: Date,
  // ... more fields
}
```

## Storing Application Data

When user submits intake form:

1. Get user ID from `useAuth()` hook
2. Link application to `user.id` in MongoDB
3. Store user's Clerk ID in `customerId` field

```tsx
const { userId } = useAuth();

const application = {
  customerId: new ObjectId(userId), // Store Clerk user ID
  applicationNumber: "APP-001",
  status: "preliminary-eligibility",
  // ... other fields
};
```

## Sign-Out

Add sign-out button in components:

```tsx
import { useClerk } from "@clerk/nextjs";

export default function SignOutButton() {
  const { signOut } = useClerk();

  return <button onClick={() => signOut()}>Sign Out</button>;
}
```

## Customization

### Theme Customization

In sign-up/sign-in pages:

```tsx
<SignUp
  appearance={{
    elements: {
      rootBox: "my-custom-class",
      card: "shadow-lg border border-gray-200",
      formButtonPrimary: "bg-primary hover:bg-primary-dark",
    },
  }}
/>
```

### Social Login

Enable in Clerk dashboard:

- Settings → Social Connections
- Configure Google, GitHub, etc.
- Update sign-up/sign-in components

## Webhooks

To sync Clerk user data to MongoDB:

1. Create webhook endpoint: `/api/webhooks/clerk`
2. Configure in Clerk dashboard:
   - Settings → Webhooks
   - Add endpoint URL
   - Subscribe to: `user.created`, `user.deleted`, `user.updated`

Example webhook handler:

```tsx
export async function POST(req: Request) {
  const evt = await req.json();

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Save to MongoDB
    const usersCollection = await getCollection("users");
    await usersCollection.insertOne({
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      createdAt: new Date(),
    });
  }

  return Response.json({ success: true });
}
```

## Testing

### Test Sign-Up Flow

1. Go to http://localhost:3001/eligibility-check
2. Complete eligibility check
3. Click "Continue"
4. Should redirect to /sign-up
5. Fill in sign-up form
6. Should redirect to /customer-intake

### Test Auth Protection

1. Try to access /customer-intake without signing in
2. Should redirect to /sign-up

### Test Sign-In

1. After sign-up, sign out
2. Go to /sign-in
3. Log in with credentials
4. Should redirect to /customer-intake

## Troubleshooting

| Issue                     | Solution                               |
| ------------------------- | -------------------------------------- |
| "Clerk API key not set"   | Add keys to `.env.local` and restart   |
| Sign-up page shows errors | Check domain in Clerk settings         |
| Redirect not working      | Verify URLs in `.env.local`            |
| Session not persisting    | Clear cookies and try again            |
| Can't find user data      | Check `useAuth()` or `useUser()` hooks |

## Environment Variables Checklist

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Set
- [ ] `CLERK_SECRET_KEY` - Set
- [ ] Domain added in Clerk dashboard
- [ ] Restart dev server after changes

## Production Deployment

When deploying to production:

1. Create Clerk application for production
2. Get production API keys
3. Update environment variables in hosting platform
4. Add production domain in Clerk settings
5. Test auth flow in production

## Security Notes

✅ API key is secure (not exposed to client)
✅ Session tokens are httpOnly cookies
✅ User passwords encrypted by Clerk
✅ CORS configured automatically
✅ Rate limiting on API endpoints
⏭️ TODO: Add 2FA support
⏭️ TODO: Add social login
⏭️ TODO: Add email verification requirements
