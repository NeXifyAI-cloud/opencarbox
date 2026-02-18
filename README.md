# OpenCarBox Platform

Next.js App Router project with Supabase-backed auth/data and AI provider integration groundwork.

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## System start with Supabase Access Token

Use the startup wrapper to normalize legacy token names and boot the app:

```bash
pnpm system:check   # validates token/env mapping without starting dev server
pnpm system:start   # starts Next.js dev server
```

`tools/export_env.sh` now maps `SUPABASE_TOKEN` and `supabase_access_token` to `SUPABASE_ACCESS_TOKEN` automatically.

## Required environment variables

See `.env.example` for the full list. Core values:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### AI Provider Configuration

The platform supports multiple AI providers with automatic fallback:

**Primary Provider (GitHub Models - Recommended):**
- `GITHUB_TOKEN` - GitHub personal access token (automatically available in GitHub Actions)
- `AI_PROVIDER` - Set to `github-models` (default)

**Fallback Provider (DeepSeek):**
- `DEEPSEEK_API_KEY` - DeepSeek API key
- `NSCALE_API_KEY` - NScale API key (if using NScale)
- `DEEPSEEK_BASE_URL` - DeepSeek API base URL (optional)
- `NSCALE_HEADER_NAME` - Custom header name for NScale (optional)

**Configuration:**
- `AI_AUTO_SELECT` - Enable automatic provider fallback (default: `true`)

📖 **See [GitHub Models Setup Guide](docs/github-models-setup.md) for detailed setup instructions.**
📖 **See [AI Provider System Documentation](docs/ai-provider-system.md) for complete documentation.**
📖 **See [Continuous AI overview](docs/continuous-ai.md) for collaboration-focused automation concepts.**

📖 **German guide:** [KI-GitHub-Aktion](docs/ai-github-action-de.md).

## Local development checks

```bash
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm build
```

## Supabase notes

- SQL migrations are tracked in `supabase/migrations/`.
- Use Supabase SQL editor or CLI to apply migrations in order.
- Row Level Security policies must restrict user tables to `auth.uid()`.

## CI/CD

Workflows:
- `.github/workflows/ci.yml`: lint, typecheck, test, build.
- `.github/workflows/security.yml`: dependency audit.
- `.github/workflows/auto-reply.yml`: AI-powered automatic responses for Issues, PRs, and comments.
- `.github/workflows/auto-improve.yml`: AI-powered quality suggestions.
- `.github/workflows/conflict-resolver.yml`: AI-powered merge conflict resolution.
- `.github/workflows/failure-orchestrator.yml`: Intelligent workflow failure handling and routing.

All AI workflows support:
- **GitHub Models** (primary) - Powered by Azure OpenAI via GitHub
- **DeepSeek** (fallback) - Cost-effective alternative
- **Automatic fallback** - Seamless provider switching on failure

Configure via repository secrets and variables. See [AI Provider Documentation](docs/ai-provider-system.md).

## Branch protection (recommended)

Enable these repository rules for `main`:
1. Require pull request before merge.
2. Require at least one approving review.
3. Require status checks to pass (`CI`, `Security`).
4. Block direct pushes to `main`.

## Project notes

- Architecture decisions and ADRs: `NOTES/brain.md`.
- Backlog and milestones: `NOTES/backlog.md`.
- Operations runbook: `NOTES/runbook.md`.

## Autonomous problem solver

Run the autonomous reliability workflow:

```bash
npm run autofix:problems
```

The workflow:
1. Executes lint/typecheck/test/build
2. Uses AI (GitHub Models or DeepSeek) for iterative remediation
3. Applies allowlisted fixes automatically
4. Stores run report at `.cline/autonomous-problem-report.json`

**AI Provider:** Automatically selects between GitHub Models (primary) and DeepSeek (fallback) based on availability and configuration.
