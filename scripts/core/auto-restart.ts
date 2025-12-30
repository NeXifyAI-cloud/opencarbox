#!/usr/bin/env tsx
/**
 * Cline Auto-Restart Service
 *
 * Eigenständiger Service der Cline-Prozesse überwacht und bei Abstürzen neu startet.
 * Kann als Background-Service laufen.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Memory } from './memory';
import { attemptRecovery, healthCheck } from './resilience';

// ============================================================================
// CONFIGURATION
// ============================================================================

const AUTO_RESTART_CONFIG = {
  checkIntervalMs: 10000,          // Check every 10 seconds
  initialDelayMs: 2000,            // Wait 2s before starting checks
  maxConsecutiveFailures: 3,       // Max failures before cooldown
  cooldownDurationMs: 60000,       // 1 minute cooldown
  stateFile: path.join(process.cwd(), '.cline', 'auto-restart-state.json'),
};

// ============================================================================
// TYPES
// ============================================================================

interface AutoRestartState {
  enabled: boolean;
  running: boolean;
  lastCheck: string;
  consecutiveFailures: number;
  inCooldown: boolean;
  cooldownUntil?: string;
  totalRestarts: number;
  lastRestart?: string;
}

// ============================================================================
// STATE
// ============================================================================

const DEFAULT_STATE: AutoRestartState = {
  enabled: true,
  running: false,
  lastCheck: new Date().toISOString(),
  consecutiveFailures: 0,
  inCooldown: false,
  totalRestarts: 0,
};

function loadState(): AutoRestartState {
  try {
    if (fs.existsSync(AUTO_RESTART_CONFIG.stateFile)) {
      return JSON.parse(fs.readFileSync(AUTO_RESTART_CONFIG.stateFile, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load auto-restart state:', e);
  }
  return { ...DEFAULT_STATE };
}

function saveState(state: AutoRestartState): void {
  try {
    const dir = path.dirname(AUTO_RESTART_CONFIG.stateFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AUTO_RESTART_CONFIG.stateFile, JSON.stringify(state, null, 2));
  } catch (e) {
    console.error('Failed to save auto-restart state:', e);
  }
}

// ============================================================================
// AUTO-RESTART SERVICE
// ============================================================================

export class AutoRestartService {
  private state: AutoRestartState;
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.state = loadState();
    this.setupShutdownHandlers();
  }

  /**
   * Startet den Auto-Restart Service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Auto-Restart Service bereits aktiv');
      return;
    }

    console.log('\n🔄 CLINE AUTO-RESTART SERVICE GESTARTET\n');

    this.isRunning = true;
    this.state.running = true;
    this.state.enabled = true;
    saveState(this.state);

    // Initial delay
    await this.sleep(AUTO_RESTART_CONFIG.initialDelayMs);

    // Start check loop
    this.startCheckLoop();

    await Memory.audit({
      action: 'auto_restart_service_start',
      resource: 'cline-service',
      status: 'SUCCESS',
    }).catch(() => {});

    console.log('✅ Service aktiv - Überwache System...\n');
  }

  /**
   * Check Loop - Periodische Systemprüfung
   */
  private startCheckLoop(): void {
    this.checkInterval = setInterval(async () => {
      await this.runHealthCheck();
    }, AUTO_RESTART_CONFIG.checkIntervalMs);
  }

  /**
   * Führt Health Check durch und reagiert auf Probleme
   */
  private async runHealthCheck(): Promise<void> {
    this.state.lastCheck = new Date().toISOString();

    // Check cooldown
    if (this.state.inCooldown && this.state.cooldownUntil) {
      const cooldownEnd = new Date(this.state.cooldownUntil).getTime();
      if (Date.now() < cooldownEnd) {
        return; // Still in cooldown
      } else {
        // Cooldown expired
        this.state.inCooldown = false;
        this.state.cooldownUntil = undefined;
        this.state.consecutiveFailures = 0;
        console.log('⏰ Cooldown beendet - Überwachung wieder aktiv');
      }
    }

    try {
      const health = await healthCheck();

      if (health.healthy) {
        this.state.consecutiveFailures = 0;
        // Silent success - no logging for routine checks
      } else {
        console.log(`\n⚠️ Health Check fehlgeschlagen: ${health.details.join(', ')}`);
        this.state.consecutiveFailures++;

        if (this.state.consecutiveFailures >= AUTO_RESTART_CONFIG.maxConsecutiveFailures) {
          await this.triggerRecovery();
        } else {
          console.log(`   Failures: ${this.state.consecutiveFailures}/${AUTO_RESTART_CONFIG.maxConsecutiveFailures}`);
        }
      }
    } catch (error) {
      console.error('Health check error:', error);
      this.state.consecutiveFailures++;
    }

    saveState(this.state);
  }

  /**
   * Triggert Recovery-Prozess
   */
  private async triggerRecovery(): Promise<void> {
    console.log('\n🔧 TRIGGER: Auto-Recovery wird gestartet...\n');

    this.state.totalRestarts++;
    this.state.lastRestart = new Date().toISOString();

    await Memory.audit({
      action: 'auto_recovery_triggered',
      resource: 'cline-service',
      status: 'WARNING',
      details: {
        consecutiveFailures: this.state.consecutiveFailures,
        totalRestarts: this.state.totalRestarts,
      },
    }).catch(() => {});

    try {
      const recovered = await attemptRecovery();

      if (recovered) {
        console.log('✅ Recovery erfolgreich!');
        this.state.consecutiveFailures = 0;
      } else {
        console.log('⚠️ Recovery teilweise erfolgreich');
        // Enter cooldown
        this.enterCooldown();
      }
    } catch (error) {
      console.error('❌ Recovery fehlgeschlagen:', error);
      this.enterCooldown();
    }

    saveState(this.state);
  }

  /**
   * Aktiviert Cooldown-Modus
   */
  private enterCooldown(): void {
    this.state.inCooldown = true;
    this.state.cooldownUntil = new Date(Date.now() + AUTO_RESTART_CONFIG.cooldownDurationMs).toISOString();
    console.log(`\n⏳ Cooldown aktiviert bis ${this.state.cooldownUntil}\n`);
  }

  /**
   * Stoppt den Service
   */
  async stop(): Promise<void> {
    console.log('\n🛑 Auto-Restart Service wird gestoppt...');

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.isRunning = false;
    this.state.running = false;
    saveState(this.state);

    await Memory.audit({
      action: 'auto_restart_service_stop',
      resource: 'cline-service',
      status: 'SUCCESS',
    }).catch(() => {});

    console.log('✅ Service gestoppt\n');
  }

  /**
   * Shutdown Handler
   */
  private setupShutdownHandlers(): void {
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
   * Gibt Status zurück
   */
  getStatus(): AutoRestartState {
    return this.state;
  }
}

