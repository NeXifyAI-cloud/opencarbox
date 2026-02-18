# Automation Manifest

## Workflows

| Workflow | Trigger | Purpose | Required Secrets | Kill Switch |
|---|---|---|---|---|
| `ci.yml` | `push` (`branches: ["$default-branch"]`), `pull_request`, daily cron, manual | lint/typecheck/test/build | none | disable workflow |
| `security.yml` | `pull_request`, `push` (`branches: ["$default-branch"]`), weekly cron | `pnpm audit`, secret scan, SBOM | none | disable workflow |
| `health-check.yml` | daily cron, manual | deterministic quality checks + optional `/api/health` probe | optional `HEALTHCHECK_URL` | unset `HEALTHCHECK_URL` |
| `deploy-preview.yml` | pull request open/sync/reopen | preview deployment to Vercel | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | remove `VERCEL_TOKEN` |
| `deploy-staging.yml` | `push` (`branches: ["$default-branch"]`), manual | staging deployment | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | disable workflow |
| `auto-deploy.yml` | successful `ci` `workflow_run` on default branch, manual | production deploy | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | disable workflow |
| `auto-approve.yml` | `pull_request_target` (opened/sync/reopen/labeled/ready_for_review) | auto-approve `dependencies`/`autofix` PRs | none | remove labels |
| `auto-merge.yml` | pull request lifecycle events | enable auto-merge for trusted labeled PRs | none | remove labels |
| `failure-orchestrator.yml` | failed `workflow_run`, manual | safe autofix → AI triage → issue fallback | `DEEPSEEK_API_KEY`, `NSCALE_API_KEY` for AI path | set `AI_MAX_CALLS=0` |

## Standardized Environment Variables

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- AI: `AI_PROVIDER`, `DEEPSEEK_API_KEY`, `NSCALE_API_KEY`, optional `DEEPSEEK_BASE_URL`, `NSCALE_HEADER_NAME`
- Deploy: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, optional `GH_PAT`

## Runner Configuration (ADR-010, ADR-011)

All workflows use centralized runner control via repository variable:

```yaml
runs-on: ${{ vars.RUNNER || 'ubuntu-latest' }}
```

- **Default (no variable set):** GitHub-hosted `ubuntu-latest`.
- **Self-hosted activation:** Set `vars.RUNNER` to `self-hosted` or a specific label (e.g. `self-hosted-build`) in GitHub Settings → Actions → Variables.
- **Rollback:** Delete `vars.RUNNER` or set to `ubuntu-latest` — all workflows fall back to GitHub-hosted instantly.
- **Provisioning:** See NOTES/runbook.md § Runner Policy for server setup, monitoring, and maintenance.

## Notes

- Non-CI workflows call `source tools/export_env.sh` before preflight checks (including `bootstrap.yml`).
- AI workflows are fail-closed through `tools/preflight.ts ai`.
- Production reviewer approvals are configured in GitHub Environment settings and cannot be changed from repository code.
