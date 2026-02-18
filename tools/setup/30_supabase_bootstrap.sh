#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 30_supabase_bootstrap =="

if ! require_or_warn SUPABASE_ACCESS_TOKEN; then
  echo "⚠️  Supabase-Setup übersprungen (fehlende echte Werte)."
  exit 0
fi

if ! require_or_warn SUPABASE_PROJECT_REF; then
  echo "⚠️  SUPABASE_PROJECT_REF fehlt. Projekt-spezifischer Check wird übersprungen."
  exit 0
fi

status_code="$(curl -sS -o /tmp/supabase_project.json -w "%{http_code}" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF")"

if [[ "$status_code" == "200" ]]; then
  echo "✅ Supabase-Projekt erreichbar"
else
  echo "⚠️  Supabase API antwortete mit HTTP $status_code"
fi
