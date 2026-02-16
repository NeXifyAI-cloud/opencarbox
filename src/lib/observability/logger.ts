/* eslint-disable no-console */
type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  event: string;
  requestId?: string;
  userId?: string;
  provider?: string;
  latencyMs?: number;
  status?: number;
  reason?: string;
}

export function log(level: LogLevel, payload: LogPayload): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    ...payload,
  };

  const output = JSON.stringify(entry);
  if (level === 'error') {
    console.error(output);
    return;
  }

  if (level === 'warn') {
    console.warn(output);
    return;
  }

  console.log(output);
}
