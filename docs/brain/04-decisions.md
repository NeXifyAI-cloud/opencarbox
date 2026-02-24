# Architecture Decision Records (ADR-light)

> Last updated: 2026-02-17

## ADR-001: Remove explicit npm version from workflows

- **Date**: 2026-02-17
- **Context**: `npm/action-setup@v4` fails when `version` is specified both in the action config and via `packageManager` in `package.json`. All CI runs were broken.
- **Decision**: Remove `version: ${{ env.PNPM_VERSION }}` from all workflows and rely on `packageManager: "npm@9.12.3"` in `package.json` as single source of truth.
- **Consequences**: npm version is managed in one place (`package.json`). Upgrading npm only requires changing `package.json`.

## ADR-002: Vercel as primary deployment target

- **Date**: 2026-02-17 (documented, pre-existing decision)
- **Context**: The project is a Next.js application. Vercel provides native Next.js support with zero-config deploys.
- **Decision**: Use Vercel for production hosting in Frankfurt (fra1) region. No Docker required for production.
- **Consequences**: Serverless deployment model. Docker/compose added for local development and optional self-hosting.

## ADR-003: DeepSeek + NSCALE only AI policy

- **Date**: 2026-02-17 (documented, pre-existing decision)
- **Context**: Project enforces specific AI provider policy — no OpenAI, Google AI, Anthropic, or other providers.
- **Decision**: Only DeepSeek and NSCALE are allowed. Enforced by `tools/guard_no_openai.sh` in CI.
- **Consequences**: All AI integrations must use DeepSeek API. CI blocks any commits introducing forbidden provider SDKs or env vars.

## ADR-004: Add Dockerfile for containerized development and self-hosting

- **Date**: 2026-02-17
- **Context**: While Vercel is the primary deployment target, a Dockerfile enables local development parity, self-hosting options, and staging environments.
- **Decision**: Add multi-stage Dockerfile + compose.yaml with healthcheck, non-root user, and standalone Next.js output.
- **Consequences**: Developers can run `docker compose up` for local development. Staging can use container-based deployment.

## ADR-005: Add release, staging, and production deployment workflows

- **Date**: 2026-02-17
- **Context**: Only auto-deploy (after CI on main) existed. Missing: release management, staging environment, gated production deploy.
- **Decision**: Add `release.yml` (tag push), `deploy-staging.yml` (main push + manual), `deploy-prod.yml` (manual with environment protection).
- **Consequences**: Release process is formalized. Staging deploys automatically. Production requires manual trigger and environment approval.
