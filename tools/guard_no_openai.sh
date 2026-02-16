#!/usr/bin/env bash
set -euo pipefail
if rg -n "OPENAI_" . --glob '!tools/guard_no_openai.sh'; then
  echo "Found forbidden OPENAI_ usage. This repo is DeepSeek-only."
  exit 1
fi
