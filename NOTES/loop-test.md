# End-to-End Loop Test (Auftrag 29)

## Purpose

This document describes how to verify the complete CI failure → issue → autofix → PR loop
works end-to-end. Follow these steps to validate the automation chain.

## Prerequisites

- Write access to the repository
- Ability to create branches and push code
- All workflows enabled in the repository settings

## E2E Verification Steps

### Step 1: Create an intentional lint error

```bash
# Create a test branch
git checkout -b test/loop-verification

# Introduce a deliberate lint error
echo "const unused_var = 'this will fail lint';" >> src/lib/utils.ts

# Commit and push
git add -A
git commit -m "test: intentional lint error for loop verification"
git push origin test/loop-verification

# Open a PR against main
```

### Step 2: Observe CI failure cascade

1. **CI workflow** (`ci.yml`) runs and fails on lint check
2. **Loop Orchestrator** (`loop-orchestrator.yml`) triggers:
   - Creates a CI failure issue with failed job details
   - Comments on the PR with failure summary
3. **CI Retry** (`ci-retry.yml`) triggers:
   - Classifies the failure as `lint` (not retryable)
   - Labels the issue `autofix-candidate`
4. **Autofix** (`autofix.yml`) triggers:
   - Runs `eslint --fix` and `prettier --write`
   - If fix succeeds: creates an autofix PR
   - If fix fails: creates an incident issue with `needs-human`

### Step 3: Verify the autofix PR

1. Check that an autofix PR was created with label `autofix`
2. Verify the PR's CI passes (lint error should be fixed)
3. Review the autofix PR changes — should only contain format/lint fixes

### Step 4: Cleanup

```bash
# Delete the test branch
git checkout main
git branch -D test/loop-verification
git push origin --delete test/loop-verification
```

Close any test issues and PRs created during verification.

## Expected Outcomes

| Step | Expected Result |
|------|----------------|
| CI run | Fails with lint error |
| Loop orchestrator | Creates issue with `ci-failure` label |
| CI retry | Classifies as `lint`, no retry (deterministic) |
| Autofix | Creates PR fixing the lint error |
| Autofix PR CI | Passes all checks |

## Workflow Dispatch Self-Test

For a lighter verification, use `workflow_dispatch` on the loop orchestrator:

```bash
gh workflow run loop-orchestrator.yml --field test_mode=true
```

This triggers the orchestrator in test mode without requiring an actual CI failure.

## Guardrails Verification

To verify guardrails (Auftrag 28) are working:

1. **Cooldown**: After the first autofix PR, no second PR should be created within 6 hours for the same SHA
2. **File limits**: Autofix PRs should not modify more than 20 files or 500 diff lines
3. **Blocked files**: `.env`, migration files, and lockfiles must never be in autofix PRs
4. **PR limit**: Maximum 2 open autofix PRs at any time

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| Orchestrator didn't trigger | Check workflow_run trigger — CI must complete (not just start) |
| No autofix PR created | Check if 2 autofix PRs already exist (guardrail limit) |
| Autofix PR doesn't pass CI | The lint error may not be auto-fixable; check `needs-human` label |
| Issue not created | Check deduplication marker — issue may already exist for this run |
