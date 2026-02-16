#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 10_github_bootstrap =="

if ! require_or_warn GH_TOKEN || ! require_or_warn GITHUB_OWNER || ! require_or_warn REPO_NAME; then
  echo "⚠️  GitHub-Setup übersprungen (fehlende echte Werte)."
  exit 0
fi

status_code="$(curl -sS -o /tmp/gh_repo.json -w "%{http_code}" \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$GITHUB_OWNER/$REPO_NAME")"

if [[ "$status_code" == "200" ]]; then
  echo "✅ Repository gefunden: $GITHUB_OWNER/$REPO_NAME"
elif [[ "$status_code" == "404" ]]; then
  echo "⚠️  Repository nicht gefunden oder kein Zugriff: $GITHUB_OWNER/$REPO_NAME"
  exit 0
else
  echo "⚠️  Unerwartete GitHub-Antwort (HTTP $status_code)."
  exit 0
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "⚠️  gh CLI nicht gefunden. Überspringe Repo-Regel-Setup."
  exit 0
fi

export GH_TOKEN

# Enable auto-merge support

gh api \
  --method PATCH \
  -H "Accept: application/vnd.github+json" \
  "/repos/$GITHUB_OWNER/$REPO_NAME" \
  -f allow_auto_merge=true \
  -f delete_branch_on_merge=true >/dev/null

echo "✅ Auto-merge + delete-branch-on-merge aktiviert."

# Require branch protection checks on main (best effort)

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/$GITHUB_OWNER/$REPO_NAME/branches/main/protection" \
  -f required_status_checks.strict=true \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_linear_history=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f block_creations=false \
  -f required_conversation_resolution=true \
  -F required_status_checks.contexts[]='CI / quality' \
  -F required_status_checks.contexts[]='security-scan' >/dev/null || true

echo "✅ Branch-Protection für main (best effort) gesetzt."
