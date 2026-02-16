# OpenCarBox Platform

Next.js App Router project with Supabase-backed auth/data and AI provider integration groundwork.

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Required environment variables

See `.env.example` for the full list. Core values:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`
- `AI_PROVIDER` (`deepseek`)
- `DEEPSEEK_BASE_URL` (optional)
- `NSCALE_API_KEY`
- `NSCALE_HEADER_NAME`

## Local development checks

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm build
```

## Supabase notes

- SQL migrations are tracked in `supabase/migrations/`.
- Use Supabase SQL editor or CLI to apply migrations in order.
- Row Level Security policies must restrict user tables to `auth.uid()`.

## CI/CD

Workflows:
- `.github/workflows/ci.yml`: lint, typecheck, test, build.
- `.github/workflows/security.yml`: dependency audit.

## Branch protection (recommended)

Enable these repository rules for `main`:
1. Require pull request before merge.
2. Require at least one approving review.
3. Require status checks to pass (`CI`, `Security`).
4. Block direct pushes to `main`.

## Project notes

- Architecture decisions and ADRs: `NOTES/brain.md`.
- Backlog and milestones: `NOTES/backlog.md`.
- Operations runbook: `NOTES/runbook.md`.
