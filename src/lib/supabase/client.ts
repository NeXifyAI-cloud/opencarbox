/**
 * Supabase Client für Client-Komponenten (Browser)
 * 
 * Verwendet den anon key für öffentliche Operationen.
 * RLS (Row Level Security) schützt die Daten.
 * 
 * @example
 * ```tsx
 * import { supabase } from '@/lib/supabase/client'
 * 
 * const { data, error } = await supabase
 *   .from('products')
 *   .select('*')
 * ```
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

/**
 * Erstellt einen Supabase-Client für Browser-Umgebungen.
 * Verwendet Singleton-Pattern für Performance.
 */
function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Supabase Client Singleton für Client-Komponenten */
export const supabase = createClient()

/** Re-export für Kompatibilität */
export { createClient }

