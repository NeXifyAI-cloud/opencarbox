/**
 * Supabase Middleware Client
 * 
 * Aktualisiert Auth-Session bei jedem Request.
 * Wird in middleware.ts verwendet.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Aktualisiert die Supabase Auth-Session und setzt Cookies.
 * Muss in der Next.js Middleware aufgerufen werden.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // WICHTIG: Nicht zwischen createServerClient und supabase.auth.getUser()
  // anderen Code ausführen. Ein einfacher Fehler kann schwer zu debuggen sein.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Optional: Geschützte Routen prüfen
  // if (!user && request.nextUrl.pathname.startsWith('/admin')) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}

