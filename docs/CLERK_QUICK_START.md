# Clerk Auth Quick Start

## 🚀 5-Minute Setup

### 1. Create Clerk Account

- Go to https://dashboard.clerk.com
- Sign up (free)
- Create new application

### 2. Copy API Keys

From Clerk Dashboard → Settings → API Keys:

```
Publishable Key (starts with pk_)
Secret Key (starts with sk_)
```

### 3. Add to `.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/customer-intake
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/customer-intake
```

### 4. Add Domain

In Clerk Dashboard → Settings → Domains:

- Development: `localhost:3001`

### 5. Restart

```bash
npm run dev
```

Done! ✅

---

## 📍 Routes

| Route                 | Auth    | Purpose   |
| --------------------- | ------- | --------- |
| `/`                   | No      | Home      |
| `/eligibility-check`  | No      | Quiz      |
| `/sign-up`            | No      | Register  |
| `/sign-in`            | No      | Login     |
| `/customer-intake`    | **Yes** | Form      |
| `/customer-dashboard` | **Yes** | Dashboard |

---

## 💻 Using Auth in Code

### Check if user is signed in

```tsx
import { useAuth } from "@clerk/nextjs";

const { isSignedIn, userId } = useAuth();

if (!isSignedIn) {
  // Show login prompt
}
```

### Get user details

```tsx
import { useUser } from "@clerk/nextjs";

const { user } = useUser();

console.log(user?.emailAddresses[0].emailAddress);
console.log(user?.firstName);
```

### Sign out

```tsx
import { useClerk } from '@clerk/nextjs'

const { signOut } = useClerk()

<button onClick={() => signOut()}>Logout</button>
```

---

## 🔄 Auth Flow

```
User on homepage
  ↓
Clicks eligibility check
  ↓
Answers questions
  ↓ (if eligible)
Clicks "Continue"
  ↓
Redirected to /sign-up (Clerk form)
  ↓
Creates account
  ↓
Auto-redirected to /customer-intake (protected)
  ↓
Fills intake form
```

---

## 🛡️ Protected vs Public

**Protected** (needs login):

- `/customer-intake`
- `/customer-dashboard`
- `/admin/**`

**Public** (no login needed):

- `/`
- `/eligibility-check`
- `/sign-up`
- `/sign-in`

---

## ✅ Test It

1. Go to http://localhost:3001
2. Click eligibility check
3. Complete quiz
4. Click continue
5. Should see sign-up form ✓
6. Sign up with test email
7. Should go to intake form ✓

---

## 🐛 Quick Fixes

| Problem                       | Fix                                 |
| ----------------------------- | ----------------------------------- |
| "Key not found"               | Restart server after `.env` changes |
| Sign-up not showing           | Add domain in Clerk settings        |
| Redirect not working          | Check middleware.ts route config    |
| Can't access /customer-intake | You must sign up first              |

---

## 📚 More Info

- Full guide: `docs/CLERK_AUTH_SETUP.md`
- Implementation details: `docs/CLERK_AUTH_IMPLEMENTATION.md`
- Clerk docs: https://clerk.com/docs
