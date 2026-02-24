#!/bin/bash

# OpenCarBox Production Deployment Script
# Für 15:00 CET Übergabe vorbereitet

set -e

echo "🚀 OpenCarBox Production Deployment - $(date)"
echo "=============================================="

# 1. Prüfe Environment Variables
echo "📋 Prüfe Environment Variables..."
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN nicht gesetzt"
    exit 1
fi

if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "❌ VERCEL_PROJECT_ID nicht gesetzt"
    exit 1
fi

# 2. Installiere Dependencies
echo "📦 Installiere Dependencies..."
pnpm install --frozen-lockfile

# 3. Prüfe Code-Qualität
echo "🔍 Prüfe Code-Qualität..."
pnpm lint
pnpm type-check

# 4. Führe Tests aus
echo "🧪 Führe Tests aus..."
pnpm test

# 5. Baue Projekt
echo "🏗️  Baue Projekt..."
pnpm build

# 6. Deploy zu Vercel
echo "🚀 Deploy zu Vercel..."
vercel deploy --prod --token=$VERCEL_TOKEN --yes

# 7. Prüfe Deployment
echo "✅ Deployment abgeschlossen!"
echo "📊 Status: https://vercel.com/dashboard"

# 8. Cleanup temporärer Dateien
echo "🧹 Cleanup..."
rm -f vercel_logs*.json

echo "🎉 OpenCarBox ist bereit für 15:00 CET Übergabe!"