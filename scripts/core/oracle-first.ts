#!/usr/bin/env tsx
/**
 * ============================================================================
 * ORACLE-FIRST PROTOCOL - CLINE agiert wie ein Mensch mit perfektem Gedächtnis
 * ============================================================================
 *
 * KERNPRINZIP:
 * - VOR jeder Aktion: Oracle befragen
 * - NACH jeder Aktion: Ergebnis dokumentieren
 * - Oracle gibt IMMER die nächste Aufgabe
 *
 * WORKFLOW:
 * 1. beforeAction() → Oracle analysiert, genehmigt, gibt Guidance
 * 2. [Aktion durchführen]
 * 3. afterAction() → Dokumentieren, Lernen, nächste Aufgabe holen
 *
 * @see .clinerules für Enforcement
 */

import * as fs from 'fs';
import * as path from 'path';
import { Memory } from './memory';
import { Oracle, OracleResponse, OracleTask } from './oracle';

// ============================================================================
// TYPES
// ============================================================================

export interface BeforeActionParams {
  action: string;           // z.B. "create_component", "fix_bug", "refactor"
  description: string;      // Was wird gemacht?
  files?: string[];         // Betroffene Dateien
  context?: string;         // Zusätzlicher Kontext
  priority?: OracleTask['priority'];
}

export interface BeforeActionResult {
  approved: boolean;        // Darf die Aktion ausgeführt werden?
  taskId: string;           // Eindeutige Task-ID
  guidance: OracleResponse; // Oracle's Analyse und Empfehlung
  warnings: string[];       // Warnungen vom Oracle
}

export interface AfterActionParams {
  taskId: string;           // Task-ID von beforeAction
  success: boolean;         // War die Aktion erfolgreich?
  result: string;           // Was wurde erreicht?
  learnings?: string[];     // Was wurde gelernt?
  errors?: string[];        // Aufgetretene Fehler
}

export interface AfterActionResult {
  documented: boolean;      // Wurde dokumentiert?
  nextTask: OracleTask | null; // Nächste empfohlene Aufgabe
  learnings: string[];      // Verarbeitete Learnings
  stats: {
    successRate: number;
    tasksCompleted: number;
  };
}

// ============================================================================
// ORACLE-FIRST PROTOCOL
// ============================================================================

/**
 * Oracle-First Protocol - MANDATORY für CLINE
 *
 * @example
 * ```typescript
 * // VOR jeder Aktion
 * const { approved, taskId, guidance, warnings } = await OracleFirst.beforeAction({
 *   action: 'create_component',
 *   description: 'Erstelle Header-Komponente',
 *   files: ['src/components/layout/header.tsx'],
 * });
 *
 * if (!approved) {
 *   console.warn('Oracle hat abgelehnt:', warnings);
 *   return;
 * }
 *
 * // Aktion mit guidance durchführen...
 *
 * // NACH der Aktion
 * const { nextTask, stats } = await OracleFirst.afterAction({
 *   taskId,
 *   success: true,
 *   result: 'Header-Komponente mit Responsive Design erstellt',
 *   learnings: ['Tailwind für Mobile-First genutzt'],
 * });
 *
 * console.log('Nächste Aufgabe:', nextTask?.description);
 * ```
 */
export class OracleFirst {

  // ==========================================================================
  // CORE PROTOCOL
  // ==========================================================================

