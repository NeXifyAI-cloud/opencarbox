#!/usr/bin/env bash
set -euo pipefail

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1"; exit 1; }
}

need_cmd git
need_cmd node
need_cmd npm
need_cmd gh
need_cmd vercel
need_cmd supabase

echo "Prerequisites OK"
