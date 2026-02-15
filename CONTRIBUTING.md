# Contributing

## GitHub Actions Policy

For security and reproducibility, every external GitHub Action in `.github/workflows/*.yml` must be pinned to a full commit SHA:

- ✅ Allowed: `uses: owner/repo@<40-char-sha> # vX.Y.Z`
- ❌ Not allowed: `uses: owner/repo@vX`, `@main`, `@master`

Keep a trailing comment with the intended semver tag (for example `# v6`) so updates remain readable.

## CI Policy (Fast Gate / Full Gate / Autofix)

- **Fast Gate (required):** secret scan, lint, type-check, smoke build, fail-fast.
- **Full Gate (required):** sharded tests + full build + performance budget.
- **Autofix loop:** runs only on failing gates, creates/updates a single `autofix/<sha>` PR, skips infra/network failures.
- **Auto-merge:** only for trusted PRs with `autofix` label and green required checks.
