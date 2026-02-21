'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log exception to Supabase System Logs
    logger.error('Global Application Error', { 
      message: error.message, 
      stack: error.stack, 
      digest: error.digest 
    })
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8 text-center bg-gray-50 dark:bg-gray-900">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Uups! Da ist etwas schiefgelaufen.
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Unser System hat den Fehler protokolliert. Wir kümmern uns darum.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
