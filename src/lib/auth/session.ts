import { logger } from "../logger";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export interface UserSession {
  userId: string
  email: string
  name?: string
  role?: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER'
  emailVerified?: boolean
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignored when called from Server Component
            }
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    return {
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.name,
      role: session.user.user_metadata?.role || 'CUSTOMER',
      emailVerified: !!session.user.email_confirmed_at,
    }
  } catch (error) {
    logger.error('Failed to get session:', error)
    return null
  }
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized: No active session')
  }

  return session
}

export async function requireRole(
  requiredRole: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER'
): Promise<UserSession> {
  const session = await requireAuth()

  const roleHierarchy: Record<string, number> = {
    ADMIN: 3,
    EMPLOYEE: 2,
    CUSTOMER: 1,
  }

  const userLevel = roleHierarchy[session.role || 'CUSTOMER'] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0

  if (userLevel < requiredLevel) {
    throw new Error(`Insufficient permissions: Required role ${requiredRole}`)
  }

  return session
}

export async function requireAdmin(): Promise<UserSession> {
  return requireRole('ADMIN')
}

export async function requireEmployee(): Promise<UserSession> {
  return requireRole('EMPLOYEE')
}

export async function requireCustomer(): Promise<UserSession> {
  return requireAuth()
}
