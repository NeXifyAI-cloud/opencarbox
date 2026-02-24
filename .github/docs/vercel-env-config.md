# Vercel Environment Secrets Configuration
## OpenCarBox Production & Preview Deployments

**Repository:** `NeXifyAI-cloud/opencarbox`  
**Vercel Project:** opencarbox-prod  
**Date:** February 23, 2026  
**Environments:** Development, Preview, Production

---

## Executive Summary

This document outlines a strategy to migrate **sensitive secrets from GitHub to Vercel's native environment management**, reducing exposure and improving security through:

✅ **Environment Isolation** — Different secrets for production vs preview  
✅ **Automatic Secret Rotation** — Vercel handles key lifecycle  
✅ **Granular Access Control** — Team members can't see production secrets  
✅ **Audit Logging** — Track who deployed what, when  
✅ **Preview Deployment Protection** — Reduced secrets in non-prod environments  

---

## 1. Current State: GitHub Secrets (Before)

Currently, secrets are stored in GitHub and passed to Vercel during deployments:

```yaml
# .github/workflows/auto-deploy.yml (CURRENT - NOT IDEAL)
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Problems:**
- 🔴 Secrets visible to all GitHub team members
- 🔴 No audit trail of who accessed secrets
- 🔴 Secrets passed through GitHub Actions logs (risk of exposure)
- 🔴 Hard to rotate per environment
- 🔴 Preview deployments have same secrets as production

---

## 2. Target State: Vercel-Native Secrets (After)

Secrets stored directly in Vercel dashboard with per-environment control:

```plaintext
VERCEL DASHBOARD
├── Project: opencarbox-prod
│   ├── Settings → Environment Variables
│   │   ├── Preview (staging branch)
│   │   │   ├── DATABASE_URL (staging DB)
│   │   │   ├── SUPABASE_SERVICE_ROLE_KEY (staging Supabase)
│   │   │   └── ... other secrets
│   │   ├── Production (main branch)
│   │   │   ├── DATABASE_URL (prod DB)
│   │   │   ├── SUPABASE_SERVICE_ROLE_KEY (prod Supabase)
│   │   │   ├── STRIPE_SECRET_KEY (prod Stripe)
│   │   │   └── ... other secrets
│   │   └── Development (local/dev branch)
│   │       └── ... dev-specific secrets
```

**Benefits:**
- ✅ Secrets never leave Vercel
- ✅ Access control via Vercel team roles
- ✅ Automatic secrets management
- ✅ Better deployment audit trail
- ✅ Preview deployments use staging secrets automatically

---

## 3. Environment Structure

### 3.1 Environment Tiers

| Tier | Branch | Secrets | Auto-Deploy | Domain |
|------|--------|---------|------------|--------|
| **Production** | `main` | Full (all services) | Yes | opencarbox.com, carvantooo.com |
| **Staging** | `develop`, `staging` | Full (staging services) | Yes | staging.opencarbox.com, staging.carvantooo.com |
| **Preview** | `feature/*`, `fix/*` | Minimal (dev/test services) | Auto via PR | pr-{number}.opencarbox.com |
| **Development** | Local machine | Dev/mock services | Manual | localhost:3000 |

### 3.2 Environment Variables by Tier

#### **Production Secrets (main branch)**
```plaintext
# Database
DATABASE_URL = postgresql://user:pass@prod-db.supabase.co:5432/postgres
DIRECT_URL = postgresql://user:pass@direct.supabase.co:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL = https://prod-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <REDACTED_JWT>
SUPABASE_SERVICE_ROLE_KEY = <REDACTED_JWT>
SUPABASE_ACCESS_TOKEN = <REDACTED_TOKEN>

# Stripe (Production Account)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_prod...
STRIPE_SECRET_KEY = sk_live_prod...
STRIPE_WEBHOOK_SECRET = whsec_live_prod...

# Third-party APIs (Production)
DEEPSEEK_API_KEY = sk-prod-deepseek...
NSCALE_API_KEY = nscale-prod-key...
JULIUS_API_KEY = julius-prod-key...
MEILISEARCH_API_KEY = meili-prod-key...
TECDOC_API_KEY = tecdoc-prod-key...
TWILIO_AUTH_TOKEN = twilio-prod-token...
RESEND_API_KEY = resend-prod-key...
SENTRY_DSN = https://prod@sentry.io/...

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES = true
NEXT_PUBLIC_ENABLE_BETA_UI = false
```

#### **Staging Secrets (develop/staging branch)**
```plaintext
# Database (Staging)
DATABASE_URL = postgresql://user:pass@staging-db.supabase.co:5432/postgres
DIRECT_URL = postgresql://user:pass@staging-direct.supabase.co:5432/postgres

# Supabase (Staging)
NEXT_PUBLIC_SUPABASE_URL = https://staging-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <REDACTED_JWT>
SUPABASE_SERVICE_ROLE_KEY = <REDACTED_JWT>

# Stripe (Staging/Test Account)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_staging...
STRIPE_SECRET_KEY = sk_test_staging...
STRIPE_WEBHOOK_SECRET = whsec_test_staging...

# Third-party APIs (Staging/Test)
DEEPSEEK_API_KEY = sk-staging-deepseek...
NSCALE_API_KEY = nscale-staging-key...
JULIUS_API_KEY = julius-staging-key...
MEILISEARCH_API_KEY = meili-staging-key...

# Feature Flags (Testing)
NEXT_PUBLIC_ENABLE_AI_FEATURES = true
NEXT_PUBLIC_ENABLE_BETA_UI = true
```

#### **Preview Secrets (PR feature branches)**
```plaintext
# Database (Shared Preview/Test)
DATABASE_URL = postgresql://user:pass@preview-db.supabase.co:5432/postgres

# Supabase (Shared Preview)
NEXT_PUBLIC_SUPABASE_URL = https://preview-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <REDACTED_JWT>
SUPABASE_SERVICE_ROLE_KEY = <REDACTED_JWT>

# Stripe (Always Test Account)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_preview...
STRIPE_SECRET_KEY = sk_test_preview...

# Feature Flags (All Features Enabled for Testing)
NEXT_PUBLIC_ENABLE_AI_FEATURES = true
NEXT_PUBLIC_ENABLE_BETA_UI = true
NEXT_PUBLIC_ENABLE_DEBUG_UI = true
```

---

## 4. Migration Plan: GitHub → Vercel

### Phase 1: Preparation (Week 1)
**Goal:** Audit current secrets and plan migration

```bash
# Step 1: List all GitHub secrets
curl -s \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/NeXifyAI-cloud/opencarbox/actions/secrets \
  | jq '.secrets[].name'

# Step 2: Create Vercel project structure
# (if not already done)
vercel link --project opencarbox-prod --org NeXifyAI

# Step 3: Document secret sources
# Create file: .github/SECRETS_MIGRATION.md
```

### Phase 2: Setup Vercel Environments (Week 1)
**Goal:** Configure environment variables in Vercel dashboard

1. **Log in to Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select project: **opencarbox-prod**

2. **Configure Production Environment**
   - Settings → Environment Variables
   - Filter: Production
   - Add all production secrets (see section 3.2)

3. **Configure Staging Environment**
   - Settings → Environment Variables
   - Filter: Staging (or create new)
   - Add staging secrets

4. **Configure Preview Environment**
   - Settings → Environment Variables
   - Filter: Preview
   - Add preview/test secrets

5. **Verify Environment Isolation**
   - Vercel automatically separates secrets by branch/environment

### Phase 3: Update GitHub Workflows (Week 2)
**Goal:** Remove secret dependencies from GitHub, rely on Vercel

```yaml
# BEFORE (.github/workflows/auto-deploy.yml)
- name: Deploy to Vercel
  run: |
    vercel deploy \
      --token ${{ secrets.VERCEL_TOKEN }} \
      --org-id ${{ secrets.VERCEL_ORG_ID }} \
      --project-id ${{ secrets.VERCEL_PROJECT_ID }}
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

# AFTER (.github/workflows/auto-deploy.yml)
- name: Deploy to Vercel
  run: |
    vercel deploy \
      --token ${{ secrets.VERCEL_TOKEN }} \
      --org-id ${{ vars.VERCEL_ORG_ID }} \
      --project-id ${{ vars.VERCEL_PROJECT_ID }}
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
    # Note: ORG_ID and PROJECT_ID are public (use vars., not secrets.)
    VERCEL_ORG_ID: ${{ vars.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ vars.VERCEL_PROJECT_ID }}
```

### Phase 4: Remove GitHub Secrets (Week 3)
**Goal:** Clean up GitHub secrets after verification

```bash
# Only after successful Vercel deployments:
curl -X DELETE \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/NeXifyAI-cloud/opencarbox/actions/secrets/DATABASE_URL

# Remove these from GitHub:
# - DATABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY
# - DEEPSEEK_API_KEY
# - NSCALE_API_KEY
# - JULES_API_KEY
# - MEILISEARCH_API_KEY
# - ... etc

# Keep only Vercel-specific secrets in GitHub:
# - VERCEL_TOKEN (needed for deployments)
# - VERCEL_ORG_ID (can move to vars. if public)
# - VERCEL_PROJECT_ID (can move to vars. if public)
```

---

## 5. Deploy Hooks Configuration

### 5.1 Automatic Deployment on Git Push

**Setup in Vercel Dashboard:**

1. **Settings → Git**
   - **Production Branch:** `main`
   - **Preview Branches:** `develop`, `staging`, `feature/*`
   - **Ignore Build Step:** Leave empty (use vercel.json instead)

2. **Settings → Build & Development Settings**
   ```plaintext
   Framework: Next.js
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **vercel.json** (in repository root)
   ```json
   {
     "buildCommand": "pnpm build",
     "devCommand": "pnpm dev",
     "installCommand": "pnpm install",
     "env": {
       "NEXT_PUBLIC_APP_NAME": "@link /project/settings/environment-variables"
     },
     "git": {
       "deploymentEnabled": {
         "main": true,
         "develop": true,
         "staging": true,
         "feature": true
       }
    }
   }
   ```

### 5.2 Manual Deployment Webhook

For CI/CD systems that need to trigger deployments:

```bash
# Trigger production deployment
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"main"}' \
  https://api.vercel.com/v1/deployments?teamId=TEAM_ID&projectId=PROJECT_ID&token=VERCEL_TOKEN

# Trigger staging deployment
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"develop"}' \
  https://api.vercel.com/v1/deployments?teamId=TEAM_ID&projectId=PROJECT_ID&token=VERCEL_TOKEN
```

### 5.3 Post-Deployment Hooks

Configure webhooks in Vercel to notify external systems:

**Settings → Integrations → Webhooks**

```json
{
  "url": "https://your-domain.com/api/webhooks/vercel",
  "events": [
    "deployment.created",
    "deployment.succeeded",
    "deployment.failed",
    "deployment.canceled"
  ]
}
```

Example webhook handler:

```typescript
// pages/api/webhooks/vercel.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, deployment } = req.body;

  console.log(`Deployment ${type}:`, {
    url: deployment.url,
    environment: deployment.environment,
    state: deployment.state,
  });

  // Handle deployment events
  switch (type) {
    case 'deployment.succeeded':
      // Notify Slack
      await notifySlack(`✅ Production deployed to ${deployment.url}`);
      // Run smoke tests
      await runSmokeTests(deployment.url);
      break;

    case 'deployment.failed':
      // Alert team
      await notifySlack(`❌ Deployment failed: ${deployment.url}`);
      break;
  }

  res.status(200).json({ received: true });
}
```

---

## 6. Preview Deployments with Reduced Secrets

### 6.1 Preview Environment Protection

**Vercel Dashboard → Settings → Preview Deployments**

```plaintext
☑ Require approval for production-like environment variables
  - Any secret matching `PROD_*` or `SECRET_*` requires manual approval

☐ Show environment variables in preview deployment logs
  - Secrets are always masked in logs (automatic)

☑ Enable preview comments on GitHub PRs
  - Show deployment URLs in PR comments
```

### 6.2 Branching Strategy for Secrets

```plaintext
main (Production)
├─ STRIPE_SECRET_KEY = sk_live_prod...
├─ DATABASE_URL = prod_db...
└─ All PROD_* variables

develop (Staging)
├─ STRIPE_SECRET_KEY = sk_test_staging...
├─ DATABASE_URL = staging_db...
└─ All TEST_* variables

feature/my-feature (Preview)
├─ STRIPE_SECRET_KEY = sk_test_preview...
├─ DATABASE_URL = preview_db...
└─ Debug variables enabled
```

### 6.3 Automatic Preview Cleanup

```bash
# Delete preview deployments after PR close
# Vercel Dashboard → Settings → Preview Deployments
# ☑ Destroy preview deployment when PR is closed
```

---

## 7. Production-Only Secrets

### 7.1 High-Risk Secrets (Production Only)

These should **ONLY** be available in production environment:

```plaintext
STRIPE_WEBHOOK_SECRET (sk_live_...) - PRODUCTION ONLY
STRIPE_SECRET_KEY (sk_live_...) - PRODUCTION ONLY
DEEPSEEK_API_KEY (real key) - PRODUCTION ONLY
DATABASE_URL (prod connection) - PRODUCTION ONLY
SUPABASE_SERVICE_ROLE_KEY (prod) - PRODUCTION ONLY
SENTRY_AUTH_TOKEN - PRODUCTION ONLY
RESEND_API_KEY (real account) - PRODUCTION ONLY
```

### 7.2 Restricting Access

**Vercel Dashboard → Settings → Access Control**

```plaintext
Production Environment:
├─ Only: Admins can see production secrets
├─ Team members: Can deploy, but cannot view secrets
└─ Deployments: Logged and audited

Preview Environments:
├─ All team members: Can view/modify
└─ Secrets: Test/staging credentials only
```

---

## 8. Monitoring & Alerting

### 8.1 Deployment Alerts

Configure Slack integration:

```bash
# Vercel Dashboard → Integrations → Slack
# Connect workspace and enable notifications for:
# - Deployment succeeded
# - Deployment failed
# - Production deployments (always notify)
```

### 8.2 Secret Access Audit

```bash
# Via Vercel CLI:
vercel env list --environment=production

# Output:
# Environment: Production
# DATABASE_URL: ••••••••••••••••••
# STRIPE_SECRET_KEY: ••••••••••••••••••
# ... (list masked for security)
```

### 8.3 Secret Rotation Alerts

Create reminder in calendar:

```plaintext
Quarterly (every 90 days):
- Rotate STRIPE_SECRET_KEY
- Rotate DEEPSEEK_API_KEY
- Rotate NSCALE_API_KEY
- Rotate JULES_API_KEY

Annually (every 365 days):
- Rotate DATABASE_URL (change password)
- Rotate SUPABASE_SERVICE_ROLE_KEY (if possible)
- Rotate SENTRY_AUTH_TOKEN

On Suspected Compromise:
- Immediately rotate ALL secrets
- Check audit logs for unauthorized deployments
- Notify security team
```

---

## 9. Implementation Checklist

### Week 1: Preparation & Setup
- [ ] Audit all GitHub secrets
- [ ] Create Vercel environment variable schema (section 3.2)
- [ ] Set up Vercel project with environments
- [ ] Test environment isolation
- [ ] Document secret sources and rotation schedules

### Week 2: Migration
- [ ] Add all production secrets to Vercel
- [ ] Add all staging secrets to Vercel
- [ ] Add preview secrets to Vercel
- [ ] Update `.github/workflows/auto-deploy.yml`
- [ ] Update `.github/workflows/deploy-preview.yml`
- [ ] Test deployments to staging

### Week 3: Cutover
- [ ] Test production deployment from Vercel secrets
- [ ] Verify no fallback to GitHub secrets
- [ ] Remove secrets from GitHub Actions
- [ ] Update documentation
- [ ] Train team on new process

### Week 4: Verification & Cleanup
- [ ] Monitor deployments for 1 week
- [ ] Verify audit logs are working
- [ ] Set up secret rotation reminders
- [ ] Archive migration documentation
- [ ] Close GitHub issues

---

## 10. Troubleshooting

### Problem: Preview deployment fails with "secret not found"
**Solution:** Ensure preview environment variables are set in Vercel dashboard (not just production)

### Problem: Secrets appear in build logs
**Solution:** Vercel auto-masks secrets in logs; if visible, check that variable names match exactly

### Problem: Production and preview using same secrets
**Solution:** Ensure each environment has unique secrets in Vercel dashboard; check branch filters

### Problem: Need to update secret urgently
**Solution:**
```bash
# Via Vercel CLI:
vercel env add SECRET_NAME
# (Interactive prompt to enter new value)

# Verify in dashboard:
# Settings → Environment Variables → [Select Environment]
```

---

## 11. Documentation Template

Create `.github/VERCEL_ENV_GUIDE.md`:

```markdown
# Vercel Environment Configuration Guide

## Quick Reference

| Env | Branch | Database | Stripe | AI Models |
|-----|--------|----------|--------|-----------|
| Production | main | prod | live | Real |
| Staging | develop | staging | test | Real (Staging) |
| Preview | feature/* | preview | test | Test |

## Accessing Secrets

1. **View environment variables:**
   ```bash
   vercel env list --environment=production
   ```

2. **Add new secret:**
   ```bash
   vercel env add SECRET_NAME
   ```

3. **Remove secret:**
   ```bash
   # Via Vercel Dashboard only
   ```

## Deploying

```bash
# Deploy to production
git push origin main

# Deploy to staging
git push origin develop

# Deploy preview (automatic on PR)
git push origin feature/my-feature
```

## Need Help?

- Check deployment logs: Vercel Dashboard → Deployments
- Verify secrets: Vercel Dashboard → Settings → Environment Variables
- Check Git integration: Vercel Dashboard → Settings → Git
```

---

## 12. Security Best Practices

✅ **DO:**
- Store all sensitive keys in Vercel, not GitHub
- Use environment-specific secrets
- Rotate secrets quarterly
- Enable two-factor auth on Vercel account
- Audit deployment logs regularly
- Test deployments in staging before production

❌ **DON'T:**
- Share Vercel access tokens with anyone
- Commit `.env.local` or `.env.production.local`
- Use same secrets across environments
- Store API keys in git history
- Deploy without testing in staging first
- Leave preview secrets on after PR closes

---

## Summary

By migrating secrets to Vercel:
- ✅ Secrets never stored in GitHub
- ✅ Per-environment secret management
- ✅ Automatic preview deployment with test secrets
- ✅ Better audit trails
- ✅ Easier secret rotation
- ✅ Compliance with security best practices

**Target Completion:** End of Q1 2026  
**Owner:** DevOps Team  
**Review Cadence:** Quarterly
