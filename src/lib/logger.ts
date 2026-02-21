
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Initialize Supabase only if environment variables are present
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

function logToDb(level: string, msg: string, meta?: unknown): void {
  if (!supabase) return
  supabase
    .from('system_logs')
    .insert({
      level,
      message: msg,
      metadata: meta !== undefined ? JSON.stringify(meta) : null,
    })
    .then(() => {})
}

export const logger = {
  info: (msg: string, meta?: unknown) => logToDb('info', msg, meta),
  warn: (msg: string, meta?: unknown) => {
    logToDb('warn', msg, meta)
  },
  error: (msg: string, meta?: unknown) => {
    logToDb('error', msg, meta)
  },
}
