# Components & Commands

> Last updated: 2026-02-17

## Main Application (Next.js)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint (next lint) |
| `pnpm typecheck` | TypeScript `tsc --noEmit` |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright end-to-end |
| `pnpm test:coverage` | Vitest with coverage |
| `pnpm format:check` | Prettier check |
| `pnpm format` | Prettier write |

## Database

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to Supabase |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Prisma Studio |

## Quality & Security

| Command | Description |
|---------|-------------|
| `pnpm quality-gate` | Full quality checks (TS, console, any, docs) |
| `pnpm secret:scan` | Scan for leaked secrets |
| `bash tools/guard_no_openai.sh` | Verify no forbidden AI providers |
| `npx tsx tools/preflight.ts ci` | CI preflight validation |

## Oracle & Memory System

| Command | Description |
|---------|-------------|
| `pnpm oracle:status` | Check Oracle system state |
| `pnpm oracle:before "action" "desc"` | Pre-change consultation |
| `pnpm oracle:after "action" "desc"` | Post-change recording |
| `pnpm oracle:sync` | Sync Oracle data |

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
| `npm test` | Tests |

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
