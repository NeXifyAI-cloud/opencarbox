#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="tools/guard_no_openai.sh"
EXCLUDE_FILES=("${SCRIPT_PATH}" "tools/check_env_schema.ts")

USE_RG=false
if command -v rg >/dev/null 2>&1; then
  USE_RG=true
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
  if [[ "${USE_RG}" == true ]]; then
    local rg_excludes=()
    for f in "${EXCLUDE_FILES[@]}"; do
      rg_excludes+=(--glob "!${f}")
    done
    out="$(rg -n --hidden "${rg_excludes[@]}" --glob '!.git' "${pattern}" "${EXISTING_ROOTS[@]}" || true)"
  else
    local raw
    raw="$(grep -rn -E "${pattern}" --exclude-dir=.git --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' --include='*.json' --include='*.yml' --include='*.yaml' --include='*.sh' "${EXISTING_ROOTS[@]}" || true)"
    out=""
    while IFS= read -r line; do
      [[ -z "${line}" ]] && continue
      local skip=false
      for f in "${EXCLUDE_FILES[@]}"; do
        if [[ "${line}" == "${f}:"* ]]; then
          skip=true
          break
        fi
      done
      [[ "${skip}" == true ]] || out+="${line}"$'\n'
    done <<< "${raw}"
    out="${out%$'\n'}"
  fi

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
