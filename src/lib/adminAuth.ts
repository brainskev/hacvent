import { auth, clerkClient } from '@clerk/nextjs/server'

const hasAdminRoleMetadata = (value: unknown) => {
  if (!value || typeof value !== 'object') return false
  const role = (value as Record<string, unknown>).role
  return role === 'admin' || role === 'super_admin'
}

const hasAdminRoleClaim = (sessionClaims: unknown) => {
  if (!sessionClaims || typeof sessionClaims !== 'object') return false
  const claims = sessionClaims as Record<string, unknown>

  // Clerk often maps public metadata into `metadata` claims.
  if (hasAdminRoleMetadata(claims.metadata)) return true

  const role = claims.role
  return role === 'admin' || role === 'super_admin'
}

export async function isAdminRequest() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return false

  const isClaimAdmin = hasAdminRoleClaim(sessionClaims)

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const isMetadataAdmin =
      hasAdminRoleMetadata(user.publicMetadata) ||
      hasAdminRoleMetadata(user.privateMetadata) ||
      hasAdminRoleMetadata(user.unsafeMetadata)

    return isMetadataAdmin || isClaimAdmin
  } catch {
    // Fallback to claims if Clerk API lookup fails transiently.
    return isClaimAdmin
  }
}
