#!/usr/bin/env bash
set -euo pipefail

: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN is required}"
: "${SUPABASE_PROJECT_REF:?SUPABASE_PROJECT_REF is required}"

supabase login --token "$SUPABASE_ACCESS_TOKEN" >/dev/null
supabase link --project-ref "$SUPABASE_PROJECT_REF" || true
supabase db push

echo "Supabase bootstrap complete"
