# Contributing to OpenCarBox & Carvantooo

Thank you for your interest in contributing!

## Getting Started

```bash
# Clone the repository
git clone https://github.com/NeXifyAI-cloud/opencarbox.git
cd opencarbox

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Development Workflow

1. Create a feature branch from `main`: `git checkout -b feature/my-feature`
2. Make your changes
3. Run quality checks:
   ```bash
   pnpm lint        # ESLint
   pnpm typecheck   # TypeScript
   pnpm test        # Unit tests
   pnpm build       # Production build
   ```
4. Commit with a descriptive message
5. Open a Pull Request against `main`

## Code Standards

- **TypeScript strict mode** — no `any`, no implicit null
- **Tailwind CSS only** — no inline styles, use design tokens
- **Path aliases** — use `@/` imports (e.g., `import { x } from '@/lib/utils'`)
- **Formatting** — Prettier (semi-false, single quotes, width 100)
- **AI Policy** — only DeepSeek + NSCALE providers allowed; `OPENAI_*` is forbidden
- **8px Grid** — all spacing in 8px increments

## Branch Naming

- `feature/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance tasks

## Pull Request Guidelines

- PRs require CI to pass (lint + typecheck + test + build)
- PRs require at least one code review approval
- Keep changes focused and small
- Update documentation (`NOTES/`, `docs/`, `README`) if needed
- Complete the Definition of Done checklist in the PR template
- See `NOTES/runbook.md` for the Branch Protection Contract

## Adding Environment Variables

1. Add the variable with a placeholder value to `.env.example`
2. Update `tools/check_env_schema.ts` if the variable is required at build time
3. Set the variable in Vercel (Preview + Production) and CI secrets as needed
4. Document in `NOTES/runbook.md` under the appropriate section

## Security

- Never commit secrets, API keys, or tokens
- Run `pnpm secret:scan` before committing
- `OPENAI_*` environment variables are explicitly forbidden
- Report security issues via [SECURITY.md](./SECURITY.md)
