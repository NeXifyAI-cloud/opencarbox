# Runbook

## Local Development
1. `pnpm install`
2. `.env.local` auf Basis `.env.example` erstellen.
3. `pnpm dev`

## Supabase Setup
1. Projekt in Supabase anlegen.
2. Env Variablen setzen (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
3. SQL Migrationen aus `supabase/migrations` ausführen.

## Vercel Deploy
1. Repo in Vercel importieren.
2. Alle Env Variablen aus `.env.example` in Vercel setzen.
3. Deploy starten; Health Endpoint prüfen (`/api/health`).

## Incident / Debug
- Health prüfen: `/api/health`.
- Fehler in AI-Route: Logs (`ai_logs`) + Server Logs ohne Secrets.
- Rate Limit Trigger: HTTP 429 + Token Bucket Parameter prüfen.
