#!/usr/bin/env tsx
/**
 * Oracle-First Protocol - CLINE agiert wie ein Mensch
 *
 * KERNPRINZIP: Das Oracle ist das Live-Gedächtnis.
 * - Oracle kennt ALLES (Live-Time-Stand)
 * - CLINE befragt IMMER das Oracle vor jeder Aktion
 * - Jede Aufgabe wird dokumentiert
 * - Oracle gibt die nächste Aufgabe
 *
 * @see .clinerules für Enforcement
 */

import * as fs from 'fs';
import * as path from 'path';
import { Memory, MemoryType } from './memory';
import { Oracle, OracleResponse, OracleTask } from './oracle';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ORACLE_FIRST_CONFIG = {
  stateFile: path.join(process.cwd(), '.cline', 'oracle-first-state.json'),
  sessionTimeout: 30 * 60 * 1000, // 30 Min Session
  maxTaskHistory: 100,
  autoDocumentInterval: 60000, // 1 Min
};

// ============================================================================
// TYPES
// ============================================================================

export interface OracleSession {
  id: string;
  startedAt: string;
  lastActivity: string;
  tasksCompleted: number;
  tasksInProgress: string[];
  currentContext: string;
}

export interface OracleFirstState {
  currentSession: OracleSession | null;
  taskQueue: OracleTask[];
  taskHistory: OracleTask[];
  stats: {
    totalSessions: number;
    totalTasks: number;
    successRate: number;
  };
}

export interface BeforeActionResult {
  approved: boolean;
  guidance: OracleResponse;
  taskId: string;
  warnings: string[];
}

export interface AfterActionResult {
  documented: boolean;
  nextTask: OracleTask | null;
  learnings: string[];
}

// ============================================================================
// ORACLE-FIRST PROTOCOL
// ============================================================================

/**
 * Oracle-First Protocol - MANDATORY vor JEDER Aktion
 *
 * Nutzung:
 * ```typescript
 * // VOR jeder Aktion
 * const { approved, guidance, taskId } = await OracleFirst.beforeAction({
 *   action: 'create_component',
 *   description: 'Erstelle Header-Komponente',
 *   files: ['src/components/header.tsx'],
 * });
 *
 * if (!approved) {
 *   console.log('Action not approved:', guidance.recommendation);
 *   return;
 * }
 *
 * // Aktion durchführen...
 *
 * // NACH der Aktion
 * const { nextTask } = await OracleFirst.afterAction({
 *   taskId,
 *   success: true,
 *   result: 'Header-Komponente erstellt',
 *   learnings: ['Tailwind für Styling verwendet'],
 * });
 * ```
 */
export class OracleFirst {
  private static state: OracleFirstState | null = null;

  // ==========================================================================
  // CORE PROTOCOL
  // ==========================================================================

