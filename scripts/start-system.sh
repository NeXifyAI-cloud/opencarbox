#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/../tools/export_env.sh"

: "${SUPABASE_ACCESS_TOKEN:?Set SUPABASE_ACCESS_TOKEN (or SUPABASE_TOKEN/supabase_access_token)}"

MODE="${1:-dev}"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required to start the system." >&2
  exit 1
fi

if command -v supabase >/dev/null 2>&1; then
  supabase login --token "$SUPABASE_ACCESS_TOKEN" >/dev/null 2>&1 || true
else
  echo "Supabase CLI not found; skipping supabase login." >&2
fi

if [[ "$MODE" == "check" ]]; then
  echo "System start preflight successful."
  exit 0
fi

if [[ "$MODE" == "prod" ]]; then
  exec pnpm start
fi

exec pnpm dev
