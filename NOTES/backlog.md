# Backlog

## Tech Debt / Bug Fixes (prioritized)

### TD-001 — pnpm-lock.yaml out of sync with package.json — Priorität: Hoch
- **Repro:** `pnpm install --frozen-lockfile` → fails with specifier mismatch (autoprefixer, postcss versions).
- **Erwartetes Ergebnis:** `pnpm install --frozen-lockfile` succeeds.
- **Aktuelles Ergebnis:** Fails in CI with `ERR_PNPM_OUTDATED_LOCKFILE`.
- **Betroffene Dateien:** `pnpm-lock.yaml`, `package.json`
- **Fix:** Regenerate lockfile with `pnpm install`.
- **Akzeptanzkriterien:** `pnpm install --frozen-lockfile` succeeds in CI.
- **Status:** ✅ Fixed (lockfile regenerated)

### TD-002 — .env.example contains OPENAI_COMPAT vars — Priorität: Hoch
- **Repro:** `grep OPENAI .env.example` → shows `OPENAI_COMPAT_API_KEY` and `OPENAI_COMPAT_BASE_URL`.
- **Erwartetes Ergebnis:** No OPENAI references in env configuration.
- **Aktuelles Ergebnis:** `.env.example` has OPENAI-prefixed vars that contradict DeepSeek-only policy.
- **Betroffene Dateien:** `.env.example`
- **Akzeptanzkriterien:** No `OPENAI_*` in `.env.example`; `tools/guard_no_openai.sh` stays green.
- **Status:** ✅ Fixed

### TD-003 — Missing CONTRIBUTING.md — Priorität: Mittel
- **Repro:** No contribution guidelines exist.
- **Erwartetes Ergebnis:** Clear guidelines for branching, PR process, commit messages.
- **Betroffene Dateien:** `CONTRIBUTING.md` (new)
- **Akzeptanzkriterien:** File exists with branch strategy, commit convention, PR checklist.
- **Status:** ✅ Fixed

### TD-004 — Missing CODEOWNERS — Priorität: Mittel
- **Repro:** No `.github/CODEOWNERS` exists; PRs have no auto-assigned reviewers.
- **Erwartetes Ergebnis:** Auto-review assignment for critical paths.
- **Betroffene Dateien:** `.github/CODEOWNERS` (new)
- **Akzeptanzkriterien:** CODEOWNERS file assigns default owner.
- **Status:** ✅ Fixed

### TD-005 — CI lacks test report artifacts — Priorität: Niedrig
- **Repro:** CI runs tests but does not upload results as artifacts.
- **Erwartetes Ergebnis:** Test results available as downloadable artifacts in CI.
- **Betroffene Dateien:** `.github/workflows/ci.yml`
- **Akzeptanzkriterien:** CI uploads test report on failure.
- **Status:** ✅ Fixed

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

### A6 — Optionaler Umstieg von CI auf self-hosted Runner (separate ADR) — Priorität: Mittel
- **Akzeptanzkriterien:**
  - Eine neue ADR dokumentiert Anlass, Risiko, Kosten und Rollback für den Umstieg von `ubuntu-latest` auf `self-hosted` in `ci.yml`.
  - Es existiert ein reproduzierbarer Runner-Betriebsnachweis (Provisioning, Labels, Monitoring, Patch-Management, Ausfallprozess).
  - Ein Validierungslauf zeigt, dass `pnpm lint`, `pnpm typecheck`, `pnpm test` und `pnpm build` auf self-hosted stabil durchlaufen.
  - Rollback auf `ubuntu-latest` ist als einzelner, dokumentierter Workflow-Change möglich und getestet.
- **Zieltermin:** 2026-04-10