  /**
   * MANDATORY: Vor jeder Aktion aufrufen
   *
   * Das Oracle:
   * 1. Analysiert die geplante Aktion
   * 2. Prüft gegen Regeln und vergangene Erkenntnisse
   * 3. Gibt Guidance und Warnungen
   * 4. Dokumentiert den Start der Aktion
   */
  static async beforeAction(params: {
    action: string;
    description: string;
    files?: string[];
    context?: string;
    priority?: OracleTask['priority'];
  }): Promise<BeforeActionResult> {
    console.log(`\n🔮 ORACLE-FIRST: Analysiere Aktion "${params.action}"...`);

    // Session starten/fortsetzen
    await this.ensureSession();

    // Kontext sammeln
    const fileContext = await this.getFileContext(params.files || []);
    const fullContext = `
ACTION: ${params.action}
DESCRIPTION: ${params.description}
FILES: ${(params.files || []).join(', ') || 'None'}

FILE CONTEXT:
${fileContext}

${params.context ? `ADDITIONAL CONTEXT:\n${params.context}` : ''}
    `.trim();

    // Oracle befragen
    const guidance = await Oracle.thinkWithMemory(
      `Analysiere diese geplante Aktion und gib Guidance:

1. Ist diese Aktion sinnvoll im aktuellen Projektkontext?
2. Gibt es bekannte Probleme oder Antipatterns zu beachten?
3. Was sind die wichtigsten Schritte für die Implementierung?
4. Gibt es Warnungen oder Risiken?

Antworte mit approved: true/false im metadata Feld.`,
      fullContext
    );

    // Task erstellen
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const task: OracleTask = {
      id: taskId,
      description: params.description,
      priority: params.priority || 'NORMAL',
      status: 'IN_PROGRESS',
      context: fullContext,
      createdAt: new Date().toISOString(),
    };

    // State aktualisieren
    const state = await this.loadState();
    state.taskQueue.push(task);
    if (state.currentSession) {
      state.currentSession.tasksInProgress.push(taskId);
      state.currentSession.lastActivity = new Date().toISOString();
    }
    await this.saveState(state);

    // Dokumentieren
    await Memory.audit({
      action: 'before_action',
      resource: params.action,
      status: 'SUCCESS',
      details: {
        taskId,
        description: params.description,
        files: params.files,
        confidence: guidance.confidence,
      }
    });

    // Warnings extrahieren
    const warnings: string[] = [];
    if (guidance.confidence < 0.7) {
      warnings.push(`⚠️ Low confidence (${(guidance.confidence * 100).toFixed(0)}%) - zusätzliche Überprüfung empfohlen`);
    }
    if (guidance.analysis.toLowerCase().includes('risk') || guidance.analysis.toLowerCase().includes('warning')) {
      warnings.push('⚠️ Oracle hat potenzielle Risiken identifiziert');
    }

    const approved = guidance.confidence >= 0.3 && !guidance.recommendation.toLowerCase().includes('not recommended');

    console.log(`✅ Oracle-First Analysis complete. Approved: ${approved}`);
    if (warnings.length > 0) {
      console.log('Warnings:', warnings.join('\n'));
    }

    return {
      approved,
      guidance,
      taskId,
      warnings,
    };
  }

