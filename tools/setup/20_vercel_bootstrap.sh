#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 20_vercel_bootstrap =="

if ! require_or_warn VERCEL_TOKEN || ! require_or_warn VERCEL_ORG_ID; then
  echo "⚠️  Vercel-Setup übersprungen (fehlende echte Werte)."
  exit 0
fi

status_code="$(curl -sS -o /tmp/vercel_team.json -w "%{http_code}" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v2/teams/$VERCEL_ORG_ID")"

if [[ "$status_code" == "200" ]]; then
  echo "✅ Vercel Team/Org erreichbar"
else
  echo "⚠️  Vercel API antwortete mit HTTP $status_code"
fi
