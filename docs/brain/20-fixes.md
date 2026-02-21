# Fix Log

> Chronological log of fixes applied to the system.

## 2026-02-17: pnpm version conflict in GitHub Actions

- **Problem**: All CI workflows failing with `Error: Multiple versions of pnpm specified` — `pnpm/action-setup@v4` detected version in both `version` param and `packageManager` in package.json.
- **Root cause**: `pnpm/action-setup@v4` added stricter validation. Having `version: ${{ env.PNPM_VERSION }}` (value: `9`) alongside `"packageManager": "pnpm@9.12.3"` in package.json triggers a conflict error.
- **Fix**: Removed `version` parameter and `PNPM_VERSION` env var from all 9 affected workflow files. pnpm version is now solely managed via `packageManager` in package.json.
- **Prevention**: Documented in ADR-001. Single source of truth for pnpm version.
- **Verification**: All workflow YAML validated. Local `pnpm lint`, `pnpm typecheck`, `pnpm test` pass.

## 2026-02-17: pnpm-lock.yaml out of sync

- **Problem**: `pnpm i --frozen-lockfile` failed because lockfile specifiers didn't match package.json (autoprefixer, postcss versions updated).
- **Root cause**: package.json dependencies were updated without regenerating the lockfile.
- **Fix**: Ran `pnpm i` to regenerate `pnpm-lock.yaml`.
- **Prevention**: CI runs `pnpm i --frozen-lockfile` which catches lockfile drift.
- **Verification**: `pnpm i --frozen-lockfile` succeeds locally.
