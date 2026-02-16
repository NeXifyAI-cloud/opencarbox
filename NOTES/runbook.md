# Runbook

## Operations
- Start local app: `pnpm dev`.
- Validate quality gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Apply Supabase migrations via Supabase CLI or SQL editor using files in `supabase/migrations`.

## Release Process
1. Merge only through PR into protected `main`.
2. Ensure required CI checks are green.
3. Deploy to Vercel Preview, then Production.

## Rollback
- Revert offending commit in GitHub.
- Redeploy previous successful Vercel deployment.
- If migration-related, apply compensating migration (never edit historical migration files).

## Incident Steps
1. Triage impact and severity.
2. Check `/api/health` and CI status.
3. Capture metadata-only logs (no prompts/PII/secrets).
4. Create backlog item with acceptance criteria before closing incident.

## Test-Matrix & Gates

### 3-Stufen-Teststrategie
| Stufe | Was wird geprüft? | Lokaler Befehl | CI-Gate |
|------|--------------------|----------------|---------|
| Unit | Stores, Hooks, Utils (`src/**/__tests__`) | `pnpm test` oder gezielt `pnpm vitest src/**/__tests__` | Teil von Coverage-Gate |
| Integration | API-Routen inkl. Fehlerfälle (`tests/api`) | `pnpm vitest tests/api` | Teil von Coverage-Gate |
| E2E (kritisch) | Checkout + Terminbuchungs-Happy-Path (`tests/e2e/critical-*.spec.ts`) | `pnpm test:e2e -- tests/e2e/critical-*.spec.ts` | Pflichtjob `e2e-critical-flows` |

### Mindestabdeckung
- Gate wird über `pnpm test:coverage` erzwungen.
- Die Mindestwerte sind in `vitest.config.ts` hinterlegt und müssen in CI erfüllt sein.

### Pflicht-Flows vor Release
1. Checkout-Happy-Path (`critical-checkout-happy-path.spec.ts`) muss grün sein.
2. Terminbuchungs-Happy-Path (`critical-appointment-happy-path.spec.ts`) muss grün sein.
