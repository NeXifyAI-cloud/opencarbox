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

## ADR-002: Failure-Orchestrator als zentrale Failure-Route
- **Decision**: Ein zentraler Workflow `failure-orchestrator.yml` verarbeitet fehlgeschlagene Workflow-Runs in drei Stufen: Safe-Autofix, AI-Triage-Gating (DeepSeek + NSCALE) und Incident-Issue-Fallback.
- **Alternatives**:
  - Einzelne, voneinander getrennte Autofix-/Triage-Workflows ohne zentrale Steuerung.
  - Ausschließlich manuelle Incident-Bearbeitung.
- **Reasoning**:
  - Deterministische, wiederholbare Behandlung jedes Fehlschlags.
  - Fail-closed Verhalten für AI-Pfade durch verpflichtendes Preflight (`AI_PROVIDER=deepseek`, `DEEPSEEK_API_KEY`, `NSCALE_API_KEY`).
- **Consequences**:
  - Schnellere Erstreaktion bei CI-/Workflow-Fehlern.
  - Höhere Transparenz durch standardisierte PR-/Issue-Erstellung.

## Security & Privacy Notes
- Never store or log API keys in plain text.
- Only metadata logging is allowed for AI interactions.
- RLS is required for user-bound tables in Supabase migrations.

## Extensibility Notes
- New AI providers should be added behind a provider interface in `src/lib/ai/providers/*`.
- Provider-specific headers and retry behavior must remain encapsulated in adapter files.
