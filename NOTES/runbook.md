# Runbook

## Operations
- Start local app: `pnpm dev`.
- Validate quality gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Apply Supabase migrations via Supabase CLI or SQL editor using files in `supabase/migrations`.

## Operativer Kontrollkreis (KPI-Schwellen)
| KPI | Warnschwelle | Kritische Schwelle | Standard-Label | Priorität |
|-----|--------------|--------------------|----------------|-----------|
| CI-Fehlerrate | >= 5% (7 Tage rolling) | >= 10% (7 Tage rolling) | `kpi:ci-failure-rate` | `priority:high` |
| Deployment-Fails | >= 2 Fehlschläge / 24h | >= 3 Fehlschläge / 24h | `kpi:deployment-fail` | `priority:high` |
| API-Health-Failure | >= 3 fehlgeschlagene Checks / 15m | >= 5 fehlgeschlagene Checks / 15m oder >5m Outage | `kpi:api-health-failure` | `priority:critical` |

## Release Process
1. Merge only through PR into protected `main`.
2. Ensure required CI checks are green.
3. Deploy to Vercel Preview, then Production.

## Rollback
- Revert offending commit in GitHub.
- Redeploy previous successful Vercel deployment.
- If migration-related, apply compensating migration (never edit historical migration files).

## Incident Steps (mit Artefakten)
1. **Triage impact and severity** → Artefakt: Monitoring-Alert (z. B. Actions Run, Uptime Alert) + Incident-Issue aus `.github/ISSUE_TEMPLATE/incident_report.md`.
2. **Check `/api/health` and CI status** → Artefakt: Verlinkte Check-Resultate (Workflow-URL, Healthcheck-Output) im Incident-Ticket.
3. **Capture metadata-only logs (no prompts/PII/secrets)** → Artefakt: Angehängtes Log-Snippet/Runbook-Notiz im Incident-Ticket.
4. **Create backlog item with acceptance criteria before closing incident** → Artefakt: Folge-Ticket (Backlog) + Postmortem-Link im abgeschlossenen Incident.
