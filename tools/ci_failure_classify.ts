/**
 * CI Failure Classifier (Auftrag 24)
 *
 * Deterministic classification of CI failure logs into known categories.
 * No AI — uses pattern matching on error strings and exit codes.
 */

export type FailureClass =
  | 'lint'
  | 'format'
  | 'typecheck'
  | 'test-flaky'
  | 'test-deterministic'
  | 'build'
  | 'deps'
  | 'network-transient'
  | 'registry-timeout'
  | 'unknown';

export interface ClassifyResult {
  failureClass: FailureClass;
  retryable: boolean;
  confidence: 'high' | 'medium' | 'low';
  matchedPattern: string;
}

interface Pattern {
  failureClass: FailureClass;
  regex: RegExp;
  retryable: boolean;
  confidence: 'high' | 'medium' | 'low';
}

const PATTERNS: Pattern[] = [
  // Network / transient errors (retryable)
  {
    failureClass: 'network-transient',
    regex: /ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|socket hang up|network timeout/i,
    retryable: true,
    confidence: 'high',
  },
  {
    failureClass: 'registry-timeout',
    regex: /ERR_PNPM_FETCH_\d+|npm ERR! network|ERR_PNPM_REGISTRIES|registry\.npmjs\.org.*timeout|fetch failed/i,
    retryable: true,
    confidence: 'high',
  },
  // Lint errors
  {
    failureClass: 'lint',
    regex: /ESLint.*found \d+ (error|problem)|eslint.*--fix|Lint error|✖ \d+ problem/i,
    retryable: false,
    confidence: 'high',
  },
  // Format errors
  {
    failureClass: 'format',
    regex: /Prettier.*check.*failed|Code style issues found|prettier --write/i,
    retryable: false,
    confidence: 'high',
  },
  // TypeScript errors
  {
    failureClass: 'typecheck',
    regex: /TS\d{4,5}:|error TS\d+|Type '.*' is not assignable|tsc.*--noEmit.*failed/i,
    retryable: false,
    confidence: 'high',
  },
  // Test flaky indicators
  {
    failureClass: 'test-flaky',
    regex: /RETRY|flaky|timed?\s*out.*test|test.*timed?\s*out|Exceeded timeout|socket hang up.*test/i,
    retryable: true,
    confidence: 'medium',
  },
  // Test deterministic failures
  {
    failureClass: 'test-deterministic',
    regex: /FAIL\s+tests\/|AssertionError|expect\(.*\)\.(toBe|toEqual|toMatch)|Test Suites:.*failed|vitest.*failed/i,
    retryable: false,
    confidence: 'high',
  },
  // Build errors
  {
    failureClass: 'build',
    regex: /Build (error|failed)|next build.*failed|Module not found|Cannot find module/i,
    retryable: false,
    confidence: 'high',
  },
  // Dependency errors
  {
    failureClass: 'deps',
    regex: /npm ERR! code EUSAGE|npm ci.*failed|package-lock\.json.*missing|ERR_PNPM_OUTDATED_LOCKFILE|ERR_PNPM_NO_MATCHING_VERSION|ERR_PNPM_FETCH_FAIL/i,
    retryable: false,
    confidence: 'high',
  },
];

export function classifyFailure(logOutput: string): ClassifyResult {
  for (const pattern of PATTERNS) {
    const match = pattern.regex.exec(logOutput);
    if (match) {
      return {
        failureClass: pattern.failureClass,
        retryable: pattern.retryable,
        confidence: pattern.confidence,
        matchedPattern: match[0],
      };
    }
  }

  return {
    failureClass: 'unknown',
    retryable: false,
    confidence: 'low',
    matchedPattern: '',
  };
}

export function isTransient(result: ClassifyResult): boolean {
  return result.retryable && result.confidence !== 'low';
}

export function suggestedLabels(result: ClassifyResult): string[] {
  const labels: string[] = [];

  switch (result.failureClass) {
    case 'lint':
    case 'format':
      labels.push('autofix-candidate', 'ci-failure');
      break;
    case 'typecheck':
      labels.push('ci-failure', 'needs-human');
      break;
    case 'test-flaky':
      labels.push('flaky-test', 'ci-failure');
      break;
    case 'test-deterministic':
      labels.push('ci-failure', 'needs-human');
      break;
    case 'build':
      labels.push('ci-failure', 'needs-human');
      break;
    case 'deps':
      labels.push('ci-failure', 'autofix-candidate');
      break;
    case 'network-transient':
    case 'registry-timeout':
      labels.push('ci-failure', 'transient');
      break;
    default:
      labels.push('ci-failure', 'needs-human');
  }

  return labels;
}
