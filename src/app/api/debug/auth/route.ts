import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const getRoleFromMetadata = (value: unknown) => {
  if (!value || typeof value !== 'object') return null
  const role = (value as Record<string, unknown>).role
  return typeof role === 'string' ? role : null
}

const getRoleFromClaims = (sessionClaims: unknown) => {
  if (!sessionClaims || typeof sessionClaims !== 'object') {
    return { role: null as string | null, metadataRole: null as string | null }
  }

  const claims = sessionClaims as Record<string, unknown>
  const role = typeof claims.role === 'string' ? claims.role : null
  const metadataRole = getRoleFromMetadata(claims.metadata)

  return { role, metadataRole }
}

const isAdminRole = (role: string | null) => role === 'admin' || role === 'super_admin'

const isDebugAllowed = (req: NextRequest) => {
  if (process.env.NODE_ENV !== 'production') return true

  const token = process.env.AUTH_DEBUG_TOKEN
  if (!token) return false

  const suppliedToken = req.headers.get('x-auth-debug-token')
  return suppliedToken === token
}

export async function GET(req: NextRequest) {
  if (!isDebugAllowed(req)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const { userId, sessionId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Not signed in',
          userId: null,
          sessionId: sessionId ?? null,
        },
        { status: 401 }
      )
    }

    const claimsRole = getRoleFromClaims(sessionClaims)

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    const publicRole = getRoleFromMetadata(user.publicMetadata)
    const privateRole = getRoleFromMetadata(user.privateMetadata)
    const unsafeRole = getRoleFromMetadata(user.unsafeMetadata)

    const isAdminByClaims = isAdminRole(claimsRole.role) || isAdminRole(claimsRole.metadataRole)
    const isAdminByMetadata =
      isAdminRole(publicRole) || isAdminRole(privateRole) || isAdminRole(unsafeRole)

    return NextResponse.json(
      {
        ok: true,
        environment: process.env.NODE_ENV,
        user: {
          id: user.id,
          primaryEmail: user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress ?? null,
        },
        session: {
          id: sessionId ?? null,
          role: claimsRole.role,
          metadataRole: claimsRole.metadataRole,
        },
        metadata: {
          publicRole,
          privateRole,
          unsafeRole,
          publicMetadata: user.publicMetadata,
          privateMetadata: user.privateMetadata,
          unsafeMetadata: user.unsafeMetadata,
        },
        authorization: {
          isAdminByClaims,
          isAdminByMetadata,
          effectiveIsAdmin: isAdminByClaims || isAdminByMetadata,
        },
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}
