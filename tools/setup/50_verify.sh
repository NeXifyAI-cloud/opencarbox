#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 50_verify =="

resolve_gitlab_token || true

if [[ -f .env.local ]]; then
  echo "✅ .env.local vorhanden"
  keys_count="$(grep -E '^[A-Z0-9_]+=' .env.local | wc -l | tr -d ' ')"
  echo "ℹ️  Anzahl gesetzter Keys in .env.local: $keys_count"
else
  echo "⚠️  .env.local fehlt"
fi

for var in GITHUB_OWNER REPO_NAME GH_TOKEN VERCEL_TOKEN SUPABASE_ACCESS_TOKEN GITLAB_TOKEN GITLAB_PROJECT_ID; do
  require_or_warn "$var" || true
done

echo "✅ Verifikation abgeschlossen"