  /**
   * VOR jeder Aktion aufrufen - MANDATORY
   *
   * Das Oracle:
   * 1. Lädt vollständigen Projektkontext
   * 2. Analysiert die geplante Aktion
   * 3. Prüft gegen Regeln und vergangene Erkenntnisse
   * 4. Gibt Genehmigung, Guidance und Warnungen
   */
  static async beforeAction(params: BeforeActionParams): Promise<BeforeActionResult> {
    console.log(`\n🔮 ORACLE-FIRST: Analysiere "${params.action}"...`);

    // Session sicherstellen
    await Oracle.ensureSession();

    // Dateikontext sammeln
    const fileContext = await this.getFileContext(params.files || []);

    // Oracle befragen
    const prompt = `
Analysiere diese geplante Aktion:

ACTION: ${params.action}
DESCRIPTION: ${params.description}
FILES: ${(params.files || []).join(', ') || 'Keine'}

${fileContext ? `FILE CONTENTS:\n${fileContext}\n` : ''}
${params.context ? `CONTEXT:\n${params.context}\n` : ''}

FRAGEN:
1. Ist diese Aktion sinnvoll im aktuellen Projektkontext?
2. Gibt es bekannte Probleme oder Antipatterns zu beachten?
3. Was sind die wichtigsten Schritte für die Implementierung?
4. Gibt es Warnungen oder Risiken?

Setze "approved" auf true/false basierend auf deiner Analyse.
    `.trim();

    const guidance = await Oracle.think(prompt);

    // Task-ID generieren
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Warnings extrahieren
    const warnings: string[] = guidance.warnings || [];

    if (guidance.confidence < 0.7) {
      warnings.push(`⚠️ Niedrige Konfidenz (${(guidance.confidence * 100).toFixed(0)}%)`);
    }
    if (guidance.analysis.toLowerCase().includes('risk') ||
        guidance.analysis.toLowerCase().includes('warning') ||
        guidance.analysis.toLowerCase().includes('achtung')) {
      warnings.push('⚠️ Oracle hat potenzielle Risiken identifiziert');
    }

    // Genehmigung basierend auf Analyse
    const approved = guidance.approved !== false &&
                     guidance.confidence >= 0.3 &&
                     !guidance.recommendation.toLowerCase().includes('nicht empfohlen');

    // Audit Log
    await Memory.audit({
      action: 'before_action',
      resource: params.action,
      status: approved ? 'SUCCESS' : 'WARNING',
      details: {
        taskId,
        description: params.description,
        files: params.files,
        approved,
        confidence: guidance.confidence,
        warnings: warnings.length
      }
    });

    console.log(`✅ Analyse abgeschlossen. Genehmigt: ${approved ? 'JA' : 'NEIN'}`);
    if (warnings.length > 0) {
      console.log('⚠️ Warnungen:', warnings.join(', '));
    }

    return {
      approved,
      taskId,
      guidance,
      warnings,
    };
  }

  /**
   * NACH jeder Aktion aufrufen - MANDATORY
   *
   * Das Oracle:
   * 1. Dokumentiert das Ergebnis
   * 2. Extrahiert und speichert Learnings
   * 3. Aktualisiert Stats
   * 4. Gibt die nächste Aufgabe
   */
  static async afterAction(params: AfterActionParams): Promise<AfterActionResult> {
    console.log(`\n🔮 ORACLE-FIRST: Dokumentiere ${params.taskId}...`);

    // Task abschließen
    await Oracle.completeTask(
      params.taskId,
      params.result,
      params.success,
      params.learnings
    );

    // Fehler als Antipatterns speichern
    const allLearnings = [...(params.learnings || [])];

    if (params.errors && params.errors.length > 0) {
      for (const error of params.errors) {
        await Memory.remember({
          type: 'ANTIPATTERN',
          category: 'error',
          title: `Error in ${params.taskId}`,
          content: error,
          tags: ['error', 'antipattern', 'avoid']
        });
        allLearnings.push(`AVOID: ${error}`);
      }
    }

    // Oracle Cache invalidieren (neues Wissen verfügbar)
    Oracle.invalidateCache();

    // Nächste Aufgabe holen
    const nextContext = `
Letzte Aktion: ${params.result}
Erfolg: ${params.success}
Learnings: ${allLearnings.join(', ')}
    `.trim();

    const nextTask = await Oracle.getNextTask(nextContext);

    // Status holen
    const status = await Oracle.getStatus();

    console.log(`✅ Dokumentiert. Success Rate: ${(status.successRate * 100).toFixed(1)}%`);
    if (nextTask) {
      console.log(`📋 Nächste Aufgabe: ${nextTask.description}`);
    }

    return {
      documented: true,
      nextTask,
      learnings: allLearnings,
      stats: {
        successRate: status.successRate,
        tasksCompleted: status.completedTasks,
      }
    };
  }

  // ==========================================================================
  // CONVENIENCE METHODS
  // ==========================================================================

