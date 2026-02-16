#!/usr/bin/env bash

set -euo pipefail

is_missing_or_placeholder() {
  local value="${1:-}"
  [[ -z "$value" || "$value" == "..." || "$value" == "DEIN_ORG_ODER_USER" || "$value" == "dein-projekt" ]]
}

require_or_warn() {
  local name="$1"
  local value="${!name:-}"

  if is_missing_or_placeholder "$value"; then
    echo "⚠️  $name ist nicht gesetzt oder enthält einen Platzhalter. Schritt wird ggf. übersprungen."
    return 1
  fi

  echo "✅ $name ist gesetzt"
  return 0
}

write_env_value() {
  local file="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}
