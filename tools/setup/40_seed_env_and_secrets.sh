#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=tools/setup/lib.sh
source "$SCRIPT_DIR/lib.sh"

echo "== 40_seed_env_and_secrets =="

ENV_FILE=".env.local"
touch "$ENV_FILE"

declare -a vars=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  DEEPSEEK_API_KEY
  NSCALE_API_KEY
  NSCALE_HEADER_NAME
)

for var in "${vars[@]}"; do
  value="${!var:-}"
  if is_missing_or_placeholder "$value"; then
    echo "⚠️  $var ist leer/Platzhalter und wurde nicht in $ENV_FILE geschrieben"
    continue
  fi

  write_env_value "$ENV_FILE" "$var" "$value"
  echo "✅ $var in $ENV_FILE aktualisiert"
done

echo "✅ Environment-Seeding abgeschlossen"
