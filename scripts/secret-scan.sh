#!/usr/bin/env bash
set -euo pipefail

PATTERN='(\bsbp_[A-Za-z0-9_-]{20,}|\bghp_[A-Za-z0-9]{20,}|\bsk_(?!test_)[A-Za-z0-9_-]{20,}|SUPABASE_ACCESS_TOKEN\s*=\s*sbp_[A-Za-z0-9_-]{20,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*(eyJ[A-Za-z0-9._-]{20,}|sb_[A-Za-z0-9._-]{20,}))'

if ! git ls-files -z | xargs -0 -r rg -n --pcre2 "$PATTERN" -- >/tmp/secret-scan.out; then
  echo "Secret scan passed: no obvious secret patterns found in tracked files."
  exit 0
fi

echo "Potential secret pattern found in tracked files:"
cat /tmp/secret-scan.out
exit 1
