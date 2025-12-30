#!/usr/bin/env tsx
/**
 * Cline Watchdog - Process Monitor & Auto-Restart
 *
 * Überwacht Cline-Prozesse und startet sie bei Abstürzen automatisch neu.
 * Implementiert Watchdog Pattern mit Health Checks.
 */

import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Memory } from './memory';
import { attemptRecovery, healthCheck } from './resilience';

// ============================================================================
// CONFIGURATION
// ============================================================================

const WATCHDOG_CONFIG = {
  healthCheckIntervalMs: 30000,     // 30 seconds
  restartDelayMs: 5000,              // 5 seconds between restarts
  maxRestartAttempts: 5,             // Maximum restarts before giving up
  restartCooldownMs: 300000,         // 5 minutes cooldown after max restarts
  pidFilePath: path.join(process.cwd(), '.cline', 'watchdog.pid'),
  stateFilePath: path.join(process.cwd(), '.cline', 'watchdog-state.json'),
};

// ============================================================================
// TYPES
// ============================================================================

interface WatchdogState {
  startedAt: string;
  restartCount: number;
  lastRestart?: string;
  lastHealthCheck?: string;
  isRunning: boolean;
  currentPid?: number;
  errors: string[];
  cooldownUntil?: string;
}

interface ProcessConfig {
  name: string;
  command: string;
  args: string[];
  cwd: string;
  restartOnFailure: boolean;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const DEFAULT_WATCHDOG_STATE: WatchdogState = {
  startedAt: new Date().toISOString(),
  restartCount: 0,
  isRunning: false,
  errors: [],
};

function loadWatchdogState(): WatchdogState {
  try {
    if (fs.existsSync(WATCHDOG_CONFIG.stateFilePath)) {
      return JSON.parse(fs.readFileSync(WATCHDOG_CONFIG.stateFilePath, 'utf-8'));
    }
  } catch (error) {
    console.error('Failed to load watchdog state:', error);
  }
  return { ...DEFAULT_WATCHDOG_STATE };
}

function saveWatchdogState(state: WatchdogState): void {
  try {
    const dir = path.dirname(WATCHDOG_CONFIG.stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(WATCHDOG_CONFIG.stateFilePath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Failed to save watchdog state:', error);
  }
}

function writePidFile(pid: number): void {
  try {
    const dir = path.dirname(WATCHDOG_CONFIG.pidFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(WATCHDOG_CONFIG.pidFilePath, String(pid));
  } catch (error) {
    console.error('Failed to write PID file:', error);
  }
}

function clearPidFile(): void {
  try {
    if (fs.existsSync(WATCHDOG_CONFIG.pidFilePath)) {
      fs.unlinkSync(WATCHDOG_CONFIG.pidFilePath);
    }
  } catch (error) {
    console.error('Failed to clear PID file:', error);
  }
}

// ============================================================================
// WATCHDOG CLASS
// ============================================================================

export class Watchdog {
  private state: WatchdogState;
  private currentProcess: ChildProcess | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isShuttingDown = false;

  constructor() {
    this.state = loadWatchdogState();
    this.setupSignalHandlers();
  }

  /**
   * Startet den Watchdog mit einem Prozess
   */
  async start(config: ProcessConfig): Promise<void> {
    console.log(`\n🐕 WATCHDOG: Starting monitor for ${config.name}\n`);

    this.state.startedAt = new Date().toISOString();
    this.state.isRunning = true;
    saveWatchdogState(this.state);

    // Start health check loop
    this.startHealthChecks();

    // Start monitored process
    await this.spawnProcess(config);

    await Memory.audit({
      action: 'watchdog_start',
      resource: config.name,
      status: 'SUCCESS',
      details: { config },
    }).catch(() => {});
  }

  /**
   * Spawnt den überwachten Prozess
   */
  private async spawnProcess(config: ProcessConfig): Promise<void> {
    // Check cooldown
    if (this.state.cooldownUntil) {
      const cooldownEnd = new Date(this.state.cooldownUntil).getTime();
      if (Date.now() < cooldownEnd) {
        console.log(`⏳ WATCHDOG: In cooldown until ${this.state.cooldownUntil}`);
        return;
      } else {
        // Cooldown expired, reset
        this.state.cooldownUntil = undefined;
        this.state.restartCount = 0;
        saveWatchdogState(this.state);
      }
    }

    // Check max restarts
    if (this.state.restartCount >= WATCHDOG_CONFIG.maxRestartAttempts) {
      console.log(`⚠️ WATCHDOG: Max restart attempts (${WATCHDOG_CONFIG.maxRestartAttempts}) reached`);
      this.state.cooldownUntil = new Date(Date.now() + WATCHDOG_CONFIG.restartCooldownMs).toISOString();
      saveWatchdogState(this.state);

      await Memory.audit({
        action: 'watchdog_max_restarts',
        resource: config.name,
        status: 'WARNING',
        details: { restartCount: this.state.restartCount, cooldownUntil: this.state.cooldownUntil },
      }).catch(() => {});

      return;
    }

    console.log(`🚀 WATCHDOG: Spawning ${config.name}...`);

    this.currentProcess = spawn(config.command, config.args, {
      cwd: config.cwd,
      stdio: 'inherit',
      shell: true,
    });

    this.state.currentPid = this.currentProcess.pid;
    if (this.currentProcess.pid) {
      writePidFile(this.currentProcess.pid);
    }
    saveWatchdogState(this.state);

    // Handle process events
    this.currentProcess.on('exit', async (code, signal) => {
      console.log(`\n⚡ WATCHDOG: Process exited with code ${code}, signal ${signal}`);

      this.state.currentPid = undefined;
      clearPidFile();

      if (!this.isShuttingDown && config.restartOnFailure && code !== 0) {
        this.state.restartCount++;
        this.state.lastRestart = new Date().toISOString();
        this.state.errors.push(`Exit code ${code} at ${new Date().toISOString()}`);

        // Keep only last 10 errors
        if (this.state.errors.length > 10) {
          this.state.errors = this.state.errors.slice(-10);
        }
        saveWatchdogState(this.state);

        await Memory.audit({
          action: 'watchdog_process_crashed',
          resource: config.name,
          status: 'FAILURE',
          error_message: `Process crashed with code ${code}`,
          details: { code, signal, restartCount: this.state.restartCount },
        }).catch(() => {});

        // Attempt recovery before restart
        console.log(`\n🔧 WATCHDOG: Attempting recovery...`);
        await attemptRecovery();

        // Wait before restart
        console.log(`⏳ WATCHDOG: Waiting ${WATCHDOG_CONFIG.restartDelayMs}ms before restart...`);
        await this.sleep(WATCHDOG_CONFIG.restartDelayMs);

        // Restart
        console.log(`🔄 WATCHDOG: Restarting (attempt ${this.state.restartCount}/${WATCHDOG_CONFIG.maxRestartAttempts})...`);
        await this.spawnProcess(config);
      }
    });

    this.currentProcess.on('error', async (error) => {
      console.error(`❌ WATCHDOG: Process error:`, error);

      this.state.errors.push(`Error: ${error.message} at ${new Date().toISOString()}`);
      saveWatchdogState(this.state);

      await Memory.audit({
        action: 'watchdog_process_error',
        resource: config.name,
        status: 'FAILURE',
        error_message: error.message,
        stack_trace: error.stack,
      }).catch(() => {});
    });

    console.log(`✅ WATCHDOG: ${config.name} started with PID ${this.currentProcess.pid}`);
  }

  /**
   * Startet periodische Health Checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      if (this.isShuttingDown) return;

      console.log(`\n🏥 WATCHDOG: Running health check...`);
      const health = await healthCheck();
      this.state.lastHealthCheck = new Date().toISOString();
      saveWatchdogState(this.state);

      if (!health.healthy) {
        console.log(`⚠️ WATCHDOG: Health check failed`);
        health.details.forEach(d => console.log(`  - ${d}`));

        await Memory.audit({
          action: 'watchdog_health_check',
          resource: 'cline-system',
          status: 'WARNING',
          details: health,
        }).catch(() => {});

        // Try recovery
        await attemptRecovery();
      } else {
        console.log(`✅ WATCHDOG: Health check passed`);
      }
    }, WATCHDOG_CONFIG.healthCheckIntervalMs);
  }

  /**
   * Stoppt den Watchdog
   */
  async stop(): Promise<void> {
    console.log(`\n🛑 WATCHDOG: Stopping...`);
    this.isShuttingDown = true;

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM');
    }

    this.state.isRunning = false;
    clearPidFile();
    saveWatchdogState(this.state);

    await Memory.audit({
      action: 'watchdog_stop',
      resource: 'cline-system',
      status: 'SUCCESS',
    }).catch(() => {});

    console.log(`✅ WATCHDOG: Stopped`);
  }

  /**
   * Signal Handler Setup
   */
  private setupSignalHandlers(): void {
    process.on('SIGTERM', () => this.stop());
    process.on('SIGINT', () => this.stop());
  }

  /**
   * Utility: Sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gibt den aktuellen Status zurück
   */
  getStatus(): WatchdogState {
    return this.state;
  }
}

// ============================================================================
// QUICK WATCH FUNCTIONS
// ============================================================================

/**
 * Startet den Development Server mit Watchdog
 */
export async function watchDev(): Promise<void> {
  const watchdog = new Watchdog();
  await watchdog.start({
    name: 'next-dev',
    command: 'npm',
    args: ['run', 'dev'],
    cwd: process.cwd(),
    restartOnFailure: true,
  });
}

/**
 * Startet einen beliebigen npm script mit Watchdog
 */
export async function watchScript(scriptName: string): Promise<void> {
  const watchdog = new Watchdog();
  await watchdog.start({
    name: scriptName,
    command: 'npm',
    args: ['run', scriptName],
    cwd: process.cwd(),
    restartOnFailure: true,
  });
}

// ============================================================================
// CLI
// ============================================================================

if (require.main === module) {
  const command = process.argv[2];
  const arg = process.argv[3];

  (async () => {
    switch (command) {
      case 'dev':
        await watchDev();
        break;

      case 'script':
        if (!arg) {
          console.error('Usage: tsx scripts/core/watchdog.ts script <script-name>');
          process.exit(1);
        }
        await watchScript(arg);
        break;

      case 'status':
        const state = loadWatchdogState();
        console.log('\n📊 WATCHDOG STATUS\n');
        console.log(JSON.stringify(state, null, 2));
        break;

      case 'reset':
        saveWatchdogState({ ...DEFAULT_WATCHDOG_STATE });
        clearPidFile();
        console.log('✅ Watchdog state reset');
        break;

      default:
        console.log(`
🐕 CLINE WATCHDOG

Usage:
  npm run watch:dev              - Watch development server
  npm run watch:script <name>    - Watch any npm script
  npm run watch:status           - Show watchdog status
  npm run watch:reset            - Reset watchdog state

Or run directly:
  tsx scripts/core/watchdog.ts <command>
        `);
    }
  })();
}
