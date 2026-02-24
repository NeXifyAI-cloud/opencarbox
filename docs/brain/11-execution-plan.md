# Execution Plan

> Last updated: 2026-02-17

## PR1: Fix CI & Repo Standards ✅

**Files changed:**
- `.github/workflows/*.yml` — Remove npm version conflict
- `npm-lock.yaml` — Refresh lockfile
- `docs/brain/*` — Repository documentation
- `CODEOWNERS` — Code ownership
- `.editorconfig` — Editor settings
- `.gitattributes` — Git attributes
- `CONTRIBUTING.md` — Contribution guidelines

**Verify:**
```bash
npm run lint && npm run typecheck && npm run test
# All workflows YAML valid
```

**Acceptance:**
- CI pipeline passes (lint + typecheck + test + build)
- /docs/brain/ populated with accurate inventory

## PR2: New Workflows (release, staging, prod)

**Files:**
- `.github/workflows/release.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-prod.yml`

**Verify:**
```bash
# YAML valid
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/release.yml'))"
# Workflow syntax: GitHub validates on push
```

**Acceptance:**
- `release.yml` triggers on `v*` tag push, creates GitHub Release
- `deploy-staging.yml` triggers on main push + manual dispatch
- `deploy-prod.yml` requires manual dispatch + environment approval

## PR3: Containerization

**Files:**
- `Dockerfile` — Multi-stage build, non-root, healthcheck
- `compose.yaml` — Development + production profiles
- `.dockerignore`

**Verify:**
```bash
docker build -t opencarbox .
docker compose up -d
curl http://localhost:3000/api/health
```

**Acceptance:**
- Docker image builds successfully
- Container starts and serves the application
- Healthcheck passes

## Future PRs (documented, not yet scheduled)

### PR4: Security & Compliance
- Add CodeQL workflow
- Add SBOM generation (syft)
- Add container scanning
- Dependabot configuration

### PR5: Bugfix Loop
- Fix React.useMemo warning (product-grid.tsx)
- Address long function warnings from quality-gate
- Evaluate legacy frontend/ migration

### PR6: Observability
- Structured logging
- Health check dashboard
- Runbooks for common operations
