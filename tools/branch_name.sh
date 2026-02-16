#!/usr/bin/env bash
set -euo pipefail

# Generates normalized branch names in the format: codex/{feature}
# Usage:
#   tools/branch_name.sh "Safe Autofix" [suffix]
# Env:
#   BRANCH_FEATURE_MAX_LEN (default: 48)

raw_feature="${1:-}"
raw_suffix="${2:-}"
max_len="${BRANCH_FEATURE_MAX_LEN:-48}"

if [[ -z "$raw_feature" ]]; then
  echo "usage: $0 <feature-context> [suffix]" >&2
  exit 1
fi

normalize() {
  local value="$1"
  value="$(printf '%s' "$value" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g')"
  printf '%s' "$value"
}

feature="$(normalize "$raw_feature")"
suffix="$(normalize "$raw_suffix")"

if [[ -n "$suffix" ]]; then
  feature="${feature}-${suffix}"
fi

if [[ -z "$feature" ]]; then
  feature="task"
fi

# enforce max length on feature part only
if [[ "$max_len" =~ ^[0-9]+$ ]] && (( max_len > 0 )) && (( ${#feature} > max_len )); then
  feature="${feature:0:max_len}"
  feature="$(printf '%s' "$feature" | sed -E 's/-+$//')"
fi

if [[ -z "$feature" ]]; then
  feature="task"
fi

printf 'codex/%s\n' "$feature"
