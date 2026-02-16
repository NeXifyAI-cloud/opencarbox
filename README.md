# OpenCarBox – AI-ready Next.js + Supabase Starter

## Setup

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Environment

Copy `.env.example` to `.env.local` and set all required values.

Server-only secrets:
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`
- `OPENAI_COMPAT_API_KEY`
- `OPENAI_COMPAT_BASE_URL`
- `NSCALE_API_KEY`

## Supabase

- SQL migrations are in `supabase/migrations`.
- Required tables with RLS: `profiles`, `ai_settings`, `ai_logs`.

## API Endpoints

- `GET /api/health` – app + supabase connectivity state
- `POST /api/ai/chat` – authenticated chat completion endpoint with:
  - zod validation
  - per-user token bucket rate limiting
  - timeout + retries + lightweight circuit breaker
  - metadata-only logging

## App Routes

- `/dashboard` – protected dashboard entry
- `/settings` – AI settings status panel (provider/base/model/key preview)

## Vercel Deploy

1. Import repository in Vercel.
2. Add all environment variables from `.env.example`.
3. Deploy and verify `/api/health`.

## Notes

All architecture and operations docs live in:
- `NOTES/brain.md`
- `NOTES/backlog.md`
- `NOTES/runbook.md`
