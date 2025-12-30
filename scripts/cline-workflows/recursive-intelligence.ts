#!/usr/bin/env tsx
/**
 * Recursive Intelligence Protocol - Automated Workflow
 * Implementiert: Think → Recall → Execute → Verify → Learn → Update
 *
 * Mit Resilience-Integration für Absturzsicherheit
 */

import { execSync } from 'child_process';
import { Memory } from '../core/memory';
import { Oracle } from '../core/oracle';

export interface WorkflowContext {
  task: string;
  codeContext?: string;
  filesPaths?: string[];
}

export interface WorkflowResult {
  success: boolean;
  insights: string[];
  errors?: string[];
  nextActions?: string[];
}

/**
 * Schritt 1: THINK - Oracle Analyse (mit Retry)
 */
async function stepThink(context: WorkflowContext): Promise<string> {
  console.log('🧠 STEP 1: THINKING...');

  try {
    const prompt = `
      AUFGABE: ${context.task}

      Analysiere diese Aufgabe und gib einen sicheren, effizienten Lösungsweg vor.
      Berücksichtige:
      - Mögliche Fallstricke
      - Best Practices aus dem Projekt
      - Abhängigkeiten
      - Testing-Strategie
    `;

    const response = await Oracle.think(prompt, context.codeContext);

    console.log(`  ✅ Analysis complete (Confidence: ${response.confidence * 100}%)`);
    return response.recommendation;
  } catch (error) {
    console.error('  ❌ Think step failed:', error);
    // Return fallback recommendation
    return `[FALLBACK] Aufgabe: ${context.task} - Oracle nicht erreichbar. Manuelle Analyse erforderlich.`;
  }
}

/**
 * Schritt 2: RECALL - Memory Abruf (mit Fallback)
 */
async function stepRecall(task: string): Promise<string[]> {
  console.log('🔍 STEP 2: RECALLING...');

  try {
    const memories = await Memory.recall(task);
    const insights = memories.map(m => `[${m.type}] ${m.title}: ${m.content}`);

    console.log(`  ✅ Found ${memories.length} relevant memories`);
    return insights;
  } catch (error) {
    console.warn('  ⚠️ Memory recall failed, continuing without memories:', error);
    return ['[FALLBACK] Memory nicht erreichbar - keine historischen Daten verfügbar'];
  }
}

/**
 * Schritt 3: EXECUTE - Wird manuell durchgeführt (Code-Änderungen)
 */
function stepExecute(): void {
  console.log('⚙️  STEP 3: EXECUTE - Implementiere die Lösung jetzt');
  console.log('  (Dieser Schritt wird von dir/Cline manuell durchgeführt)');
}

/**
 * Schritt 4: VERIFY - Tests ausführen
 */
