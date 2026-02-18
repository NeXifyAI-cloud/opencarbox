#!/usr/bin/env bash
set -eu

echo "Running lightweight secret scan on tracked files..."

# Locate rg
RG_CMD=""
if command -v rg &>/dev/null; then
  RG_CMD="rg"
elif [ -f "/mnt/c/Users/pcour/AppData/Local/Microsoft/WinGet/Links/rg.exe" ]; then
  RG_CMD="/mnt/c/Users/pcour/AppData/Local/Microsoft/WinGet/Links/rg.exe"
else
  echo "WARNING: ripgrep not found -- secret scan skipped. Install: winget install BurntSushi.ripgrep.MSVC"
  exit 0
fi

PATTERN='(sbp_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*eyJ[A-Za-z0-9._-]+|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{32,}|AIza[0-9A-Za-z_-]{20,})'

if "$RG_CMD" -n --hidden --glob '!.git' --glob '!.next' --glob '!node_modules' --glob '!pnpm-lock.yaml' --glob '!*.sh' --pcre2 "$PATTERN" .; then
  echo "FAIL: Potential secret/token pattern found."
  exit 1
fi

echo "Secret scan passed."
