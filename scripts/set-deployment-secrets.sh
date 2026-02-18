#!/usr/bin/env bash
set -euo pipefail


resolve_github_token() {
  if [[ -n "${GH_TOKEN:-}" ]]; then
    return 0
  fi

  if [[ -n "${CLASSIC_TOKEN_GITHUB_NEU:-}" ]]; then
    export GH_TOKEN="$CLASSIC_TOKEN_GITHUB_NEU"
    return 0
  fi

  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    export GH_TOKEN="$GITHUB_TOKEN"
    return 0
  fi

  return 1
}

resolve_github_token || true

: "${GITHUB_OWNER:?}"
: "${REPO_NAME:?}"
: "${GH_TOKEN:?Set GH_TOKEN (or CLASSIC_TOKEN_GITHUB_NEU/GITHUB_TOKEN)}"

# App/Supabase public
: "${NEXT_PUBLIC_SUPABASE_URL:?}"
: "${NEXT_PUBLIC_SUPABASE_ANON_KEY:?}"

# Server-only
: "${SUPABASE_SERVICE_ROLE_KEY:?}"
: "${DEEPSEEK_API_KEY:?}"
: "${NSCALE_API_KEY:?}"
NSCALE_HEADER_NAME="${NSCALE_HEADER_NAME:-X-NSCALE-API-KEY}"
AI_PROVIDER="${AI_PROVIDER:-deepseek}"
if [[ "$AI_PROVIDER" != "deepseek" ]]; then
  echo "AI_PROVIDER must be deepseek" >&2
  exit 1
fi

# GitHub Secrets
set_secret() {
  echo -n "$2" | gh secret set "$1" --repo "$GITHUB_OWNER/$REPO_NAME" >/dev/null
}

set_secret NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL"
set_secret NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
set_secret SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY"
set_secret DEEPSEEK_API_KEY "$DEEPSEEK_API_KEY"
set_secret NSCALE_API_KEY "$NSCALE_API_KEY"
set_secret NSCALE_HEADER_NAME "$NSCALE_HEADER_NAME"
set_secret AI_PROVIDER "$AI_PROVIDER"

echo "GitHub secrets set."

# Vercel env (optional if VERCEL_TOKEN available)
if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  vercel env add NEXT_PUBLIC_SUPABASE_URL production --token "$VERCEL_TOKEN" <<<"$NEXT_PUBLIC_SUPABASE_URL" >/dev/null || true
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token "$VERCEL_TOKEN" <<<"$NEXT_PUBLIC_SUPABASE_ANON_KEY" >/dev/null || true
  vercel env add SUPABASE_SERVICE_ROLE_KEY production --token "$VERCEL_TOKEN" <<<"$SUPABASE_SERVICE_ROLE_KEY" >/dev/null || true
  vercel env add DEEPSEEK_API_KEY production --token "$VERCEL_TOKEN" <<<"$DEEPSEEK_API_KEY" >/dev/null || true
  vercel env add NSCALE_API_KEY production --token "$VERCEL_TOKEN" <<<"$NSCALE_API_KEY" >/dev/null || true
  vercel env add NSCALE_HEADER_NAME production --token "$VERCEL_TOKEN" <<<"$NSCALE_HEADER_NAME" >/dev/null || true
  vercel env add AI_PROVIDER production --token "$VERCEL_TOKEN" <<<"$AI_PROVIDER" >/dev/null || true
  echo "Vercel env set (production)."
fi
