# AI Copilot Instructions - OpenCarBox & Carvantooo

> **Last Updated:** 2024-12-30
> **Project:** OpenCarBox & Carvantooo - Premium Automotive Multisite Platform
> **Framework:** Next.js 14+ (App Router) + TypeScript + Supabase

---

## 🎯 Project Philosophy

This is a **premium automotive e-commerce platform** with three distinct verticals (Carvantooo Shop, OpenCarBox Werkstatt, OpenCarBox Autohandel) sharing unified infrastructure. Core principle: **"Automotive Premium"** design with precision, depth, purposeful motion, and strong hierarchy.

---

## 🏗️ Architecture at a Glance

```
┌─ Client Layer ────────────────────────┐
│  React Components + TanStack Query    │
│  Zustand Stores | TypeScript Strict   │
└──────────────────────────────────────┘
           ↓
┌─ Next.js 14 (App Router) ────────────┐
│  API Routes | Server Actions          │
│  Middleware (auth, redirects)         │
│  Edge Runtime Support                 │
└──────────────────────────────────────┘
           ↓
┌─ External Services ──────────────────┐
│  Supabase (Auth+DB+Storage)           │
│  Stripe (Payments)                    │
│  Meilisearch (Full-text Search)       │
│  Resend (Transactional Email)         │
│  TecDoc API (Vehicle Data HSN/TSN)    │
│  Botpress/WhatsApp (Chat)             │
└──────────────────────────────────────┘
```

**Key principle:** All external service calls happen in **API routes or server actions**, never directly from client components.

---

## 📁 Directory Structure & Conventions

### Core Directories

| Path | Purpose | Notes |
|------|---------|-------|
| `src/app/` | Next.js App Router | Three sites: `(shop)`, `(werkstatt)`, `(autohandel)` |
| `src/components/` | React Components | Organized: `layout/`, `ui/`, `shared/`, `providers/` |
| `src/lib/` | Utilities & Helpers | Supabase clients, query builders, formatters |
| `src/hooks/` | Custom React Hooks | Query hooks, local storage, media queries |
| `src/stores/` | Zustand State | `cart-store.ts`, `ui-store.ts` |
| `src/types/` | TypeScript Definitions | `database.types.ts` (auto-generated from Supabase) |
| `prisma/` | Database Schema | `schema.prisma` defines all tables & relations |
| `docs/` | Architecture & Design Docs | Read before major changes |

### Path Aliases (tsconfig.json)

Always use these instead of relative paths:
```typescript
// ✅ Correct
import { supabase } from '@/lib/supabase/client'
import Button from '@/components/ui/button'

// ❌ Avoid
import { supabase } from '../../../lib/supabase/client'
```

---

## 🔐 Authentication & Data Access

### Row Level Security (RLS) First

Supabase **RLS policies are enforced at the database level**. Never trust the client:

```typescript
// ✅ Client-side query respects RLS
const { data } = await supabase
  .from('orders')
  .select('*')
  // User only sees their own orders due to RLS policy

// ❌ Don't try to filter on client
const { data: allOrders } = await supabase
  .from('orders')
  .select('*')
  // This returns only user's orders anyway, but relying on app logic is wrong
```

### Database User Roles

```sql
enum UserRole {
  CUSTOMER      -- Standard users
  EMPLOYEE      -- Workshop/sales staff
  ADMIN         -- Full access
}
```

Permissions are enforced via RLS. Check `prisma/schema.prisma` User model for current schema.

---

## 🛢️ Database & Data Patterns

### Three Core Domains

