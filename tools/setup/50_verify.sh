#!/usr/bin/env bash
set -euo pipefail

npm run lint
npm run type-check
npm run test -- --run
npm run build

echo "Verification complete"
