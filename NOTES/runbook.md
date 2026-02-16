# Runbook

## Local development
1. Install dependencies:
   - `npm ci`
2. Start app:
   - `npm run dev`
3. Open:
   - `http://localhost:3000/settings`
   - `http://localhost:3000/status`

## Core checks
- Lint: `npm run lint`
- Typecheck: `npm run type-check`
- Unit tests: `npm run test -- --run`
- Build: `npm run build`

## Health and AI endpoints
- Health: `GET /api/health`
- Models: `POST /api/ai/models`
- Chat test: `POST /api/ai/chat`

## Secrets handling
- Local secrets in `.env` only.
- CI/CD secrets in GitHub Actions secrets:
  - `DEEPSEEK_API_KEY`
  - `OPENAI_COMPAT_API_KEY`
  - `NSCALE_API_KEY`

## Troubleshooting
- If provider test call fails, verify selected provider and model in Settings.
- If endpoint returns 500, inspect server logs for `provider` and `requestId` fields.
