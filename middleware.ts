import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)'])
const isDebugRoute = createRouteMatcher(['/api/debug(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect()
  }

  // Run Clerk middleware on debug routes so auth() can access session claims.
  if (isDebugRoute(req)) {
    await auth()
  }
})

export const config = {
  matcher: ['/admin(.*)', '/api/admin(.*)', '/api/debug(.*)']
}
