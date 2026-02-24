# Contributing to OpenCarBox & Carvantooo

Thank you for your interest in contributing!

## Getting Started

```bash
# Clone the repository
git clone https://github.com/NeXifyAI-cloud/opencarbox.git
cd opencarbox

# Install dependencies
npm install

# Start development server
npm dev
```

## Development Workflow

1. Create a feature branch from `main`: `git checkout -b feature/my-feature`
2. Make your changes
3. Run quality checks:
   ```bash
   npm run lint        # ESLint
   npm run typecheck   # TypeScript
   npm run test        # Unit tests
   npm run quality-gate # Full quality check
   ```
4. Commit with a descriptive message
5. Open a Pull Request against `main`

## Code Standards

- **TypeScript strict mode** — no `any`, no implicit null
- **Tailwind CSS only** — no inline styles, use design tokens
- **Path aliases** — use `@/` imports (e.g., `import { x } from '@/lib/utils'`)
- **Formatting** — Prettier (semi-false, single quotes, width 100)
- **AI Policy** — only DeepSeek + NSCALE providers allowed

## Branch Naming

- `feature/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance tasks

## Pull Request Guidelines

- PRs require CI to pass (lint + typecheck + test + build)
- PRs require code review approval
- Keep changes focused and small
- Update documentation if needed

## Security

- Never commit secrets, API keys, or tokens
- Run `npm run secret:scan` before committing
- Report security issues via [SECURITY.md](./SECURITY.md)
