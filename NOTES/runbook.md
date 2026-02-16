# Runbook

## Operations

- Start local app: `pnpm dev`.
- Validate quality gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Apply Supabase migrations via Supabase CLI or SQL editor using files in `supabase/migrations`.

## Release Process

1. Merge only through PR into protected `main`.
2. Ensure required CI checks are green.
3. Deploy to Vercel Preview, then Production.

## 48h Emergency Delivery Mode

Use this mode only when delivery must complete in <=2 days.

1. Enforce WIP limit: max 3 active tracks (FE, BE/API, QA/DevOps).
2. Prioritize only critical path: catalog -> cart -> checkout.
3. Freeze non-critical scope (SEO, advanced integrations, polish).
4. Trigger Go/No-Go review at hour 46.

### Required gates in Emergency Mode

- Gate A (end of Day 1):
  - Product can be discovered and added to cart.
  - Cart persistence survives page reload.
- Gate B (end of Day 2):
  - Checkout happy-path works end-to-end.
  - At least one checkout failure-path test exists.
  - `pnpm lint && pnpm typecheck && pnpm test && pnpm build` is green.

## Rollback

- Revert offending commit in GitHub.
- Redeploy previous successful Vercel deployment.
- If migration-related, apply compensating migration (never edit historical migration files).

## Incident Steps

1. Triage impact and severity.
2. Check `/api/health` and CI status.
3. Capture metadata-only logs (no prompts/PII/secrets).
4. Create backlog item with acceptance criteria before closing incident.
