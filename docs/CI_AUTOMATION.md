# CI Automation Overview

## Workflow roles
- `fast-gate.yml`: runs lint + type-check + secret scan quickly.
- `full-gate.yml`: runs tests + build.
- `autofix.yml`: reacts to failed gate runs and creates/updates autofix PRs using NSCALE/DeepSeek.
- `oracle.yml`: safety gate for `autofix` PRs.
- `automerge-autofix.yml`: enables auto-merge when Oracle and required checks pass.
- `branch-maintenance.yml`: schedules repair PR creation for existing remote branches.
- `check-pinned-actions.yml`: enforces full-SHA action pinning.

## Required checks (recommended)
- `fast-gate / fast`
- `full-gate / full`
- `check-pinned-actions / pinned`
- `Oracle (autofix safety gate) / oracle` for autofix PRs

## Troubleshooting
- CI logs are expected in artifact `ci-logs`.
- Failure classification summary is written to `logs/error-summary.json` by `scripts/ci-classify-failure.js`.
- Guard failures:
  - Forbidden path edits: `scripts/forbidden-path-guard.mjs`
  - Secret leaks: `scripts/ci-secret-guard.js`
