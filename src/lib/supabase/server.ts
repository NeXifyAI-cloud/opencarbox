/**
 * Supabase Client für Server-Komponenten und API Routes
 *
 * Verwendet Cookies für Auth-Session-Management.
 * Dieser Client respektiert RLS und User-Sessions.
 *
 * @example
 * ```tsx
 * // In Server Component
 * import { createServerClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = await createServerClient()
 *   const { data } = await supabase.from('products').select('*')
 *   return <div>{JSON.stringify(data)}</div>
 * }
 * ```
 */

import type { Database } from '@/types/supabase';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cookie-Typ für setAll */
interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * Erstellt einen Supabase-Client für Server-Komponenten.
 * Verwendet Cookies für Session-Management.
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Der `setAll` Methode wurde von einer Server Component aufgerufen.
            // Dies kann ignoriert werden, wenn Middleware die Session aktualisiert.
          }
        },
      },
    }
  )
}

/**
 * Erstellt einen Supabase Admin-Client mit Service Role Key.
 * ACHTUNG: Umgeht RLS - nur für Admin-Operationen verwenden!
 *
 * @example
 * ```ts
 * const admin = createAdminClient()
 * await admin.from('users').delete().eq('id', userId)
 * ```
 */
export function createAdminClient() {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // Admin Client braucht keine Cookies
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
