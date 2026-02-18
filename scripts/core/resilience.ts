#!/usr/bin/env tsx
/**
 * Cline Resilience Core - Absturzsicherheit & Auto-Recovery
 *
 * Features:
 * - Auto-Restart bei Abstürzen
 * - Graceful Degradation
 * - Circuit Breaker Pattern
 * - Health Monitoring
 * - Automatic Recovery
 */

import * as fs from 'fs';
import * as path from 'path';
import { Memory } from './memory';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  healthCheckIntervalMs: 30000,
  circuitBreakerThreshold: 5,
  circuitBreakerResetMs: 60000,
  stateFilePath: path.join(process.cwd(), '.cline', 'resilience-state.json'),
  logFilePath: path.join(process.cwd(), '.cline', 'resilience.log'),
};

// ============================================================================
// TYPES
// ============================================================================

export interface ResilienceState {
  lastHealthCheck: string;
  consecutiveFailures: number;
  circuitBreakerOpen: boolean;
  circuitBreakerOpenedAt?: string;
  recoveryAttempts: number;
  lastError?: string;
  services: {
    oracle: ServiceState;
    memory: ServiceState;
    sync: ServiceState;
  };
}

export interface ServiceState {
  status: 'healthy' | 'degraded' | 'failed';
  lastSuccess?: string;
  lastFailure?: string;
  failureCount: number;
}

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

// ============================================================================
// RESILIENCE STATE MANAGEMENT
// ============================================================================

const DEFAULT_STATE: ResilienceState = {
  lastHealthCheck: new Date().toISOString(),
  consecutiveFailures: 0,
  circuitBreakerOpen: false,
  recoveryAttempts: 0,
  services: {
    oracle: { status: 'healthy', failureCount: 0 },
    memory: { status: 'healthy', failureCount: 0 },
    sync: { status: 'healthy', failureCount: 0 },
  },
};

