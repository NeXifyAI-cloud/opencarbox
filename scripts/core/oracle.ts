import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Oracle Core - KI-gestützte Entscheidungsfindung und Kontext-Optimierung
 * "Erst denken, dann handeln."
 */

const ORACLE_CONFIG = {
  provider: process.env.AI_PROVIDER || 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.GITHUB_TOKEN || '',
  nscaleApiKey: process.env.NSCALE_API_KEY || '',
  nscaleHeaderName: process.env.NSCALE_HEADER_NAME || 'X-NSCALE-API-KEY',
  baseURL: process.env.DEEPSEEK_BASE_URL || process.env.GITHUB_MODELS_BASE_URL || 'https://api.deepseek.com',
  model: process.env.AI_DEFAULT_MODEL || process.env.GITHUB_MODELS_MODEL || 'deepseek-chat',
  timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '60000'),
  autoSelect: process.env.AI_AUTO_SELECT === 'true',
};

export interface OracleTask {
  id: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface OracleThought {
  analysis: string;
  recommendation: string;
  plan: string[];
  risks: string[];
  optimization: string;
  confidence: number;
  approved: boolean;
  warnings: string[];
}

// OracleResponse is an alias for OracleThought in some contexts
export type OracleResponse = OracleThought;

interface DeepSeekChatCompletionPayload {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class Oracle {
  private static sessionActive = false;
  private static tasks = new Map<string, OracleTask>();

  /**
   * Stellt sicher, dass eine Oracle-Session aktiv ist
   */
  static async ensureSession(): Promise<void> {
    if (!this.sessionActive) {
      this.sessionActive = true;
      console.log('🔮 Oracle Session initialized.');
    }
  }

  /**
   * "Nachdenken" über einen Task vor der Ausführung
   */
  static async think(task: string, context?: any): Promise<OracleThought> {
    const prompt = `
Du bist das NeXify Oracle, die strategische Intelligenz hinter dem OpenCarBox System. Deine Aufgabe ist es, einen Task zu analysieren und den optimalen Ausführungsplan zu erstellen.

TASK:
${task}

KONTEXT:
${JSON.stringify(context || {}, null, 2)}

REGELN:
1. Denke "Oracle-First": Erst Strategie, dann Code.
2. Minimiere Risiken.
3. Optimiere für Wartbarkeit und Performance.

ANTWORTE IM JSON FORMAT:
{
  "analysis": "Detaillierte Analyse der Situation",
  "recommendation": "Konkrete Empfehlung",
  "plan": ["Schritt 1", "Schritt 2", ...],
  "risks": ["Risiko 1", ...],
  "optimization": "Vorschlag zur Optimierung",
  "confidence": 0.95,
  "approved": true,
  "warnings": []
}
`;

    try {
      const response = await this.requestChatCompletion({
        model: ORACLE_CONFIG.model,
        messages: [
          { role: 'system', content: 'Du bist ein hochintelligenter Software-Architekt.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{.*\}/s);
      if (!jsonMatch) throw new Error('Oracle response is not valid JSON');

      const result = JSON.parse(jsonMatch[0]);
      return {
        analysis: result.analysis || 'Keine Analyse verfügbar',
        recommendation: result.recommendation || 'Keine Empfehlung verfügbar',
        plan: result.plan || [],
        risks: result.risks || [],
        optimization: result.optimization || 'Keine Optimierung vorgeschlagen',
        confidence: typeof result.confidence === 'number' ? result.confidence : 0.5,
        approved: result.approved !== false,
        warnings: result.warnings || []
      };
    } catch (error) {
      console.error('Oracle thinking failed:', error);
      return {
        analysis: 'Analyse fehlgeschlagen',
        recommendation: 'Task manuell prüfen',
        plan: ['Task direkt ausführen (Oracle Fallback)'],
        risks: ['Erhöhtes Risiko durch fehlende strategische Planung'],
        optimization: 'Fehler in der Oracle-Anbindung prüfen',
        confidence: 0.1,
        approved: true,
        warnings: ['Oracle-Anbindung fehlgeschlagen']
      };
    }
  }

  /**
   * Einfaches "Thought" Interface für schnelle Entscheidungen
   */
  static async quickThink(prompt: string): Promise<string> {
    try {
      const response = await this.requestChatCompletion({
        model: ORACLE_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      });
      return response.choices[0].message.content;
    } catch (error) {
      return `Oracle Fallback: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Schließt einen Task ab
   */
  static async completeTask(taskId: string, _result: string, success: boolean, _learnings?: string[]): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = success ? 'COMPLETED' : 'FAILED';
    }
    console.log(`✅ Task ${taskId} abgeschlossen: ${success ? 'SUCCESS' : 'FAILURE'}`);
  }

  /**
   * Invalidiert den Cache
   */
  static invalidateCache(): void {
    console.log('🔮 Oracle Cache invalidated.');
  }

  /**
   * Gibt die nächste Aufgabe zurück
   */
  static async getNextTask(_context: string): Promise<OracleTask | null> {
    return null;
  }

  /**
   * Gibt den aktuellen Status zurück
   */
  static async getStatus(): Promise<{ successRate: number; taskCount: number; completedTasks: number }> {
    const completed = Array.from(this.tasks.values()).filter(t => t.status === 'COMPLETED').length;
    return {
      successRate: this.tasks.size > 0 ? completed / this.tasks.size : 1.0,
      taskCount: this.tasks.size,
      completedTasks: completed
    };
  }

  /**
   * Beendet die Session
   */
  static async endSession(): Promise<void> {
    this.sessionActive = false;
    console.log('🔮 Oracle Session ended.');
  }

  /**
   * Privater Request Handler (DeepSeek & GitHub Models kompatibel)
   */
  private static async requestChatCompletion(
    payload: DeepSeekChatCompletionPayload
  ): Promise<DeepSeekChatCompletionResponse> {
    const isGitHub = ORACLE_CONFIG.provider === 'github-models';
    const isNscale = ORACLE_CONFIG.provider === 'nscale';

    let url = `${ORACLE_CONFIG.baseURL.replace(/\/$/, '')}/v1/chat/completions`;

    if (isGitHub && !ORACLE_CONFIG.baseURL.includes('/v1')) {
      url = `${ORACLE_CONFIG.baseURL.replace(/\/$/, '')}/chat/completions`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ORACLE_CONFIG.apiKey}`,
    };

    if (isNscale) {
      headers[ORACLE_CONFIG.nscaleHeaderName] = ORACLE_CONFIG.nscaleApiKey;
    }

    const response = await this.withTimeout(
      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      }),
      ORACLE_CONFIG.timeoutMs,
      `AI request (${ORACLE_CONFIG.provider}) timed out`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as DeepSeekChatCompletionResponse;
  }

  private static withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
    const timeout = new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]);
  }
}

// CLI Support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'think') {
    Oracle.think(args[1] || 'Kein Task angegeben').then(t => console.log(JSON.stringify(t, null, 2)));
  } else if (command === 'status') {
    console.log(`🔮 Oracle Status: ${ORACLE_CONFIG.provider}`);
    console.log(`📍 Model: ${ORACLE_CONFIG.model}`);
    console.log(`📍 BaseURL: ${ORACLE_CONFIG.baseURL}`);
  }
}
