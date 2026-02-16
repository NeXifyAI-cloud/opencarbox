# Runbook

## Operations
- Start local app: `pnpm dev`.
- Validate quality gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Apply Supabase migrations via Supabase CLI or SQL editor using files in `supabase/migrations`.

## API Monitoring & Incident Checks

### Health Endpoint
- Endpoint: `GET /api/health`
- Success criteria:
  - HTTP `200`
  - JSON includes `status`, `timestamp`, `dependencies.database`, `dependencies.aiService`
  - `dependencies.*.status` should be `up`
- Degraded criteria:
  - HTTP `503`
  - One or more dependencies in `degraded` / `down`

Quick check:
```bash
curl -sS -i http://localhost:3000/api/health
```

### AI Chat Endpoint
- Endpoint: `POST /api/ai/chat`
- Required body contract:
  - `messages` array (1..50)
  - message roles: `system | user | assistant`
  - message content max. 8000 chars
- Standard success code: `200`

Common response codes:
- `400` `INVALID_JSON` / `VALIDATION_ERROR`
- `429` `RATE_LIMIT_EXCEEDED` (`Retry-After` header beachten)
- `502` `AI_UPSTREAM_ERROR`
- `503` `FEATURE_DISABLED`

Quick checks:
```bash
curl -sS -i -X POST http://localhost:3000/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'
```

```bash
curl -sS -i -X POST http://localhost:3000/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Release Process
1. Merge only through PR into protected `main`.
2. Ensure required CI checks are green.
3. Deploy to Vercel Preview, then Production.

## Rollback
- Revert offending commit in GitHub.
- Redeploy previous successful Vercel deployment.
- If migration-related, apply compensating migration (never edit historical migration files).

## Incident Steps
1. Triage impact and severity.
2. Check `/api/health` status and identify dependency with degraded/down state.
3. Validate `/api/ai/chat` status code + `code` payload to classify incident quickly.
4. Capture metadata-only logs (no prompts/PII/secrets).
5. Create backlog item with acceptance criteria before closing incident.
