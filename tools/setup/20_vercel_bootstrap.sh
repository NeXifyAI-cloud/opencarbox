#!/usr/bin/env bash
set -euo pipefail

: "${VERCEL_TOKEN:?VERCEL_TOKEN is required}"

if [[ -n "${VERCEL_PROJECT_ID:-}" && -n "${VERCEL_ORG_ID:-}" ]]; then
  vercel link --yes --token "$VERCEL_TOKEN" --project "$VERCEL_PROJECT_ID" --scope "$VERCEL_ORG_ID" || true
else
  vercel link --yes --token "$VERCEL_TOKEN" || true
fi

echo "Vercel bootstrap complete"
