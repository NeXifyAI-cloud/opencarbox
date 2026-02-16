import { NextResponse } from 'next/server';

import type { HealthResponse } from '@/lib/api/contracts/health';

const REQUIRED_DB_ENV_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const REQUIRED_AI_ENV_VARS = ['AI_PROVIDER', 'DEEPSEEK_API_KEY', 'NSCALE_API_KEY'];

function hasRequiredEnv(keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]));
}

async function runDatabaseCheck() {
  if (!hasRequiredEnv(REQUIRED_DB_ENV_VARS)) {
    return {
      status: 'down' as const,
      latencyMs: null,
      details: `Missing env vars: ${REQUIRED_DB_ENV_VARS.filter((key) => !process.env[key]).join(', ')}`,
    };
  }

  const started = Date.now();
  const healthUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')}/auth/v1/health`;

  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        status: 'degraded' as const,
        latencyMs: Date.now() - started,
        details: `Supabase health returned HTTP ${response.status}`,
      };
    }

    return {
      status: 'up' as const,
      latencyMs: Date.now() - started,
      details: 'Supabase auth health reachable.',
    };
  } catch (error) {
    return {
      status: 'down' as const,
      latencyMs: Date.now() - started,
      details: error instanceof Error ? error.message : 'Unknown database connectivity error.',
    };
  }
}

function runAiServiceCheck() {
  if (!hasRequiredEnv(REQUIRED_AI_ENV_VARS)) {
    return {
      status: 'degraded' as const,
      latencyMs: null,
      details: `Missing env vars: ${REQUIRED_AI_ENV_VARS.filter((key) => !process.env[key]).join(', ')}`,
    };
  }

  return {
    status: 'up' as const,
    latencyMs: 0,
    details: 'AI provider configuration is present.',
  };
}

export async function GET() {
  const [database, aiService] = await Promise.all([runDatabaseCheck(), runAiServiceCheck()]);

  const status: HealthResponse['status'] =
    database.status === 'up' && aiService.status === 'up' ? 'ok' : 'degraded';

  const payload: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    dependencies: {
      database,
      aiService,
    },
  };

  return NextResponse.json(payload, {
    status: status === 'ok' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
