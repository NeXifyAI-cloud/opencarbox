#!/usr/bin/env node
// Runs prisma generate with a DATABASE_URL fallback for CI/build environments
// where the actual database is not yet available (e.g. Vercel postinstall).

const { execSync } = require('child_process');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

try {
  execSync('prisma generate', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.error('prisma generate failed. Ensure Prisma is installed and DATABASE_URL is valid.');
  process.exit(err.status ?? 1);
}
