#!/usr/bin/env tsx
/**
 * Oracle Core - DeepSeek AI Integration
 *
 * Das zentrale "Gehirn" des CLINE-Systems.
 * Nutzt DeepSeek API (OpenAI-kompatibel) mit 128K Token Context.
 *
 * @see https://api-docs.deepseek.com/
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import { Memory } from './memory';

dotenv.config();

// ============================================================================
// CONFIGURATION
// ============================================================================

const ORACLE_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  timeoutMs: 60000, // 60s für DeepSeek
  maxContextTokens: 120000, // 128K limit, 8K reserve
  cacheFilePath: path.join(process.cwd(), '.cline', 'oracle-context-cache.json'),
};

// DeepSeek Client (OpenAI-kompatibel)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

const ORACLE_MODEL = process.env.AGENT_MODEL || 'deepseek-chat';

// ============================================================================
// TYPES
// ============================================================================

export interface OracleResponse {
  analysis: string;
  recommendation: string;
  confidence: number;
  nextTask?: string;
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

interface ContextCache {
  lastUpdated: string;
  rules: string;
  specs: string;
  schema: string;
  recentMemories: string;
  pendingTasks: OracleTask[];
}

// ============================================================================
// ORACLE CORE CLASS
// ============================================================================

/**
 * Oracle Core - DeepSeek AI mit 128K Context Window
 * Das zentrale KI-Gehirn für CLINE mit vollständigem Projektkontext.
 */
export class Oracle {
  private static contextCache: ContextCache | null = null;
  private static lastContextLoad: number = 0;
  private static readonly CONTEXT_TTL = 5 * 60 * 1000; // 5 Min Cache

  // ==========================================================================
  // CORE THINKING
  // ==========================================================================

