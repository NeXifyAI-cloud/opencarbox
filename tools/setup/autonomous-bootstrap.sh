#!/usr/bin/env bash
# Autonomous Bootstrap Documentation Script
# This script documents all ONE-TIME manual steps needed for full autonomous operation.
# It is DOCUMENTATION-ONLY and does not execute side effects automatically.

set -euo pipefail

cat <<'EOF'
# 🤖 OpenCarBox Autonomous Operation Bootstrap Checklist

This document outlines the **one-time manual steps** required to achieve
complete autonomous operation for the opencarbox repository.

## Prerequisites

- GitHub repository admin access
- GitHub CLI (`gh`) installed and authenticated
- Appropriate secrets/tokens from third-party services

---

## ✅ Step 1: Repository Variables

Set the `OPENCARBOX_RUNNER` repository variable:

```bash
# Option A: Use GitHub-hosted runners (default)
gh variable set OPENCARBOX_RUNNER --body ""

# Option B: Use self-hosted runner
gh variable set OPENCARBOX_RUNNER --body "self-hosted"
```

**Why**: Centralized control of runner infrastructure across all workflows.

---

## ✅ Step 2: Required GitHub Secrets

Set the following repository secrets:

### Deployment (Vercel)
```bash
gh secret set VERCEL_TOKEN --body "YOUR_VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --body "YOUR_VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "YOUR_VERCEL_PROJECT_ID"
```

### Database (Supabase)
```bash
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "YOUR_SUPABASE_URL"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "YOUR_SUPABASE_ANON_KEY"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "YOUR_SUPABASE_SERVICE_ROLE_KEY"
gh secret set DATABASE_URL --body "YOUR_DATABASE_URL"
```

### AI Providers (DeepSeek / NSCALE)
```bash
gh secret set DEEPSEEK_API_KEY --body "YOUR_DEEPSEEK_KEY"
gh secret set NSCALE_API_KEY --body "YOUR_NSCALE_KEY"
gh secret set DEEPSEEK_BASE_URL --body "https://api.deepseek.com"
gh secret set NSCALE_HEADER_NAME --body "Authorization"
```

**Why**: These secrets enable automated deployments, AI-powered workflows, and database access.

---

## ✅ Step 3: Enable Auto-Merge at Repository Level

Check if auto-merge is enabled:

```bash
gh api repos/:owner/:repo --jq '.allow_auto_merge'
```

If `false`, enable it:

```bash
gh api --method PATCH repos/:owner/:repo -f allow_auto_merge=true
```

**Status**: ✅ Already enabled (`allow_auto_merge: true` confirmed via API)

**Why**: Required for PRs to auto-merge when conditions are met.

---

## ✅ Step 4: Branch Protection Configuration

Ensure branch protection rules do **NOT** block autonomous operations:

### For `main` branch:

```bash
# Check current protection rules
gh api repos/:owner/:repo/branches/main/protection

# Adjust if needed - example for balanced protection:
gh api --method PUT repos/:owner/:repo/branches/main/protection \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]=ci \
  -f enforce_admins=false \
  -f required_pull_request_reviews=null \
  -f restrictions=null
```

**Critical**: Set `enforce_admins=false` to allow bot accounts to merge.

**Why**: Branch protection can block auto-merge even when all checks pass.

---

## ✅ Step 5: Default Branch Configuration

After PR #116 (`audit-fix-deploy-10646060533465607163` → `main`) merges:

```bash
# Set main as default branch
gh api --method PATCH repos/:owner/:repo -f default_branch=main
```

**Current**: Default branch is `audit-fix-deploy-10646060533465607163`
**Target**: Default branch should be `main` after sync completes

**Why**: Ensures CI and deployment workflows target the correct branch.

---

## ✅ Step 6: GitHub Token Permissions

Ensure `GITHUB_TOKEN` has sufficient permissions for auto-approve workflows:

Repository Settings → Actions → General → Workflow permissions:
- ✅ Select: **Read and write permissions**
- ✅ Check: **Allow GitHub Actions to create and approve pull requests**

**Why**: Auto-approve workflow needs permission to approve PRs.

---

## ✅ Step 7: Workflow Triggers Validation

Verify workflows can trigger each other (not disabled by org policy):

Repository Settings → Actions → General → Workflow permissions:
- ✅ Ensure workflows can trigger other workflows

**Why**: `auto-merge` workflow needs to trigger on `workflow_run` completion of `ci`.

---

## ✅ Step 8: Optional - Self-Hosted Runner Setup

If using self-hosted runners (`OPENCARBOX_RUNNER` set to custom value):

1. Install runner on target machine:
   ```bash
   # Follow GitHub instructions at:
   # Settings → Actions → Runners → New self-hosted runner
   ```

2. Configure runner with appropriate labels
3. Start runner as a service

**Why**: Better performance, cost control, or specialized environment needs.

---

## 🎯 Validation Checklist

After completing all steps, verify autonomous operation:

- [ ] `OPENCARBOX_RUNNER` variable set
- [ ] All required secrets configured
- [ ] Auto-merge enabled at repository level
- [ ] Branch protection allows bot merges
- [ ] `GITHUB_TOKEN` has write permissions
- [ ] Workflows can trigger other workflows
- [ ] Default branch will be set to `main` after PR #116 merges

Test autonomous operation:
1. Create a test PR with `auto-merge` label
2. Wait for CI to pass
3. Verify PR auto-approves and auto-merges
4. Check that stale-cleanup workflow runs daily
5. Verify sync-to-main workflow manages PR #116

---

## 📊 Autonomous Operations Overview

### What Runs Automatically:

1. **Auto-Merge**: PRs from trusted actors with passing CI
2. **Stale Cleanup**: Daily cleanup of placeholder/superseded PRs
3. **Sync to Main**: Daily sync from audit-fix-deploy → main
4. **Failure Orchestrator**: AI-powered failure triage and fixes
5. **Auto-Deploy**: Zero-confirmation deploys on default branch

### What Requires Human Action:

1. **Secrets Rotation**: Periodic rotation of API keys/tokens
2. **Branch Protection Changes**: Adjusting protection rules
3. **Workflow File Changes**: PRs touching `.github/workflows/` require manual review
4. **Migration File Changes**: PRs touching `supabase/migrations/` require manual review
5. **Initial Repository Setup**: This bootstrap process

---

## 🚨 Safety Guards

The autonomous system includes safety guards:

- ❌ PRs touching `.github/workflows/` require human review
- ❌ PRs touching `supabase/migrations/` require human review
- ✅ AI fix attempts are limited (`AI_MAX_CALLS: '3'`)
- ✅ Workflow edits forbidden in AI triage (`FORBID_WORKFLOW_EDITS: 'true'`)
- ✅ All merges use squash strategy (clean history)
- ✅ Concurrency controls prevent race conditions

---

## 📚 Additional Resources

- Full autonomy architecture: `NOTES/autonomous-operations.md`
- Workflow runbook: `NOTES/runbook.md`
- Repository brain/memory: `NOTES/brain.md`

---

## ✨ Success!

Once all steps are complete, the repository operates autonomously.
Routine operations require **zero human confirmation**.

EOF
