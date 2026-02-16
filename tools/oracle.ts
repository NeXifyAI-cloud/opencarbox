import { createClient } from '@supabase/supabase-js';

type OraclePolicy = {
  tool: string;
  enabled: boolean;
  max_ai_calls: number;
  max_conflict_files: number;
  max_file_bytes: number;
  forbid_workflows: boolean;
  deny_globs: string[];
};

type OracleRun = {
  id: string;
};

function mustEnv(name: string): string {
  const value = (process.env[name] || '').trim();
  if (!value) {
    throw new Error(`Missing ${name} for Oracle.`);
  }
  return value;
}

function oracleClient() {
  const url = mustEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = mustEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function oracleStartRun(tool: string): Promise<OracleRun> {
  const sb = oracleClient();
  const { data, error } = await sb
    .from('oracle_runs')
    .insert({
      tool,
      run_source: process.env.ORACLE_RUN_SOURCE || 'unknown',
      github_run_id: process.env.GITHUB_RUN_ID || null,
      github_ref: process.env.GITHUB_REF || null,
      meta: {},
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`oracleStartRun: ${error.message}`);
  }

  return { id: data.id };
}

export async function oracleFinishRun(runId: string, success: boolean, meta: unknown = {}) {
  const sb = oracleClient();
  const { error } = await sb
    .from('oracle_runs')
    .update({ finished_at: new Date().toISOString(), success, meta })
    .eq('id', runId);

  if (error) {
    throw new Error(`oracleFinishRun: ${error.message}`);
  }
}

export async function oracleEvent(runId: string, kind: string, details: unknown = {}) {
  const sb = oracleClient();
  const { error } = await sb.from('oracle_events').insert({ run_id: runId, kind, details });

  if (error) {
    throw new Error(`oracleEvent: ${error.message}`);
  }
}

export async function oracleLoadPolicy(tool: string): Promise<OraclePolicy> {
  const sb = oracleClient();
  const { data, error } = await sb
    .from('oracle_policies')
    .select('tool,enabled,max_ai_calls,max_conflict_files,max_file_bytes,forbid_workflows,deny_globs')
    .eq('tool', tool)
    .single();

  if (error) {
    throw new Error(`oracleLoadPolicy: ${error.message}`);
  }

  return {
    tool: data.tool,
    enabled: data.enabled,
    max_ai_calls: data.max_ai_calls,
    max_conflict_files: data.max_conflict_files,
    max_file_bytes: data.max_file_bytes,
    forbid_workflows: data.forbid_workflows,
    deny_globs: data.deny_globs ?? [],
  };
}

export async function oracleConsumeCalls(
  tool: string,
  n: number,
): Promise<{ allowed: boolean; remaining: number }> {
  const sb = oracleClient();
  const { data, error } = await sb.rpc('oracle_consume_calls', { p_tool: tool, p_n: n });

  if (error) {
    throw new Error(`oracleConsumeCalls: ${error.message}`);
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean(row?.allowed),
    remaining: Number(row?.remaining ?? 0),
  };
}
