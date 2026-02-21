const DEFAULT_JULES_BASE_URL = 'https://jules.example.invalid';

export type JulesEvent = {
  source: string;
  kind: 'request' | 'error' | 'decision' | 'event';
  name: string;
  metadata?: Record<string, unknown>;
};

function getJulesConfig() {
  const apiKey = process.env.JULES_API_KEY;
  const baseUrl = (process.env.JULES_BASE_URL || process.env.N8N_DOMAIN || DEFAULT_JULES_BASE_URL).replace(/\/$/, '');

  if (!apiKey || !baseUrl || baseUrl === DEFAULT_JULES_BASE_URL) {
    return null;
  }

  return { apiKey, baseUrl };
}

export async function sendJulesEvent(event: JulesEvent): Promise<void> {
  const config = getJulesConfig();
  if (!config) {
    return;
  }

  try {
    await fetch(`${config.baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...event,
      }),
    });
  } catch {
    // best-effort forwarding only, never block request handling
  }
}
