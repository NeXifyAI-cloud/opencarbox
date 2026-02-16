import { maskSecret } from '@/lib/logging/safe-logger'
import { createServerClient } from '@/lib/supabase/server'

type AiSettingRow = {
  provider?: string | null
  base_url?: string | null
  model?: string | null
  api_key_preview?: string | null
}

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <main className="mx-auto max-w-2xl p-8">Bitte anmelden, um Einstellungen zu verwalten.</main>
  }

  const { data } = await supabase.from('ai_settings').select('provider,base_url,model,api_key_preview').eq('user_id', user.id).maybeSingle()
  const setting = (data ?? {}) as AiSettingRow

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-3xl font-semibold">AI Einstellungen</h1>
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <p>
          <span className="font-medium">Provider:</span> {setting.provider ?? 'deepseek'}
        </p>
        <p>
          <span className="font-medium">Base URL:</span> {setting.base_url ?? 'Nicht gesetzt'}
        </p>
        <p>
          <span className="font-medium">Modell:</span> {setting.model ?? 'Nicht gesetzt'}
        </p>
        <p>
          <span className="font-medium">API Key:</span> {maskSecret(setting.api_key_preview)}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">Speichern/Test Call UI folgt im nächsten Milestone.</p>
    </main>
  )
}
