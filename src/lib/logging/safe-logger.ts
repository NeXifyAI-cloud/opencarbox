export interface LogMeta {
  userId?: string
  provider?: string
  model?: string
  latencyMs?: number
  success?: boolean
  errorCode?: string
}

function redact(value: string): string {
  if (value.length <= 4) {
    return '****'
  }

  return `****${value.slice(-4)}`
}

export function maskSecret(value?: string | null): string {
  if (!value) {
    return 'unset'
  }

  return redact(value)
}

export function logAiEvent(message: string, meta: LogMeta): void {
  // eslint-disable-next-line no-console
  console.info('[ai-event]', message, meta)
}
