#!/usr/bin/env bash
set -euo pipefail

: "${VERCEL_TOKEN:?Set VERCEL_TOKEN}"
: "${VERCEL_ORG_ID:?Set VERCEL_ORG_ID}"
: "${REPO_NAME:?Set REPO_NAME}"

# Link (creates .vercel)
vercel link --yes --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" || true

echo "Vercel link done. You can run: vercel env pull .env.local --yes"
