#!/usr/bin/env bash
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"

REPO_SLUG="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)}"
if [[ -z "${REPO_SLUG}" ]]; then
  echo "Unable to detect repository. Set GITHUB_REPOSITORY=owner/repo"
  exit 1
fi

# Create labels idempotently
for label in "type:bug" "type:feature" "area:api" "area:infra" "status:blocked" "status:ready"; do
  name="${label%%:*}"
  value="${label#*:}"
  gh label create "${name}/${value}" --color BFD4F2 --description "${name} ${value}" --repo "${REPO_SLUG}" 2>/dev/null || true
done

gh api -X PUT "repos/${REPO_SLUG}/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]='ci' \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false >/dev/null || true

echo "GitHub bootstrap complete"
