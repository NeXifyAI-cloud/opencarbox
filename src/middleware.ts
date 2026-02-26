import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  // Sicherheit: Alle x-user-* Header vom Client entfernen, um Spoofing zu verhindern
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-user-id')
  requestHeaders.delete('x-user-role')
  requestHeaders.delete('x-user-email')

  // Protected paths and their required roles
  const protectedPaths: Record<string, string | string[]> = {
    '/admin': 'ADMIN',
    '/werkstatt': 'EMPLOYEE',
    '/mein-konto': 'CUSTOMER',
    '/api/admin': 'ADMIN',
    '/api/werkstatt': 'EMPLOYEE',
    '/api/users': 'CUSTOMER',
    '/api/orders': 'CUSTOMER',
    '/api/vehicles': 'CUSTOMER',
    '/api/appointments': 'CUSTOMER',
  }

  const pathname = request.nextUrl.pathname

  // Check if path needs protection
  const protectedPath = Object.entries(protectedPaths).find(([path]) =>
    pathname.startsWith(path)
  )

  if (!protectedPath) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  const [, requiredRole] = protectedPath

  try {
    // Get session from Supabase
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
              // The setAll method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Nicht authentifiziert' },
          { status: 401 }
        )
      }
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const userRole = session.user.user_metadata?.role || 'CUSTOMER'

    // Check role hierarchy
    const roleHierarchy: Record<string, number> = {
      ADMIN: 3,
      EMPLOYEE: 2,
      CUSTOMER: 1,
    }

    const userLevel = roleHierarchy[userRole] || 0
    const requiredLevel = Array.isArray(requiredRole)
      ? Math.max(...requiredRole.map(r => roleHierarchy[r] || 0))
      : roleHierarchy[requiredRole as string] || 0

    if (userLevel < requiredLevel) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Nicht autorisiert' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Add session info to headers
    requestHeaders.set('x-user-id', session.user.id)
    requestHeaders.set('x-user-role', userRole)
    requestHeaders.set('x-user-email', session.user.email || '')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/werkstatt/:path*',
    '/mein-konto/:path*',
    '/api/admin/:path*',
    '/api/werkstatt/:path*',
    '/api/users/:path*',
    '/api/orders/:path*',
    '/api/vehicles/:path*',
    '/api/appointments/:path*',
  ],
}