// ============================================================================
// DAEMON MODE
// ============================================================================

/**
 * Startet als Daemon (Background Service)
 */
async function startDaemon(): Promise<void> {
  const service = new AutoRestartService();
  await service.start();

  // Keep process running
  process.stdin.resume();

  console.log('💡 Drücke Ctrl+C um den Service zu beenden\n');
}

// ============================================================================
// CLI
// ============================================================================

if (require.main === module) {
  const command = process.argv[2];

  (async () => {
    switch (command) {
      case 'start':
        await startDaemon();
        break;

      case 'status':
        const state = loadState();
        console.log('\n📊 AUTO-RESTART SERVICE STATUS\n');
        console.log(`  Enabled:    ${state.enabled ? '✅' : '❌'}`);
        console.log(`  Running:    ${state.running ? '✅' : '❌'}`);
        console.log(`  Last Check: ${state.lastCheck}`);
        console.log(`  Failures:   ${state.consecutiveFailures}`);
        console.log(`  In Cooldown: ${state.inCooldown ? '⚠️ Ja' : '✅ Nein'}`);
        console.log(`  Total Restarts: ${state.totalRestarts}`);
        if (state.lastRestart) {
          console.log(`  Last Restart: ${state.lastRestart}`);
        }
        console.log();
        break;

      case 'reset':
        saveState({ ...DEFAULT_STATE });
        console.log('✅ Auto-Restart State zurückgesetzt\n');
        break;

      case 'disable':
        const currentState = loadState();
        currentState.enabled = false;
        saveState(currentState);
        console.log('✅ Auto-Restart deaktiviert\n');
        break;

      case 'enable':
        const enableState = loadState();
        enableState.enabled = true;
        saveState(enableState);
        console.log('✅ Auto-Restart aktiviert\n');
        break;

      default:
        console.log(`
🔄 CLINE AUTO-RESTART SERVICE

Usage:
  npm run cline:auto-restart       - Start the service (daemon mode)
  npm run cline:auto-status        - Show service status
  npm run cline:auto-reset         - Reset service state
  npm run cline:auto-enable        - Enable auto-restart
  npm run cline:auto-disable       - Disable auto-restart

Or run directly:
  tsx scripts/core/auto-restart.ts <command>
        `);
    }
  })();
}

export { loadState as loadAutoRestartState };
