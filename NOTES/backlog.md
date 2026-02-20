# Backlog

## Milestone 1 — Scaffold ✅
- [x] Add env validation module and feature flags.
- [x] Align `.env.example` with required public/server variables.
- [x] Initialize NOTES documentation set.
- [x] Add dedicated CI and security workflows.
- [x] Add modern issue forms and PR template checklist.

## Milestone 2 — Vertical Slice (Auth/Settings)
- [ ] Auth flow with protected dashboard route group.
  - **Akzeptanzkriterien:**
    - Supabase Auth login/logout functional
    - Dashboard routes protected via middleware
    - Session state managed via `@supabase/ssr`
- [ ] Persisted settings with Supabase + RLS.
  - **Akzeptanzkriterien:**
    - User settings stored in Supabase with RLS policies
    - Settings read/write via TanStack Query
    - RLS smoke tests pass for settings table
- [x] Implement `/api/health` endpoint and status page.
- [x] Implement `/api/ai/chat` with validation and tests.

## Milestone 3 — Providers + NSCALE (DeepSeek-only)
- [ ] DeepSeek provider adapter.
  - **Akzeptanzkriterien:**
    - Provider interface implemented in `src/lib/ai/providers/deepseek.ts`
    - Only `AI_PROVIDER=deepseek` accepted at runtime
- [ ] DeepSeek adapter hardening (strict request schema, header enforcement, deterministic error mapping).
  - **Akzeptanzkriterien:**
    - Laufzeitvalidierung blockiert alle Provider außer `AI_PROVIDER=deepseek`.
    - Jeder AI-Request wird abgebrochen, wenn `NSCALE_API_KEY` fehlt.
    - `OPENAI_*`-Variablen und OpenAI-Fallbackpfade sind in Adapter-/Config-Checks explizit ausgeschlossen.
- [ ] Retry/timeout/rate-limit/circuit-breaker utilities (DeepSeek-only).
  - **Akzeptanzkriterien:**
    - Retry/Circuit-Breaker werden nur für DeepSeek-Aufrufe aktiviert (`AI_PROVIDER=deepseek` vorausgesetzt).
    - Bei fehlendem `NSCALE_API_KEY` erfolgt fail-closed vor dem ersten Netzwerkaufruf.
    - Integrationstests decken Timeout-, Retry- und Open-Circuit-Fälle ohne alternativen Provider ab.
- [ ] AI telemetry and `ai_logs` metadata persistence (DeepSeek-only).
  - **Akzeptanzkriterien:**
    - Telemetrie schreibt ausschließlich Metadaten für DeepSeek-Requests und speichert den gesetzten NSCALE-Headernamen.
    - Events ohne `AI_PROVIDER=deepseek` oder ohne `NSCALE_API_KEY` werden verworfen und als Policy-Verstoß markiert.
    - Dashboards/Reports zeigen keine OpenAI- oder sonstigen Provider-Metriken.

## Milestone 4 — Docs + Autofix
- [ ] Complete docs structure and wiki sync script.
- [ ] Add `tools/auto_improve.ts` backlog generation.
- [ ] Add optional `autofix.yml` safe-fix pipeline.
- [ ] Document label/project setup and runbook operations.

## Ops Milestones

### Ops-1 — CI/CD & Templates ✅
- [x] PR/Issue templates with DoD checklist
- [x] CODEOWNERS ownership rules
- [x] Branch protection contract documented
- [x] Release workflow with SemVer tags
- [x] Preview deploy on PR, production deploy on main

### Ops-2 — Guards & Checks
- [x] Env schema check (`tools/check_env_schema.ts`)
- [x] RLS smoke tests (`supabase/tests/rls_smoke.sql`)
- [x] Next.js hardening (deduplicated headers, vercel.json as contract)

### Ops-3 — Future
- [ ] Incident-Issue automation with standard template (A4)
- [ ] Release checklist as PR template extension (A5)
- [x] Optional self-hosted runner evaluation (A6) — via `vars.RUNNER` systemweit konfigurierbar

