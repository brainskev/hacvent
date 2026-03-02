import { auth, currentUser } from '@clerk/nextjs/server'

const hasAdminRoleMetadata = (value: unknown) => {
  if (!value || typeof value !== 'object') return false
  const role = (value as Record<string, unknown>).role
  return role === 'admin' || role === 'super_admin'
}

export async function isAdminRequest() {
  const { userId } = await auth()
  if (!userId) return false

  const user = await currentUser()
  if (!user) return false

  const isMetadataAdmin =
    hasAdminRoleMetadata(user.publicMetadata) ||
    hasAdminRoleMetadata(user.privateMetadata) ||
    hasAdminRoleMetadata(user.unsafeMetadata)

  return isMetadataAdmin
}
