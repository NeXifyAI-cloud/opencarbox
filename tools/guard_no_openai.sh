#!/usr/bin/env bash
set -euo pipefail

scan_openai() {
  if command -v rg >/dev/null 2>&1; then
    rg -n "OPENAI_" . --glob '!tools/guard_no_openai.sh' || true
  else
    grep -RIn "OPENAI_" . --exclude='guard_no_openai.sh' || true
  fi
}

out="$(scan_openai)"
if [[ -n "${out}" ]]; then
  echo "Found forbidden OPENAI_ usage. This repo is DeepSeek-only."
  echo "${out}"
  exit 1
fi

echo "OK: no OPENAI_ usage found."
