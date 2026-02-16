#!/usr/bin/env bash
set -euo pipefail

# Normalize legacy secret names to standard env names without printing secret values.
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_PROJEKT_URL:-${projekt_url:-}}}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY:-${SUPABASE_PUBLISHABLE_KEY:-${Anon_Key:-}}}}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_SECRET_KEY:-${service_role:-}}}"
export DATABASE_URL="${DATABASE_URL:-${SUPABASE_POSTGRESQL:-}}"

export VERCEL_TOKEN="${VERCEL_TOKEN:-${vercel_token:-}}"
export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-${VERCEL_PROJEKT_ID:-${Vercel_Projekt_ID:-}}}"
export GH_PAT="${GH_PAT:-${CLASSIC_TOKEN_GITHUB:-${github_token:-}}}"

export AI_PROVIDER="${AI_PROVIDER:-deepseek}"
export DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-}"
export NSCALE_API_KEY="${NSCALE_API_KEY:-}"
export DEEPSEEK_BASE_URL="${DEEPSEEK_BASE_URL:-}"
export NSCALE_HEADER_NAME="${NSCALE_HEADER_NAME:-X-NSCALE-API-KEY}"

echo "export_env.sh: mapped environment aliases to standard names."
