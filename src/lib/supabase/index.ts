/**
 * Supabase Client Exports
 * 
 * Zentrale Export-Datei für alle Supabase-Clients.
 * 
 * @example
 * ```tsx
 * // Client-Komponente
 * import { supabase } from '@/lib/supabase'
 * 
 * // Server-Komponente
 * import { createServerClient } from '@/lib/supabase'
 * ```
 */

// Client-Side (Browser)
export { supabase, createClient } from './client'

// Server-Side (Server Components, API Routes)
export { createServerClient, createAdminClient } from './server'

// Middleware
export { updateSession } from './middleware'

