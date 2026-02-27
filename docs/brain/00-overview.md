# System Overview — OpenCarBox & Carvantooo

> Last updated: 2026-02-17

## Platform

Premium Automotive Multisite Platform — three sites sharing one codebase:

| Site | Purpose | Brand Color |
|------|---------|-------------|
| Carvantooo (Shop) | Online parts shop | `#FFB300` (red) |
| OpenCarBox Werkstatt | Workshop services | `#FFA800` (blue) |
| OpenCarBox Autohandel | Vehicle trading | `#FFA800` (blue) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.35 (App Router) |
| Language | TypeScript 5.9.3 (strict) |
| Runtime | Node.js ≥ 18.17 |
| Package Manager | pnpm 9.12.3 |
| UI | React 18.3, shadcn/ui, Radix UI, Tailwind CSS 3.4 |
| State | Zustand (client), TanStack Query (server) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5.10 |
| Auth | Supabase Auth + RLS |
| Payments | Stripe |
| Search | Meilisearch |
| Email | Resend |
| Vehicle Data | TecDoc API |
| AI | DeepSeek + NSCALE (no OpenAI) |
| Error Tracking | Sentry |
| Hosting | Vercel (fra1 / Frankfurt) |
| CI/CD | GitHub Actions |

## Architecture Diagram (simplified)

```
┌─────────────┐     ┌──────────────────────┐
│  Browser     │────▶│  Next.js App (Vercel) │
│  (React SPA) │     │  App Router + API     │
└─────────────┘     └───────┬──────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     ┌────────────┐  ┌───────────┐  ┌─────────────┐
     │  Supabase  │  │  Stripe   │  │ Meilisearch │
     │  (DB+Auth) │  │ (Payments)│  │  (Search)   │
     └────────────┘  └───────────┘  └─────────────┘
```

## Source Layout

```
src/
├── app/              # Next.js App Router (pages + API routes)
│   ├── (autohandel)  # Autohandel site routes
│   ├── (shop)        # Shop site routes
│   ├── (werkstatt)   # Werkstatt site routes
│   └── api/          # API endpoints
├── components/       # React components (auth, layout, ui, shared, shop)
├── config/           # App configuration
├── hooks/            # Custom React hooks
├── lib/              # Utilities (supabase clients, AI, config)
├── middleware.ts     # Next.js middleware
├── stores/           # Zustand state stores
├── styles/           # Global styles
└── types/            # TypeScript type definitions

frontend/             # Legacy React frontend (CRA-based, separate)
scripts/              # Oracle, watchdog, quality-gate, automation
tools/                # CI preflight, guard scripts
prisma/               # Schema + seed
supabase/             # Migrations
tests/                # Vitest unit + Playwright e2e
docs/                 # Architecture, design-system, API docs
```