## Automation Backlog

### A0 — Zentraler Failure-Orchestrator für fehlgeschlagene Runs — Priorität: Hoch
- **Status:** ✅ Erledigt
- **Ergebnis:** `.github/workflows/failure-orchestrator.yml` deckt alle fehlgeschlagenen Workflows zentral ab (inkl. CI-Routing), mit AI-Triage-Gating (DeepSeek+NSCALE) und Incident-Issue-Fallback.
- **Abnahmedatum:** 2026-02-16

### A1 — Workflow-Konsolidierung (`ci.yml` vs `ci-cd.yml`) — Priorität: Hoch
- **Akzeptanzkriterien:**
  - Es existiert ein klarer, dokumentierter Verantwortungszuschnitt zwischen `ci.yml` und `ci-cd.yml` (oder ein konsolidierter Workflow).
  - Doppelte Jobs/Schritte wurden entfernt, ohne funktionalen Verlust bei PR- und Main-Branch-Läufen.
  - Workflow-Dokumentation in `docs/` wurde entsprechend aktualisiert.
- **Zieltermin:** 2026-03-06

### A2 — Concurrency + Cancel-in-progress für alle Build-lastigen Workflows — Priorität: Hoch
- **Akzeptanzkriterien:**
  - Alle Build-lastigen Workflows nutzen `concurrency` mit branch-/PR-bezogener Gruppierung.
  - `cancel-in-progress: true` ist überall gesetzt, wo parallele Runs nicht sinnvoll sind.
  - Verifiziert durch mindestens einen Testlauf, dass bei neuem Push laufende alte Builds abgebrochen werden.
- **Zieltermin:** 2026-03-13

### A3 — Automatischer Plan-Status-Report aus `docs/tasks/master_plan.md` — Priorität: Mittel
- **Akzeptanzkriterien:**
  - Ein automatischer Job erzeugt aus `docs/tasks/master_plan.md` einen strukturierten Status-Report (z. B. als PR-Kommentar oder Artefakt).
  - Der Report enthält mindestens Gesamtfortschritt, offene Punkte und zuletzt geänderte Tasks.
  - Fehler bei Report-Erstellung führen zu einem klaren, nachvollziehbaren Workflow-Fehlerzustand.
- **Zieltermin:** 2026-03-20

### A4 — Incident-Issue-Automation mit Standard-Template — Priorität: Mittel
- **Akzeptanzkriterien:**
  - Es gibt ein standardisiertes Incident-Issue-Template mit Pflichtfeldern (Impact, Timeline, Root Cause, Maßnahmen).
  - Ein Workflow kann Incident-Issues auf Label-/Titel-Basis automatisch erstellen oder vervollständigen.
  - Zugehörige Labels/Assignees werden konsistent und dokumentiert gesetzt.
- **Zieltermin:** 2026-03-27

### A5 — Release-Checklist als PR-Template-Erweiterung — Priorität: Niedrig
- **Akzeptanzkriterien:**
  - Das PR-Template enthält eine dedizierte Release-Checklist (Versioning, Changelog, Migration, Rollback-Hinweise).
  - Die Checklist ist in regulären PRs nutzbar, ohne den normalen Entwicklungsfluss übermäßig zu belasten.
  - Dokumentation beschreibt, wann die Release-Checklist vollständig abgearbeitet werden muss.
- **Zieltermin:** 2026-04-03

### A6 — Systemweite Runner-Konfiguration via `vars.RUNNER` (ADR-010) — Priorität: Mittel
- **Status:** ✅ Erledigt
- **Ergebnis:** Alle 25 Workflows nutzen `runs-on: ${{ vars.RUNNER || 'ubuntu-latest' }}`. Runner-Wechsel erfordert nur eine Änderung an der Repository-Variable `vars.RUNNER`. Rollback auf `ubuntu-latest` durch Löschen der Variable. ADR-010 dokumentiert Entscheidung und Rollback-Plan.
- **Abnahmedatum:** 2026-02-18

