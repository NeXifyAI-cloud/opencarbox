# Target State

> Last updated: 2026-02-17

## How OpenCarBox is Started

### Production (Vercel)
- Automatic deploy on merge to `main` via `auto-deploy.yml`
- Vercel builds Next.js in serverless mode (Frankfurt region)
- No server management required

### Staging (Vercel Preview)
- `deploy-staging.yml` triggers on push to `main` or manual dispatch
- Uses Vercel preview deployment
- Separate environment variables via GitHub Environments

### Local Development
- `npm dev` — standard Next.js dev server
- `docker compose up` — containerized development (optional)

## How it is Operated

- **Hosting**: Vercel (serverless, auto-scaling)
- **Database**: Supabase PostgreSQL (managed, connection pooling)
- **Auth**: Supabase Auth with RLS
- **Monitoring**: Sentry error tracking
- **Secrets**: GitHub Secrets + Vercel Environment Variables

## How it is Updated

1. Feature branch from `main` (e.g., `feature/new-search`)
2. PR triggers CI (`ci.yml`): lint → typecheck → test → build
3. PR triggers Security (`security.yml`): dependency audit + secret scan
4. Code review + approval
5. Merge to `main` → auto-deploy to production
6. Tagged releases (`v*`) → `release.yml` generates release notes

## How it is Monitored

- **Error tracking**: Sentry (`SENTRY_DSN`)
- **Build status**: GitHub Actions status badges
- **Dependency health**: npm audit in `security.yml` (weekly schedule)
- **Secret hygiene**: `secret:scan` in CI + Husky pre-commit

## Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `main` | Production-ready code | Protected: require PR, CI pass, reviews |
| `feature/*` | New features | PR to main |
| `fix/*` | Bug fixes | PR to main |
| `chore/*` | Maintenance | PR to main |

- Release tags: `v{major}.{minor}.{patch}` (SemVer)
- No `develop` branch — trunk-based development with short-lived feature branches

## Definition of Done

- [ ] Build green (`npm run build`)
- [ ] Tests green (`npm run test`)
- [ ] Lint green (`npm run lint`)
- [ ] Type check green (`npm run typecheck`)
- [ ] Security checks green (`npm run secret:scan`, `npm audit`)
- [ ] Quality gate passes (`npm run quality-gate`)
- [ ] No forbidden AI providers (`guard_no_openai.sh`)
- [ ] PR reviewed and approved
- [ ] Documentation updated if needed
