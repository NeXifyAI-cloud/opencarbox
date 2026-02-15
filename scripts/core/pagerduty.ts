import * as fs from 'fs'
import * as path from 'path'

export type PagerDutySeverity = 'critical' | 'error' | 'warning' | 'info'
export type PagerDutyEventAction = 'trigger' | 'resolve'

interface PagerDutyAlertState {
  [dedupKey: string]: {
    lastAction: PagerDutyEventAction
    updatedAt: string
  }
}

interface PagerDutyAlertPayload {
  dedupKey: string
  summary: string
  severity: PagerDutySeverity
  source: string
  action: PagerDutyEventAction
  component?: string
  group?: string
  customDetails?: Record<string, unknown>
}

const PD_STATE_PATH = path.join(process.cwd(), '.cline', 'pagerduty-state.json')
const PD_EVENTS_API = 'https://events.pagerduty.com/v2/enqueue'
const PD_SOURCE = process.env.PAGERDUTY_SOURCE || 'OpenCarBox-Resilience'

function loadState(): PagerDutyAlertState {
  try {
    if (fs.existsSync(PD_STATE_PATH)) {
      const raw = fs.readFileSync(PD_STATE_PATH, 'utf-8')
      return JSON.parse(raw) as PagerDutyAlertState
    }
  } catch {
    // Silent fallback
  }
  return {}
}

function saveState(state: PagerDutyAlertState): void {
  try {
    const dir = path.dirname(PD_STATE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(PD_STATE_PATH, JSON.stringify(state, null, 2))
  } catch {
    // Silent fallback
  }
}

function canSendAction(dedupKey: string, action: PagerDutyEventAction): boolean {
  const state = loadState()
  const existing = state[dedupKey]

  if (!existing) return true

  // Prevent repeated trigger/resolve spam for same state.
  return existing.lastAction !== action
}

function rememberAction(dedupKey: string, action: PagerDutyEventAction): void {
  const state = loadState()
  state[dedupKey] = {
    lastAction: action,
    updatedAt: new Date().toISOString(),
  }
  saveState(state)
}

export function isPagerDutyConfigured(): boolean {
  return Boolean(process.env.PAGERDUTY_INTEGRATION_KEY)
}

export async function sendPagerDutyEvent(payload: PagerDutyAlertPayload): Promise<boolean> {
  const integrationKey = process.env.PAGERDUTY_INTEGRATION_KEY

  if (!integrationKey) {
    return false
  }

  if (!canSendAction(payload.dedupKey, payload.action)) {
    return true
  }

  const response = await fetch(PD_EVENTS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routing_key: integrationKey,
      event_action: payload.action,
      dedup_key: payload.dedupKey,
      payload: {
        summary: payload.summary,
        source: payload.source || PD_SOURCE,
        severity: payload.severity,
        component: payload.component,
        group: payload.group,
        custom_details: payload.customDetails,
      },
    }),
  })

  if (!response.ok) {
    return false
  }

  rememberAction(payload.dedupKey, payload.action)
  return true
}

export async function triggerPagerDutyAlert(
  dedupKey: string,
  summary: string,
  severity: PagerDutySeverity,
  customDetails: Record<string, unknown> = {}
): Promise<boolean> {
  return sendPagerDutyEvent({
    action: 'trigger',
    dedupKey,
    summary,
    severity,
    source: PD_SOURCE,
    component: 'cline-resilience',
    group: 'platform-health',
    customDetails,
  })
}

export async function resolvePagerDutyAlert(
  dedupKey: string,
  summary: string,
  customDetails: Record<string, unknown> = {}
): Promise<boolean> {
  return sendPagerDutyEvent({
    action: 'resolve',
    dedupKey,
    summary,
    severity: 'info',
    source: PD_SOURCE,
    component: 'cline-resilience',
    group: 'platform-health',
    customDetails,
  })
}
