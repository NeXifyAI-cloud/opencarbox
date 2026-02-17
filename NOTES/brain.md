# Brain / Architecture Notes

## System Map (Single Source of Truth)

### Stack
- **Framework:** Next.js 14 App Router, TypeScript strict, pnpm 9
- **Data/Auth:** Supabase (Auth + DB + Storage + RLS), Prisma ORM (`prisma/schema.prisma`)
- **State:** TanStack Query (server), Zustand (client, `src/stores/`)
- **UI:** Tailwind CSS, Radix UI, class-variance-authority
- **Payments:** Stripe (`@stripe/stripe-js`, `stripe`)
- **Search:** Meilisearch
- **Email:** Resend
- **AI:** DeepSeek only (NSCALE header required) — **OpenAI forbidden** (guard policy)
- **Deployment:** Vercel (`vercel.json`, `auto-deploy.yml`)
- **CI:** GitHub Actions (`ci.yml` — lint, typecheck, test, build)

### Key Directories
| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router (routes, API, layouts) |
| `src/components/` | UI components (layout, ui, shared, providers) |
| `src/lib/config/` | Env validation (Zod), feature flags |
| `src/lib/supabase/` | Supabase clients (client, server, middleware) |
| `src/stores/` | Zustand stores |
| `prisma/schema.prisma` | Database schema |
| `supabase/migrations/` | SQL migrations (001–003) |
| `tools/` | CI/CD tools (preflight, guard, env export) |
| `scripts/` | Dev/ops scripts (quality-gate, secret-scan, system start) |
| `NOTES/` | Brain, backlog, runbook (this directory) |
| `.github/workflows/` | CI, security, auto-deploy, failure-orchestrator |

### Environment Variables (from `.env.example`)
| Variable | Scope | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_APP_URL` | Client | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes |
| `DEEPSEEK_API_KEY` | Server | For AI features |
| `NSCALE_API_KEY` | Server | For AI features |
| `AI_DEFAULT_PROVIDER` | Server | Default: deepseek |
| `AI_DEFAULT_MODEL` | Server | Default: deepseek-chat |
| `RATE_LIMIT_PER_MINUTE` | Server | Default: 20 |
| `AI_TIMEOUT_MS` | Server | Default: 30000 |
| `SENTRY_DSN` | Server | Optional |
| `FEATURE_AI_CHAT` | Server | Default: true |

### Build / Test / Quality
```bash
pnpm install              # Install dependencies
pnpm lint                 # ESLint (next lint)
pnpm typecheck            # tsc --noEmit
pnpm test                 # Vitest (unit + API tests)
pnpm build                # next build (standalone output)
pnpm secret:scan          # Secret pattern scan
pnpm quality-gate         # Full quality check
pnpm system:check         # System health check
```

### Integrations
- **Supabase:** Auth, DB (PostgreSQL), Storage, RLS
- **Stripe:** Payment processing (server-side only)
- **Meilisearch:** Full-text search
- **Resend:** Transactional email
- **DeepSeek + NSCALE:** AI chat (server-side only)
- **Vercel:** Hosting + deployment (fra1 region)

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
