# NeXifyAI Brain

## Definition of Done (Phase 1)
- Next.js + TypeScript strict stack remains the primary app foundation.
- Minimal vertical slice exists and is test-covered:
  - `/settings` UI for AI provider configuration and test call.
  - `/api/health` endpoint for service status.
  - Provider abstraction with a mock provider implementation.
- Baseline delivery automation exists via GitHub Actions for CI, security checks, and release packaging.
- Project runbook and backlog are documented under `/NOTES`.

## Architecture Decision Records

### ADR-001: Keep existing Next.js monolith and add AI slice incrementally
- **Status:** Accepted
- **Context:** Repository already contains a Next.js TypeScript codebase.
- **Decision:** Deliver the requested Phase 1 scope as additive modules/routes inside the existing app.
- **Consequences:** Faster delivery and lower migration risk, but requires careful namespace isolation.

### ADR-002: Provider abstraction via a small interface
- **Status:** Accepted
- **Context:** We need support for DeepSeek and OpenAI-compatible endpoints.
- **Decision:** Introduce `AIProvider` interface with `listModels()` and `chatCompletion()` methods and build providers behind a factory.
- **Consequences:** Easier testing and safe fallback to mock provider when keys are unavailable.

### ADR-003: Settings persisted in browser localStorage for Phase 1
- **Status:** Accepted
- **Context:** Secure backend persistence is out of scope for first vertical slice.
- **Decision:** Store non-secret provider metadata in localStorage and read secret key fallbacks from environment variables server-side.
- **Consequences:** Fast iteration; production secret management remains via deployment secrets.

## Risks
- Existing repository includes historical CI workflows and legacy scripts; overlap can cause duplication.
- External provider network calls may fail in local/offline mode; mock provider is used for deterministic tests.

## Roadmap (short)
1. Phase 1 (this change): scaffold + minimal AI slice.
2. Phase 2: circuit breaker, retry policy, latency metrics, and settings persistence API.
3. Phase 3: richer docs UI, status telemetry dashboard, and auto-improve loop wiring to CI artifacts.
