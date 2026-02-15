# Contributing

## GitHub Actions Policy

For security and reproducibility, every external GitHub Action in `.github/workflows/*.yml` must be pinned to a full commit SHA:

- ✅ Allowed: `uses: owner/repo@<40-char-sha> # vX.Y.Z`
- ❌ Not allowed: `uses: owner/repo@vX`, `@main`, `@master`

Keep a trailing comment with the intended semver tag (for example `# v6`) so updates remain readable.
