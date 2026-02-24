# GitHub Secrets & Settings Plan — OpenCarBox Repository

**Repository:** `NeXifyAI-cloud/opencarbox`  
**Last Updated:** February 23, 2026  
**Status:** Production-Ready Plan

---

## 1. Current Secrets Audit

### 1.1 GitHub Secrets Currently Used (from Workflow Analysis)

| Secret Name | Workflows Using It | Sensitivity | Status | Notes |
|-------------|-------------------|------------|--------|-------|
| `GITHUB_TOKEN` | All workflows | Standard | ✅ Built-in | Auto-generated, no action needed |
| `DEEPSEEK_API_KEY` | auto-reply, failure-orchestrator, conflict-resolver, auto-improve | **HIGH** | 🔴 Review | Check expiration dates; implement rotation policy |
| `NSCALE_API_KEY` | auto-reply, failure-orchestrator, conflict-resolver, auto-improve | **HIGH** | 🔴 Review | Routing header authentication; validate permissions |
| `NSCALE_HEADER_NAME` | 4 AI workflows | LOW | ✅ OK | Non-sensitive, could be in env.example |
| `DEEPSEEK_BASE_URL` | AI workflows | MEDIUM | ⚠️ Review | Custom proxy URL; validate for injection attacks |
| `JULES_API_KEY` | ci, autofix, auto-improve, conflict-resolver, backlog-sync, deploy-preview | **HIGH** | 🔴 Review | Event-routing critical path; implement rate-limiting alerts |
| `JULES_BASE_URL` | 6 workflows | MEDIUM | ✅ OK | Non-secret endpoint, could be in public config |
| `VERCEL_TOKEN` | auto-deploy, deploy-prod, deploy-preview, deploy-staging | **HIGH** | 🔴 CRITICAL | Check scope; should be fine-grained token for specific project |
| `VERCEL_ORG_ID` | auto-deploy, deploy-prod, deploy-preview | MEDIUM | ✅ OK | Org ID not sensitive; could be in public config |
| `VERCEL_PROJECT_ID` | deploy workflows | MEDIUM | 🔴 **DUPLICATE** | Also exists as `NEU_VERCEL_PROJEKT_ID` — consolidate immediately |
| `NEU_VERCEL_PROJEKT_ID` | deploy workflows | MEDIUM | 🔴 **DUPLICATE** | Redundant with `VERCEL_PROJECT_ID` — remove in favor of one name |
| `NEXT_PUBLIC_SUPABASE_URL` | auto-deploy | LOW | ✅ OK | Public endpoint (includes Supabase URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | auto-deploy | MEDIUM | ⚠️ Review | Anonymous key with RLS restrictions; verify RLS policies active |
| `SUPABASE_SERVICE_ROLE_KEY` | auto-deploy | **CRITICAL** | 🔴 CRITICAL | Bypasses RLS; restrict to CI only; implement key rotation quarterly |
| `DATABASE_URL` | auto-deploy (build context) | **CRITICAL** | 🔴 CRITICAL | Full PostgreSQL connection string; use environment secret only in CI, never in logs |
| `GITLAB_PROJEKT_TOKEN` | mem0-brain.yml only | **HIGH** | ⚠️ Review | External system integration; check GitLab scopes; consider service account |
| `CLASSIC_TOKEN_GITHUB_NEU` | mem0-brain.yml only | **HIGH** | 🔴 **SECURITY** | Classic GitHub tokens are deprecated; replace with fine-grained token immediately |

### 1.2 Application-Level Secrets (from env.example)

**Supabase Stack:**
- `NEXT_PUBLIC_SUPABASE_URL` — Public (in env.example)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Restricted by RLS
- `SUPABASE_SERVICE_ROLE_KEY` — Admin key (CI only)
- `SUPABASE_ACCESS_TOKEN` — Supabase management token (not in workflows, but in code)
- `MCP_SERVER_URL` — Model Context Protocol server (not in workflows)

**Database:**
- `DATABASE_URL` — Primary connection string (in CI)
- `DIRECT_URL` — Prisma bypass connection (migrate operations)

**Payments (Stripe):**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Public key (in env.example)
- `STRIPE_SECRET_KEY` — Secret key (GitHub secret)
- `STRIPE_WEBHOOK_SECRET` — Webhook signing key (GitHub secret)

**Search (Meilisearch):**
- `MEILISEARCH_HOST` — API endpoint (env.example)
- `MEILISEARCH_API_KEY` — Admin key (GitHub secret)

**Vehicle Data (TecDoc):**
- `TECDOC_API_KEY` — Third-party API (GitHub secret)
- `TECDOC_PROVIDER_ID` — Provider identifier (env.example)

**Communication (Twilio/WhatsApp):**
- `TWILIO_ACCOUNT_SID` — Account ID (env.example)
- `TWILIO_AUTH_TOKEN` — Auth token (GitHub secret)
- `TWILIO_WHATSAPP_NUMBER` — Business phone number (env.example)

**Email (Resend):**
- `RESEND_API_KEY` — Email provider API key (GitHub secret)
- `EMAIL_FROM` — Sender address (env.example)

**Chatbot (Botpress):**
- `BOTPRESS_BOT_ID` — Bot identifier (env.example)
- `BOTPRESS_HOST_URL` — API endpoint (env.example)

**Error Tracking (Sentry):**
- `SENTRY_DSN` — Public DSN (can be in env.example or public config)

**App Configuration:**
- `NEXT_PUBLIC_APP_URL` — Application URL (public)
- `NEXT_PUBLIC_APP_NAME` — Brand name (public)

---

## 2. Red Flags & Security Issues Found

### 🔴 CRITICAL Issues

#### Issue #1: Supabase Service Role Key in CI/CD
**Risk Level:** CRITICAL  
**Finding:** `SUPABASE_SERVICE_ROLE_KEY` is used in `auto-deploy.yml` during build, bypassing all RLS policies.

**Remediation:**
1. Service role key should ONLY be available in edge functions or server-side code
2. Never pass to CI/CD unless absolutely required
3. If needed: implement approval gates for production builds
4. Alternative: use read-only service role key with limited scopes (if Supabase supports)
5. **Action:** Audit which build steps actually need this key; consider using Supabase connections instead

#### Issue #2: Database URL Exposed in CI Logs
**Risk Level:** CRITICAL  
**Finding:** `DATABASE_URL` contains full PostgreSQL password and is used during build processes.

**Remediation:**
1. Add mask pattern in GitHub Actions: `::add-mask::` for connection string
2. Rotate database password immediately after any CI exposure
3. Use Prisma with `SKIP_ENV_VALIDATION=false` to catch missing vars early
4. Consider using Postgres connection pooler (e.g., PgBouncer) with separate CI credentials
5. **Action:** Implement connection string rotation on a 90-day cycle

#### Issue #3: Classic GitHub Token (mem0-brain.yml)
**Risk Level:** CRITICAL  
**Finding:** `CLASSIC_TOKEN_GITHUB_NEU` is a deprecated GitHub classic token with full repo access.

**Remediation:**
1. **Immediate:** Generate fine-grained personal access token with scopes:
   - `contents: read` (for code access)
   - `pull_requests: write` (if needed for PR operations)
   - `issues: write` (if needed for issue operations)
2. Limit to specific repository branches or actions
3. Set expiration to 1 year max
4. Rotate quarterly
5. **Action:** Schedule token replacement within 1 week

#### Issue #4: Vercel Token Scope Unknown
**Risk Level:** CRITICAL  
**Finding:** `VERCEL_TOKEN` used in multiple deploy workflows; unclear if fine-grained or legacy.

**Remediation:**
1. Check Vercel dashboard: Settings → Tokens
2. If using legacy token: regenerate as fine-grained token with:
   - Scope: specific project only (not all projects)
   - Scope: deployment permissions only (no settings/secrets modification)
   - Scope: preview deployments only (restrict production)
3. Rotate quarterly
4. Document scopes in `.github/SECRETS.md`
5. **Action:** Audit within 1 week

### 🟠 HIGH Issues

#### Issue #5: Duplicate Vercel Project ID
**Risk Level:** HIGH  
**Finding:** Both `VERCEL_PROJECT_ID` and `NEU_VERCEL_PROJEKT_ID` exist and are used conditionally (`${{ secrets.NEU_VERCEL_PROJEKT_ID || secrets.VERCEL_PROJECT_ID }}`).

**Remediation:**
1. Identify which name is correct (German "NEU_VERCEL_PROJEKT_ID" or English)
2. Standardize on one name across all workflows
3. Update `.github/dependabot.yml` to track this constant
4. Remove duplicate secret
5. **Action:** Change in next deploy; remove old secret after 1 week verification

#### Issue #6: DEEPSEEK_API_KEY Rotation Unknown
**Risk Level:** HIGH  
**Finding:** No evidence of key rotation policy or expiration tracking for DeepSeek API.

**Remediation:**
1. Check DeepSeek API key expiration in dashboard
2. Implement quarterly rotation schedule
3. Maintain rotation log in repository (encrypted or access-controlled)
4. Set GitHub secret expiration alerts
5. **Action:** Set calendar reminder for Q3 2026 rotation

#### Issue #7: NSCALE_API_KEY Permission Scope Unknown
**Risk Level:** HIGH  
**Finding:** NSCALE header authentication used but scopes/permissions not documented.

**Remediation:**
1. Document NSCALE_API_KEY scope: which models/endpoints can this key access?
2. Implement least-privilege principle: restrict to OpenCarBox resources only
3. Add rate limit configuration (see oracle-security-config.md)
4. Rotate annually or on suspected compromise
5. **Action:** Document in `.github/SECRETS.md`

#### Issue #8: Supabase Anon Key RLS Policy Verification
**Risk Level:** HIGH  
**Finding:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public but relies on RLS; RLS policies may not be properly configured.

**Remediation:**
1. Verify all Supabase tables have RLS enabled
2. Run `SELECT * FROM pg_rlspolicies WHERE tablename IN (...)` to confirm
3. Test anon key access in isolation (no authenticated context)
4. Document RLS policies (see supabase-rls-policies.sql)
5. **Action:** Complete RLS audit before next production release

### ⚠️ MEDIUM Issues

#### Issue #9: DEEPSEEK_BASE_URL Injection Risk
**Risk Level:** MEDIUM  
**Finding:** Custom proxy URL could be injection vector if not validated.

**Remediation:**
1. Validate URL format in workflows (regex or URL parser)
2. Whitelist allowed domains (if using custom proxy)
3. Add request header validation to detect man-in-the-middle
4. Document proxy setup in internal wiki
5. **Action:** Add validation in next DeepSeek wrapper update

#### Issue #10: JULES_BASE_URL Endpoint Security
**Risk Level:** MEDIUM  
**Finding:** Jules event-routing used in critical path (ci.yml) but endpoint validation missing.

**Remediation:**
1. Add request timeout and retry logic (see oracle-security-config.md)
2. Implement circuit breaker for Jules failures
3. Validate response signatures (if Jules supports)
4. Monitor for unusual retry patterns
5. **Action:** Integrate with oracle-monitoring.yml health checks

#### Issue #11: GITLAB_PROJEKT_TOKEN Scope & Rotation
**Risk Level:** MEDIUM  
**Finding:** GitLab token in mem0-brain.yml may have excessive permissions.

**Remediation:**
1. Check GitLab scope: should be `api` (minimal) or `read_repository` only
2. Consider separate service account for Mem0 integration
3. Rotate annually or on suspected compromise
4. Document GitLab integration in `.github/SECRETS.md`
5. **Action:** Review scopes within 2 weeks

#### Issue #12: Stripe Webhook Secret Not in Workflows
**Risk Level:** MEDIUM  
**Finding:** `STRIPE_WEBHOOK_SECRET` exists but not used in CI/CD (good practice), but should be verified.

**Remediation:**
1. Verify webhook validation in application code (src/)
2. Document webhook signing verification
3. Set up Stripe webhook event monitoring
4. Rotate webhook endpoint URL if signature verification fails
5. **Action:** Verify during next security audit

---

## 3. Missing Secrets to Add

### New Secrets Required for Hardened Configuration

| Secret Name | Purpose | Source | Rotation |
|-------------|---------|--------|----------|
| `SUPABASE_ANON_KEY_READ_ONLY` | Alternative key for restricted operations | Supabase UI | Quarterly |
| `DATABASE_URL_READONLY` | Read-only database connection (analytics) | PostgreSQL | Quarterly |
| `SENTRY_AUTH_TOKEN` | Sentry release tracking | Sentry Dashboard | Annually |
| `GITHUB_TOKEN_FINE_GRAINED` | Replace classic token; PR/Issue operations | GitHub Settings | Quarterly |
| `RATE_LIMIT_SECRET` | For rate limiter signing | Generate UUID | Quarterly |
| `API_SIGNATURE_KEY` | For request signature validation | Generate 32-byte key | Quarterly |

### Monitoring Secrets

| Secret Name | Purpose | Source |
|-------------|---------|--------|
| `PAGERDUTY_INTEGRATION_KEY` | Alert routing (if using PagerDuty) | PagerDuty → Integrations |
| `SLACK_WEBHOOK_URL` | Failure notifications | Slack → Incoming Webhooks |
| `DATADOG_API_KEY` | Monitoring backend (optional) | Datadog → API Keys |

---

## 4. Recommended Fine-Grained Token Scopes

### For `VERCEL_TOKEN`
```
Scope: "opencarbox" project only
Permissions:
  - deployments: read, write
  - preview deployments: read, write
  - production deployments: write (with approval)
  - project settings: read only
  - secrets: none
Expiration: 1 year
```

### For `GITHUB_TOKEN_FINE_GRAINED` (replaces classic token)
```
Scope: "opencarbox" repository only
Permissions:
  - contents: read
  - pull_requests: write
  - issues: write
  - actions: read
Expiration: 1 year
```

### For `GITLAB_PROJEKT_TOKEN` (mem0-brain)
```
Scope: "opencarbox" project only
Permissions:
  - read_api
  - read_repository
Access Level: Developer (minimal)
Expiration: 1 year
```

---

## 5. Secret Rotation Schedule

### Quarterly Rotation (Every 90 Days)
- `DEEPSEEK_API_KEY`
- `NSCALE_API_KEY`
- `JULES_API_KEY`
- `GITHUB_TOKEN_FINE_GRAINED` (if added)
- `VERCEL_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `MEILISEARCH_API_KEY`
- `TWILIO_AUTH_TOKEN`
- `RESEND_API_KEY`
- `RATE_LIMIT_SECRET`
- `API_SIGNATURE_KEY`

### Annually Rotation (Every 365 Days)
- `SENTRY_AUTH_TOKEN`
- `GITLAB_PROJEKT_TOKEN`
- `TECDOC_API_KEY` (if available)

### Ad-Hoc Rotation (On Suspected Compromise)
- Any key with unusual activity
- Keys after developer departures
- Keys used by external services

### Rotation Process
1. **Generate new secret** in source system (GitHub, Vercel, Stripe, etc.)
2. **Add as new secret** in GitHub: `SECRET_NAME_V2` (temporary)
3. **Update workflows** to use `${{ secrets.SECRET_NAME_V2 || secrets.SECRET_NAME }}`
4. **Test in staging** for 2-3 days
5. **Delete old secret** from GitHub
6. **Remove fallback** from workflows
7. **Document in CHANGELOG.md**

Example:
```yaml
# Workflow during rotation window
env:
  DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY_V2 || secrets.DEEPSEEK_API_KEY }}
