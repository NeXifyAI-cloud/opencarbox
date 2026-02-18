import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
}

function resolveVersion() {
  return process.env.npm_package_version ?? '0.0.0-dev';
}

export async function GET() {
  const missingEnvVars = getMissingEnvVars();
  const supabaseStatus = missingEnvVars.length === 0 ? 'up' : 'degraded';
  const overallStatus = supabaseStatus === 'up' ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status: overallStatus,
      version: resolveVersion(),
      dependencies: {
        supabase: {
          status: supabaseStatus,
          missingEnv: missingEnvVars,
        },
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: overallStatus === 'ok' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
