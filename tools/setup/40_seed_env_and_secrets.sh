#!/usr/bin/env bash
set -euo pipefail

: "${GH_TOKEN:?GH_TOKEN is required}"
REPO_SLUG="${GITHUB_REPOSITORY:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

set_secret() {
  local key="$1"
  local value="${!key:-}"
  if [[ -n "$value" ]]; then
    printf '%s' "$value" | gh secret set "$key" --repo "$REPO_SLUG" >/dev/null
    echo "Set GitHub secret: $key"
  else
    echo "Skipped empty secret: $key"
  fi
}

for key in \
  SUPABASE_SERVICE_ROLE_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY \
  DEEPSEEK_API_KEY OPENAI_COMPAT_API_KEY OPENAI_COMPAT_BASE_URL NSCALE_API_KEY NSCALE_HEADER_NAME; do
  set_secret "$key"
done

echo "Secret seeding complete"
