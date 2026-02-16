import { getAiEnv } from '@/lib/ai/env';

export async function deepseekChatCompletion(payload: unknown) {
  const env = getAiEnv();
  const baseUrl = env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com';
  const url = `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      [env.NSCALE_HEADER_NAME]: env.NSCALE_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`DeepSeek error ${res.status}: ${txt.slice(0, 300)}`);
  }

  return res.json();
}