  /**
   * MANDATORY: Nach jeder Aktion aufrufen
   *
   * Das Oracle:
   * 1. Dokumentiert das Ergebnis
   * 2. Extrahiert Learnings
   * 3. Aktualisiert den Kontext
   * 4. Gibt die nächste Aufgabe
   */
  static async afterAction(params: {
    taskId: string;
    success: boolean;
    result: string;
    learnings?: string[];
    errors?: string[];
  }): Promise<AfterActionResult> {
    console.log(`\n🔮 ORACLE-FIRST: Dokumentiere Ergebnis für ${params.taskId}...`);

    // State laden
    const state = await this.loadState();

    // Task finden und aktualisieren
    const taskIndex = state.taskQueue.findIndex(t => t.id === params.taskId);
    if (taskIndex >= 0) {
      const task = state.taskQueue[taskIndex];
      task.status = params.success ? 'COMPLETED' : 'FAILED';
      task.result = params.result;
      task.completedAt = new Date().toISOString();

      // In History verschieben
      state.taskHistory.unshift(task);
      state.taskQueue.splice(taskIndex, 1);

      // History begrenzen
      if (state.taskHistory.length > ORACLE_FIRST_CONFIG.maxTaskHistory) {
        state.taskHistory = state.taskHistory.slice(0, ORACLE_FIRST_CONFIG.maxTaskHistory);
      }

      // Stats aktualisieren
      state.stats.totalTasks++;
      const successCount = state.taskHistory.filter(t => t.status === 'COMPLETED').length;
      state.stats.successRate = successCount / state.taskHistory.length;
    }

    // Session aktualisieren
    if (state.currentSession) {
      state.currentSession.tasksCompleted++;
      state.currentSession.tasksInProgress = state.currentSession.tasksInProgress.filter(
        id => id !== params.taskId
      );
      state.currentSession.lastActivity = new Date().toISOString();
    }

    await this.saveState(state);

    // Im Memory dokumentieren
    const memoryType: MemoryType = params.success ? 'BEST_PRACTICE' : 'ANTIPATTERN';
    await Memory.remember({
      type: memoryType,
      category: 'task_result',
      title: `Task ${params.taskId}: ${params.result.substring(0, 100)}`,
      content: `
Result: ${params.result}
Success: ${params.success}
Learnings: ${(params.learnings || []).join(', ')}
Errors: ${(params.errors || []).join(', ')}
      `.trim(),
      metadata: {
        taskId: params.taskId,
        success: params.success,
        learnings: params.learnings,
        errors: params.errors,
      },
      tags: ['task', params.success ? 'success' : 'failure', 'documented']
    });

    // Learnings verarbeiten
    const learnings = params.learnings || [];
    if (params.errors && params.errors.length > 0) {
      // Fehler als Antipatterns speichern
      for (const error of params.errors) {
        await Memory.remember({
          type: 'ANTIPATTERN',
          category: 'error_learning',
          title: `Error from ${params.taskId}`,
          content: error,
          tags: ['error', 'learning', 'antipattern']
        });
        learnings.push(`Avoid: ${error}`);
      }
    }

    // Audit Log
    await Memory.audit({
      action: 'after_action',
      resource: params.taskId,
      status: params.success ? 'SUCCESS' : 'FAILURE',
      details: {
        result: params.result,
        learnings: learnings.length,
        errors: params.errors?.length || 0,
      }
    });

    // Oracle Cache invalidieren (neues Wissen verfügbar)
    Oracle.invalidateCache();

    // Nächste Aufgabe holen
    const nextTask = await Oracle.getNextTask(
      `Letzte Aufgabe: ${params.result}\nSuccess: ${params.success}\nLearnings: ${learnings.join(', ')}`
    );

    console.log(`✅ Ergebnis dokumentiert. Success Rate: ${(state.stats.successRate * 100).toFixed(1)}%`);

    return {
      documented: true,
      nextTask,
      learnings,
    };
  }

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  /**
   * Startet oder setzt eine Session fort
   */
  static async ensureSession(): Promise<OracleSession> {
    const state = await this.loadState();

    // Prüfen ob Session noch gültig
    if (state.currentSession) {
      const lastActivity = new Date(state.currentSession.lastActivity).getTime();
      if (Date.now() - lastActivity < ORACLE_FIRST_CONFIG.sessionTimeout) {
        return state.currentSession;
      }
      // Session abgelaufen
      await this.endSession();
    }

    // Neue Session starten
    const session: OracleSession = {
      id: `session_${Date.now()}`,
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      tasksCompleted: 0,
      tasksInProgress: [],
      currentContext: '',
    };

    state.currentSession = session;
    state.stats.totalSessions++;
    await this.saveState(state);

    // Session im Memory dokumentieren
    await Memory.audit({
      action: 'session_start',
      resource: session.id,
      status: 'SUCCESS',
      details: { sessionNumber: state.stats.totalSessions }
    });

    console.log(`🚀 Oracle-First Session gestartet: ${session.id}`);
    return session;
  }

  /**
   * Beendet die aktuelle Session
   */
  static async endSession(): Promise<void> {
    const state = await this.loadState();

    if (state.currentSession) {
      await Memory.audit({
        action: 'session_end',
        resource: state.currentSession.id,
        status: 'SUCCESS',
        details: {
          tasksCompleted: state.currentSession.tasksCompleted,
          duration: Date.now() - new Date(state.currentSession.startedAt).getTime(),
        }
      });

      console.log(`👋 Session beendet: ${state.currentSession.id} (${state.currentSession.tasksCompleted} Tasks)`);
      state.currentSession = null;
      await this.saveState(state);
    }
  }

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  private static async loadState(): Promise<OracleFirstState> {
    if (this.state) return this.state;

    try {
      if (fs.existsSync(ORACLE_FIRST_CONFIG.stateFile)) {
        const data = fs.readFileSync(ORACLE_FIRST_CONFIG.stateFile, 'utf-8');
        this.state = JSON.parse(data);
        return this.state!;
      }
    } catch (e) {
      console.warn('Could not load Oracle-First state, creating new');
    }

    this.state = {
      currentSession: null,
      taskQueue: [],
      taskHistory: [],
      stats: {
        totalSessions: 0,
        totalTasks: 0,
        successRate: 1.0,
      }
    };

    return this.state;
  }

