# Bolt's Journal - Performance Optimizations

This journal tracks critical learnings from performance optimizations in this codebase.

## 2025-05-14 - Prisma Singleton Anti-Pattern
**Learning:** Multiple API routes were instantiating `new PrismaClient()` locally, leading to potential database connection exhaustion and overhead.
**Action:** Always use a shared Prisma singleton (e.g., from `src/lib/prisma.ts`) in Next.js API routes to reuse connections and improve performance.

## 2025-05-14 - Intl Formatter Overhead
**Learning:** Repeatedly instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` (especially in render loops for product grids) is computationally expensive.
**Action:** Implement a caching mechanism (e.g., using a `Map`) in utility functions to reuse `Intl` formatter instances and reduce rendering latency.
