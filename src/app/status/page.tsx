async function getHealth(): Promise<{ status: string; timestamp: string; service: string; version: string }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/health`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch health status');
  }

  return response.json() as Promise<{ status: string; timestamp: string; service: string; version: string }>;
}

export default async function StatusPage(): Promise<JSX.Element> {
  const health = await getHealth();

  return (
    <main className="mx-auto mt-10 max-w-3xl space-y-3 px-6">
      <h1 className="text-2xl font-semibold">System Status</h1>
      <p>Service: {health.service}</p>
      <p>Status: {health.status}</p>
      <p>Version: {health.version}</p>
      <p>Timestamp: {health.timestamp}</p>
    </main>
  );
}
