# Automation Manifest

## Workflows

| Workflow | Trigger | Purpose | Required Secrets | Kill Switch |
|---|---|---|---|---|
| `ci.yml` | `push` (`$default-branch`), `pull_request`, daily cron, manual | lint, typecheck, test, build | none | disable workflow |
| `security.yml` | `push` (`$default-branch`), `pull_request`, weekly cron (Mon 04:00 UTC) | dependency audit, secret scan, SBOM | none | disable workflow |
| `health-check.yml` | daily cron (05:00 UTC), manual | build health check + optional `/api/health` probe | optional `HEALTHCHECK_URL` | unset `HEALTHCHECK_URL` or disable |
| `deploy-preview.yml` | `pull_request` (opened/sync/reopen) | preview deployment to Vercel | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `NEU_VERCEL_PROJEKT_ID` | remove `VERCEL_TOKEN` |
| `deploy-staging.yml` | `push` (`$default-branch`), manual | staging deployment to Vercel | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `NEU_VERCEL_PROJEKT_ID` | disable workflow |
| `deploy-prod.yml` | manual (`workflow_dispatch`, requires `deploy` confirmation) | manual production deployment | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `NEU_VERCEL_PROJEKT_ID` | disable workflow |
| `auto-deploy.yml` | `workflow_run` (CI success on default branch), manual | automatic production deployment | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `NEU_VERCEL_PROJEKT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` | disable workflow |
| `auto-approve.yml` | `pull_request_target` (opened/sync/reopen/labeled/ready_for_review) | auto-approve trusted actor and labeled PRs | none | remove labels |
| `auto-merge.yml` | `pull_request` (labeled/opened/sync/reopen), `workflow_run` (CI) | auto-merge safe PRs when CI passes | none | remove labels |
| `autofix.yml` | `workflow_run` (CI failure) | safe format/lint fixes on failing branches | none | disable workflow |
| `ci-retry.yml` | `workflow_run` (CI failure), manual | classify failure and retry transient failures | none | disable workflow |
| `failure-orchestrator.yml` | `workflow_run` (any of 25 tracked workflows fail) | AI triage → safe autofix → issue fallback | `DEEPSEEK_API_KEY`, `NSCALE_API_KEY` for AI path | set `AI_MAX_CALLS=0` or disable |
| `loop-orchestrator.yml` | `workflow_run` (CI), `issues` (labeled), `pull_request`, manual | CI failure → issue, PR failure comments, ready-for-dev notifications | none | disable workflow |
| `auto-improve.yml` | every 6h cron, manual | scheduled quality improvements via AI | AI secrets (see below) | disable workflow |
| `conflict-resolver.yml` | every 6h cron, manual | AI-based merge conflict resolution | AI secrets (see below) | disable workflow |
| `auto-reply.yml` | `issue_comment`, `issues` (opened), `pull_request` (opened) | AI-powered auto-reply to issues/PRs | `DEEPSEEK_API_KEY`, `NSCALE_API_KEY` | disable workflow |
| `codex-controller.yml` | `repository_dispatch` (codex.run_*) | routes dispatch events to autofix/conflict-resolver/auto-improve | none | disable workflow |
| `issue-triage.yml` | `issues` (opened/edited/reopened/labeled) | auto-label and auto-assign issues | none | disable workflow |
| `pr-labeler.yml` | `pull_request_target` (opened/sync) | auto-label PRs by file paths | none | disable workflow |
| `stale.yml` | daily cron (06:00 UTC), manual | auto-close stale issues (14d + 7d warning) | none | disable workflow |
| `stale-cleanup.yml` | daily cron (02:00 UTC), manual | cleanup stale PRs, auto-merge ready ones | none | disable workflow |
| `sync-to-main.yml` | `push` (`audit-fix-deploy-*`), daily cron (03:00 UTC), manual | sync audit-fix-deploy branch to main with auto-merge | none | disable workflow |
| `backlog-sync.yml` | daily cron (05:00 UTC), manual | sync GitHub issues to `NOTES/backlog.md` | none | disable workflow |
| `release.yml` | `push` (tags `v*.*.*`), manual | build + create GitHub Release | none | disable workflow |
| `bootstrap.yml` | manual (`workflow_dispatch`) | project initialization (Vercel + Supabase setup) | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `NEU_VERCEL_PROJEKT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | disable workflow |
| `mem0-brain.yml` | `push` (`$default-branch`), every 6h cron, manual | Mem0 AI memory sync + GitLab mirror | `GITLAB_PROJEKT_TOKEN`, `CLASSIC_TOKEN_GITHUB_NEU` | disable workflow |
| `security-intake.yml` | weekly cron (Mon 04:00 UTC), manual | parse audit findings → create GitHub issues | none | disable workflow |
| `ai-pr-review.yml` | `pull_request` (opened/synchronize) | AI-powered PR code review via OpenAI | `OPENAI_API_KEY` | remove `OPENAI_API_KEY` or disable |
| `ai-issue-analyze.yml` | `issues` (opened/labeled) | AI-powered issue analysis and categorization | `OPENAI_API_KEY` | remove `OPENAI_API_KEY` or disable |
| `ai-code-scan.yml` | `push` (`$default-branch`), weekly cron (Mon 00:00 UTC), manual | AI-powered code scanning for vulnerabilities | `OPENAI_API_KEY` | remove `OPENAI_API_KEY` or disable |

## Standardized Environment Variables

### Deployment
- `VERCEL_TOKEN` — Vercel API token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` / `NEU_VERCEL_PROJEKT_ID` — Vercel project ID

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `DATABASE_URL` — direct database connection string

