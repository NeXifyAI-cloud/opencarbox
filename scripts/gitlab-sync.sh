#!/bin/bash
# GitLab Sync Script for OpenCarBox
# Generated: $(date)

GITLAB_TOKEN="undefined"
GITHUB_TOKEN="undefined"
GITLAB_URL="https://gitlab.com"
PROJECT_NAME="opencarbox"

echo "🚀 Starting GitLab sync for 110 Codex PRs"

# Function to sync a single PR
sync_pr() {
  local branch="$1"
  local title="$2"
  local priority="$3"
  
  echo "📦 Syncing: $branch ($priority priority)"
  
  # Checkout branch
  git checkout "$branch" 2>/dev/null || git checkout -b "$branch" "origin/$branch"
  
  # Push to GitLab
  git push --set-upstream gitlab "$branch"
  
  # Create Merge Request in GitLab
  curl -X POST "$GITLAB_URL/api/v4/projects/\$PROJECT_NAME/merge_requests" \
    -H "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"source_branch\": \"$branch\",
      \"target_branch\": \"main\",
      \"title\": \"$title\",
      \"description\": \"Auto-synced from GitHub Codex PR\",
      \"remove_source_branch\": true,
      \"squash\": true
    }"
  
  echo "✅ Synced: $branch"
}

# Sync high priority PRs first
echo "🔴 Syncing HIGH priority PRs"
sync_pr "codex/add-ai-triage-job-in-failure-orchestrator" "Add Ai Triage Job In Failure Orchestrator" "high"
sync_pr "codex/add-autofix-workflow-on-ci-failure" "Add Autofix Workflow On Ci Failure" "high"
sync_pr "codex/add-installation-step-in-failure-orchestrator" "Add Installation Step In Failure Orchestrator" "high"
sync_pr "codex/add-security-audit-workflow" "Add Security Audit Workflow" "high"
sync_pr "codex/bootstrap-github-repository-with-labels" "Bootstrap Github Repository With Labels" "high"
sync_pr "codex/create-automation-guidelines-for-deepseek-and-nscale" "Create Automation Guidelines For Deepseek And Nscale" "high"
sync_pr "codex/create-integration-matrix-for-tasks" "Create Integration Matrix For Tasks" "high"
sync_pr "codex/document-gitlab-to-github-mirroring-setup" "Document Gitlab To Github Mirroring Setup" "high"
sync_pr "codex/fix-ci-setup-for-common-failures" "Fix Ci Setup For Common Failures" "high"
sync_pr "codex/implement-api-routes-and-validation-contracts" "Implement Api Routes And Validation Contracts" "high"
sync_pr "codex/implement-deepseek-api-integration" "Implement Deepseek Api Integration" "high"
sync_pr "codex/implement-dual-homed-github-and-gitlab-sync" "Implement Dual Homed Github And Gitlab Sync" "high"
sync_pr "codex/implement-failure-orchestrator-for-workflows" "Implement Failure Orchestrator For Workflows" "high"
sync_pr "codex/implement-pagerduty-integration-without-secrets" "Implement Pagerduty Integration Without Secrets" "high"
sync_pr "codex/integrate-github-classic-token" "Integrate Github Classic Token" "high"
sync_pr "codex/refactor-failure-orchestrator.yml-logic" "Refactor Failure Orchestrator.yml Logic" "high"
sync_pr "codex/refactor-oracle.ts-to-use-deepseek" "Refactor Oracle.ts To Use Deepseek" "high"
sync_pr "codex/replace-inline-node-code-with-async-variant" "Replace Inline Node Code With Async Variant" "high"
sync_pr "codex/replace-openai-adapter-with-deepseek-tasks" "Replace Openai Adapter With Deepseek Tasks" "high"
sync_pr "codex/set-github-and-vercel-environment-variables" "Set Github And Vercel Environment Variables" "high"
sync_pr "codex/set-github-and-vercel-secrets" "Set Github And Vercel Secrets" "high"
sync_pr "codex/set-gitlab-mr-settings-for-fast-forward-merges" "Set Gitlab Mr Settings For Fast Forward Merges" "high"
sync_pr "codex/update-failure-orchestrator.yml-workflows-list" "Update Failure Orchestrator.yml Workflows List" "high"
sync_pr "codex/update-failure-orchestrator.yml-workflows-list-zxpt3j" "Update Failure Orchestrator.yml Workflows List Zxpt3j" "high"
sync_pr "codex/update-github-actions-to-use-pinned-shas" "Update Github Actions To Use Pinned Shas" "high"
sync_pr "codex/update-security.yml-install-step" "Update Security.yml Install Step" "high"

