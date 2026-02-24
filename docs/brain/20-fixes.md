# Fix Log

> Chronological log of fixes applied to the system.

## 2026-02-17: npm version conflict in GitHub Actions

- **Problem**: All CI workflows failing with `Error: Multiple versions of npm specified` — `npm/action-setup@v4` detected version in both `version` param and `packageManager` in package.json.
- **Root cause**: `npm/action-setup@v4` added stricter validation. Having `version: ${{ env.PNPM_VERSION }}` (value: `9`) alongside `"packageManager": "npm@9.12.3"` in package.json triggers a conflict error.
- **Fix**: Removed `version` parameter and `PNPM_VERSION` env var from all 9 affected workflow files. npm version is now solely managed via `packageManager` in package.json.
- **Prevention**: Documented in ADR-001. Single source of truth for npm version.
- **Verification**: All workflow YAML validated. Local `npm run lint`, `npm run typecheck`, `npm run test` pass.

## 2026-02-17: npm-lock.yaml out of sync

- **Problem**: `npm i --frozen-lockfile` failed because lockfile specifiers didn't match package.json (autoprefixer, postcss versions updated).
- **Root cause**: package.json dependencies were updated without regenerating the lockfile.
- **Fix**: Ran `npm i` to regenerate `npm-lock.yaml`.
- **Prevention**: CI runs `npm i --frozen-lockfile` which catches lockfile drift.
- **Verification**: `npm i --frozen-lockfile` succeeds locally.
