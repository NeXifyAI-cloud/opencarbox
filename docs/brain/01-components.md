# Components & Commands

> Last updated: 2026-02-17

## Main Application (Next.js)

| Command | Description |
|---------|-------------|
| `npm dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint (next lint) |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end |
| `npm run test:coverage` | Vitest with coverage |
| `npm format:check` | Prettier check |
| `npm format` | Prettier write |

## Database

| Command | Description |
|---------|-------------|
| `npm db:generate` | Generate Prisma client |
| `npm db:push` | Push schema to Supabase |
| `npm db:migrate` | Run Prisma migrations |
| `npm db:seed` | Seed database |
| `npm db:studio` | Open Prisma Studio |

## Quality & Security

| Command | Description |
|---------|-------------|
| `npm run quality-gate` | Full quality checks (TS, console, any, docs) |
| `npm run secret:scan` | Scan for leaked secrets |
| `bash tools/guard_no_openai.sh` | Verify no forbidden AI providers |
| `npx tsx tools/preflight.ts ci` | CI preflight validation |

## Oracle & Memory System

| Command | Description |
|---------|-------------|
| `npm oracle:status` | Check Oracle system state |
| `npm oracle:before "action" "desc"` | Pre-change consultation |
| `npm oracle:after "action" "desc"` | Post-change recording |
| `npm oracle:sync` | Sync Oracle data |

## CI Preflight Modes

| Mode | Required Env Vars |
|------|------------------|
| `ci` | None |
| `ai` | `AI_PROVIDER=deepseek`, `DEEPSEEK_API_KEY`, `NSCALE_API_KEY` |
| `oracle` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `deploy` | `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` |

## Frontend (Legacy — `frontend/`)

Separate React CRA app. Not part of main CI pipeline.

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm run test` | Tests |

## External Services

| Service | Purpose | Config |
|---------|---------|--------|
| Supabase | DB + Auth + Storage + RLS | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe | Payments | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Meilisearch | Product search | `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY` |
| TecDoc | Vehicle data (HSN/TSN) | `TECDOC_API_KEY` |
| Resend | Transactional email | `RESEND_API_KEY` |
| Sentry | Error tracking | `SENTRY_DSN` |
| DeepSeek | AI chat | `DEEPSEEK_API_KEY` |
| NSCALE | AI provider | `NSCALE_API_KEY` |
| Vercel | Hosting | `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` |