  /**
   * Hauptmethode: Denkt mit vollem Projektkontext
   */
  static async think(prompt: string, context?: string): Promise<OracleResponse> {
    return this.withRetry(async () => {
      const fullContext = await this.loadFullContext();

      const systemPrompt = `Du bist das Oracle - das zentrale KI-Gehirn des OpenCarBox CLINE-Systems.

DEINE ROLLE:
- Du hast VOLLSTÄNDIGEN Zugriff auf Projektkontext (Rules, Specs, Schema, Memory)
- Du dokumentierst JEDE Aktion im Memory
- Du gibst IMMER die nächste empfohlene Aufgabe
- Du arbeitest nach dem NeXify Blueprint (Recursive Intelligence Protocol)

PROJEKT-KONTEXT:
${fullContext}

${context ? `ZUSÄTZLICHER KONTEXT:\n${context}` : ''}

ANTWORT-FORMAT (JSON):
{
  "analysis": "Tiefgehende Analyse der Situation",
  "recommendation": "Konkrete Handlungsempfehlung",
  "confidence": 0.0-1.0,
  "nextTask": "Nächste empfohlene Aufgabe (optional)",
  "metadata": {}
}`;

      const response = await deepseek.chat.completions.create({
        model: ORACLE_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      const text = response.choices[0]?.message?.content || '';

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]) as OracleResponse;
        this.documentInteraction(prompt, result).catch(() => {});
        return result;
      }

      throw new Error('Ungültige Oracle-Antwort: Kein JSON gefunden');
    }, 'Oracle.think');
  }

  /**
   * Retry Wrapper mit exponential backoff
   */
  private static async withRetry<T>(
    fn: () => Promise<T>,
    operationName: string,
    maxRetries: number = ORACLE_CONFIG.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`${operationName}: Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

        if (attempt < maxRetries) {
          const delay = ORACLE_CONFIG.retryDelayMs * Math.pow(2, attempt - 1);
          console.log(`${operationName}: Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Log failure to Memory (best effort)
    await Memory.audit({
      action: operationName,
      resource: 'oracle',
      status: 'FAILURE',
      error_message: lastError?.message,
      details: { attempts: maxRetries },
    }).catch(() => {});

    throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
  }

  /**
   * Optimiert den Kontext für zukünftige Interaktionen
   */
  static async optimizeContext(newKnowledge: string): Promise<void> {
    console.log('Optimizing Oracle Context with new knowledge...');

    // Analysiere die neue Erkenntnis
    const analysis = await this.think(
      'Analysiere diese neue Erkenntnis und kategorisiere sie für zukünftige Nutzung',
      newKnowledge
    );

    // Speichere optimierten Kontext im Memory
    await Memory.remember({
      type: 'KNOWLEDGE',
      category: 'oracle_context',
      title: 'Oracle Context Optimization',
      content: analysis.recommendation,
      metadata: { confidence: analysis.confidence, original: newKnowledge },
      tags: ['oracle', 'context', 'optimization']
    });

    console.log('✅ Oracle Context optimiert und in Memory gespeichert');
  }

  /**
   * Ingest Learning - Verarbeitet neue Erkenntnisse
   */
  static async ingestLearning(data: any): Promise<void> {
    console.log('Ingesting new learning data into Oracle...');

    const learningData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    // Lasse Oracle die Lerndata analysieren
    const analysis = await this.think(
      'Extrahiere wiederverwendbare Patterns und Best Practices aus diesen Daten',
      learningData
    );

    // Bestimme den Typ basierend auf der Analyse
    const memoryType = analysis.recommendation.toLowerCase().includes('avoid')
      ? 'ANTIPATTERN'
      : 'BEST_PRACTICE';

    // Speichere die Erkenntnis
    await Memory.remember({
      type: memoryType,
      category: 'learned_pattern',
      title: `Learned Pattern from Data`,
      content: analysis.recommendation,
      metadata: {
        confidence: analysis.confidence,
        rawData: learningData,
        analysis: analysis.analysis
      },
      tags: ['learning', 'pattern', 'ingested']
    });

    console.log(`✅ Learning Data ingested as ${memoryType}`);
  }

  /**
   * Retrieve Context - Holt relevanten Kontext aus dem Memory
   */
  static async retrieveContext(topic: string): Promise<string> {
    const memories = await Memory.recall(topic);

    if (memories.length === 0) {
      return 'Keine relevanten Erkenntnisse im Memory gefunden.';
    }

    const context = memories
      .map(m => `[${m.type}] ${m.title}: ${m.content}`)
      .join('\n\n');

    return context;
  }

  /**
   * Enhanced Think - Denkt mit Memory-Kontext
   */
  static async thinkWithMemory(prompt: string, additionalContext?: string): Promise<OracleResponse> {
    const memoryContext = await this.retrieveContext(prompt);

    const fullContext = `
      MEMORY CONTEXT (Past Learnings):
      ${memoryContext}

      ${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}` : ''}
    `;

    return this.think(prompt, fullContext);
  }

  // ==========================================================================
  // CONTEXT MANAGEMENT (128K Token Window)
  // ==========================================================================

  private static contextCache: ContextCache | null = null;
  private static lastContextLoad: number = 0;
  private static readonly CONTEXT_TTL = 5 * 60 * 1000; // 5 Min Cache

  /**
   * Lädt den vollständigen Projektkontext (nutzt 128K Context Window)
   */
  static async loadFullContext(): Promise<string> {
    if (this.contextCache && Date.now() - this.lastContextLoad < this.CONTEXT_TTL) {
      return this.formatContext(this.contextCache);
    }

    console.log('🔄 Loading full project context...');

    const cache: ContextCache = {
      lastUpdated: new Date().toISOString(),
      rules: '',
      specs: '',
      schema: '',
      recentMemories: '',
      pendingTasks: [],
    };

    // 1. .clinerules laden
    try {
      const rulesPath = path.join(process.cwd(), '.clinerules');
      if (fs.existsSync(rulesPath)) {
        cache.rules = fs.readFileSync(rulesPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not load .clinerules');
    }

    // 2. project_specs.md laden
    try {
      const specsPath = path.join(process.cwd(), 'project_specs.md');
      if (fs.existsSync(specsPath)) {
        cache.specs = fs.readFileSync(specsPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not load project_specs.md');
    }

    // 3. prisma/schema.prisma laden
    try {
      const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
      if (fs.existsSync(schemaPath)) {
        cache.schema = fs.readFileSync(schemaPath, 'utf-8');
      }
    } catch (e) {
      console.warn('Could not load prisma/schema.prisma');
    }

    // 4. Recent Memories aus Supabase (best effort)
    try {
      const memories = await Memory.recall('');
      if (Array.isArray(memories) && memories.length > 0) {
        cache.recentMemories = memories
          .slice(0, 50)
          .map((m: { type: string; title: string; content: string }) => `[${m.type}] ${m.title}: ${m.content}`)
          .join('\n\n');
      }
    } catch (e) {
      console.warn('Could not load memories from Supabase');
    }

    this.contextCache = cache;
    this.lastContextLoad = Date.now();
    this.saveContextCache(cache);

    console.log('✅ Full context loaded');
    return this.formatContext(cache);
  }

  /**
   * Formatiert den Kontext für das Prompt
   */
  private static formatContext(cache: ContextCache): string {
    const sections: string[] = [];

    if (cache.rules) {
      sections.push(`=== CLINE RULES ===\n${cache.rules}`);
    }

    if (cache.specs) {
      sections.push(`=== PROJECT SPECS ===\n${cache.specs.substring(0, 30000)}`);
    }

    if (cache.schema) {
      sections.push(`=== DATABASE SCHEMA ===\n${cache.schema}`);
    }

    if (cache.recentMemories) {
      sections.push(`=== RECENT MEMORIES ===\n${cache.recentMemories}`);
    }

    if (cache.pendingTasks && cache.pendingTasks.length > 0) {
      const tasksStr = cache.pendingTasks
        .map(t => `- [${t.priority}] ${t.description} (${t.status})`)
        .join('\n');
      sections.push(`=== PENDING TASKS ===\n${tasksStr}`);
    }

    return sections.join('\n\n');
  }

  /**
   * Speichert den Kontext-Cache
   */
  private static saveContextCache(cache: ContextCache): void {
    try {
      const dir = path.dirname(ORACLE_CONFIG.cacheFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(ORACLE_CONFIG.cacheFilePath, JSON.stringify(cache, null, 2));
    } catch (e) {
      // Silent fail
    }
  }

  /**
   * Cache invalidieren (bei Änderungen)
   */
  static invalidateCache(): void {
    this.contextCache = null;
    this.lastContextLoad = 0;
    console.log('🔄 Oracle context cache invalidated');
  }

  /**
   * Dokumentiert Oracle-Interaktionen
   */
  private static async documentInteraction(prompt: string, response: OracleResponse): Promise<void> {
    await Memory.audit({
      action: 'oracle_interaction',
      resource: 'oracle',
      status: 'SUCCESS',
      details: {
        prompt: prompt.substring(0, 500),
        confidence: response.confidence,
        hasNextTask: !!response.nextTask,
      }
    }).catch(() => {});
  }

  // ==========================================================================
  // TASK QUEUE MANAGEMENT
  // ==========================================================================

  /**
   * Holt die nächste Aufgabe vom Oracle
   */
  static async getNextTask(currentContext?: string): Promise<OracleTask | null> {
    const response = await this.think(
      'Was ist die nächste wichtigste Aufgabe basierend auf dem aktuellen Projektstand? Priorisiere: BLOCKER > CRITICAL > HIGH > NORMAL > LOW.',
      currentContext
    );

    if (response.nextTask) {
      const task: OracleTask = {
        id: `task_${Date.now()}`,
        description: response.nextTask,
        priority: this.determinePriority(response.nextTask, response.confidence),
        status: 'PENDING',
        context: response.analysis,
        createdAt: new Date().toISOString(),
      };

      await Memory.remember({
        type: 'TODO',
        category: 'oracle_task',
        title: task.description,
        content: response.analysis,
        metadata: task,
        tags: ['task', task.priority.toLowerCase()]
      });

      return task;
    }

    return null;
  }

  /**
   * Markiert Aufgabe als abgeschlossen
   */
  static async completeTask(taskId: string, result: string, success: boolean): Promise<void> {
    const memoryType = success ? 'BEST_PRACTICE' : 'ANTIPATTERN';

    await Memory.remember({
      type: memoryType,
      category: 'task_completion',
      title: `Task ${taskId} ${success ? 'completed' : 'failed'}`,
      content: result,
      metadata: { taskId, success, completedAt: new Date().toISOString() },
      tags: ['task', 'completion', success ? 'success' : 'failure']
    });

    await Memory.audit({
      action: 'complete_task',
      resource: taskId,
      status: success ? 'SUCCESS' : 'FAILURE',
      details: { result }
    });

    console.log(`✅ Task ${taskId} ${success ? 'completed' : 'failed'}`);
  }

  /**
   * Bestimmt Priorität
   */
  private static determinePriority(description: string, confidence: number): OracleTask['priority'] {
    const lower = description.toLowerCase();

    if (lower.includes('blocker') || lower.includes('crash') || lower.includes('security')) {
      return 'BLOCKER';
    }
    if (lower.includes('critical') || lower.includes('urgent') || lower.includes('broken')) {
      return 'CRITICAL';
    }
    if (lower.includes('important') || lower.includes('bug') || confidence > 0.9) {
      return 'HIGH';
    }
    if (confidence < 0.5) {
      return 'LOW';
    }
    return 'NORMAL';
  }

  // ==========================================================================
  // HEALTH CHECK
  // ==========================================================================

  /**
   * Prüft ob Oracle funktioniert
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await deepseek.chat.completions.create({
        model: ORACLE_MODEL,
        messages: [{ role: 'user', content: 'Respond with exactly: {"status": "ok"}' }],
        max_tokens: 50,
      });

      const text = response.choices[0]?.message?.content || '';
      return text.includes('ok');
    } catch (e) {
      console.error('Oracle health check failed:', e);
      return false;
    }
  }
}

// ============================================================================
// TYPES (für externe Nutzung)
// ============================================================================

interface ContextCache {
  lastUpdated: string;
  rules: string;
  specs: string;
  schema: string;
  recentMemories: string;
  pendingTasks: OracleTask[];
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
        const healthy = await Oracle.healthCheck();
        console.log(healthy ? '✅ Oracle (DeepSeek) is healthy' : '❌ Oracle is unhealthy');
        process.exit(healthy ? 0 : 1);
        break;

      case 'think':
        const prompt = args.slice(1).join(' ') || 'Was ist der aktuelle Projektstatus?';
        const response = await Oracle.think(prompt);
        console.log('\n📊 Oracle Response:');
        console.log(JSON.stringify(response, null, 2));
        break;

      case 'next-task':
        const task = await Oracle.getNextTask();
        if (task) {
          console.log('\n📋 Next Task:');
          console.log(JSON.stringify(task, null, 2));
        } else {
          console.log('✅ Keine ausstehenden Aufgaben');
        }
        break;

      case 'load-context':
        const context = await Oracle.loadFullContext();
        console.log('\n📚 Loaded Context:');
        console.log(context.substring(0, 5000) + '...');
        break;

      default:
        console.log(`
🔮 Oracle CLI - DeepSeek Integration (128K Context)

Commands:
  health        - Check if Oracle is working
  think <prompt> - Ask Oracle a question
  next-task     - Get the next recommended task
  load-context  - Load and display project context

Examples:
  npx tsx scripts/core/oracle.ts health
  npx tsx scripts/core/oracle.ts think "How should I implement feature X?"
  npx tsx scripts/core/oracle.ts next-task
        `);
    }
  })();
}
