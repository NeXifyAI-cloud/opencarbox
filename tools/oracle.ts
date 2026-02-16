type JsonRecord = Record<string, unknown>

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const ORACLE_RUN_SOURCE = process.env.ORACLE_RUN_SOURCE || 'github-actions'

function hasOracleEnv(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_SERVICE_ROLE_KEY.length > 0
}

async function rpc<T>(fn: string, payload: JsonRecord): Promise<T> {
  if (!hasOracleEnv()) {
    throw new Error('Oracle env missing')
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Oracle RPC ${fn} failed: ${res.status} ${await res.text()}`)
  }

  return (await res.json()) as T
}

export async function oracleStartRun(tool: string): Promise<{ id: string }> {
  if (!hasOracleEnv()) {
    return { id: `local-${Date.now()}` }
  }

  const data = await rpc<Array<{ id: string }>>('oracle_start_run', {
    p_tool: tool,
    p_source: ORACLE_RUN_SOURCE,
  })

  return data[0] || { id: `fallback-${Date.now()}` }
}

export async function oracleFinishRun(
  runId: string,
  success: boolean,
  meta: JsonRecord
): Promise<void> {
  if (!hasOracleEnv()) return
  await rpc('oracle_finish_run', {
    p_run_id: runId,
    p_success: success,
    p_meta: meta,
  })
}

export async function oracleLoadPolicy(tool: string): Promise<JsonRecord> {
  if (!hasOracleEnv()) {
    return { enabled: true }
  }

  const data = await rpc<Array<JsonRecord>>('oracle_load_policy', {
    p_tool: tool,
  })

  return data[0] || { enabled: true }
}

export async function oracleEvent(
  runId: string,
  event: string,
  payload: JsonRecord
): Promise<void> {
  if (!hasOracleEnv()) return
  await rpc('oracle_event', {
    p_run_id: runId,
    p_event: event,
    p_payload: payload,
  })
}

export async function oracleConsumeCalls(
  tool: string,
  amount: number
): Promise<{ allowed: boolean }> {
  if (!hasOracleEnv()) {
    return { allowed: true }
  }

  const data = await rpc<Array<{ allowed: boolean }>>('oracle_consume_calls', {
    p_tool: tool,
    p_amount: amount,
  })

  return data[0] || { allowed: false }
}
