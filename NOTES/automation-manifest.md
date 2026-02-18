# Automation Manifest

> Auto-generated overview of all GitHub Actions workflows in this repository.
> Update this file whenever you add, remove, or significantly change a workflow.

## Workflow Overview

| # | Workflow | File | Triggers | Purpose |
|---|---------|------|----------|---------|
| 1 | **ci** | `ci.yml` | push (main), pull_request, schedule (weekly) | Lint, type check, test & build |
| 2 | **ci-retry** | `ci-retry.yml` | workflow_run (ci), workflow_dispatch | Classify & retry transient CI failures |
| 3 | **Auto-Deploy Production** | `auto-deploy.yml` | workflow_run (ci on main), workflow_dispatch | Deploy to Vercel production after successful CI |
| 4 | **Deploy Staging** | `deploy-staging.yml` | push (main), workflow_dispatch | Deploy to Vercel staging environment |
| 5 | **Deploy Preview** | `deploy-preview.yml` | pull_request | Deploy PR preview to Vercel |
| 6 | **Deploy Production** | `deploy-prod.yml` | workflow_dispatch (manual, requires confirmation) | Manual production deployment |
| 7 | **Release** | `release.yml` | push (tags v*.*.*), workflow_dispatch | Build, test & create GitHub release |
| 8 | **Security** | `security.yml` | pull_request, push (main), schedule (weekly Mon) | Dependency audit & secret scan |
| 9 | **security-intake** | `security-intake.yml` | schedule (Mon 04:00 UTC), workflow_dispatch | Convert audit findings into issues |
| 10 | **Auto-Merge** | `auto-merge.yml` | pull_request (labeled/dependabot/autofix) | Auto-approve & merge trusted PRs |
| 11 | **autofix** | `autofix.yml` | workflow_run (ci failed) | Auto-fix lint/format issues via PR |
| 12 | **auto-improve** | `auto-improve.yml` | schedule (every 6h), workflow_dispatch | Periodic quality checks |
| 13 | **auto-reply** | `auto-reply.yml` | issues, pull_request, issue_comment | AI-powered auto-reply to issues/PRs |
| 14 | **conflict-resolver** | `conflict-resolver.yml` | schedule (every 6h), workflow_dispatch | Auto-resolve PR merge conflicts |
| 15 | **failure-orchestrator** | `failure-orchestrator.yml` | workflow_run (all major workflows) | Route workflow failures to AI triage or manual issues |
| 16 | **loop-orchestrator** | `loop-orchestrator.yml` | workflow_run, issues, pull_request | Closed-loop issue → PR → CI orchestration |
| 17 | **issue-triage** | `issue-triage.yml` | issues (opened, edited, labeled) | Auto-label & triage new issues |
| 18 | **pr-labeler** | `pr-labeler.yml` | pull_request_target | Label PRs by changed file paths |
| 19 | **stale** | `stale.yml` | schedule (daily 06:00 UTC), workflow_dispatch | Auto-close stale issues after inactivity |
| 20 | **backlog-sync** | `backlog-sync.yml` | schedule (daily 05:00 UTC), workflow_dispatch | Sync open issues to NOTES/backlog.md |
| 21 | **Mem0 Brain Integration** | `mem0-brain.yml` | push (main), schedule (every 6h), workflow_dispatch | Mem0 knowledge integration & GitLab sync |
| 22 | **codex-controller** | `codex-controller.yml` | repository_dispatch | Route control commands to agents |
| 23 | **bootstrap** | `bootstrap.yml` | workflow_dispatch | One-time project bootstrap setup |
| 24 | **manifest-check** | `manifest-check.yml` | pull_request (workflow changes) | Warn if automation-manifest.md is not updated |

## Dependency Graph

```
push/PR → ci → ci-retry (on failure)
                ├── auto-deploy (on success, main only)
                ├── autofix (on failure)
                └── failure-orchestrator (on any completion)

push (main) → deploy-staging

pull_request → deploy-preview
             → auto-merge (dependabot / autofix / labeled)
             → security

schedule → auto-improve (every 6h)
         → conflict-resolver (every 6h)
         → mem0-brain (every 6h)
         → security (weekly)
         → security-intake (weekly)
         → stale (daily)
         → backlog-sync (daily)
         → ci (weekly health check)
```

## Conventions

- **Branch references**: Trigger-level `branches:` filters are removed where a job-level `if` already checks `github.event.repository.default_branch`. Conditions and `--base` commands use `github.event.repository.default_branch` instead of hardcoded branch names.
- **Path filters**: CI and security workflows skip on docs-only changes (`*.md`, `docs/**`, `NOTES/**`, `LICENSE`).
- **Caching**: pnpm store cached via `actions/setup-node` `cache: pnpm`; Next.js build cached via `actions/cache`.
- **Concurrency**: Workflows that benefit from cancelling superseded runs use `concurrency` groups to prevent redundant executions; utility workflows (like manifest checks) may omit concurrency when cancellation is not required.
- **pnpm version**: Read from `packageManager` in `package.json` – never specified in `pnpm/action-setup`.
- **Environment protection rules**: Deploy workflows prefer to model manual approvals via dedicated workflows (for example `deploy-prod.yml`) rather than `environment:`-based protection; some deploy workflows may still use `environment:` blocks when GitHub environment features are explicitly desired.
- **Auto-merge**: Dependabot patch/minor PRs and autofix PRs are automatically approved and merged when all checks pass.
