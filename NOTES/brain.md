# Brain / Architecture Notes

## Architecture Overview
- Framework: Next.js App Router with TypeScript strict mode.
- Data/Auth: Supabase (`@supabase/supabase-js` + `@supabase/ssr`).
- Runtime config validation: Zod-backed env parsing in `src/lib/config/env.ts`.
- Feature gates: `src/lib/config/featureFlags.ts`.

## ADR-001: Runtime env validation with Zod
- **Decision**: Validate server/client environment variables at runtime using centralized schemas.
- **Alternatives**:
  - Access env values ad-hoc in each module.
  - Use compile-time-only typing without runtime checks.
- **Reasoning**:
  - Avoids hidden misconfigurations in CI/deployment.
  - Enables explicit defaults and required field errors.
- **Consequences**:
  - App fails fast if env values are missing/invalid.
- New environment variables must be added to the schema.

## ADR-002: Klare Failure-Zuständigkeit zwischen `autofix.yml` und `failure-orchestrator.yml`
- **Decision**: `autofix.yml` ist ausschließlich für Safe-Autofix-PRs bei fehlgeschlagenen `ci`-Runs zuständig. `failure-orchestrator.yml` übernimmt zentrales Routing/Issue/AI-Triage für fehlgeschlagene Runs aller Workflows.
- **Alternatives**:
  - Vollständige Zentralisierung inklusive Safe-Autofix im `failure-orchestrator`.
  - Parallele Zuständigkeit beider Workflows ohne harte Trennung.
- **Reasoning**:
  - Verhindert doppelte Schreibpfade (PR/Issue) pro fehlgeschlagenem Run.
  - Hält Safe-Autofix deterministisch, während Triage-Fälle klar im Orchestrator landen.
  - Erlaubt fail-closed AI-Gating im Orchestrator (`AI_PROVIDER=deepseek`, `DEEPSEEK_API_KEY`, `NSCALE_API_KEY`).
- **Consequences**:
  - Pro Run schreibt nur ein Workflow Artefakte (PR oder Issue).
  - Eindeutigere Incident-Nachverfolgung über Routing-Labels und Run-Marker.

## ADR-003: Einheitliche Env-Normalisierung und fail-closed AI-Gating in allen Automations-Workflows
- **Decision**: Nicht-CI-Workflows führen zu Beginn `source tools/export_env.sh` aus und prüfen anschließend via `tools/preflight.ts` den jeweiligen Modus (`ci`, `ai`, `oracle`, `deploy`).
- **Alternatives**:
  - Legacy-Secret-Namen direkt in jedem Workflow duplizieren.
  - Preflight nur in ausgewählten Workflows nutzen.
- **Reasoning**:
  - Reduziert Drift zwischen alten Secret-Namen und standardisierten Runtime-Variablen.
  - Erzwingt DeepSeek-only inklusive NSCALE-Header ohne implizite Fallbacks.
  - Macht Deploy-/Oracle-Schritte deterministischer, da fehlende Pflichtvariablen früh scheitern.
- **Consequences**:
  - Workflows schlagen früher und klarer fehl, wenn Secrets unvollständig sind.
  - Operationales Verhalten ist über alle Automations-Workflows konsistent.

## Security & Privacy Notes
- Never store or log API keys in plain text.
- Only metadata logging is allowed for AI interactions.
- RLS is required for user-bound tables in Supabase migrations.

## Extensibility Notes
- New AI providers should be added behind a provider interface in `src/lib/ai/providers/*`.
- Provider-specific headers and retry behavior must remain encapsulated in adapter files.


## ADR-004: CI auf GitHub-hosted `ubuntu-latest` ohne AI-Secrets
- **Decision**: Der primäre CI-Workflow (`.github/workflows/ci.yml`) läuft in beiden Jobs auf `runs-on: ubuntu-latest` (GitHub-hosted) und enthält keine AI-/Deploy-Secrets als Voraussetzung.
- **Alternatives**:
  - Betrieb auf `self-hosted` als Standard-Runner für CI.
  - Gemischtes Modell mit optionalem Fallback zwischen `self-hosted` und `ubuntu-latest`.
- **Reasoning**:
  - PR- und Main-Checks bleiben unabhängig von lokaler Runner-Verfügbarkeit.
  - Build/Test-Checks sind weiterhin klar von AI-/Deploy-Workflows getrennt.
- **Consequences**:
  - CI ist sofort lauffähig ohne eigene Runner-Infrastruktur.
  - Eine mögliche Rückkehr zu `self-hosted` wird als separate zukünftige Backlog-/ADR-Entscheidung geführt (siehe `NOTES/backlog.md`, A6).

## ADR-005: Webhook-basierter Codex-Controller für autonome Pipeline-Steuerung
- **Decision**: Einführung eines signierten Webhook-Endpunkts `POST /api/webhooks/codex-controller`, der DeepSeek-only Routing-Entscheidungen trifft und über `repository_dispatch` die zuständigen Automationspfade startet.
- **Alternatives**:
  - Direkte Entscheidung ausschließlich in einzelnen GitHub Workflows ohne zentralen Router.
  - Polling statt Event/Webhook-Steuerung.
- **Reasoning**:
  - Ein zentraler Router reduziert Duplikate bei Triggerlogik und ermöglicht konsistente Guardrails.
  - Webhooks liefern reaktive, niedrig-latente Steuerung ohne permanente Polling-Kosten.
  - DeepSeek + NSCALE bleibt erzwungen, da Entscheidungslogik dieselbe AI-Policy nutzt.
