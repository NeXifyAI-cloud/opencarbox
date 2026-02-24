#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('[postinstall] Starting Prisma Client generation...');

// Ensure DATABASE_URL is set for the generator
if (!process.env.DATABASE_URL) {
  console.log('[postinstall] DATABASE_URL missing, setting dummy URL for generator');
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}

try {
  console.log('[postinstall] Running: npx prisma generate');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('[postinstall] ✅ Prisma Client generated successfully');
} catch (error) {
  console.error('[postinstall] ❌ Prisma Client generation failed');
  console.error(error.message);
  process.exit(1); // Fail the build if we can't generate the client
}
