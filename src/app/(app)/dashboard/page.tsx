import Link from 'next/link'

import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">Bitte zuerst anmelden, um das Dashboard zu sehen.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Angemeldet als {user.email}</p>
      <Link href="/settings" className="text-blue-600 underline underline-offset-4">
        Zu den AI-Einstellungen
      </Link>
    </main>
  )
}