- **Consequences**:
  - Für produktiven Betrieb sind `CODEX_WEBHOOK_SECRET`, `GH_PAT`/`GITHUB_TOKEN` und korrektes `GITHUB_REPOSITORY` erforderlich.
  - Externe Systeme müssen den HMAC-Header `x-codex-signature-256` liefern.

## ADR-004-Nachtrag: DeepSeek-only + NSCALE-Pflicht als verbindliche Provider-Policy
- **Decision**: Alle AI-bezogenen Backlog- und Implementierungsaufgaben sind DeepSeek-only; gültige Requests erfordern `AI_PROVIDER=deepseek` und `NSCALE_API_KEY` ohne alternative Providerpfade.
- **Reasoning**:
  - Hält Architektur- und Backlog-Policy konsistent und auditierbar.
  - Erzwingt fail-closed Verhalten bei fehlendem NSCALE-Header-Secret.
- **Consequences**:
  - OpenAI/sonstige Provider sind operativ ausgeschlossen, solange keine explizite neue ADR dies ändert.
  - Abnahmekriterien für AI-Tasks müssen DeepSeek-only und NSCALE-Pflicht explizit prüfen.

## ADR-006: Vereinheitlichte Guardrail-Variablen für AI-Konfliktauflösung
- **Decision**: Guardrail-Umgebungsvariablen für die AI-Konfliktauflösung akzeptieren standardisiert `max_conflict_files`, `max_file_bytes` und `binary_heuristic_threshold` (zusätzlich rückwärtskompatibel zu bisherigen UPPERCASE-Varianten).
- **Alternatives**:
  - Ausschließlich UPPERCASE-Variablen weiterführen.
  - Harte Umstellung ohne Rückwärtskompatibilität.
- **Reasoning**:
  - Entspricht der dokumentierten Guardrail-Benennung für AI-Workflows.
  - Vermeidet Konfigurationsdrift zwischen Workflow-Definitionen und Tooling.
- **Consequences**:
  - Bestehende Automationen bleiben kompatibel, neue Workflows können konsistent lowercase-Guardrails setzen.
  - Binärdatei-Erkennung kann über `binary_heuristic_threshold` explizit gesteuert werden.


## ADR-007: GitLab-Projekttoken als systemweite Alias-Quelle in Setup/Env-Mapping
- **Decision**: Setup- und Env-Normalisierung unterstützen zusätzlich GitLab-Projekttoken/-Projekt-ID über standardisierte Variablen (`GITLAB_TOKEN`, `GITLAB_PROJECT_ID`) plus Legacy-Aliasse aus systemweiten Datenquellen.
- **Alternatives**:
  - Ausschließlich GitHub/Vercel/Supabase-Secrets mappen.
  - GitLab-Variablen nur manuell ohne Alias-Auflösung pflegen.
- **Reasoning**:
  - Erlaubt direkte Nutzung bereits hinterlegter Projekttoken ohne manuelle Umbenennung.
  - Hält den Bootstrap-/Verify-Pfad konsistent mit bestehender Env-Normalisierung.
- **Consequences**:
  - Preflight/Setup zeigen fehlende GitLab-Parameter früh als Warnung.
  - Künftige GitLab-Automationen können standardisierte Variablen direkt verwenden.

## ADR-008: Env-Schema-Check über `.env.example` als Single Source of Truth
- **Decision**: `tools/check_env_schema.ts` nutzt `.env.example` als deklaratives Schema für alle Umgebungsvariablen. Neue Variablen müssen zuerst dort ergänzt werden. Verbotene Provider-Variablen (`OPENAI_*`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) werden sowohl im Environment als auch in `.env.example` geprüft.
- **Alternatives**:
  - Manuelle Prüfung ohne automatisierten Check.
  - Separate Schema-Datei unabhängig von `.env.example`.
- **Reasoning**:
  - `.env.example` existiert bereits als Dokumentation; nutzt es doppelt als Laufzeit-Schema.
  - CI-Modus (`--ci`) beschränkt Prüfung auf Build-relevante Variablen, während lokaler Modus alle prüft.
  - Forbidden-Provider-Alignment mit `tools/guard_no_openai.sh` stellt konsistente Policy-Durchsetzung sicher.
- **Consequences**:
  - `pnpm env:check` kann lokal und in CI als Preflight genutzt werden.
  - Alle neuen Variablen folgen einem dokumentierten Workflow: `.env.example` → `env:check` → Vercel/CI Secrets.

## ADR-009: Preview/Production Deploy-Trennung über dedizierte Workflows
- **Decision**: Preview-Deployments werden durch `deploy-preview.yml` (Trigger: `pull_request`) gesteuert, Production-Deployments durch `auto-deploy.yml` (Trigger: `workflow_run` nach CI auf `main`). Kein gemeinsamer Workflow mit Environment-Schalter.
- **Alternatives**:
  - Ein einzelner Deploy-Workflow mit Environment-Parameter.
  - Preview nur über Vercel Git Integration ohne eigenen Workflow.
- **Reasoning**:
  - Klare Trennung von Berechtigungen (Preview braucht kein `--prod`).
  - Preview-Workflows können eigene Preflight-Checks ausführen (z. B. Env-Schema-Check).
  - Production-Deploys sind an erfolgreiche CI gebunden, nicht an PR-Events.
- **Consequences**:
  - Zwei Workflows zu pflegen, aber mit klaren, nicht-überlappenden Verantwortlichkeiten.
  - Preview-URLs werden automatisch als PR-Kommentar gepostet.
