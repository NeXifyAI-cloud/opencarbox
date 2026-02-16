# Backlog

## Milestone 1 — Scaffold
- [x] Add env validation module and feature flags.
- [x] Align `.env.example` with required public/server variables.
- [x] Initialize NOTES documentation set.
- [x] Add dedicated CI and security workflows.
- [x] Add modern issue forms and PR template checklist.

## Milestone 2 — Vertical Slice
- [ ] Auth flow with protected dashboard route group.
- [ ] Persisted settings with Supabase + RLS.
- [x] Implement `/api/health` endpoint and status page.
- [x] Implement `/api/ai/chat` with validation and tests.

## Milestone 3 — Providers + NSCALE
- [ ] DeepSeek provider adapter.
- [ ] OpenAI-compatible adapter with NSCALE header.
- [ ] Retry/timeout/rate-limit/circuit-breaker utilities.
- [ ] AI telemetry and `ai_logs` metadata persistence.

## Milestone 4 — Docs + Autofix
- [ ] Complete docs structure and wiki sync script.
- [ ] Add `tools/auto_improve.ts` backlog generation.
- [ ] Add optional `autofix.yml` safe-fix pipeline.
- [ ] Document label/project setup and runbook operations.

## Automation Backlog

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
