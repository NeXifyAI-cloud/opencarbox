#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="tools/guard_no_openai.sh"

if ! command -v rg >/dev/null 2>&1; then
  echo "guard_no_openai.sh requires ripgrep (rg)."
  exit 2
fi

SEARCH_ROOTS=(
  "src"
  "scripts"
  "tools"
  "tests"
  ".github/workflows"
  "package.json"
  "package-lock.json"
  "pnpm-lock.yaml"
)

EXISTING_ROOTS=()
for root in "${SEARCH_ROOTS[@]}"; do
  if [[ -e "${root}" ]]; then
    EXISTING_ROOTS+=("${root}")
  fi
done

scan_forbidden() {
  local label="$1"
  local pattern="$2"

  local out
  out="$(rg -n --hidden --glob "!${SCRIPT_PATH}" --glob '!.git' "${pattern}" "${EXISTING_ROOTS[@]}" || true)"

  if [[ -n "${out}" ]]; then
    echo "[${label}]"
    echo "${out}"
    echo
    return 1
  fi

  return 0
}

had_violation=0

scan_forbidden "forbidden env usage" "OPENAI_|GOOGLE_API_KEY|GEMINI_API_KEY|ANTHROPIC_API_KEY" || had_violation=1
scan_forbidden "forbidden provider sdk" "@google/generative-ai|@google/genai|@anthropic-ai/sdk|cohere-ai|mistralai" || had_violation=1

if [[ "${had_violation}" -ne 0 ]]; then
  echo "Found forbidden AI provider drift. Allowed in production: DeepSeek + NSCALE only."
  exit 1
fi

echo "OK: no forbidden provider usage found (DeepSeek + NSCALE policy)."