# Sync medium priority PRs
echo "🟡 Syncing MEDIUM priority PRs"
sync_pr "codex/add-ai-triage-job-to-workflow" "Add Ai Triage Job To Workflow" "medium"
sync_pr "codex/add-autofix-enhancements-to-workflow" "Add Autofix Enhancements To Workflow" "medium"
sync_pr "codex/add-automation-backlog-section-to-notes/backlog.md" "Add Automation Backlog Section To Notes/backlog.md" "medium"
sync_pr "codex/add-branch-maintenance-workflow" "Add Branch Maintenance Workflow" "medium"
sync_pr "codex/add-ci-bootstrap-workflow-setup" "Add Ci Bootstrap Workflow Setup" "medium"
sync_pr "codex/add-ci-workflow-for-build-and-tests" "Add Ci Workflow For Build And Tests" "medium"
sync_pr "codex/add-self-hosted-runner-setup-instructions" "Add Self Hosted Runner Setup Instructions" "medium"
sync_pr "codex/consolidate-ci/cd-workflows" "Consolidate Ci/cd Workflows" "medium"
sync_pr "codex/create-project-structure-and-setup-scripts" "Create Project Structure And Setup Scripts" "medium"
sync_pr "codex/define-clear-responsibility-for-workflows" "Define Clear Responsibility For Workflows" "medium"
sync_pr "codex/ensure-automated-response-for-all-messages" "Ensure Automated Response For All Messages" "medium"
sync_pr "codex/fix-multiple-workflow-issues" "Fix Multiple Workflow Issues" "medium"
sync_pr "codex/implement-automated-ci/cd-workflows" "Implement Automated Ci/cd Workflows" "medium"
sync_pr "codex/implement-autonomous-ci/cd-pipeline" "Implement Autonomous Ci/cd Pipeline" "medium"
sync_pr "codex/implement-supabase-oracle-for-tool-policies" "Implement Supabase Oracle For Tool Policies" "medium"
sync_pr "codex/implement-typescript-based-automation-scripts" "Implement Typescript Based Automation Scripts" "medium"
sync_pr "codex/integrate-pagerduty-and-enable-proactive-response" "Integrate Pagerduty And Enable Proactive Response" "medium"
sync_pr "codex/konsolidiere-ci-workflows-in-einen" "Konsolidiere Ci Workflows In Einen" "medium"
sync_pr "codex/move-installation-step-in-workflow" "Move Installation Step In Workflow" "medium"
sync_pr "codex/replace-pinned_sha-in-workflows" "Replace Pinned_sha In Workflows" "medium"
sync_pr "codex/set-up-ci-automation-workflows-and-scripts" "Set Up Ci Automation Workflows And Scripts" "medium"
sync_pr "codex/setup-ci-automation-and-maintenance-workflows" "Setup Ci Automation And Maintenance Workflows" "medium"
sync_pr "codex/setup-environment-variables-and-bootstrap-scripts" "Setup Environment Variables And Bootstrap Scripts" "medium"
sync_pr "codex/setup-pr-backlog-worker-workflow" "Setup Pr Backlog Worker Workflow" "medium"
sync_pr "codex/update-auto-improve.yml-workflow" "Update Auto Improve.yml Workflow" "medium"
sync_pr "codex/update-auto-merge-workflow-and-documentation" "Update Auto Merge Workflow And Documentation" "medium"
sync_pr "codex/update-auto-merge-workflow-conditions" "Update Auto Merge Workflow Conditions" "medium"
sync_pr "codex/update-ci-configuration-and-caching-strategy" "Update Ci Configuration And Caching Strategy" "medium"
sync_pr "codex/update-pr-creation-workflow-with-guardrail" "Update Pr Creation Workflow With Guardrail" "medium"
sync_pr "codex/update-requiredenvvars-and-refactor-log-messages" "Update Requiredenvvars And Refactor Log Messages" "medium"
sync_pr "codex/update-supabase-documentation-and-examples" "Update Supabase Documentation And Examples" "medium"
sync_pr "codex/update-supabase-documentation-and-examples-ae2v81" "Update Supabase Documentation And Examples Ae2v81" "medium"
sync_pr "codex/update-supabase-documentation-and-examples-xqt6p9" "Update Supabase Documentation And Examples Xqt6p9" "medium"
sync_pr "codex/update-vercel-version-in-workflow" "Update Vercel Version In Workflow" "medium"
sync_pr "codex/verify-environment-variable-setup" "Verify Environment Variable Setup" "medium"

echo "🎉 GitLab sync completed!"
