# Bug Backlog

> Last updated: 2026-02-17

## Priority 1 (Blocking CI)

| # | Bug | Status | Root Cause |
|---|-----|--------|------------|
| 1 | npm version conflict in all workflows | ✅ Fixed | `npm/action-setup@v4` conflicts when both `version` param and `packageManager` in package.json are set |
| 2 | npm-lock.yaml out of sync with package.json | ✅ Fixed | `autoprefixer` and `postcss` specifiers changed without lockfile refresh |

## Priority 2 (Warnings)

| # | Bug | Status | Location |
|---|-----|--------|----------|
| 3 | React.useMemo missing dependency warning | Open | `src/components/shop/product-grid.tsx:129` — `customProducts` missing from deps array |

## Priority 3 (Technical Debt)

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 4 | Legacy `frontend/` directory | Open | Separate CRA app, not integrated with main CI. Consider migration or removal. |
| 5 | 27 functions exceed recommended length | Open | Reported by `quality-gate` — refactor candidates |
| 6 | Vite CJS deprecation warning | Open | `vitest` shows CJS API deprecation notice — will need vitest upgrade eventually |

## TODO Items in Code

| File | Line | Content |
|------|------|---------|
| `src/stores/index.ts` | — | Contains TODO markers |
