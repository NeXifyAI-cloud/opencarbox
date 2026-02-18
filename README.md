# OpenCarBox Platform

Next.js App Router project with Supabase-backed auth/data and AI provider integration groundwork.

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## System start with Supabase Access Token

Use the startup wrapper to normalize legacy token names and boot the app:

```bash
pnpm system:check   # validates token/env mapping without starting dev server
pnpm system:start   # starts Next.js dev server
```

`tools/export_env.sh` now maps `SUPABASE_TOKEN` and `supabase_access_token` to `SUPABASE_ACCESS_TOKEN` automatically.

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
- `OPENCARBOX_RUNNER` (optional; Runner-Label für alle Workflows, sonst `ubuntu-latest`)

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
- Alle Workflows unterstützen `OPENCARBOX_RUNNER` als zentralen Runner-Override (Fallback `ubuntu-latest`).
- `.github/workflows/ci.yml`: lint, typecheck, test, build.
- `.github/workflows/security.yml`: dependency audit.
- `.github/workflows/auto-reply.yml`: beantwortet Issues, PRs, Reviews und Kommentare automatisch (DeepSeek mit Fallback-Antwort).

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

## Autonomous problem solver

Run the autonomous reliability workflow (DeepSeek + NSCALE headers mandatory):

```bash
npm run autofix:problems
```

The workflow executes lint/typecheck/test/build, asks DeepSeek for iterative remediation commands, applies allowlisted fixes automatically, and stores a run report at `.cline/autonomous-problem-report.json`.
