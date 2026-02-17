# Contributing to OpenCarBox

## Branch Strategy

| Branch pattern | Purpose |
|----------------|---------|
| `main` | Protected production branch |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Tooling, docs, maintenance |

## Getting Started

```bash
git clone <repo-url>
cd opencarbox
pnpm install
cp .env.example .env.local   # Fill in your values
pnpm dev                      # http://localhost:3000
```

## Before Opening a PR

Run the quality gate locally:

```bash
pnpm lint        # ESLint
pnpm typecheck   # TypeScript strict check
pnpm test        # Vitest
pnpm build       # Next.js production build
pnpm secret:scan # Ensure no secrets leaked
```

## Commit Messages

Use conventional commit style:

- `feat: add product search`
- `fix: correct cart total calculation`
- `chore: update CI workflow`
- `docs: update runbook`
- `deps: bump next to 14.2.x`

## Pull Request Checklist

See `.github/PULL_REQUEST_TEMPLATE.md` for the full checklist. Key points:

- [ ] Tests added/updated for behavior changes
- [ ] All quality gate checks pass
- [ ] Documentation updated if needed
- [ ] No secrets in code, logs, or docs
- [ ] Migrations included if DB schema changed

## AI Provider Policy

**Only DeepSeek + NSCALE** are allowed. No OpenAI dependencies.
See `tools/guard_no_openai.sh` for the enforced policy.

## Code Style

- TypeScript strict mode — no `any`, no implicit null.
- Tailwind CSS only — no inline styles.
- `@/` path aliases for imports (`@/lib/utils`, `@/components/ui`).
- German UI text, English code.
