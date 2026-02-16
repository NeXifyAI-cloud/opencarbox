import { createClient } from '@supabase/supabase-js';

interface TelemetryInput {
  userId: string;
  provider: string;
  model: string;
  status: 'ok' | 'error';
  latencyMs: number;
  errorCode?: string;
}

export async function writeAiTelemetry(input: TelemetryInput): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return;
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await supabase.from('ai_logs').insert({
    user_id: input.userId,
    provider: input.provider,
    model: input.model,
    status: input.status,
    latency_ms: input.latencyMs,
    error_code: input.errorCode ?? null,
  });
}
