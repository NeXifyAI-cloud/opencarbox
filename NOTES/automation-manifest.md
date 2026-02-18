# Automation Manifest

Dieses Manifest dokumentiert Zweck, Trigger, Secrets und Not-Aus je Workflow.

| Workflow | Zweck | Trigger | Secrets/Environment | Not-Aus |
|---|---|---|---|---|
| `auto-deploy.yml` | siehe `.github/workflows/auto-deploy.yml` | siehe Datei | VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `auto-improve.yml` | siehe `.github/workflows/auto-improve.yml` | siehe Datei | AI_PROVIDER=deepseek, DEEPSEEK_API_KEY, NSCALE_API_KEY | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `auto-merge.yml` | siehe `.github/workflows/auto-merge.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `auto-reply.yml` | siehe `.github/workflows/auto-reply.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `autofix.yml` | siehe `.github/workflows/autofix.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `backlog-sync.yml` | siehe `.github/workflows/backlog-sync.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `bootstrap.yml` | siehe `.github/workflows/bootstrap.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `ci-retry.yml` | siehe `.github/workflows/ci-retry.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `ci.yml` | siehe `.github/workflows/ci.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `codex-controller.yml` | siehe `.github/workflows/codex-controller.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `conflict-resolver.yml` | siehe `.github/workflows/conflict-resolver.yml` | siehe Datei | AI_PROVIDER=deepseek, DEEPSEEK_API_KEY, NSCALE_API_KEY | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `deploy-preview.yml` | siehe `.github/workflows/deploy-preview.yml` | siehe Datei | VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `deploy-prod.yml` | siehe `.github/workflows/deploy-prod.yml` | siehe Datei | VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `deploy-staging.yml` | siehe `.github/workflows/deploy-staging.yml` | siehe Datei | VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `failure-orchestrator.yml` | siehe `.github/workflows/failure-orchestrator.yml` | siehe Datei | AI_PROVIDER=deepseek, DEEPSEEK_API_KEY, NSCALE_API_KEY | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `health-check.yml` | siehe `.github/workflows/health-check.yml` | siehe Datei | HEALTHCHECK_URL (optional) | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `issue-triage.yml` | siehe `.github/workflows/issue-triage.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `loop-orchestrator.yml` | siehe `.github/workflows/loop-orchestrator.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `mem0-brain.yml` | siehe `.github/workflows/mem0-brain.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `pr-labeler.yml` | siehe `.github/workflows/pr-labeler.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `release.yml` | siehe `.github/workflows/release.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `sbom-weekly.yml` | siehe `.github/workflows/sbom-weekly.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `security-intake.yml` | siehe `.github/workflows/security-intake.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `security.yml` | siehe `.github/workflows/security.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
| `stale.yml` | siehe `.github/workflows/stale.yml` | siehe Datei | n/a | Disable Workflow in Actions UI oder `on` Trigger entfernen |