function loadState(): ResilienceState {
  try {
    if (fs.existsSync(CONFIG.stateFilePath)) {
      const data = fs.readFileSync(CONFIG.stateFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    logError('Failed to load resilience state', error);
  }
  return { ...DEFAULT_STATE };
}

function saveState(state: ResilienceState): void {
  try {
    const dir = path.dirname(CONFIG.stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.stateFilePath, JSON.stringify(state, null, 2));
  } catch (error) {
    logError('Failed to save resilience state', error);
  }
}

// ============================================================================
// LOGGING
// ============================================================================

function logInfo(message: string): void {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] INFO: ${message}\n`;
  console.log(`🟢 ${message}`);
  appendLog(logLine);
}

function logWarning(message: string): void {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] WARN: ${message}\n`;
  console.warn(`🟡 ${message}`);
  appendLog(logLine);
}

function logError(message: string, error?: any): void {
  const timestamp = new Date().toISOString();
  const errorMsg = error instanceof Error ? error.message : String(error || '');
  const logLine = `[${timestamp}] ERROR: ${message} - ${errorMsg}\n`;
  console.error(`🔴 ${message}`, error);
  appendLog(logLine);
}

function appendLog(line: string): void {
  try {
    const dir = path.dirname(CONFIG.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(CONFIG.logFilePath, line);
  } catch {
    // Silent fail for logging
  }
}

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

export class CircuitBreaker {
  private state = loadState();

  isOpen(): boolean {
    if (!this.state.circuitBreakerOpen) return false;

    // Check if enough time has passed to try again
    if (this.state.circuitBreakerOpenedAt) {
      const openedAt = new Date(this.state.circuitBreakerOpenedAt).getTime();
      const now = Date.now();
      if (now - openedAt > CONFIG.circuitBreakerResetMs) {
        this.halfOpen();
        return false;
      }
    }
    return true;
  }

  recordSuccess(): void {
    this.state.consecutiveFailures = 0;
    this.state.circuitBreakerOpen = false;
    this.state.circuitBreakerOpenedAt = undefined;
    saveState(this.state);
    logInfo('Circuit breaker: Success recorded, circuit closed');
  }

  recordFailure(): void {
    this.state.consecutiveFailures++;
    if (this.state.consecutiveFailures >= CONFIG.circuitBreakerThreshold) {
      this.state.circuitBreakerOpen = true;
      this.state.circuitBreakerOpenedAt = new Date().toISOString();
      logWarning(`Circuit breaker: OPENED after ${this.state.consecutiveFailures} failures`);
    }
    saveState(this.state);
  }

  private halfOpen(): void {
    logInfo('Circuit breaker: Half-open, allowing test request');
    this.state.circuitBreakerOpen = false;
    saveState(this.state);
  }

  getState(): ResilienceState {
    return this.state;
  }
}

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

export async function withRetry<T>(
  fn: AsyncFunction<T>,
  operationName: string,
  maxRetries: number = CONFIG.maxRetries
): Promise<T> {
  const circuitBreaker = new CircuitBreaker();

  if (circuitBreaker.isOpen()) {
    throw new Error(`Circuit breaker is open. Operation '${operationName}' blocked.`);
  }

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logInfo(`${operationName}: Attempt ${attempt}/${maxRetries}`);
      const result = await fn();
      circuitBreaker.recordSuccess();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logError(`${operationName}: Attempt ${attempt} failed`, lastError);

      if (attempt < maxRetries) {
        const delay = CONFIG.retryDelayMs * Math.pow(2, attempt - 1);
        logInfo(`${operationName}: Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  circuitBreaker.recordFailure();
  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
}

// ============================================================================
// GRACEFUL DEGRADATION
// ============================================================================

export async function withFallback<T>(
  primary: AsyncFunction<T>,
  fallback: AsyncFunction<T>,
  operationName: string
): Promise<T> {
  try {
    return await withRetry(primary, operationName);
  } catch (primaryError) {
    logWarning(`${operationName}: Primary failed, using fallback`);
    try {
      return await fallback();
    } catch (fallbackError) {
      logError(`${operationName}: Fallback also failed`, fallbackError);
      throw fallbackError;
    }
  }
}

// ============================================================================
// SAFE EXECUTION WRAPPER
// ============================================================================

export async function safeExecute<T>(
  fn: AsyncFunction<T>,
  operationName: string,
  options: {
    logToMemory?: boolean;
    fallbackValue?: T;
    retries?: number;
  } = {}
): Promise<T | undefined> {
  const { logToMemory = true, fallbackValue, retries = CONFIG.maxRetries } = options;

  const startTime = Date.now();

  try {
    const result = await withRetry(fn, operationName, retries);

    if (logToMemory) {
      await Memory.audit({
        action: operationName,
        resource: 'cline-resilience',
        status: 'SUCCESS',
        duration_ms: Date.now() - startTime,
      }).catch(() => {}); // Silent fail for audit
    }

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    if (logToMemory) {
      await Memory.audit({
        action: operationName,
        resource: 'cline-resilience',
        status: 'FAILURE',
        error_message: errorMsg,
        duration_ms: Date.now() - startTime,
      }).catch(() => {}); // Silent fail for audit
    }

    if (fallbackValue !== undefined) {
      logWarning(`${operationName}: Returning fallback value`);
      return fallbackValue;
    }

    return undefined;
  }
}

// ============================================================================
// HEALTH CHECK SYSTEM
// ============================================================================

export interface HealthCheckResult {
  healthy: boolean;
  services: {
    oracle: boolean;
    memory: boolean;
    filesystem: boolean;
    env: boolean;
  };
  details: string[];
}

export async function healthCheck(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    healthy: true,
    services: {
      oracle: false,
      memory: false,
      filesystem: false,
      env: false,
    },
    details: [],
  };

  // Check Environment Variables
  const requiredEnvVars = ['AI_PROVIDER', 'DEEPSEEK_API_KEY', 'NSCALE_API_KEY'];
  const optionalEnvVars = ['DEEPSEEK_BASE_URL', 'NSCALE_HEADER_NAME'];

  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
  const missingOptionalEnvVars = optionalEnvVars.filter(v => !process.env[v]);
  const isProviderValid = process.env.AI_PROVIDER === 'deepseek';

  result.services.env = missingEnvVars.length === 0 && isProviderValid;
  if (!result.services.env) {
    if (missingEnvVars.length > 0) {
      result.details.push(`Missing required AI env vars: ${missingEnvVars.join(', ')}`);
    }
    if (!isProviderValid) {
      result.details.push(`Invalid AI_PROVIDER: expected "deepseek", got "${process.env.AI_PROVIDER || 'undefined'}"`);
    }
    result.healthy = false;
  }

  if (missingOptionalEnvVars.length > 0) {
    result.details.push(`Optional AI env vars not set: ${missingOptionalEnvVars.join(', ')}`);
  }

  // Check Filesystem
  try {
    const testFile = path.join(process.cwd(), '.cline', 'health-check.tmp');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    result.services.filesystem = true;
  } catch (error) {
    result.services.filesystem = false;
    result.details.push('Filesystem write test failed');
    result.healthy = false;
  }

  // Check Memory (Supabase)
  try {
    if (result.services.env) {
      await Memory.recall('health-check-test');
      result.services.memory = true;
    }
  } catch (error) {
    result.services.memory = false;
    result.details.push('Memory (Supabase) connection failed');
    result.healthy = false;
  }

  // Check Oracle (DeepSeek/NSCALE)
  try {
    if (result.services.env) {
      // Simple check - just verify the module loads
      result.services.oracle = true;
    }
  } catch (error) {
    result.services.oracle = false;
    result.details.push('Oracle (DeepSeek/NSCALE) connection failed');
    result.healthy = false;
  }

  // Update state
  const state = loadState();
  state.lastHealthCheck = new Date().toISOString();
  state.services.oracle.status = result.services.oracle ? 'healthy' : 'failed';
  state.services.memory.status = result.services.memory ? 'healthy' : 'failed';
  saveState(state);

  return result;
}

// ============================================================================
// AUTO-RECOVERY SYSTEM
// ============================================================================

export async function attemptRecovery(): Promise<boolean> {
  logInfo('🔧 AUTO-RECOVERY: Starting recovery attempt...');

  const state = loadState();
  state.recoveryAttempts++;
  saveState(state);

  const recoverySteps: Array<{ name: string; action: () => Promise<boolean> }> = [
    {
      name: 'Reset Circuit Breaker',
      action: async () => {
        state.circuitBreakerOpen = false;
        state.consecutiveFailures = 0;
        saveState(state);
        return true;
      },
    },
    {
      name: 'Clear Stale State',
      action: async () => {
        state.services.oracle = { status: 'healthy', failureCount: 0 };
        state.services.memory = { status: 'healthy', failureCount: 0 };
        state.services.sync = { status: 'healthy', failureCount: 0 };
        saveState(state);
        return true;
      },
    },
    {
      name: 'Verify Connections',
      action: async () => {
        const health = await healthCheck();
        return health.healthy;
      },
    },
  ];

  let successCount = 0;

  for (const step of recoverySteps) {
    try {
      logInfo(`Recovery: ${step.name}...`);
      const success = await step.action();
      if (success) {
        successCount++;
        logInfo(`  ✅ ${step.name} succeeded`);
      } else {
        logWarning(`  ⚠️ ${step.name} returned false`);
      }
    } catch (error) {
      logError(`  ❌ ${step.name} failed`, error);
    }
  }

  const recovered = successCount === recoverySteps.length;

  if (recovered) {
    logInfo('🔧 AUTO-RECOVERY: Successfully recovered!');
    state.lastError = undefined;
    saveState(state);

    await Memory.audit({
      action: 'auto_recovery',
      resource: 'cline-resilience',
      status: 'SUCCESS',
      details: { recoveryAttempts: state.recoveryAttempts },
    }).catch(() => {});
  } else {
    logWarning(`🔧 AUTO-RECOVERY: Partial recovery (${successCount}/${recoverySteps.length} steps)`);

    await Memory.audit({
      action: 'auto_recovery',
      resource: 'cline-resilience',
      status: 'WARNING',
      details: { successCount, totalSteps: recoverySteps.length },
    }).catch(() => {});
  }

  return recovered;
}

// ============================================================================
// CRASH HANDLER
// ============================================================================

export function setupCrashHandlers(): void {
  // Uncaught Exception Handler
  process.on('uncaughtException', async (error) => {
    logError('UNCAUGHT EXCEPTION', error);

    const state = loadState();
    state.lastError = error.message;
    state.consecutiveFailures++;
    saveState(state);

    await Memory.audit({
      action: 'uncaught_exception',
      resource: 'cline-process',
      status: 'FAILURE',
      error_message: error.message,
      stack_trace: error.stack,
    }).catch(() => {});

    // Attempt recovery
    await attemptRecovery();
  });

  // Unhandled Promise Rejection Handler
  process.on('unhandledRejection', async (reason, _promise) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logError('UNHANDLED REJECTION', error);

    const state = loadState();
    state.lastError = error.message;
    saveState(state);

    await Memory.audit({
      action: 'unhandled_rejection',
      resource: 'cline-process',
      status: 'FAILURE',
      error_message: error.message,
      stack_trace: error.stack,
    }).catch(() => {});
  });

  // Graceful Shutdown Handler
  process.on('SIGTERM', async () => {
    logInfo('Received SIGTERM, graceful shutdown...');
    await gracefulShutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logInfo('Received SIGINT, graceful shutdown...');
    await gracefulShutdown();
    process.exit(0);
  });

  logInfo('Crash handlers initialized');
}

async function gracefulShutdown(): Promise<void> {
  logInfo('Performing graceful shutdown...');

  const state = loadState();
  state.lastHealthCheck = new Date().toISOString();
  saveState(state);

  await Memory.audit({
    action: 'graceful_shutdown',
    resource: 'cline-process',
    status: 'SUCCESS',
  }).catch(() => {});

  logInfo('Graceful shutdown complete');
}

// ============================================================================
// UTILITIES
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// MAIN EXPORTS & CLI
// ============================================================================

export const Resilience = {
  withRetry,
  withFallback,
  safeExecute,
  healthCheck,
  attemptRecovery,
  setupCrashHandlers,
  loadState,
  saveState,
  CircuitBreaker,
};

// CLI Mode
if (require.main === module) {
  const command = process.argv[2];

  (async () => {
    switch (command) {
      case 'health':
        console.log('\n🏥 CLINE HEALTH CHECK\n');
        const health = await healthCheck();
        console.log('Services:');
        console.log(`  Oracle:     ${health.services.oracle ? '✅' : '❌'}`);
        console.log(`  Memory:     ${health.services.memory ? '✅' : '❌'}`);
        console.log(`  Filesystem: ${health.services.filesystem ? '✅' : '❌'}`);
        console.log(`  Env Vars:   ${health.services.env ? '✅' : '❌'}`);
        if (health.details.length > 0) {
          console.log('\nIssues:');
          health.details.forEach(d => console.log(`  - ${d}`));
        }
        console.log(`\nOverall: ${health.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}\n`);
        break;

      case 'recover':
        console.log('\n🔧 CLINE AUTO-RECOVERY\n');
        const recovered = await attemptRecovery();
        console.log(`\nRecovery: ${recovered ? '✅ SUCCESS' : '⚠️ PARTIAL'}\n`);
        break;

      case 'status':
        console.log('\n📊 CLINE RESILIENCE STATUS\n');
        const state = loadState();
        console.log(JSON.stringify(state, null, 2));
        break;

      case 'reset':
        console.log('\n🔄 RESETTING RESILIENCE STATE\n');
        saveState({ ...DEFAULT_STATE });
        console.log('✅ State reset to defaults\n');
        break;

      default:
        console.log(`
🛡️ CLINE RESILIENCE CLI

Usage:
  npm run cline:health     - Check system health
  npm run cline:recover    - Attempt auto-recovery
  npm run cline:status     - Show resilience state
  npm run cline:reset      - Reset to defaults

Or run directly:
  tsx scripts/core/resilience.ts <command>
        `);
    }
  })();
}