1. **Shop (Carvantooo):** `products`, `categories`, `orders`, `order_items`
2. **Werkstatt (OpenCarBox):** `services`, `appointments`, `vehicles` (customer's garage)
3. **Autohandel (OpenCarBox):** `vehicles_for_sale`

### Vehicle Compatibility (HSN/TSN)

Critical pattern for the platform:

```typescript
// ✅ Pattern: Find products compatible with a vehicle
const getCompatibleProducts = async (hsn: string, tsn: string) => {
  // 1. Lookup HSN/TSN in TecDoc (external API)
  const vehicle = await getTecDocVehicle(hsn, tsn)

  // 2. Find products tagged for this vehicle in DB
  const { data } = await supabase
    .from('product_vehicle_compatibility')
    .select('product_id')
    .eq('hsn', hsn)
    .eq('tsn', tsn)

  return data
}
```

### Queries Use TanStack Query

Never use `useEffect` + `setState` for data fetching. Use TanStack Query (React Query):

```typescript
// ✅ Correct
import { useQuery } from '@tanstack/react-query'

export function ProductList() {
  const { data: products, isPending, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
  })

  if (isPending) return <Loading />
  if (error) return <Error error={error} />
  return <div>{/* render products */}</div>
}
```

---

## 🎨 Design System & Styling

### Tailwind + CSS Variables

All styling uses **Tailwind CSS** with custom config in `tailwind.config.ts`:

```typescript
// ✅ Use utility classes
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
  Shop Now
</button>

// ❌ Avoid inline styles or custom CSS
<button style={{ background: '#E53E3E' }}>Don't do this</button>
```

### Two-Brand Color System

```
Carvantooo (Shop):  bg-red-600 (#E53E3E) - Dynamisch, Action
OpenCarBox (Werk):  bg-blue-600 (#3182CE) - Vertrauen, Service
```

### 8px Grid System

Everything aligns to 8px increments for precision. Spacing utilities:
- `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-8` = 32px (Tailwind default scaled)
- Custom config in `tailwind.config.ts` enforces premium spacing

---

## 🔄 Data Flow Patterns

### API Route → Supabase → Response

All external API calls (Stripe, TecDoc, Meilisearch) happen in **API routes**:

```typescript
// ✅ API Route: src/app/api/products/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  // Search in Meilisearch
  const results = await meilisearch.index('products').search(query)

  // Enrich with Supabase data if needed
  const { data } = await supabase
    .from('products')
    .select('*')
    .in('id', results.map(r => r.id))

  return Response.json(data)
}

// Client component: Use TanStack Query
const { data } = useQuery({
  queryKey: ['products', query],
  queryFn: () => fetch(`/api/products?q=${query}`).then(r => r.json()),
})
```

### Server Actions for Mutations

Use **Server Actions** for data mutations (less boilerplate than API routes):

```typescript
// ✅ Server Action: src/app/actions.ts
'use server'

import { supabase } from '@/lib/supabase/server'

export async function createOrder(formData: FormData) {
  const supabaseServer = await supabase()

  const { data, error } = await supabaseServer
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: 99.99,
      status: 'pending'
    })

  if (error) throw error
  return data
}

// Client component:
<form action={createOrder}>
  <input name="productId" />
  <button type="submit">Order</button>
</form>
```

---

## 🧪 Testing & Quality

### Test Files Location

- Unit tests: `src/**/__tests__/*.test.ts`
- E2E tests: `e2e/` directory
- Run with: `npm run test` (vitest) or `npm run test:e2e` (playwright)

### Before Committing

```bash
npm run type-check   # TypeScript strict check
npm run lint:fix     # ESLint + Prettier
npm run test         # Unit tests
npm run quality-gate # Custom quality checks
```

---

## 🔧 Development Workflows

### Running Locally

```bash
# Install & setup
npm install
npm run db:generate  # Generate Prisma client
npm run db:push      # Sync schema to Supabase
npm run seed         # Seed initial data (if needed)

# Development
npm run dev          # Start Next.js (http://localhost:3000)

# Database admin
npm run db:studio    # Prisma Studio (http://localhost:5555)
```

### Database Migrations

Changes to `prisma/schema.prisma` require:

```bash
npm run db:push      # For development/prototyping
# OR
npm run db:migrate   # For tracked migrations (preferred for production)
```

### Supabase-specific Workflows

Supabase MCP server is configured for advanced operations:
```
supabase:
  url: https://mcp.supabase.com/mcp?project_ref=acclrhzzwdutbigxsxyq&features=...
```
Use for SQL execution, migrations, branch management, edge functions.

---

## 📋 Key Files to Understand

Before making architectural changes, read:

| File | Why |
|------|-----|
| `project_specs.md` | **The law** - brand architecture, legal compliance, system requirements |
| `docs/architecture/system-overview.md` | Big picture: three sites, service boundaries, data flows |
| `docs/architecture/data-flow.md` | Sequence diagrams for product search, orders, appointments |
| `prisma/schema.prisma` | Database schema - 12 tables, all relations |
| `src/middleware.ts` | Auth middleware, redirects between sites |
| `tailwind.config.ts` | Design tokens: colors, typography, spacing |
| `next.config.js` | Image domains, redirects, security headers |

---

## ⚠️ Common Pitfalls

| Mistake | Why Bad | Fix |
|--------|---------|-----|
| Calling Stripe/TecDoc from client component | Exposes API keys | Use API routes or server actions |
| `useEffect` for data fetching | Race conditions, memory leaks | Use TanStack Query |
| Tailwind `@apply` in CSS modules | Bloats build, unnecessary | Use utility classes directly in JSX |
| Hardcoding colors instead of design tokens | Breaks consistency, hard to maintain | Use `bg-red-600` with tailwind |
| Not checking RLS before querying | Security vulnerability | Assume RLS is always enforced |
| Relative imports across directories | Breaks when refactoring | Always use `@/` path aliases |

---

## � NeXify Oracle & Memory System

This project uses a **self-evolving intelligence system** powered by Google Gemini and Supabase.

### Oracle (Thinking Process)

Located in `scripts/core/oracle.ts`, the Oracle provides:
- Deep analysis before code changes
- Context optimization
- Pattern recognition

```typescript
import { Oracle } from '@/scripts/core/oracle'

// Use before major changes
const guidance = await Oracle.think(
  "How should I implement Stripe webhooks?",
  "Current architecture uses Next.js API routes"
)
```

### Memory (Learning Database)

Located in `scripts/core/memory.ts`, the Memory system:
- Stores best practices and anti-patterns in Supabase
- Tracks all agent actions in audit logs
- Enables recall of past solutions

```typescript
import { Memory } from '@/scripts/core/memory'

// Remember a pattern
await Memory.remember({
  type: 'BEST_PRACTICE',
  category: 'api',
  title: 'Stripe webhook signature verification',
  content: 'Always verify webhook signatures using...',
  tags: ['stripe', 'security']
})

// Recall past solutions
const solutions = await Memory.recall('stripe webhook')
```

### Recursive Intelligence Protocol

**MANDATORY** workflow before any code change:

1. **Think** → Ask Oracle for guidance
2. **Recall** → Check Memory for similar patterns
3. **Execute** → Implement the solution
4. **Verify** → Run tests
5. **Learn** → Save results to Memory
6. **Update** → Sync Oracle context

---

## 🤖 Agentic Behavior Expectations

When working on this codebase:

1. **Read `project_specs.md` first** - it's the source of truth for architecture
2. **Use Oracle before major changes** - consult `scripts/core/oracle.ts` for thinking process
3. **Check Memory database** - recall past patterns from `project_memory` table
4. **Check existing patterns** - look at similar components/routes before inventing new ones
5. **Respect the design system** - use Tailwind utilities, honor the 8px grid, follow color palette
6. **Always use TypeScript strict mode** - no `any` types, enforce null checks
7. **Test before committing** - run the quality-gate script
8. **Document why, not what** - code is self-documenting, docs should explain decisions
9. **Keep RLS in mind** - every database access is automatically scoped to the user
10. **Three sites, one codebase** - understand which vertical (shop/werkstatt/autohandel) the feature belongs to
11. **Log all actions** - use `Memory.audit()` to track what you do
12. **No TODO/Placeholder code** - complete all features fully

---

## 🔗 Key Dependencies

- **Next.js 14** - Framework (App Router)
- **React 18** - UI library
- **TypeScript** - Type safety (strict mode)
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend (Postgres + Auth + Storage)
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **Stripe** - Payments
- **Meilisearch** - Full-text search
- **Prisma** - Database ORM/migrations
- **Radix UI** - Unstyled component primitives
- **shadcn/ui** - Styled component library

---

## 📞 Quick Reference

| Need | Command | File |
|------|---------|------|
| Start dev server | `npm run dev` | - |
| Sync DB schema | `npm run db:push` | `prisma/schema.prisma` |
| View database GUI | `npm run db:studio` | - |
| Check types | `npm run type-check` | `tsconfig.json` |
| Auto-fix code | `npm run lint:fix` | `.eslintrc.json` |
| Update type defs from Supabase | `npm run db:generate` | `src/types/database.types.ts` |
| Run tests | `npm run test` | `vitest.config.ts` |

---

**Last reminder:** German communication preferred. Autonomous work expected. Follow `project_specs.md` as the system's constitution.
