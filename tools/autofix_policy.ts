/**
 * Autofix Policy (Auftrag 28)
 *
 * Defines which files/patterns are allowed to be auto-fixed,
 * rate-limit logic, and safety guardrails.
 */

/** Glob patterns allowed for autofix changes */
const ALLOWED_PATTERNS: RegExp[] = [
  /^src\//,
  /^tests\//,
  /^tools\//,
  /^\.eslintrc/,
  /^\.prettierrc/,
  /^tsconfig.*\.json$/,
  /^vitest\.config\./,
  /^tailwind\.config\./,
  /^postcss\.config\./,
  /^next\.config\./,
];

/** Patterns that must NEVER be auto-fixed */
const BLOCKED_PATTERNS: RegExp[] = [
  /^prisma\/migrations\//,
  /^supabase\/migrations\//,
  /\.env/,
  /\.secret/,
  /SECRETS/i,
  /^\.github\/CODEOWNERS$/,
  /package-lock\.json$/,
];

/** Maximum number of files an autofix PR can change */
const MAX_CHANGED_FILES = 20;

/** Maximum diff size in lines for an autofix PR */
const MAX_DIFF_LINES = 500;

/** Cooldown period per SHA in hours */
const COOLDOWN_HOURS = 6;

export interface PolicyCheckResult {
  allowed: boolean;
  violations: string[];
}

/**
 * Check if a list of changed file paths passes the autofix policy.
 */
export function checkFiles(files: string[]): PolicyCheckResult {
  const violations: string[] = [];

  if (files.length > MAX_CHANGED_FILES) {
    violations.push(
      `Too many files changed: ${files.length} (max ${MAX_CHANGED_FILES})`
    );
  }

  for (const file of files) {
    // Check blocked patterns first
    for (const blocked of BLOCKED_PATTERNS) {
      if (blocked.test(file)) {
        violations.push(`Blocked file: ${file} (matches ${blocked.source})`);
      }
    }

    // Check if file is in allowed patterns
    const isAllowed = ALLOWED_PATTERNS.some((p) => p.test(file));
    if (!isAllowed) {
      // Config files at root are generally OK for lint/format fixes
      const isRootConfig = /^\.[a-z]/.test(file) || /^[a-z]+\.config\./.test(file);
      if (!isRootConfig) {
        violations.push(`File not in allowlist: ${file}`);
      }
    }
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Check if diff size is within limits.
 */
export function checkDiffSize(diffLines: number): PolicyCheckResult {
  const violations: string[] = [];

  if (diffLines > MAX_DIFF_LINES) {
    violations.push(
      `Diff too large: ${diffLines} lines (max ${MAX_DIFF_LINES})`
    );
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Check if cooldown period has passed for a given SHA.
 * Returns whether a new autofix PR is allowed.
 */
export function checkCooldown(
  lastFixTimestamp: number | null,
  now: number = Date.now()
): PolicyCheckResult {
  const violations: string[] = [];

  if (lastFixTimestamp !== null) {
    const elapsedHours = (now - lastFixTimestamp) / (1000 * 60 * 60);
    if (elapsedHours < COOLDOWN_HOURS) {
      violations.push(
        `Cooldown active: ${elapsedHours.toFixed(1)}h elapsed (min ${COOLDOWN_HOURS}h)`
      );
    }
  }

  return {
    allowed: violations.length === 0,
    violations,
  };
}

/**
 * Run all policy checks.
 */
export function fullCheck(params: {
  files: string[];
  diffLines: number;
  lastFixTimestamp: number | null;
}): PolicyCheckResult {
  const fileCheck = checkFiles(params.files);
  const diffCheck = checkDiffSize(params.diffLines);
  const cooldownCheck = checkCooldown(params.lastFixTimestamp);

  const allViolations = [
    ...fileCheck.violations,
    ...diffCheck.violations,
    ...cooldownCheck.violations,
  ];

  return {
    allowed: allViolations.length === 0,
    violations: allViolations,
  };
}

export const LIMITS = {
  MAX_CHANGED_FILES,
  MAX_DIFF_LINES,
  COOLDOWN_HOURS,
} as const;
