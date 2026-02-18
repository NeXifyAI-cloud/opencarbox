#!/usr/bin/env bash
set -euo pipefail


resolve_github_token() {
  if [[ -n "${GH_TOKEN:-}" ]]; then
    return 0
  fi

  if [[ -n "${CLASSIC_TOKEN_GITHUB_NEU:-}" ]]; then
    export GH_TOKEN="$CLASSIC_TOKEN_GITHUB_NEU"
    return 0
  fi

  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    export GH_TOKEN="$GITHUB_TOKEN"
    return 0
  fi

  return 1
}

resolve_github_token || true

: "${GITHUB_OWNER:?Set GITHUB_OWNER (user or org)}"
: "${REPO_NAME:?Set REPO_NAME}"
: "${GH_TOKEN:?Set GH_TOKEN (or CLASSIC_TOKEN_GITHUB_NEU/GITHUB_TOKEN)}"

if ! gh auth status >/dev/null 2>&1; then
  echo "$GH_TOKEN" | gh auth login --with-token >/dev/null
fi


if ! gh repo view "$GITHUB_OWNER/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$GITHUB_OWNER/$REPO_NAME" --private --confirm
fi

git init -q || true
git remote remove origin >/dev/null 2>&1 || true
git remote add origin "https://github.com/$GITHUB_OWNER/$REPO_NAME.git" || true

# Labels
gh label create "type:bug" --repo "$GITHUB_OWNER/$REPO_NAME" --color "d73a4a" --force || true
gh label create "type:feature" --repo "$GITHUB_OWNER/$REPO_NAME" --color "a2eeef" --force || true
gh label create "type:chore" --repo "$GITHUB_OWNER/$REPO_NAME" --color "cfd3d7" --force || true
gh label create "area:ai" --repo "$GITHUB_OWNER/$REPO_NAME" --color "bfdadc" --force || true
gh label create "area:supabase" --repo "$GITHUB_OWNER/$REPO_NAME" --color "0e8a16" --force || true
gh label create "area:vercel" --repo "$GITHUB_OWNER/$REPO_NAME" --color "5319e7" --force || true
gh label create "area:docs" --repo "$GITHUB_OWNER/$REPO_NAME" --color "f9d0c4" --force || true

echo "GitHub repo bootstrap done."
