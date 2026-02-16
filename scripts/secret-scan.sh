#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Running lightweight secret scan on tracked files..."

PATTERN="(sbp_[A-Za-z0-9]{20,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*eyJ[A-Za-z0-9._-]+|SUPABASE_ACCESS_TOKEN\s*=\s*[^<\s][^\s]*|NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*eyJ[A-Za-z0-9._-]+|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|sk-or-v1-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|QDRANT_API_KEY\s*=\s*eyJ[A-Za-z0-9._-]+|postgres(?:ql)?://[^\s\"'@]+:(?!<|password|PASSWORD|localdev)[^\s\"'@]+@)"

if rg -n --hidden --glob '!.git' --glob '!.next' --glob '!node_modules' --glob '!pnpm-lock.yaml' --glob '!package-lock.json' --glob '!yarn.lock' --pcre2 "$PATTERN" .; then
  echo "❌ Potential secret/token pattern found in tracked content."
  exit 1
fi

echo "✅ Secret scan passed."
