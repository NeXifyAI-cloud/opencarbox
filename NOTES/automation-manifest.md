# Automation Manifest

## Workflows

| Workflow | Trigger | Purpose | Required Secrets | Kill Switch |
|---|---|---|---|---|
| `ci.yml` | `push` (default branch), `pull_request`, daily cron, manual | lint/typecheck/test/build | none | disable workflow |
| `security.yml` | `pull_request`, `push` (default branch), weekly cron | `pnpm audit`, secret scan, SBOM | none | disable workflow |
| `health-check.yml` | daily cron, manual | deterministic quality checks + optional `/api/health` probe | optional `HEALTHCHECK_URL` | unset `HEALTHCHECK_URL` |
| `deploy-preview.yml` | pull request open/sync/reopen | preview deployment to Vercel | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | remove `VERCEL_TOKEN` |
| `deploy-staging.yml` | `push` (default branch), manual | staging deployment | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | disable workflow |
| `auto-deploy.yml` | successful `ci` `workflow_run` on default branch, manual | production deploy | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | disable workflow |
| `auto-approve.yml` | `pull_request_target` | auto-approve `dependencies`/`autofix` PRs | none | remove labels |
| `auto-merge.yml` | pull request lifecycle events | enable auto-merge for trusted labeled PRs | none | remove labels |
| `failure-orchestrator.yml` | failed `workflow_run`, manual | safe autofix → AI triage → issue fallback | `DEEPSEEK_API_KEY`, `NSCALE_API_KEY` for AI path | set `AI_MAX_CALLS=0` |

## Standardized Environment Variables

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- AI: `AI_PROVIDER`, `DEEPSEEK_API_KEY`, `NSCALE_API_KEY`, optional `DEEPSEEK_BASE_URL`, `NSCALE_HEADER_NAME`
- Deploy: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, optional `GH_PAT`

## Notes

- Non-CI workflows should call `source tools/export_env.sh` before preflight checks.
- AI workflows are fail-closed through `tools/preflight.ts ai`.
- Production reviewer approvals are configured in GitHub Environment settings and cannot be changed from repository code.