async function stepVerify(): Promise<{ success: boolean; errors: string[] }> {
  console.log('✅ STEP 4: VERIFYING...');

  const errors: string[] = [];

  try {
    // TypeScript Check
    console.log('  → TypeScript check...');
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('    ✅ TypeScript OK');
  } catch (error: any) {
    errors.push('TypeScript errors found');
    console.log('    ❌ TypeScript errors');
  }

  try {
    // Lint
    console.log('  → ESLint check...');
    execSync('npm run lint', { stdio: 'pipe' });
    console.log('    ✅ ESLint OK');
  } catch (error: any) {
    errors.push('ESLint errors found');
    console.log('    ❌ ESLint errors');
  }

  try {
    // Tests
    console.log('  → Running tests...');
    execSync('npm run test', { stdio: 'pipe' });
    console.log('    ✅ Tests OK');
  } catch (error: any) {
    errors.push('Tests failed');
    console.log('    ❌ Tests failed');
  }

  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Schritt 5: LEARN - Ergebnisse speichern
 */
async function stepLearn(
  task: string,
  success: boolean,
  insights: string[],
  errors?: string[]
): Promise<void> {
  console.log('📚 STEP 5: LEARNING...');

  const learningData = {
    task,
    success,
    insights,
    errors,
    timestamp: new Date().toISOString()
  };

  // Audit Log
  await Memory.audit({
    action: 'recursive_intelligence_workflow',
    resource: task,
    status: success ? 'SUCCESS' : 'FAILURE',
    details: learningData,
    error_message: errors?.join(', ')
  });

  if (success) {
    // Erfolgreiche Lösung als Best Practice speichern
    await Memory.remember({
      type: 'BEST_PRACTICE',
      category: 'workflow',
      title: `Successful: ${task}`,
      content: insights.join('\n\n'),
      tags: ['recursive_intelligence', 'success']
    });
  } else {
    // Fehler als Antipattern speichern
    await Memory.remember({
      type: 'ANTIPATTERN',
      category: 'workflow',
      title: `Failed: ${task}`,
      content: `Errors: ${errors?.join(', ')}\n\nInsights: ${insights.join('\n')}`,
      tags: ['recursive_intelligence', 'failure']
    });
  }

  console.log(`  ✅ Learning saved to Memory`);
}

/**
 * Schritt 6: UPDATE - Oracle Kontext aktualisieren
 */
async function stepUpdate(insights: string[]): Promise<void> {
  console.log('🔄 STEP 6: UPDATING ORACLE...');

  const knowledge = insights.join('\n\n');
  // Nutze selfOptimize statt der nicht existierenden optimizeContext-Methode
  await Oracle.quickThink(`Verarbeite folgende Erkenntnisse für zukünftige Anfragen:\n${knowledge}`);

  console.log('  ✅ Oracle context updated');
}

/**
 * Führt den kompletten Recursive Intelligence Workflow aus
 */
export async function runRecursiveIntelligence(
  context: WorkflowContext
): Promise<WorkflowResult> {
  console.log('\n🔁 RECURSIVE INTELLIGENCE PROTOCOL STARTED\n');
  console.log(`📋 Task: ${context.task}\n`);

  const startTime = Date.now();

  try {
    // 1. THINK
    const recommendation = await stepThink(context);

    // 2. RECALL
    const memories = await stepRecall(context.task);

    const insights = [recommendation, ...memories];

    // 3. EXECUTE (Manual)
    stepExecute();
    console.log('\n⏸️  WORKFLOW PAUSED: Implementiere jetzt die Lösung\n');
    console.log('💡 RECOMMENDATION:');
    console.log(recommendation);
    console.log('\n📚 RELEVANT MEMORIES:');
    memories.forEach(m => console.log(`  - ${m}`));
    console.log('\n⚠️  Nach Implementierung: npm run workflow:verify\n');

    return {
      success: true,
      insights,
      nextActions: [
        'Implementiere die Lösung basierend auf der Recommendation',
        'Führe npm run workflow:verify aus',
        'Bei Erfolg: npm run workflow:complete'
      ]
    };
  } catch (error: any) {
    console.error('❌ Workflow Error:', error.message);

    await Memory.audit({
      action: 'recursive_intelligence_workflow',
      resource: context.task,
      status: 'FAILURE',
      error_message: error.message,
      stack_trace: error.stack,
      duration_ms: Date.now() - startTime
    });

    return {
      success: false,
      insights: [],
      errors: [error.message]
    };
  }
}

/**
 * Verify-Only: Führt nur Schritt 4 aus
 */
export async function verifyOnly(): Promise<void> {
  const result = await stepVerify();

  if (!result.success) {
    console.error('\n❌ VERIFICATION FAILED');
    result.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log('\n✅ VERIFICATION SUCCESSFUL');
}

/**
 * Complete Workflow: Führt Schritte 5-6 aus nach erfolgreicher Implementierung
 */
export async function completeWorkflow(task: string, insights: string[]): Promise<void> {
  console.log('\n🏁 COMPLETING WORKFLOW...\n');

  const verifyResult = await stepVerify();

  await stepLearn(task, verifyResult.success, insights, verifyResult.errors);

  if (verifyResult.success) {
    await stepUpdate(insights);
    console.log('\n🎉 WORKFLOW COMPLETED SUCCESSFULLY\n');
  } else {
    console.error('\n❌ WORKFLOW COMPLETED WITH ERRORS\n');
    process.exit(1);
  }
}

// CLI Interface
if (require.main === module) {
  const command = process.argv[2];

  if (command === 'verify') {
    verifyOnly().catch(console.error);
  } else {
    console.log('Usage:');
    console.log('  npm run workflow:verify   - Run verification only');
    console.log('  npm run workflow:complete - Complete the workflow (Learn + Update)');
  }
}