  /**
   * Schnelle Methode für einfache Aktionen
   */
  static async execute<T>(
    params: BeforeActionParams,
    action: (guidance: OracleResponse) => Promise<T>
  ): Promise<{ result: T | null; success: boolean; nextTask: OracleTask | null }> {
    const before = await this.beforeAction(params);

    if (!before.approved) {
      console.warn('❌ Aktion nicht genehmigt:', before.warnings);
      return { result: null, success: false, nextTask: null };
    }

    let result: T | null = null;
    let success = false;
    let errors: string[] = [];

    try {
      result = await action(before.guidance);
      success = true;
    } catch (error) {
      errors = [error instanceof Error ? error.message : String(error)];
      console.error('❌ Aktion fehlgeschlagen:', errors[0]);
    }

    const after = await this.afterAction({
      taskId: before.taskId,
      success,
      result: success ? 'Erfolgreich abgeschlossen' : 'Fehlgeschlagen',
      learnings: success ? ['Erfolgreich implementiert'] : undefined,
      errors: errors.length > 0 ? errors : undefined,
    });

    return { result, success, nextTask: after.nextTask };
  }

  /**
   * Holt den aktuellen Status
   */
  static async getStatus() {
    return Oracle.getStatus();
  }

  /**
   * Beendet die Session
   */
  static async endSession() {
    return Oracle.endSession();
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Liest Dateiinhalte für Kontext
   */
  private static async getFileContext(files: string[]): Promise<string> {
    const contexts: string[] = [];
    const maxFiles = 5;
    const maxCharsPerFile = 3000;

    for (const file of files.slice(0, maxFiles)) {
      try {
        const fullPath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);

        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const truncated = content.length > maxCharsPerFile
            ? content.substring(0, maxCharsPerFile) + '\n...[truncated]'
            : content;
          contexts.push(`--- ${file} ---\n${truncated}`);
        }
      } catch {
        // Silent fail
      }
    }

    return contexts.join('\n\n');
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
        const action = args[1] || 'test_action';
        const description = args.slice(2).join(' ') || 'Test-Aktion';
        const before = await OracleFirst.beforeAction({
          action,
          description,
        });
        console.log('\n📋 Before Action Result:');
        console.log(JSON.stringify({
          approved: before.approved,
          taskId: before.taskId,
          warnings: before.warnings,
          confidence: before.guidance.confidence,
          recommendation: before.guidance.recommendation,
        }, null, 2));
        break;

      case 'after':
        const taskId = args[1] || 'test_task';
        const result = args.slice(2).join(' ') || 'Test abgeschlossen';
        const after = await OracleFirst.afterAction({
          taskId,
          success: true,
          result,
        });
        console.log('\n📋 After Action Result:');
        console.log(JSON.stringify({
          documented: after.documented,
          nextTask: after.nextTask?.description,
          stats: after.stats,
        }, null, 2));
        break;

      case 'end':
        await OracleFirst.endSession();
        break;

      default:
        console.log(`
🔮 Oracle-First Protocol CLI

CLINE agiert wie ein Mensch mit perfektem Gedächtnis.
VOR jeder Aktion: beforeAction() → Analyse, Genehmigung, Guidance
NACH jeder Aktion: afterAction() → Dokumentation, Learning, nächste Aufgabe

Commands:
  status           - Aktueller Status (Session, Tasks, Success Rate)
  before <action> <desc> - Simuliert beforeAction
  after <taskId> <result> - Simuliert afterAction
  end              - Beendet Session

Beispiele:
  npx tsx scripts/core/oracle-first.ts status
  npx tsx scripts/core/oracle-first.ts before create_component "Header erstellen"
  npx tsx scripts/core/oracle-first.ts after task_123 "Header erfolgreich erstellt"

Im Code:
  const { approved, taskId, guidance } = await OracleFirst.beforeAction({
    action: 'create_component',
    description: 'Header erstellen',
    files: ['src/components/header.tsx'],
  });

  if (approved) {
    // Aktion durchführen...
    await OracleFirst.afterAction({ taskId, success: true, result: '...' });
  }
        `);
    }
  })();
}
