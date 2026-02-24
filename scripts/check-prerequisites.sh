#!/usr/bin/env bash
set -euo pipefail

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing: $1"
    exit 1
  }
}

need git
need node
need npm
need gh
need vercel
need supabase

echo "OK: prerequisites found."
echo "Tip: ensure GH_TOKEN (or CLASSIC_TOKEN_GITHUB_NEU/GITHUB_TOKEN), VERCEL_TOKEN, SUPABASE_ACCESS_TOKEN are set for full auto."