<!-- AUTO:LIVE_ISSUES_START -->

## Live Issues Index

> Auto-generated — do not edit this section manually.
> Last updated: 2026-02-20

| # | Title | Labels | Assignees |
|---|-------|--------|-----------|
| [#131](https://github.com/NeXifyAI-cloud/opencarbox/issues/131) | CI Failure: ci #100 | `ci-failure` `status:triage` | — |
| [#133](https://github.com/NeXifyAI-cloud/opencarbox/issues/133) | CI Failure: ci #101 | `ci-failure` `status:triage` | — |
| [#144](https://github.com/NeXifyAI-cloud/opencarbox/issues/144) | CI Failure: ci #105 | `ci-failure` `status:triage` | — |
| [#154](https://github.com/NeXifyAI-cloud/opencarbox/issues/154) | CI Failure: ci #108 | `ci-failure` `status:triage` | — |
| [#155](https://github.com/NeXifyAI-cloud/opencarbox/issues/155) | CI Failure: ci #107 | `ci-failure` `status:triage` | — |
| [#156](https://github.com/NeXifyAI-cloud/opencarbox/issues/156) | CI Failure: ci #106 | `ci-failure` `status:triage` | — |
| [#157](https://github.com/NeXifyAI-cloud/opencarbox/issues/157) | CI Failure: ci #104 | `ci-failure` `status:triage` | — |
| [#122](https://github.com/NeXifyAI-cloud/opencarbox/issues/122) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#123](https://github.com/NeXifyAI-cloud/opencarbox/issues/123) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#124](https://github.com/NeXifyAI-cloud/opencarbox/issues/124) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#125](https://github.com/NeXifyAI-cloud/opencarbox/issues/125) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#132](https://github.com/NeXifyAI-cloud/opencarbox/issues/132) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#134](https://github.com/NeXifyAI-cloud/opencarbox/issues/134) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#135](https://github.com/NeXifyAI-cloud/opencarbox/issues/135) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#136](https://github.com/NeXifyAI-cloud/opencarbox/issues/136) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#137](https://github.com/NeXifyAI-cloud/opencarbox/issues/137) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#138](https://github.com/NeXifyAI-cloud/opencarbox/issues/138) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#139](https://github.com/NeXifyAI-cloud/opencarbox/issues/139) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#140](https://github.com/NeXifyAI-cloud/opencarbox/issues/140) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#141](https://github.com/NeXifyAI-cloud/opencarbox/issues/141) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#145](https://github.com/NeXifyAI-cloud/opencarbox/issues/145) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#146](https://github.com/NeXifyAI-cloud/opencarbox/issues/146) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#147](https://github.com/NeXifyAI-cloud/opencarbox/issues/147) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#152](https://github.com/NeXifyAI-cloud/opencarbox/issues/152) | Incident: conflict-resolver fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#160](https://github.com/NeXifyAI-cloud/opencarbox/issues/160) | Incident: ci fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#161](https://github.com/NeXifyAI-cloud/opencarbox/issues/161) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#162](https://github.com/NeXifyAI-cloud/opencarbox/issues/162) | Incident: autofix fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#163](https://github.com/NeXifyAI-cloud/opencarbox/issues/163) | Incident: Deploy Preview fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#164](https://github.com/NeXifyAI-cloud/opencarbox/issues/164) | Incident: conflict-resolver fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#165](https://github.com/NeXifyAI-cloud/opencarbox/issues/165) | Incident: auto-improve fehlgeschlagen | `failure-routing` `ai-triage` | — |
| [#176](https://github.com/NeXifyAI-cloud/opencarbox/issues/176) | Incident: backlog-sync fehlgeschlagen | `failure-routing` `ai-triage` | — |

<!-- AUTO:LIVE_ISSUES_END -->
