# Target State — Production Ready

## A) Branch & Release Strategy

- **`main`** — Protected, requires PR with passing CI checks.
- **`feature/*`** — New features, branched from `main`.
- **`fix/*`** — Bug fixes, branched from `main`.
- **`chore/*`** — Maintenance/tooling, branched from `main`.
- **Release Tags:** SemVer (`v1.0.0`, `v1.1.0`, etc.).
- **No direct pushes to `main`** — all changes via PR.

## B) CI/CD Definition of Done (DoD)

### CI (`.github/workflows/ci.yml`)
- [x] `pnpm lint` must pass (warnings allowed, errors block).
- [x] `pnpm typecheck` must pass (zero errors).
- [x] `pnpm test` must pass (all tests green).
- [x] `pnpm build` must succeed.
- [x] `tools/preflight.ts ci` must pass.
- [x] `tools/guard_no_openai.sh` must pass (DeepSeek-only policy).

### Security (`.github/workflows/security.yml`)
- [x] `pnpm secret:scan` must pass (blocking).
- [x] `pnpm audit --prod` runs (non-blocking, informational).
- Critical audit findings → create GitHub Issue for tracking.

### Deploy (`.github/workflows/auto-deploy.yml`)
- [x] Auto-deploys to Vercel production after successful CI on `main`.
- [x] Manual dispatch available for preview/production.

## C) 24/7 Betrieb — Track Vercel

### Decision: TRACK VERCEL
**Rationale:** The repository already has:
1. `vercel.json` configured with fra1 region, security headers, redirects.
2. `auto-deploy.yml` workflow with Vercel CLI deployment.
3. `next.config.js` with `output: 'standalone'` for Vercel.
4. No Dockerfile or docker-compose files exist.
5. Vercel secrets documented in `.github/SECRETS_SETUP.md`.

### Architecture
```
Push to main → CI green → auto-deploy.yml → Vercel Production (fra1)
PR → Vercel Preview (if Vercel GitHub integration active)
```

### Required Secrets (Vercel)
- `VERCEL_TOKEN` — Vercel API token.
- `VERCEL_PROJECT_ID` — Vercel project ID.
- `VERCEL_ORG_ID` — Vercel organization ID.

### Healthcheck
- Vercel provides built-in uptime monitoring.
- `/api/health` endpoint for external monitoring integration.
- SLO: p95 < 2.5s latency, < 2% 5xx error rate per 10min window.

### Rollback
1. Redeploy previous successful deployment in Vercel dashboard.
2. Or revert commit on `main` → CI → auto-deploy to Vercel.