### AI (primary: GitHub Models, fallback: DeepSeek)
- `AI_PROVIDER` (var) — `github-models` (default) or `deepseek`
- `AI_AUTO_SELECT` (var) — `true` (default) enables automatic fallback
- `OPENAI_API_KEY` — OpenAI API key (used by `ai-github-action` workflows)
- `DEEPSEEK_API_KEY` — DeepSeek API key
- `NSCALE_API_KEY` — nscale API key
- `DEEPSEEK_BASE_URL` — DeepSeek base URL (optional)
- `NSCALE_HEADER_NAME` — nscale header name (optional)
- `GITHUB_MODELS_BASE_URL` — GitHub Models base URL (optional, default: Azure inference)
- `GITHUB_MODELS_MODEL` — GitHub Models model name (optional, default: gpt-4o)

### External Integrations
- `GITLAB_PROJEKT_TOKEN` — GitLab project access token (mem0-brain)
- `CLASSIC_TOKEN_GITHUB_NEU` — GitHub classic PAT (mem0-brain)
- `HEALTHCHECK_URL` — deployed app URL for health probes (optional)

## Runner Configuration (ADR-010, ADR-011)

All workflows use centralized runner control via repository variable:

```yaml
runs-on: ${{ vars.RUNNER || 'ubuntu-latest' }}
```

- **Default (no variable set):** GitHub-hosted `ubuntu-latest`.
- **Self-hosted activation:** Set `vars.RUNNER` to `self-hosted` or a specific label (e.g. `self-hosted-build`) in GitHub Settings → Actions → Variables.
- **Rollback:** Delete `vars.RUNNER` or set to `ubuntu-latest` — all workflows fall back to GitHub-hosted instantly.
- **Provisioning:** See NOTES/runbook.md § Runner Policy for server setup, monitoring, and maintenance.

## Safety Guardrails

- **Protected paths:** PRs touching `.github/workflows/` or `supabase/migrations/` are blocked from auto-merge and require human review.
- **AI fail-closed:** AI workflows call `tools/preflight.ts ai` and abort if provider is unavailable.
- **Max AI calls:** `failure-orchestrator` limits to 3 AI calls per failure (`AI_MAX_CALLS=3`).
- **Autofix cap:** Maximum 2 open autofix PRs at any time.
- **No workflow edits:** `FORBID_WORKFLOW_EDITS=true` prevents AI from modifying workflow files.
- **CI deduplication:** Loop orchestrator caps at 3 open `ci-failure` issues.

## Notes

- Non-CI workflows call `source tools/export_env.sh` before preflight checks.
- Push-triggered workflows use `github.ref_name == github.event.repository.default_branch` runtime guard.
- Production reviewer approvals are configured in GitHub Environment settings and cannot be changed from repository code.
- Deploy workflows use `workflow_run` triggers (not manual reviewer gates) for autonomous deployment after CI success.
