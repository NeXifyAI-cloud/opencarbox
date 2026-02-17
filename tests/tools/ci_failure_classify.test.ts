import { describe, expect, it } from 'vitest';

import {
  classifyFailure,
  isTransient,
  suggestedLabels,
} from '../../tools/ci_failure_classify';

describe('ci_failure_classify', () => {
  describe('classifyFailure', () => {
    it('detects lint errors', () => {
      const result = classifyFailure('ESLint found 3 errors and 1 warning');
      expect(result.failureClass).toBe('lint');
      expect(result.retryable).toBe(false);
      expect(result.confidence).toBe('high');
    });

    it('detects format errors', () => {
      const result = classifyFailure('Prettier check failed: Code style issues found');
      expect(result.failureClass).toBe('format');
      expect(result.retryable).toBe(false);
    });

    it('detects TypeScript errors', () => {
      const result = classifyFailure(
        "src/app/page.tsx(5,3): error TS2322: Type 'string' is not assignable to type 'number'."
      );
      expect(result.failureClass).toBe('typecheck');
      expect(result.retryable).toBe(false);
    });

    it('detects network transient errors', () => {
      const result = classifyFailure('Error: connect ETIMEDOUT 104.16.26.34:443');
      expect(result.failureClass).toBe('network-transient');
      expect(result.retryable).toBe(true);
      expect(result.confidence).toBe('high');
    });

    it('detects registry timeout', () => {
      const result = classifyFailure(
        'ERR_PNPM_FETCH_404  GET https://registry.npmjs.org/foo - Not Found'
      );
      expect(result.failureClass).toBe('registry-timeout');
      expect(result.retryable).toBe(true);
    });

    it('detects test flaky patterns', () => {
      const result = classifyFailure('test timed out after 30000ms');
      expect(result.failureClass).toBe('test-flaky');
      expect(result.retryable).toBe(true);
      expect(result.confidence).toBe('medium');
    });

    it('detects deterministic test failures', () => {
      const result = classifyFailure(
        'FAIL  tests/api/health.test.ts\n  expect(received).toBe(expected)'
      );
      expect(result.failureClass).toBe('test-deterministic');
      expect(result.retryable).toBe(false);
    });

    it('detects build errors', () => {
      const result = classifyFailure("Build error: Module not found: Can't resolve '@/missing'");
      expect(result.failureClass).toBe('build');
      expect(result.retryable).toBe(false);
    });

    it('detects dependency errors', () => {
      const result = classifyFailure('ERR_PNPM_OUTDATED_LOCKFILE');
      expect(result.failureClass).toBe('deps');
      expect(result.retryable).toBe(false);
    });

    it('returns unknown for unrecognized output', () => {
      const result = classifyFailure('Something completely unrelated happened');
      expect(result.failureClass).toBe('unknown');
      expect(result.retryable).toBe(false);
      expect(result.confidence).toBe('low');
    });

    it('detects ECONNRESET as transient', () => {
      const result = classifyFailure('Error: read ECONNRESET');
      expect(result.failureClass).toBe('network-transient');
      expect(result.retryable).toBe(true);
    });
  });

  describe('isTransient', () => {
    it('returns true for network-transient with high confidence', () => {
      const result = classifyFailure('ETIMEDOUT');
      expect(isTransient(result)).toBe(true);
    });

    it('returns false for lint errors', () => {
      const result = classifyFailure('ESLint found 1 error');
      expect(isTransient(result)).toBe(false);
    });

    it('returns false for unknown', () => {
      const result = classifyFailure('random text');
      expect(isTransient(result)).toBe(false);
    });
  });

  describe('suggestedLabels', () => {
    it('suggests autofix-candidate for lint', () => {
      const result = classifyFailure('ESLint found 5 errors');
      const labels = suggestedLabels(result);
      expect(labels).toContain('autofix-candidate');
      expect(labels).toContain('ci-failure');
    });

    it('suggests flaky-test for flaky tests', () => {
      const result = classifyFailure('test timed out');
      const labels = suggestedLabels(result);
      expect(labels).toContain('flaky-test');
    });

    it('suggests needs-human for build errors', () => {
      const result = classifyFailure('Build error occurred');
      const labels = suggestedLabels(result);
      expect(labels).toContain('needs-human');
    });

    it('suggests transient for network errors', () => {
      const result = classifyFailure('ETIMEDOUT');
      const labels = suggestedLabels(result);
      expect(labels).toContain('transient');
    });
  });
});
