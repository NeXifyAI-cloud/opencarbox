# AI Copilot Instructions - OpenCarBox & Carvantooo

> Premium Automotive Multisite Platform | Next.js 14 + TypeScript + Supabase

## Architecture Overview

**Three-site platform** sharing one codebase: Carvantooo (Shop, rot `#E53E3E`), OpenCarBox Werkstatt + Autohandel (blau `#3182CE`).

```
Client: React + TanStack Query + Zustand | TypeScript strict
Server: Next.js App Router (API Routes + Server Actions)
Backend: Supabase (Auth+DB+Storage+RLS) | Prisma ORM
External: Stripe, Meilisearch, TecDoc API, Resend
```

**Golden Rule:** External API calls (Stripe, TecDoc) → API routes/Server Actions only. Never from client.

## Critical Patterns

### Data Fetching (ALWAYS TanStack Query)
```typescript
// ✅ Correct - TanStack Query
const { data, isPending } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(r => r.json()),
})

// ❌ NEVER useEffect + useState for fetching
```

### Row Level Security
Supabase RLS is enforced at DB level. Every query is auto-scoped to user - trust the DB, not app logic.

### Vehicle Compatibility (HSN/TSN)
Core feature: Products/services linked to vehicles via HSN/TSN codes. See `product_vehicle_compatibility` table.

## Project Structure

| Path | Purpose |
|------|---------|
| `src/app/` | App Router routes |
| `src/components/{layout,ui,shared,providers}/` | Component hierarchy |
| `src/lib/supabase/` | DB clients (client.ts, server.ts, middleware.ts) |
| `src/stores/` | Zustand stores (cart, ui) |
| `prisma/schema.prisma` | Database schema - **read first** |
| `scripts/core/` | Oracle + Memory system |

**Always use `@/` imports:** `import { x } from '@/lib/utils'`

## Essential Commands

```bash
npm run dev              # Development server
npm run db:push          # Sync Prisma schema to Supabase
npm run db:studio        # Prisma GUI
npm run type-check       # TypeScript validation
npm run quality-gate     # Full quality check before commit
npm run oracle:status    # Check Oracle system state
```

## Oracle & Memory System

This project uses AI-assisted development via `scripts/core/`:
- **oracle.ts** - Thinking process (consult before major changes)
- **memory.ts** - Stores patterns in `project_memory` table
- Run `npm run oracle:before "action" "description"` before changes

## Key Rules

1. **Read `project_specs.md`** - The constitution for architecture/branding
2. **TypeScript strict** - No `any`, no implicit null
3. **Tailwind only** - No inline styles, use design tokens
4. **8px grid** - All spacing in 8px increments
5. **No placeholders** - Complete all features fully
6. **RLS-aware** - Database security is enforced at query level
7. **German UI** - Code in English, user-facing text in German

## Common Pitfalls

| Don't | Do Instead |
|-------|------------|
| Client-side Stripe/TecDoc calls | API routes + Server Actions |
| `useEffect` for data fetching | TanStack Query |
| Relative imports `../../../` | Path aliases `@/` |
| Hardcoded colors | Tailwind tokens (`bg-red-600`) |
| Skip type-check | Run `npm run quality-gate` |

**Architecture docs:** [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
