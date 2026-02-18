#!/usr/bin/env bash
set -euo pipefail

: "${SUPABASE_ACCESS_TOKEN:?Set SUPABASE_ACCESS_TOKEN}"

supabase login --token "$SUPABASE_ACCESS_TOKEN" >/dev/null 2>&1 || true

# If you already have a project ref, set SUPABASE_PROJECT_REF and link:
if [[ -n "${SUPABASE_PROJECT_REF:-}" ]]; then
  supabase link --project-ref "$SUPABASE_PROJECT_REF"
fi

echo "Supabase bootstrap done (login + optional link)."
