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
else
  echo "⚠️  Unerwartete GitHub-Antwort (HTTP $status_code)."
fi
