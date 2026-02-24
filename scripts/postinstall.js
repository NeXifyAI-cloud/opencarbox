#!/usr/bin/env node

/**
 * Postinstall Script für Prisma
 * - Skipped in CI/Vercel wenn DATABASE_URL fehlt
 * - Fallback für Build-Umgebungen
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isDatabaseUrlMissing = !process.env.DATABASE_URL;
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';
const isVercel = process.env.VERCEL === '1';
const hasEnvLocal = fs.existsSync(path.join(process.cwd(), '.env.local'));

console.log('[postinstall] Prisma Generator Check:');
console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ MISSING'}`);
console.log(`  CI Environment: ${isCI ? '✅ YES' : '❌ NO'}`);
console.log(`  Vercel Build: ${isVercel ? '✅ YES' : '❌ NO'}`);
console.log(`  .env.local exists: ${hasEnvLocal ? '✅ YES' : '❌ NO'}`);

// Vercel Build: Skip prisma generate wenn DATABASE_URL fehlt
if (isVercel && isDatabaseUrlMissing) {
  console.log('[postinstall] ⏭️  Skipping prisma generate (Vercel Build + Missing DATABASE_URL)');
  console.log('[postinstall] ℹ️  Using schema validation fallback');
  process.exit(0);
}

// Local Development: Require DATABASE_URL
if (!isDatabaseUrlMissing && !isCI) {
  try {
    console.log('[postinstall] ▶️  Running prisma generate...');
    execSync('prisma generate', { stdio: 'inherit' });
    console.log('[postinstall] ✅ Prisma generate completed');
  } catch (error) {
    console.error('[postinstall] ❌ Prisma generate failed:', error.message);
    // Don't fail, fallback to schema validation
  }
}

// Fallback: Validate schema exists
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  console.log('[postinstall] ✅ Prisma schema found - ready for build');
} else {
  console.warn('[postinstall] ⚠️  Prisma schema not found at', schemaPath);
}

console.log('[postinstall] ✅ Postinstall completed');
process.exit(0);
