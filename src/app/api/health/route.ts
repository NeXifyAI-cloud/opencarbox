import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

export async function GET() {
  const missingEnvVars = getMissingEnvVars();
  const status = missingEnvVars.length === 0 ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status,
      service: 'opencarbox-api',
      timestamp: new Date().toISOString(),
      checks: {
        env: {
          ok: missingEnvVars.length === 0,
          missing: missingEnvVars,
        },
      },
    },
    {
      status: missingEnvVars.length === 0 ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
