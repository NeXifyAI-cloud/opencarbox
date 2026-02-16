import { GET as getHealthRoute } from '@/app/api/health/route';

export const dynamic = 'force-dynamic';

async function getHealthStatus() {
  const response = await getHealthRoute();
  return response.json();
}

export default async function StatusPage() {
  const health = await getHealthStatus();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-bold">Systemstatus</h1>
      <p className="text-sm text-muted-foreground">Live-Readiness für OpenCarBox API und Runtime.</p>

      <section className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold">API Health</h2>
        <p className="mt-2">
          Status:{' '}
          <span className={health.status === 'ok' ? 'text-green-600' : 'text-amber-600'}>
            {health.status}
          </span>
        </p>
        <p className="mt-2 text-sm">
          Environment check: {health.checks?.env?.ok ? 'ok' : 'degraded'}
        </p>

        {!health.checks?.env?.ok && health.checks?.env?.missing?.length > 0 ? (
          <ul className="mt-3 list-inside list-disc text-sm text-amber-700">
            {health.checks.env.missing.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
