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

## ADR-008: Fail-closed AI-Workflows mit standardisiertem PR-Body
- **Decision**: `conflict-resolver.yml`, `auto-improve.yml` und `failure-orchestrator.yml` führen vor AI-Aktivitäten verpflichtend `tools/export_env.sh` + `tools/preflight.ts ai` aus (fail-closed). Automatisch erzeugte PR-Bodies enthalten standardisiert die Abschnitte „Was geändert“, „Warum“, „Wie getestet“, „Risiko/Backout“.
- **Alternatives**:
  - Soft-Gating mit `continue-on-error` im Preflight.
  - Freitext-PR-Bodies ohne einheitliche Incident-Struktur.
- **Reasoning**:
  - Erzwingt DeepSeek-only/NSCALE-Pflicht deterministisch vor jedem AI-Lauf.
  - Verbessert Nachvollziehbarkeit und Backout-Fähigkeit automatischer Fix-PRs.
- **Consequences**:
  - Fehlende AI-Secrets stoppen AI-Workflows früh und sichtbar.
  - Auto-PRs sind auditierbar und entsprechen den geforderten Pflichtfeldern.

## ADR-009: Fail-closed Auto-Reply + secret-freie Controller/Autofix-Orchestrierung
- **Decision**: `auto-reply.yml` führt vor der Antwortgenerierung verpflichtend `tools/export_env.sh` und `tools/preflight.ts ai` aus und bricht bei fehlendem DeepSeek/NSCALE-Setup oder leerer DeepSeek-Antwort hart ab (kein stiller Fallback). `autofix.yml` und `codex-controller.yml` wurden auf nicht-AI-spezifische Umgebungen reduziert und führen nur Env-Normalisierung aus.
- **Alternatives**:
  - Soft-Fallback im Auto-Reply (Template-Antwort ohne AI bei Fehlern).
  - Beibehalten unnötiger AI-Secrets in Workflows ohne direkten AI-Request.
- **Reasoning**:
  - Verhindert intransparente Reply-Pfade ohne DeepSeek/NSCALE-Header.
  - Reduziert Secret-Abhängigkeiten in Dispatch-/Safe-Autofix-Workflows.
  - Erzwingt explizite Tool-Installation (`gh`/`jq`) dort, wo CLI-Aufrufe stattfinden.
- **Consequences**:
  - Auto-Reply scheitert sichtbar bei fehlerhafter AI-Konfiguration statt stiller Platzhalter-Kommentare.
  - Autofix/Controller bleiben ausführbar ohne AI-Secrets und sind klarer voneinander abgegrenzt.
