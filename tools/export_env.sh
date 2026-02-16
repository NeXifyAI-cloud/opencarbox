#!/usr/bin/env bash
set -euo pipefail

# This script normalizes environment variables for all workflows.
# It supports both GitHub Actions secret names and Codex secret names.

pick() {
  for v in "$@"; do
    if [[ -n "${v}" ]]; then
      echo -n "${v}"
      return 0
    fi
  done
  return 0
}

DEEPSEEK_API_KEY_VAL="$(pick "${DEEPSEEK_API_KEY:-}" "${deepseek_api:-}")"
NSCALE_API_KEY_VAL="$(pick "${NSCALE_API_KEY:-}")"

SUPABASE_URL_VAL="$(pick "${NEXT_PUBLIC_SUPABASE_URL:-}" "${SUPABASE_PROJEKT_URL:-}" "${projekt_url:-}")"
SUPABASE_ANON_VAL="$(pick "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" "${SUPABASE_ANON_KEY:-}" "${Anon_Key:-}" "${SUPABASE_PUBLISHABLE_KEY:-}" "${Publishable_Key:-}")"
SUPABASE_SERVICE_VAL="$(pick "${SUPABASE_SERVICE_ROLE_KEY:-}" "${service_role:-}")"

VERCEL_TOKEN_VAL="$(pick "${VERCEL_TOKEN:-}" "${vercel_token:-}")"
VERCEL_PROJECT_VAL="$(pick "${VERCEL_PROJECT_ID:-}" "${VERCEL_PROJEKT_ID:-}" "${Vercel_Projekt_ID:-}")"

GH_PAT_VAL="$(pick "${GH_PAT:-}" "${CLASSIC_TOKEN_GITHUB:-}" "${github_token:-}")"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  {
    echo "AI_PROVIDER=deepseek"
    echo "DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY_VAL}"
    echo "NSCALE_API_KEY=${NSCALE_API_KEY_VAL}"
    echo "NSCALE_HEADER_NAME=${NSCALE_HEADER_NAME:-X-NSCALE-API-KEY}"
    echo "DEEPSEEK_BASE_URL=${DEEPSEEK_BASE_URL:-}"

    echo "NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL_VAL}"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_VAL}"
    echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_VAL}"

    echo "VERCEL_TOKEN=${VERCEL_TOKEN_VAL}"
    echo "VERCEL_PROJECT_ID=${VERCEL_PROJECT_VAL}"

    echo "GH_PAT=${GH_PAT_VAL}"
  } >> "${GITHUB_ENV}"
fi

export AI_PROVIDER=deepseek
export DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY_VAL}"
export NSCALE_API_KEY="${NSCALE_API_KEY_VAL}"
export NSCALE_HEADER_NAME="${NSCALE_HEADER_NAME:-X-NSCALE-API-KEY}"
export DEEPSEEK_BASE_URL="${DEEPSEEK_BASE_URL:-}"

export NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL_VAL}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${SUPABASE_ANON_VAL}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_VAL}"

export VERCEL_TOKEN="${VERCEL_TOKEN_VAL}"
export VERCEL_PROJECT_ID="${VERCEL_PROJECT_VAL}"

export GH_PAT="${GH_PAT_VAL}"

echo "export_env.sh: mapped secrets to standardized env names."