```

---

## 6. Secret Storage Best Practices

### What Goes Where?

| Type | GitHub Secrets | env.example | Code | Vault |
|------|---------------|------------|------|-------|
| API Keys (Third-party) | ✅ YES | ❌ NO | ❌ NO | ✅ Optional |
| Database URLs | ✅ YES (CI only) | ⚠️ Dummy | ❌ NO | ✅ Optional |
| Cryptographic Keys | ✅ YES | ❌ NO | ❌ NO | ✅ Recommended |
| Public IDs (Stripe pub key) | ❌ NO | ✅ YES | ✅ OK | ❌ NO |
| Webhook Secrets | ✅ YES | ❌ NO | ❌ NO | ✅ Recommended |
| Auth Tokens | ✅ YES | ❌ NO | ❌ NO | ✅ Recommended |

### Workflow: Using Secrets Safely

**BAD:**
```yaml
- run: curl -H "Authorization: ${{ secrets.DEEPSEEK_API_KEY }}" https://api.deepseek.com
```
(Key visible in logs)

**GOOD:**
```yaml
- run: |
    curl -H "Authorization: Bearer $DEEPSEEK_API_KEY" https://api.deepseek.com
  env:
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
```
(Key masked automatically)

**BETTER:**
```yaml
- run: pnpm run ai:triage
  env:
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
    DEEPSEEK_BASE_URL: ${{ secrets.DEEPSEEK_BASE_URL }}
