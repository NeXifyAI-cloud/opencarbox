#!/usr/bin/env bash
set -euo pipefail

if rg -n "OPENAI_[A-Z0-9_]+" .github/workflows tools \
  --glob "!node_modules/**" \
  --glob "!tools/guard_no_openai.sh" \
  --glob "!.github/workflows/ci.yml" >/tmp/openai_hits.txt; then
  echo "OPENAI_* references detected in guarded automation paths:" >&2
  cat /tmp/openai_hits.txt >&2
  exit 1
fi

echo "OpenAI guard passed."
