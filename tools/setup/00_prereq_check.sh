#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 00_prereq_check =="

for cmd in bash node npm curl git; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "✅ $cmd gefunden"
  else
    echo "❌ $cmd fehlt"
    exit 1
  fi
done

missing=0
for var in GITHUB_OWNER REPO_NAME GH_TOKEN VERCEL_TOKEN VERCEL_ORG_ID SUPABASE_ACCESS_TOKEN NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  require_or_warn "$var" || missing=1
done

if [[ $missing -eq 1 ]]; then
  echo "⚠️  Einige Variablen sind Platzhalter. Nachfolgende Schritte laufen im Best-Effort-Modus."
else
  echo "✅ Alle Kernvariablen gesetzt"
fi
