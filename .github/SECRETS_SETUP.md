# GitHub Secrets Setup

Gehe zu: `Settings → Secrets and variables → Actions`.

## Required AI runtime secrets (DeepSeek + NSCALE only)

```bash
DEEPSEEK_API_KEY
DEEPSEEK_BASE_URL          # optional
NSCALE_API_KEY
NSCALE_HEADER_NAME         # optional, default: X-NSCALE-API-KEY
AI_PROVIDER                # must be: deepseek
```

> ⚠️ Kein `OPENAI_*` Secret anlegen. Es gibt bewusst keinen OpenAI-Fallback.

## Optional repository-operations secret

```bash
GH_PAT                     # classic PAT with repo + workflow, for admin-like automation
```

## Supabase / App secrets (project-specific)

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

## Optional Vercel secrets

```bash
VERCEL_TOKEN
VERCEL_PROJECT_ID
VERCEL_ORG_ID
```

## CLI setup example

```bash
chmod +x scripts/set-deployment-secrets.sh
GITHUB_OWNER=NeXify-Chat-it-Automate-it \
REPO_NAME=OpenCarBox \
GH_TOKEN=... \
NEXT_PUBLIC_SUPABASE_URL=... \
NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
SUPABASE_SERVICE_ROLE_KEY=... \
DEEPSEEK_API_KEY=... \
NSCALE_API_KEY=... \
AI_PROVIDER=deepseek \
./scripts/set-deployment-secrets.sh
```
