import { describe, expect, it } from 'vitest';

import {
  checkCooldown,
  checkDiffSize,
  checkFiles,
  fullCheck,
  LIMITS,
} from '../../tools/autofix_policy';

describe('autofix_policy', () => {
  describe('checkFiles', () => {
    it('allows src/ files', () => {
      const result = checkFiles(['src/app/page.tsx', 'src/lib/utils.ts']);
      expect(result.allowed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('allows tests/ files', () => {
      const result = checkFiles(['tests/api/health.test.ts']);
      expect(result.allowed).toBe(true);
    });

    it('allows tools/ files', () => {
      const result = checkFiles(['tools/preflight.ts']);
      expect(result.allowed).toBe(true);
    });

    it('blocks migration files', () => {
      const result = checkFiles(['prisma/migrations/001_init.sql']);
      expect(result.allowed).toBe(false);
      expect(result.violations.some((v) => v.includes('Blocked'))).toBe(true);
    });

    it('blocks supabase migration files', () => {
      const result = checkFiles(['supabase/migrations/20240101.sql']);
      expect(result.allowed).toBe(false);
    });

    it('blocks .env files', () => {
      const result = checkFiles(['.env', '.env.local']);
      expect(result.allowed).toBe(false);
      expect(result.violations.length).toBeGreaterThanOrEqual(2);
    });

    it('blocks package-lock.json', () => {
      const result = checkFiles(['package-lock.json']);
      expect(result.allowed).toBe(false);
    });

    it('blocks too many files', () => {
      const files = Array.from({ length: 25 }, (_, i) => `src/file${i}.ts`);
      const result = checkFiles(files);
      expect(result.allowed).toBe(false);
      expect(result.violations.some((v) => v.includes('Too many'))).toBe(true);
    });

    it('allows config files at root', () => {
      const result = checkFiles(['.eslintrc.json', 'tailwind.config.ts']);
      expect(result.allowed).toBe(true);
    });
  });

  describe('checkDiffSize', () => {
    it('allows small diffs', () => {
      expect(checkDiffSize(100).allowed).toBe(true);
    });

    it('blocks large diffs', () => {
      const result = checkDiffSize(LIMITS.MAX_DIFF_LINES + 1);
      expect(result.allowed).toBe(false);
    });

    it('allows exactly the limit', () => {
      expect(checkDiffSize(LIMITS.MAX_DIFF_LINES).allowed).toBe(true);
    });
  });

  describe('checkCooldown', () => {
    it('allows when no previous fix', () => {
      expect(checkCooldown(null).allowed).toBe(true);
    });

    it('blocks within cooldown window', () => {
      const now = Date.now();
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;
      const result = checkCooldown(twoHoursAgo, now);
      expect(result.allowed).toBe(false);
    });

    it('allows after cooldown expires', () => {
      const now = Date.now();
      const sevenHoursAgo = now - 7 * 60 * 60 * 1000;
      const result = checkCooldown(sevenHoursAgo, now);
      expect(result.allowed).toBe(true);
    });
  });

  describe('fullCheck', () => {
    it('passes when all checks pass', () => {
      const result = fullCheck({
        files: ['src/app/page.tsx'],
        diffLines: 10,
        lastFixTimestamp: null,
      });
      expect(result.allowed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('fails when any check fails', () => {
      const result = fullCheck({
        files: ['.env'],
        diffLines: 10,
        lastFixTimestamp: null,
      });
      expect(result.allowed).toBe(false);
    });

    it('aggregates violations from multiple checks', () => {
      const now = Date.now();
      const result = fullCheck({
        files: ['.env'],
        diffLines: 9999,
        lastFixTimestamp: now - 1000,
      });
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
    });
  });
});