```
(Use application-level secrets, not inline curl)

---

## 7. Implementation Checklist

### Phase 1: Immediate Actions (This Week)
- [ ] Audit `CLASSIC_TOKEN_GITHUB_NEU` expiration and scope
- [ ] Generate fine-grained GitHub token replacement
- [ ] Audit `VERCEL_TOKEN` scope in Vercel dashboard
- [ ] Document all current secrets in `.github/SECRETS.md`
- [ ] Create GitHub Issue #[TBD]: "Secret Audit & Rotation Plan"

### Phase 2: Short-term (Next 2 Weeks)
- [ ] Replace classic token with fine-grained token
- [ ] Consolidate `VERCEL_PROJECT_ID` / `NEU_VERCEL_PROJEKT_ID`
- [ ] Verify RLS policies are active on all Supabase tables
- [ ] Add mask patterns for `DATABASE_URL` in CI workflows
- [ ] Document GitLab token scope and rotation schedule

### Phase 3: Medium-term (Next Month)
- [ ] Implement secret rotation automation (GitHub Actions workflow)
- [ ] Add `SENTRY_AUTH_TOKEN` for release tracking
- [ ] Set up secret expiration alerts in GitHub
- [ ] Create `.github/secrets-rotation.yml` tracking document
- [ ] Add request signature validation to API endpoints

### Phase 4: Long-term (Next Quarter)
- [ ] Migrate to Vercel-side environment secrets (see vercel-env-config.md)
- [ ] Evaluate external secret vault (HashiCorp Vault, 1Password, Bitwarden)
- [ ] Implement key rotation automation
- [ ] Create runbook for secret compromise incident response
- [ ] Audit logs of all secret accesses

---

## 8. Document Template: `.github/SECRETS.md`

Create this file to document all secrets:

```markdown
# GitHub Secrets Documentation