  private static async saveState(state: OracleFirstState): Promise<void> {
    this.state = state;

    try {
      const dir = path.dirname(ORACLE_FIRST_CONFIG.stateFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(ORACLE_FIRST_CONFIG.stateFile, JSON.stringify(state, null, 2));
    } catch (e) {
      console.error('Could not save Oracle-First state:', e);
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Liest Dateiinhalte für Kontext
   */
  private static async getFileContext(files: string[]): Promise<string> {
    const contexts: string[] = [];

    for (const file of files.slice(0, 5)) { // Max 5 Files
      try {
        const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          // Begrenzen auf 3000 Zeichen pro File
          contexts.push(`--- ${file} ---\n${content.substring(0, 3000)}`);
        }
      } catch {
        // Silent fail
      }
    }

    return contexts.join('\n\n');
  }

  /**
   * Holt den aktuellen Status
   */
  static async getStatus(): Promise<{
    session: OracleSession | null;
    pendingTasks: number;
    completedTasks: number;
    successRate: number;
  }> {
    const state = await this.loadState();
    return {
      session: state.currentSession,
      pendingTasks: state.taskQueue.length,
      completedTasks: state.stats.totalTasks,
      successRate: state.stats.successRate,
    };
  }

  /**
   * Holt die Task-Queue
   */
  static async getTaskQueue(): Promise<OracleTask[]> {
    const state = await this.loadState();
    return state.taskQueue;
  }

  /**
   * Holt die Task-History
   */
  static async getTaskHistory(limit: number = 10): Promise<OracleTask[]> {
    const state = await this.loadState();
    return state.taskHistory.slice(0, limit);
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    switch (command) {
      case 'status':
        const status = await OracleFirst.getStatus();
        console.log('\n🔮 Oracle-First Status:');
        console.log(JSON.stringify(status, null, 2));
        break;

      case 'before':
        const actionDesc = args.slice(1).join(' ') || 'Test Action';
        const before = await OracleFirst.beforeAction({
          action: 'test',
          description: actionDesc,
        });
        console.log('\n📋 Before Action Result:');
        console.log(JSON.stringify(before, null, 2));
        break;

      case 'after':
        const taskId = args[1] || 'test_task';
        const result = args.slice(2).join(' ') || 'Test completed';
        const after = await OracleFirst.afterAction({
          taskId,
          success: true,
          result,
        });
        console.log('\n📋 After Action Result:');
        console.log(JSON.stringify(after, null, 2));
        break;

      case 'queue':
        const queue = await OracleFirst.getTaskQueue();
        console.log('\n📋 Task Queue:');
        console.log(JSON.stringify(queue, null, 2));
        break;

      case 'history':
        const history = await OracleFirst.getTaskHistory(10);
        console.log('\n📜 Task History (last 10):');
        console.log(JSON.stringify(history, null, 2));
        break;

      case 'end-session':
        await OracleFirst.endSession();
        break;

      default:
        console.log(`
🔮 Oracle-First Protocol CLI

Das Oracle-First Protocol stellt sicher, dass CLINE wie ein Mensch mit
perfektem Gedächtnis agiert. JEDE Aktion wird vom Oracle analysiert und dokumentiert.

Commands:
  status       - Zeigt aktuellen Status (Session, Tasks, Success Rate)
  before <desc> - Simuliert beforeAction für eine Aktion
  after <taskId> <result> - Simuliert afterAction
  queue        - Zeigt die Task-Queue
  history      - Zeigt die letzten 10 Tasks
  end-session  - Beendet die aktuelle Session

Nutzung im Code:

  // VOR jeder Aktion (MANDATORY)
  const { approved, guidance, taskId } = await OracleFirst.beforeAction({
    action: 'create_component',
    description: 'Erstelle Header-Komponente',
    files: ['src/components/header.tsx'],
  });

  // NACH der Aktion (MANDATORY)
  const { nextTask } = await OracleFirst.afterAction({
    taskId,
    success: true,
    result: 'Header erstellt',
  });
        `);
    }
  })();
}
