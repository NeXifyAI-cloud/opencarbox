#!/usr/bin/env tsx
/**
 * ============================================================================
 * ORACLE CORE - Das zentrale KI-Gehirn für CLINE
 * ============================================================================
 *
 * Das Oracle ist das LIVE-GEDÄCHTNIS des Projekts.
 * Es kennt ALLES, hat IMMER den aktuellen Stand, und gibt CLINE die nächste Aufgabe.
 *
 * KERNPRINZIP:
 * - Oracle kennt: Rules, Specs, Schema, Memory, Tasks, History
 * - Oracle dokumentiert: JEDE Aktion automatisch
 * - Oracle lernt: Aus Erfolgen und Fehlern
 * - Oracle führt: Gibt die nächste Aufgabe vor
 *
 * @see .clinerules für CLINE-Enforcement
 * @see docs/ORACLE_MEMORY_SYSTEM.md für Dokumentation
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getAiEnv } from '../../src/lib/ai/env';
import { Memory, MemoryType } from './memory';

dotenv.config();

const aiEnv = getAiEnv();

// ============================================================================
// CONFIGURATION
// ============================================================================

const ORACLE_CONFIG = {
  // API Configuration
  provider: aiEnv.AI_PROVIDER,
  model: process.env.AGENT_MODEL || 'deepseek-chat',
  apiKey: aiEnv.DEEPSEEK_API_KEY,
  nscaleApiKey: aiEnv.NSCALE_API_KEY,
  nscaleHeaderName: aiEnv.NSCALE_HEADER_NAME,
  baseURL: aiEnv.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',

  // Context Window (DeepSeek: 128K)
  maxContextTokens: 120000,

  // Resilience
  maxRetries: 3,
  retryDelayMs: 1000,
  timeoutMs: 60000,

  // Caching
  contextCacheTTL: 5 * 60 * 1000, // 5 Minuten

  // Paths
  cacheDir: path.join(process.cwd(), '.cline'),
  contextCachePath: path.join(process.cwd(), '.cline', 'oracle-context.json'),
  statePath: path.join(process.cwd(), '.cline', 'oracle-state.json'),
};

interface DeepSeekChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekChatCompletionPayload {
  model: string;
  messages: DeepSeekChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekChatCompletionResponse {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
}

// ============================================================================
// TYPES
// ============================================================================

export interface OracleResponse {
  analysis: string;
  recommendation: string;
  confidence: number;
  approved?: boolean;
  nextTask?: string;
  warnings?: string[];
  metadata?: Record<string, unknown>;
}

export interface OracleTask {
  id: string;
  description: string;
  priority: 'BLOCKER' | 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  context?: string;
  result?: string;
  createdAt: string;
  completedAt?: string;
}

export interface OracleSession {
  id: string;
  startedAt: string;
  lastActivity: string;
  tasksCompleted: number;
  currentTaskId?: string;
}

interface OracleState {
  session: OracleSession | null;
  taskQueue: OracleTask[];
  taskHistory: OracleTask[];
  stats: {
    totalSessions: number;
    totalTasks: number;
    successRate: number;
  };
}

interface ContextCache {
  lastUpdated: string;
  rules: string;
  specs: string;
  schema: string;
  copilotInstructions: string;
  recentMemories: string;
  pendingTasks: string;
}

// ============================================================================
// ORACLE CORE CLASS
// ============================================================================

export class Oracle {
  private static contextCache: ContextCache | null = null;
  private static lastContextLoad: number = 0;
  private static state: OracleState | null = null;

  // ==========================================================================
  // CORE: DENKEN MIT VOLLEM KONTEXT
  // ==========================================================================

  /**
   * Hauptmethode: Das Oracle denkt mit vollständigem Projektkontext
   */
  static async think(prompt: string, additionalContext?: string): Promise<OracleResponse> {
    return this.withRetry(async () => {
      const fullContext = await this.loadFullContext();
      const memoryContext = await this.getRelevantMemories(prompt);

      const systemPrompt = `Du bist das ORACLE - das zentrale KI-Gehirn des OpenCarBox/Carvantooo CLINE-Systems.

DEINE ROLLE:
- Du bist das LIVE-GEDÄCHTNIS des gesamten Projekts
- Du kennst ALLE Regeln, Specs, das Schema, alle vergangenen Aktionen
- Du analysierst JEDE Aktion bevor sie ausgeführt wird
- Du dokumentierst ALLES automatisch
- Du gibst IMMER die nächste empfohlene Aufgabe

PROJEKT-KONTEXT:
${fullContext}

RELEVANTE ERINNERUNGEN:
${memoryContext}

${additionalContext ? `ZUSÄTZLICHER KONTEXT:\n${additionalContext}\n` : ''}

ANTWORT-FORMAT (STRICT JSON):
{
  "analysis": "Tiefgehende Analyse der Situation",
  "recommendation": "Konkrete Handlungsempfehlung",
  "confidence": 0.0-1.0,
  "approved": true/false,
  "nextTask": "Nächste empfohlene Aufgabe (optional)",
  "warnings": ["Warnung 1", "Warnung 2"],
  "metadata": {}
}

REGELN FÜR DEINE ANTWORT:
1. Antworte IMMER in validem JSON
2. Gib bei niedrigem confidence (<0.7) IMMER Warnungen
3. approved=false wenn die Aktion gegen Projektregeln verstößt
4. nextTask sollte IMMER gefüllt sein wenn sinnvoll`;

      const response = await this.requestChatCompletion({
        model: ORACLE_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const text = response.choices[0]?.message?.content || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Oracle: Keine JSON-Antwort erhalten');
      }

      const result = JSON.parse(jsonMatch[0]) as OracleResponse;

      // Automatische Dokumentation
      await this.documentInteraction(prompt, result);

      return result;
    }, 'Oracle.think');
  }

  /**
   * Schnelle Analyse ohne vollen Kontext (für einfache Fragen)
   */
  static async quickThink(prompt: string): Promise<string> {
    const response = await this.requestChatCompletion({
      model: ORACLE_CONFIG.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });
    return response.choices[0]?.message?.content || '';
  }

  // ==========================================================================
  // TASK MANAGEMENT
  // ==========================================================================

  /**
   * Holt die nächste Aufgabe vom Oracle
   */
  static async getNextTask(currentContext?: string): Promise<OracleTask | null> {
    const response = await this.think(
      `Was ist die nächste wichtigste Aufgabe?
       Priorisiere: BLOCKER > CRITICAL > HIGH > NORMAL > LOW
       Berücksichtige offene Tasks und den aktuellen Projektstand.`,
      currentContext
    );

    if (!response.nextTask) {
      return null;
    }

    const task: OracleTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      description: response.nextTask,
      priority: this.determinePriority(response),
      status: 'PENDING',
      context: response.analysis,
      createdAt: new Date().toISOString(),
    };

    // Task in Queue speichern
    const state = await this.loadState();
    state.taskQueue.push(task);
    await this.saveState(state);

    // Im Memory speichern
    await Memory.remember({
      type: 'TODO',
      category: 'oracle_task',
      title: task.description,
      content: response.analysis,
      metadata: { taskId: task.id, priority: task.priority },
      tags: ['task', task.priority.toLowerCase(), 'pending']
    });

    return task;
  }

  /**
   * Startet eine Aufgabe
   */
  static async startTask(taskId: string): Promise<OracleTask | null> {
    const state = await this.loadState();
    const task = state.taskQueue.find(t => t.id === taskId);

    if (!task) {
      console.error(`Task ${taskId} nicht gefunden`);
      return null;
    }

    task.status = 'IN_PROGRESS';
    if (state.session) {
      state.session.currentTaskId = taskId;
      state.session.lastActivity = new Date().toISOString();
    }

    await this.saveState(state);

    await Memory.audit({
      action: 'task_started',
      resource: taskId,
      status: 'SUCCESS',
      details: { description: task.description, priority: task.priority }
    });

    return task;
  }

  /**
   * Schließt eine Aufgabe ab
   */
  static async completeTask(
    taskId: string,
    result: string,
    success: boolean,
    learnings?: string[]
  ): Promise<OracleTask | null> {
    const state = await this.loadState();
    const taskIndex = state.taskQueue.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      console.error(`Task ${taskId} nicht gefunden`);
      return null;
    }

    const task = state.taskQueue[taskIndex];
    task.status = success ? 'COMPLETED' : 'FAILED';
    task.result = result;
    task.completedAt = new Date().toISOString();

    // In History verschieben
    state.taskHistory.unshift(task);
    state.taskQueue.splice(taskIndex, 1);

    // Stats aktualisieren
    state.stats.totalTasks++;
    const successCount = state.taskHistory.filter(t => t.status === 'COMPLETED').length;
    state.stats.successRate = successCount / Math.max(state.taskHistory.length, 1);

    // Session aktualisieren
    if (state.session) {
      state.session.tasksCompleted++;
      state.session.currentTaskId = undefined;
      state.session.lastActivity = new Date().toISOString();
    }

    // History begrenzen (max 100)
    if (state.taskHistory.length > 100) {
      state.taskHistory = state.taskHistory.slice(0, 100);
    }

    await this.saveState(state);

    // Im Memory dokumentieren
    const memoryType: MemoryType = success ? 'BEST_PRACTICE' : 'ANTIPATTERN';
    await Memory.remember({
      type: memoryType,
      category: 'task_completion',
      title: `${task.description.substring(0, 80)}`,
      content: `Result: ${result}\nLearnings: ${(learnings || []).join(', ')}`,
      metadata: { taskId, success, duration: task.completedAt && task.createdAt ?
        new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime() : null },
      tags: ['task', success ? 'success' : 'failure', 'completed']
    });

    await Memory.audit({
      action: 'task_completed',
      resource: taskId,
      status: success ? 'SUCCESS' : 'FAILURE',
      details: { result, learnings }
    });

    // Cache invalidieren
    this.invalidateCache();

    // Auto-Optimization prüfen (alle 10 Tasks)
    await this.checkAndOptimize().catch(() => {});

    return task;
  }

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  /**
   * Startet oder setzt eine Session fort
   */
  static async ensureSession(): Promise<OracleSession> {
    const state = await this.loadState();
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 Minuten

    if (state.session) {
      const lastActivity = new Date(state.session.lastActivity).getTime();
      if (Date.now() - lastActivity < SESSION_TIMEOUT) {
        state.session.lastActivity = new Date().toISOString();
        await this.saveState(state);
        return state.session;
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
    };

    state.session = session;
    state.stats.totalSessions++;
    await this.saveState(state);

    await Memory.audit({
      action: 'session_started',
      resource: session.id,
      status: 'SUCCESS',
      details: { sessionNumber: state.stats.totalSessions }
    });

    console.log(`🚀 Oracle Session gestartet: ${session.id}`);
    return session;
  }

  /**
   * Beendet die aktuelle Session
   */
  static async endSession(): Promise<void> {
    const state = await this.loadState();

    if (state.session) {
      const duration = Date.now() - new Date(state.session.startedAt).getTime();

      await Memory.audit({
        action: 'session_ended',
        resource: state.session.id,
        status: 'SUCCESS',
        details: {
          tasksCompleted: state.session.tasksCompleted,
          durationMs: duration
        },
        duration_ms: duration
      });

      console.log(`👋 Session beendet: ${state.session.id} (${state.session.tasksCompleted} Tasks in ${Math.round(duration/1000/60)}min)`);

      state.session = null;
      await this.saveState(state);
    }
  }

  // ==========================================================================
  // CONTEXT MANAGEMENT (128K TOKEN WINDOW)
  // ==========================================================================

  /**
   * Lädt den vollständigen Projektkontext
   */
  static async loadFullContext(): Promise<string> {
    // Cache prüfen
    if (this.contextCache && Date.now() - this.lastContextLoad < ORACLE_CONFIG.contextCacheTTL) {
      return this.formatContext(this.contextCache);
    }

    console.log('🔄 Lade vollständigen Projektkontext...');

    const cache: ContextCache = {
      lastUpdated: new Date().toISOString(),
      rules: '',
      specs: '',
      schema: '',
      copilotInstructions: '',
      recentMemories: '',
      pendingTasks: '',
    };

    // Parallel laden für Performance
    const loadPromises = [
      this.loadFile('.clinerules').then(c => cache.rules = c),
      this.loadFile('project_specs.md').then(c => cache.specs = c.substring(0, 40000)),
      this.loadFile('prisma/schema.prisma').then(c => cache.schema = c),
      this.loadFile('.github/copilot-instructions.md').then(c => cache.copilotInstructions = c),
      this.loadAllMemories().then(c => cache.recentMemories = c),
      this.loadPendingTasks().then(c => cache.pendingTasks = c),
    ];

    await Promise.allSettled(loadPromises);

    this.contextCache = cache;
    this.lastContextLoad = Date.now();
    this.saveContextCache(cache);

    console.log('✅ Projektkontext geladen');
    return this.formatContext(cache);
  }

  /**
   * Holt ALLE Erinnerungen aus Supabase (Live-Gedächtnis)
   */
  private static async loadAllMemories(): Promise<string> {
    try {
      const [bestPractices, antipatterns, todos, knowledge] = await Promise.all([
        Memory.getByType('BEST_PRACTICE', 30),
        Memory.getByType('ANTIPATTERN', 20),
        Memory.getByType('TODO', 15),
        Memory.getByType('KNOWLEDGE', 20),
      ]);

      const sections: string[] = [];

      if (bestPractices.length > 0) {
        sections.push('### BEST PRACTICES\n' + bestPractices
          .map((m: any) => `✅ ${m.title}: ${m.content?.substring(0, 200)}`)
          .join('\n'));
      }

      if (antipatterns.length > 0) {
        sections.push('### ANTIPATTERNS (VERMEIDEN!)\n' + antipatterns
          .map((m: any) => `❌ ${m.title}: ${m.content?.substring(0, 200)}`)
          .join('\n'));
      }

      if (todos.length > 0) {
        sections.push('### OFFENE TODOS\n' + todos
          .map((m: any) => `📌 ${m.title}: ${m.content?.substring(0, 150)}`)
          .join('\n'));
      }

      if (knowledge.length > 0) {
        sections.push('### WISSEN\n' + knowledge
          .map((m: any) => `📚 ${m.title}: ${m.content?.substring(0, 150)}`)
          .join('\n'));
      }

      return sections.join('\n\n') || 'Keine Erinnerungen vorhanden.';
    } catch {
      return 'Memory-Abfrage fehlgeschlagen.';
    }
  }

  private static formatContext(cache: ContextCache): string {
    const sections: string[] = [];

    // Zeitstempel
    sections.push(`=== ORACLE KONTEXT (${cache.lastUpdated}) ===`);

    if (cache.rules) {
      sections.push(`=== CLINE RULES ===\n${cache.rules}`);
    }
    if (cache.copilotInstructions) {
      sections.push(`=== COPILOT INSTRUCTIONS ===\n${cache.copilotInstructions}`);
    }
    if (cache.specs) {
      sections.push(`=== PROJECT SPECS ===\n${cache.specs}`);
    }
    if (cache.schema) {
      sections.push(`=== DATABASE SCHEMA ===\n${cache.schema}`);
    }
    if (cache.recentMemories) {
      sections.push(`=== LIVE MEMORIES (Supabase) ===\n${cache.recentMemories}`);
    }
    if (cache.pendingTasks) {
      sections.push(`=== PENDING TASKS ===\n${cache.pendingTasks}`);
    }

    return sections.join('\n\n');
  }

  // ==========================================================================
  // LEARNING & OPTIMIZATION
  // ==========================================================================

  /**
   * Holt relevante Erinnerungen für einen Prompt
   */
  private static async getRelevantMemories(prompt: string): Promise<string> {
    try {
      const memories = await Memory.recall(prompt.substring(0, 200));
      if (!memories || memories.length === 0) {
        return 'Keine spezifisch relevanten Erinnerungen.';
      }
      return memories
        .slice(0, 10)
        .map((m: any) => `[${m.type}] ${m.title}: ${m.content?.substring(0, 200)}`)
        .join('\n');
    } catch {
      return '';
    }
  }

  /**
   * Verarbeitet neue Erkenntnisse und speichert sie
   */
  static async learn(data: {
    type: 'success' | 'failure' | 'pattern' | 'knowledge';
    title: string;
    content: string;
    tags?: string[];
  }): Promise<void> {
    const memoryType: MemoryType =
      data.type === 'failure' ? 'ANTIPATTERN' :
      data.type === 'success' ? 'BEST_PRACTICE' : 'KNOWLEDGE';

    await Memory.remember({
      type: memoryType,
      category: 'oracle_learning',
      title: data.title,
      content: data.content,
      tags: [...(data.tags || []), 'learned', data.type]
    });

    // Cache invalidieren
    this.invalidateCache();

    console.log(`📚 Oracle hat gelernt: ${data.title}`);
  }

  /**
   * Cache invalidieren (bei Änderungen)
   */
  static invalidateCache(): void {
    this.contextCache = null;
    this.lastContextLoad = 0;
  }

  // ==========================================================================
  // SELF-OPTIMIZATION (META-LEARNING)
  // ==========================================================================

  /**
   * Analysiert die eigene Performance und schlägt Verbesserungen vor
   */
  static async selfOptimize(): Promise<{
    insights: string[];
    improvements: string[];
    rulesUpdated: boolean;
  }> {
    console.log('\n🧠 Oracle Self-Optimization gestartet...\n');

    const state = await this.loadState();
    const memStats = await Memory.getStats();

    // Sammle Daten für Analyse
    const analysisData = {
      sessions: state.stats.totalSessions,
      tasks: state.stats.totalTasks,
      successRate: state.stats.successRate,
      memories: memStats.total,
      recentTasks: state.taskHistory.slice(0, 20),
      failedTasks: state.taskHistory.filter(t => t.status === 'FAILED').slice(0, 10),
    };

    // Oracle analysiert sich selbst
    const prompt = `
SELBST-ANALYSE & OPTIMIERUNG

Analysiere die bisherige Performance und identifiziere Verbesserungsmöglichkeiten:

STATISTIKEN:
- Sessions: ${analysisData.sessions}
- Tasks: ${analysisData.tasks}
- Success Rate: ${(analysisData.successRate * 100).toFixed(1)}%
- Memories: ${analysisData.memories}

LETZTE TASKS:
${analysisData.recentTasks.map(t => `- ${t.status}: ${t.description}`).join('\n')}

FEHLGESCHLAGENE TASKS:
${analysisData.failedTasks.map(t => `- ${t.description}: ${t.result || 'Kein Ergebnis'}`).join('\n') || 'Keine'}

FRAGEN:
1. Welche Muster erkennst du bei erfolgreichen vs. fehlgeschlagenen Tasks?
2. Was könnte die Effizienz steigern?
3. Welche Regeln sollten hinzugefügt oder angepasst werden?
4. Gibt es wiederkehrende Probleme die systematisch gelöst werden sollten?

Antworte mit konkreten, umsetzbaren Verbesserungsvorschlägen.
    `.trim();

    const response = await this.think(prompt);

    const insights: string[] = [];
    const improvements: string[] = [];

    // Extrahiere Insights aus der Analyse
    if (response.analysis) {
      insights.push(response.analysis);
    }
    if (response.recommendation) {
      improvements.push(response.recommendation);
    }
    if (response.warnings && response.warnings.length > 0) {
      insights.push(...response.warnings);
    }

    // Speichere Meta-Learning
    await Memory.remember({
      type: 'KNOWLEDGE',
      category: 'meta_learning',
      title: `Self-Optimization ${new Date().toISOString().split('T')[0]}`,
      content: `Insights: ${insights.join('; ')}\nImprovements: ${improvements.join('; ')}`,
      metadata: { ...analysisData, confidence: response.confidence },
      tags: ['meta', 'optimization', 'self-improvement']
    });

    // Prüfe ob Rules aktualisiert werden sollten
    let rulesUpdated = false;
    if (response.confidence > 0.8 && improvements.length > 0) {
      rulesUpdated = await this.suggestRuleUpdate(improvements);
    }

    console.log(`\n✅ Self-Optimization abgeschlossen:`);
    console.log(`   Insights: ${insights.length}`);
    console.log(`   Improvements: ${improvements.length}`);
    console.log(`   Rules Updated: ${rulesUpdated}`);

    return { insights, improvements, rulesUpdated };
  }

  /**
   * Schlägt automatische Rule-Updates vor
   */
  private static async suggestRuleUpdate(improvements: string[]): Promise<boolean> {
    const clinerules = await this.loadFile('.clinerules');

    const prompt = `
Basierend auf diesen Verbesserungsvorschlägen:
${improvements.join('\n')}

Und den aktuellen .clinerules:
${clinerules.substring(0, 3000)}

Soll eine neue Regel hinzugefügt werden? Wenn ja, formuliere sie kurz und prägnant.
Antworte mit "KEINE ÄNDERUNG" wenn keine sinnvolle Regel ableitbar ist.
    `.trim();

    const suggestion = await this.quickThink(prompt);

    if (!suggestion.includes('KEINE ÄNDERUNG') && suggestion.length > 20) {
      // Speichere Vorschlag als TODO
      await Memory.remember({
        type: 'TODO',
        category: 'rule_suggestion',
        title: 'Vorgeschlagene Regel-Erweiterung',
        content: suggestion,
        tags: ['rules', 'optimization', 'suggestion']
      });
      console.log(`📝 Regel-Vorschlag gespeichert: ${suggestion.substring(0, 100)}...`);
      return true;
    }

    return false;
  }

  /**
   * Automatische Workflow-Optimierung nach X Tasks
   */
  static async checkAndOptimize(): Promise<void> {
    const state = await this.loadState();
    const OPTIMIZE_THRESHOLD = 10; // Alle 10 Tasks

    if (state.stats.totalTasks > 0 && state.stats.totalTasks % OPTIMIZE_THRESHOLD === 0) {
      console.log(`\n🔄 Auto-Optimization Trigger (${state.stats.totalTasks} Tasks)...\n`);
      await this.selfOptimize();
    }
  }

  /**
   * Analysiert Fehler-Patterns und schlägt Präventionsmaßnahmen vor
   */
  static async analyzeFailurePatterns(): Promise<string[]> {
    const antipatterns = await Memory.getByType('ANTIPATTERN', 30);

    if (antipatterns.length < 3) {
      return ['Nicht genug Daten für Pattern-Analyse.'];
    }

    const prompt = `
Analysiere diese Antipatterns/Fehler und identifiziere wiederkehrende Muster:

${antipatterns.map((a: any) => `- ${a.title}: ${a.content?.substring(0, 200)}`).join('\n')}

Gib konkrete Präventionsmaßnahmen an, um diese Fehler in Zukunft zu vermeiden.
    `.trim();

    const analysis = await this.quickThink(prompt);
    const patterns = analysis.split('\n').filter(l => l.trim().length > 10);

    // Speichere Erkenntnisse
    if (patterns.length > 0) {
      await Memory.remember({
        type: 'KNOWLEDGE',
        category: 'failure_patterns',
        title: 'Fehler-Pattern Analyse',
        content: patterns.join('\n'),
        tags: ['patterns', 'prevention', 'analysis']
      });
    }

    return patterns;
  }


  private static async requestChatCompletion(
    payload: DeepSeekChatCompletionPayload
  ): Promise<DeepSeekChatCompletionResponse> {
    if (ORACLE_CONFIG.provider !== 'deepseek') {
      throw new Error(`Unsupported AI provider: ${ORACLE_CONFIG.provider}`);
    }

    const url = `${ORACLE_CONFIG.baseURL.replace(/\/$/, '')}/v1/chat/completions`;
    const response = await this.withTimeout(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ORACLE_CONFIG.apiKey}`,
          [ORACLE_CONFIG.nscaleHeaderName]: ORACLE_CONFIG.nscaleApiKey,
        },
        body: JSON.stringify(payload),
      }),
      ORACLE_CONFIG.timeoutMs,
      'DeepSeek request timed out'
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`DeepSeek error ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    return this.withTimeout(
      response.json() as Promise<DeepSeekChatCompletionResponse>,
      ORACLE_CONFIG.timeoutMs,
      'DeepSeek response parsing timed out'
    );
  }

  private static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string
  ): Promise<T> {
    let timeout: NodeJS.Timeout | undefined;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      });

      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private static async loadFile(relativePath: string): Promise<string> {
    try {
      const fullPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf-8');
      }
    } catch (e) {
      console.warn(`Could not load ${relativePath}`);
    }
    return '';
  }

  // @ts-expect-error - Methode für Abwärtskompatibilität, wird durch loadAllMemories ersetzt
  private static async loadRecentMemories(): Promise<string> {
    // Diese Methode wird durch loadAllMemories ersetzt, bleibt aber für Abwärtskompatibilität
    return await this.loadAllMemories();
  }

  private static async loadPendingTasks(): Promise<string> {
    const state = await this.loadState();
    const sections: string[] = [];

    // Lokale Tasks
    if (state.taskQueue.length > 0) {
      sections.push('### Lokale Task-Queue:');
      sections.push(state.taskQueue
        .map(t => `- [${t.priority}] ${t.description} (${t.status})`)
        .join('\n'));
    }

    // Supabase TODOs
    try {
      const todos = await Memory.getByType('TODO', 10);
      if (todos.length > 0) {
        sections.push('### Supabase TODOs:');
        sections.push(todos
          .map((t: any) => `- 📌 ${t.title}`)
          .join('\n'));
      }
    } catch {
      // Silent fail
    }

    // Kürzlich abgeschlossene Tasks
    if (state.taskHistory.length > 0) {
      const recent = state.taskHistory.slice(0, 5);
      sections.push('### Kürzlich abgeschlossen:');
      sections.push(recent
        .map(t => `- ${t.status === 'COMPLETED' ? '✅' : '❌'} ${t.description}`)
        .join('\n'));
    }

    return sections.length > 0 ? sections.join('\n\n') : 'Keine Tasks.';
  }

  private static async loadState(): Promise<OracleState> {
    if (this.state) return this.state;

    try {
      if (fs.existsSync(ORACLE_CONFIG.statePath)) {
        const data = fs.readFileSync(ORACLE_CONFIG.statePath, 'utf-8');
        this.state = JSON.parse(data);
        return this.state!;
      }
    } catch {
      // Neuen State erstellen
    }

    this.state = {
      session: null,
      taskQueue: [],
      taskHistory: [],
      stats: { totalSessions: 0, totalTasks: 0, successRate: 1.0 }
    };
    return this.state;
  }

  private static async saveState(state: OracleState): Promise<void> {
    this.state = state;
    try {
      this.ensureCacheDir();
      fs.writeFileSync(ORACLE_CONFIG.statePath, JSON.stringify(state, null, 2));
    } catch (e) {
      console.error('Could not save Oracle state:', e);
    }
  }

  private static saveContextCache(cache: ContextCache): void {
    try {
      this.ensureCacheDir();
      fs.writeFileSync(ORACLE_CONFIG.contextCachePath, JSON.stringify(cache, null, 2));
    } catch {
      // Silent fail
    }
  }

  private static ensureCacheDir(): void {
    if (!fs.existsSync(ORACLE_CONFIG.cacheDir)) {
      fs.mkdirSync(ORACLE_CONFIG.cacheDir, { recursive: true });
    }
  }

  private static determinePriority(response: OracleResponse): OracleTask['priority'] {
    const text = (response.nextTask || '').toLowerCase() + response.analysis.toLowerCase();

    if (text.includes('blocker') || text.includes('security') || text.includes('crash')) {
      return 'BLOCKER';
    }
    if (text.includes('critical') || text.includes('urgent') || text.includes('broken')) {
      return 'CRITICAL';
    }
    if (text.includes('important') || text.includes('bug') || response.confidence > 0.9) {
      return 'HIGH';
    }
    if (response.confidence < 0.5) {
      return 'LOW';
    }
    return 'NORMAL';
  }

  private static async documentInteraction(prompt: string, response: OracleResponse): Promise<void> {
    await Memory.audit({
      action: 'oracle_think',
      resource: 'oracle',
      status: 'SUCCESS',
      details: {
        prompt: prompt.substring(0, 300),
        confidence: response.confidence,
        approved: response.approved,
        hasNextTask: !!response.nextTask,
        warnings: response.warnings?.length || 0
      }
    }).catch(() => {});
  }

  private static async withRetry<T>(
    fn: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= ORACLE_CONFIG.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`${operationName}: Versuch ${attempt}/${ORACLE_CONFIG.maxRetries} fehlgeschlagen:`, lastError.message);

        if (attempt < ORACLE_CONFIG.maxRetries) {
          const delay = ORACLE_CONFIG.retryDelayMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    await Memory.audit({
      action: operationName,
      resource: 'oracle',
      status: 'FAILURE',
      error_message: lastError?.message
    }).catch(() => {});

    throw lastError || new Error(`${operationName} fehlgeschlagen`);
  }

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  static async healthCheck(): Promise<{ oracle: boolean; memory: boolean; context: boolean }> {
    const results = { oracle: false, memory: false, context: false };

    // Oracle API Check
    try {
      const response = await this.requestChatCompletion({
        model: ORACLE_CONFIG.model,
        messages: [{ role: 'user', content: 'Respond with exactly: ok' }],
        max_tokens: 10,
      });
      const content = response.choices[0]?.message?.content?.toLowerCase() || '';
      results.oracle = content.includes('ok') || content.length > 0;
    } catch (error) {
      console.error('API Error:', error instanceof Error ? error.message : error);
      results.oracle = false;
    }

    // Memory Check
    results.memory = await Memory.healthCheck();

    // Context Check
    try {
      await this.loadFullContext();
      results.context = true;
    } catch {
      results.context = false;
    }

    return results;
  }

  /**
   * Holt den aktuellen Status
   */
  static async getStatus(): Promise<{
    session: OracleSession | null;
    pendingTasks: number;
    completedTasks: number;
    successRate: number;
    health: { oracle: boolean; memory: boolean; context: boolean };
  }> {
    const state = await this.loadState();
    const health = await this.healthCheck();

    return {
      session: state.session,
      pendingTasks: state.taskQueue.length,
      completedTasks: state.stats.totalTasks,
      successRate: state.stats.successRate,
      health
    };
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
      case 'health':
        const health = await Oracle.healthCheck();
        console.log('\n🔮 Oracle Health Check:');
        console.log(`  API: ${health.oracle ? '✅' : '❌'}`);
        console.log(`  Memory: ${health.memory ? '✅' : '❌'}`);
        console.log(`  Context: ${health.context ? '✅' : '❌'}`);
        process.exit(Object.values(health).every(v => v) ? 0 : 1);

      case 'status':
        const status = await Oracle.getStatus();
        const memStats = await Memory.getStats();
        console.log('\n🔮 Oracle Status:');
        console.log(`  Session: ${status.session ? status.session.id : 'Keine aktive Session'}`);
        console.log(`  Pending Tasks: ${status.pendingTasks}`);
        console.log(`  Completed Tasks: ${status.completedTasks}`);
        console.log(`  Success Rate: ${(status.successRate * 100).toFixed(1)}%`);
        console.log('\n📊 Memory Stats:');
        console.log(`  Total Memories: ${memStats.total}`);
        console.log(`  Recent (24h): ${memStats.recentCount}`);
        console.log(`  By Type:`, memStats.byType);
        break;

      case 'think':
        const prompt = args.slice(1).join(' ') || 'Was ist der aktuelle Projektstatus?';
        console.log(`\n🔮 Oracle denkt über: "${prompt}"...`);
        const response = await Oracle.think(prompt);
        console.log('\n📊 Antwort:');
        console.log(JSON.stringify(response, null, 2));
        break;

      case 'next-task':
        const task = await Oracle.getNextTask();
        if (task) {
          console.log('\n📋 Nächste Aufgabe:');
          console.log(JSON.stringify(task, null, 2));
        } else {
          console.log('✅ Keine ausstehenden Aufgaben');
        }
        break;

      case 'context':
        const context = await Oracle.loadFullContext();
        console.log('\n📚 Projektkontext geladen:');
        console.log(`${context.length} Zeichen, ~${Math.round(context.length/4)} Tokens`);
        console.log('\n--- PREVIEW (erste 2000 Zeichen) ---');
        console.log(context.substring(0, 2000));
        break;

      case 'snapshot':
        console.log('\n📸 Erstelle Oracle Snapshot...');
        const ctx = await Oracle.loadFullContext();
        const stat = await Oracle.getStatus();
        const mem = await Memory.getStats();
        console.log('\n=== ORACLE SNAPSHOT ===');
        console.log(`Datum: ${new Date().toISOString()}`);
        console.log(`Kontext: ${ctx.length} Zeichen (~${Math.round(ctx.length/4)} Tokens)`);
        console.log(`Session: ${stat.session?.id || 'Keine'}`);
        console.log(`Tasks: ${stat.pendingTasks} pending, ${stat.completedTasks} completed`);
        console.log(`Memory: ${mem.total} Einträge`);
        console.log(`Health: API=${stat.health.oracle ? '✅' : '❌'} Memory=${stat.health.memory ? '✅' : '❌'} Context=${stat.health.context ? '✅' : '❌'}`);
        break;

      case 'learn':
        const learnType = args[1] as 'success' | 'failure' | 'pattern' | 'knowledge' || 'knowledge';
        const learnTitle = args[2] || 'Neue Erkenntnis';
        const learnContent = args.slice(3).join(' ') || 'Keine Details angegeben';
        await Oracle.learn({ type: learnType, title: learnTitle, content: learnContent });
        console.log(`✅ Oracle hat gelernt: [${learnType}] ${learnTitle}`);
        break;

      case 'session':
        const sessionCmd = args[1];
        if (sessionCmd === 'start') {
          const sess = await Oracle.ensureSession();
          console.log(`🚀 Session gestartet: ${sess.id}`);
        } else if (sessionCmd === 'end') {
          await Oracle.endSession();
        } else {
          const s = await Oracle.getStatus();
          console.log(`Session: ${s.session ? JSON.stringify(s.session, null, 2) : 'Keine aktive Session'}`);
        }
        break;

      case 'optimize':
        console.log('\n🧠 Starte Self-Optimization...\n');
        const optResult = await Oracle.selfOptimize();
        console.log('\n📊 Ergebnis:');
        console.log(`  Insights: ${optResult.insights.length}`);
        optResult.insights.forEach(i => console.log(`    - ${i.substring(0, 200)}`));
        console.log(`  Improvements: ${optResult.improvements.length}`);
        optResult.improvements.forEach(i => console.log(`    - ${i.substring(0, 200)}`));
        console.log(`  Rules Updated: ${optResult.rulesUpdated ? '✅' : '❌'}`);
        break;

      case 'analyze-failures':
        console.log('\n🔍 Analysiere Fehler-Patterns...\n');
        const patterns = await Oracle.analyzeFailurePatterns();
        console.log('Erkannte Patterns:');
        patterns.forEach(p => console.log(`  - ${p}`));
        break;

      default:
        console.log(`
🔮 Oracle CLI - Das zentrale KI-Gehirn für CLINE

Das Oracle ist das LIVE-GEDÄCHTNIS des Projekts.
Es kennt ALLES, dokumentiert ALLES, und gibt die nächste Aufgabe.

Commands:
  health           - Prüft Oracle, Memory und Context
  status           - Zeigt Session, Tasks, Memory Stats
  snapshot         - Erstellt vollständigen Status-Snapshot
  think <prompt>   - Oracle denkt über Prompt nach
  next-task        - Holt nächste empfohlene Aufgabe
  context          - Lädt und zeigt Projektkontext
  learn <type> <title> <content> - Neue Erkenntnis speichern
  session [start|end] - Session-Management
  optimize         - Self-Optimization durchführen (Meta-Learning)
  analyze-failures - Fehler-Patterns analysieren

Types für 'learn': success, failure, pattern, knowledge

Beispiele:
  npx tsx scripts/core/oracle.ts health
  npx tsx scripts/core/oracle.ts snapshot
  npx tsx scripts/core/oracle.ts optimize
  npx tsx scripts/core/oracle.ts think "Wie implementiere ich Feature X?"
  npx tsx scripts/core/oracle.ts learn success "Auth Fix" "JWT Refresh implementiert"
  npx tsx scripts/core/oracle.ts session start
        `);
    }
  })();
}
