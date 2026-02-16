# Brain / ADR Log

## ADR-001: Delivery mode
- Decision: Implement FALLBACK-ready setup automation scripts under `/tools/setup` that can be executed locally or in CI.
- Rationale: Tokens may be unavailable in contributor environments; scripts must reproduce FULL-AUTO steps.

## ADR-002: AI chat endpoint guardrails
- Decision: `/api/ai/chat` requires Bearer auth, zod request validation, in-memory rate limiting, retries, and timeout.
- Rationale: Establish secure baseline for provider integrations.

## ADR-003: Privacy-first observability
- Decision: Log only metadata (provider, latency, status, request id), no prompt/user content.
- Rationale: Reduce privacy and leakage risk while keeping operational visibility.