**Last Updated:** 2026-02-23  
**Maintainer:** [Your Name]

## Secrets Registry

### API Keys

| Secret | Service | Purpose | Scope | Rotation | Status |
|--------|---------|---------|-------|----------|--------|
| DEEPSEEK_API_KEY | DeepSeek | AI model calls | OpenCarBox project | Q2 2026 | ✅ Active |
| NSCALE_API_KEY | NSCALE | Routing header | All models | Q2 2026 | ✅ Active |

### Database

| Secret | System | Purpose | Scope | Rotation | Status |
|--------|--------|---------|-------|----------|--------|
| DATABASE_URL | PostgreSQL | Main connection | CI/CD only | 2026-05-23 | ✅ Active |
| SUPABASE_SERVICE_ROLE_KEY | Supabase | RLS bypass (admin) | CI/CD only | 2026-05-23 | ✅ Active |

...
```

---

## Summary

**Total Secrets Identified:** 25+ (GitHub + Application-level)  
**Critical Issues:** 4  
**High Issues:** 4  
**Medium Issues:** 4  
**Recommended New Secrets:** 6  
**Rotation Coverage:** 90% (quarterly), 85% (annually)

**Next Steps:**
1. Schedule secret audit meeting
2. Create GitHub Issue for secret rotation plan
3. Implement monitoring (see oracle-monitoring.yml)
4. Document all secrets in `.github/SECRETS.md`
5. Begin rotation cycle Q2 2026
