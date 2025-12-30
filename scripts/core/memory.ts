import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Resilience Configuration
const MEMORY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 500,
  connectionTimeoutMs: 10000,
};

// Singleton with lazy initialization
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Memory: Missing Supabase credentials in environment');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { fetch: fetchWithTimeout },
    });
  }
  return supabaseInstance;
}

// Fetch with timeout
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MEMORY_CONFIG.connectionTimeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export type MemoryType = 'BEST_PRACTICE' | 'ANTIPATTERN' | 'KNOWLEDGE' | 'TODO';
export type AuditStatus = 'SUCCESS' | 'FAILURE' | 'WARNING';

/**
 * Memory Core - Schnittstelle zu Supabase (Project Memory & Audit Logs)
 */
export class Memory {
  /**
   * Speichert eine neue Erkenntnis im Gedächtnis
   */
  static async remember(params: {
    type: MemoryType;
    category: string;
    title: string;
    content: string;
    metadata?: any;
    tags?: string[];
  }): Promise<void> {
    await this.withRetry(async () => {
      const { error } = await getSupabase().from('project_memory').insert([params]);
      if (error) {
        throw new Error(`Memory remember failed: ${error.message}`);
      }
    }, 'Memory.remember');
  }

  /**
   * Ruft Wissen aus dem Gedächtnis ab
   */
  static async recall(query: string, filter?: any): Promise<any[]> {
    return this.withRetry(async () => {
      let request = getSupabase().from('project_memory').select('*');

      if (filter) {
        request = request.match(filter);
      }

      const { data, error } = await request.textSearch('content', query);

      if (error) {
        throw new Error(`Memory recall failed: ${error.message}`);
      }
      return data || [];
    }, 'Memory.recall', [], MEMORY_CONFIG.maxRetries);
  }

  /**
   * Protokolliert eine Aktion (Audit Log)
   */
  static async audit(params: {
    action: string;
    resource: string;
    status: AuditStatus;
    details?: any;
    error_message?: string;
    stack_trace?: string;
    duration_ms?: number;
  }): Promise<void> {
    // Audit should not throw - best effort logging
    try {
      await this.withRetry(async () => {
        const { error } = await getSupabase().from('audit_logs').insert([{
          ...params,
          created_at: new Date().toISOString(),
        }]);
        if (error) {
          throw new Error(`Audit logging failed: ${error.message}`);
        }
      }, 'Memory.audit', undefined, 2); // Fewer retries for audit
    } catch (e) {
      // Silent fail for audit - don't break the main flow
      console.error('Audit logging failed (non-critical):', e);
    }
  }

  /**
   * Retry wrapper mit exponential backoff
   */
  private static async withRetry<T>(
    fn: () => Promise<T>,
    operationName: string,
    fallbackValue?: T,
    maxRetries: number = MEMORY_CONFIG.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`${operationName}: Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

        if (attempt < maxRetries) {
          const delay = MEMORY_CONFIG.retryDelayMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (fallbackValue !== undefined) {
      console.warn(`${operationName}: Returning fallback value after ${maxRetries} failed attempts`);
      return fallbackValue;
    }

    throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
  }

  /**
   * Holt alle Einträge eines bestimmten Typs
   */
  static async getByType(type: MemoryType, limit: number = 50): Promise<any[]> {
    return this.withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('project_memory')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(`Memory getByType failed: ${error.message}`);
      return data || [];
    }, 'Memory.getByType', [], MEMORY_CONFIG.maxRetries);
  }

  /**
   * Holt alle Einträge (für Oracle Kontext)
   */
  static async getAll(limit: number = 100): Promise<any[]> {
    return this.withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('project_memory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(`Memory getAll failed: ${error.message}`);
      return data || [];
    }, 'Memory.getAll', [], MEMORY_CONFIG.maxRetries);
  }

  /**
   * Sucht nach Einträgen mit Tags
   */
  static async searchByTags(tags: string[], limit: number = 20): Promise<any[]> {
    return this.withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('project_memory')
        .select('*')
        .contains('tags', tags)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new Error(`Memory searchByTags failed: ${error.message}`);
      return data || [];
    }, 'Memory.searchByTags', [], MEMORY_CONFIG.maxRetries);
  }

  /**
   * Holt Statistiken über das Gedächtnis
   */
  static async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    recentCount: number;
  }> {
    return this.withRetry(async () => {
      const { data, error } = await getSupabase()
        .from('project_memory')
        .select('type');

      if (error) throw new Error(`Memory getStats failed: ${error.message}`);

      const byType: Record<string, number> = {};
      let recentCount = 0;
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      (data || []).forEach((m: any) => {
        byType[m.type] = (byType[m.type] || 0) + 1;
        if (new Date(m.created_at).getTime() > oneDayAgo) recentCount++;
      });

      return {
        total: data?.length || 0,
        byType,
        recentCount
      };
    }, 'Memory.getStats', { total: 0, byType: {}, recentCount: 0 }, MEMORY_CONFIG.maxRetries);
  }

  /**
   * Löscht alte Einträge (Cleanup)
   */
  static async cleanup(olderThanDays: number = 30, keepTypes: MemoryType[] = ['BEST_PRACTICE']): Promise<number> {
    return this.withRetry(async () => {
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await getSupabase()
        .from('project_memory')
        .delete()
        .lt('created_at', cutoffDate)
        .not('type', 'in', `(${keepTypes.join(',')})`)
        .select('id');

      if (error) throw new Error(`Memory cleanup failed: ${error.message}`);
      return data?.length || 0;
    }, 'Memory.cleanup', 0, 2);
  }

  /**
   * Health Check - Prüft Supabase Verbindung
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const { error } = await getSupabase().from('project_memory').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Reconnect - Erneuert Supabase Verbindung
   */
  static reconnect(): void {
    supabaseInstance = null;
    console.log('Memory: Connection reset, will reconnect on next operation');
  }
}
