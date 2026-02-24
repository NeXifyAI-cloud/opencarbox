# CI/CD Status

> Last updated: 2026-02-17

## GitHub Actions Workflows

| Workflow | File | Trigger | Status | Notes |
|----------|------|---------|--------|-------|
| ci | `ci.yml` | push main, PR | ✅ Fixed | npm version conflict resolved |
| Security | `security.yml` | push main, PR, weekly schedule | ✅ Fixed | npm version conflict resolved |
| Auto-Deploy | `auto-deploy.yml` | ci success on main, manual | ✅ Fixed | Deploys to Vercel |
| Autofix | `autofix.yml` | ci failure | ✅ Fixed | Auto-formats + lint fix |
| Auto-Merge | `auto-merge.yml` | PR labeled | ✅ Active | Merges approved PRs |
| Auto-Improve | `auto-improve.yml` | issue labeled | ✅ Fixed | AI-based improvements |
| Auto-Reply | `auto-reply.yml` | issues, issue_comment | ✅ Active | Auto-responds to issues |
| Bootstrap | `bootstrap.yml` | manual | ✅ Fixed | Initial setup |
| Codex Controller | `codex-controller.yml` | repository_dispatch | ✅ Active | Codex integration |
| Conflict Resolver | `conflict-resolver.yml` | push, PR, schedule | ✅ Fixed | Auto-resolve merge conflicts |
| Failure Orchestrator | `failure-orchestrator.yml` | workflow_run completed | ✅ Fixed | Handles workflow failures |
| Mem0 Brain | `mem0-brain.yml` | push main, manual, schedule | ✅ Fixed | Memory system sync |
| **release** | `release.yml` | **NEW** — tag push | ✅ New | Build artifacts + release notes |
| **deploy-staging** | `deploy-staging.yml` | **NEW** — push main, manual | ✅ New | Deploy to staging |
| **deploy-prod** | `deploy-prod.yml` | **NEW** — manual (gated) | ✅ New | Deploy to production with approval |

## Fix Applied (2026-02-17)

**Problem**: All workflows using `npm/action-setup@v4` failed with:
```
Error: Multiple versions of npm specified:
  - version 9 in the GitHub Action config with the key "version"
  - version npm@9.12.3 in the package.json with the key "packageManager"
```

**Root cause**: `npm/action-setup@v4` reads `packageManager` from `package.json` and conflicts when `version` is also provided.

**Fix**: Removed `version: ${{ env.PNPM_VERSION }}` and `PNPM_VERSION` env from all 9 affected workflows.

## CI Pipeline (ci.yml)

```
quick-checks (Lint & Type Check)
  └─▶ test-and-build (Test & Build)
```

1. Checkout + npm setup + Node 20
2. `npm i --frozen-lockfile`
3. Preflight check (`tools/preflight.ts ci`)
4. Guard: no OpenAI usage (`tools/guard_no_openai.sh`)
5. Lint (`next lint`)
6. Type check (`tsc --noEmit`)
7. Test (`vitest`)
8. Build (`next build`)

## Deployment

- **Platform**: Vercel (serverless, Frankfurt region)
- **Trigger**: Auto-deploy after CI success on main
- **Preview**: Available via `workflow_dispatch` with `preview` option
