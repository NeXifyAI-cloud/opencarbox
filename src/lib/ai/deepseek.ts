import { getAiEnv } from './env';

export async function deepseekChat(payload: unknown) {
  const env = getAiEnv();
  const baseUrl = (env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com').replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      [env.NSCALE_HEADER_NAME]: env.NSCALE_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek error ${response.status}: ${await response.text()}`);
  }

  return response.json();
}
