import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  console.log('--- Initializing Nexify Core Tables via SQL RPC ---');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.project_memory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      tags TEXT[] DEFAULT '{}',
      confidence_score FLOAT DEFAULT 1.0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id TEXT NOT NULL DEFAULT 'cline-nexify-agent',
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details JSONB DEFAULT '{}',
      status TEXT NOT NULL,
      error_message TEXT,
      stack_trace TEXT,
      duration_ms INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    // Da wir kein direktes 'exec' in PostgREST haben, nutzen wir eine RPC Funktion falls vorhanden, 
    // oder verlassen uns darauf, dass Prisma oder der User die Tabellen via Supabase UI anlegt.
    // Aber wir können versuchen, einen Test-Insert zu machen, um zu sehen ob sie da sind.
    
    console.log('Checking for tables...');
    const { error: memoryError } = await supabase.from('project_memory').select('count', { count: 'exact', head: true });
    
    if (memoryError && memoryError.code === 'PGRST205') {
       console.error('CRITICAL: Tabellen fehlen in Supabase! Bitte SQL in Supabase Dashboard ausführen:');
       console.log(sql);
       process.exit(1);
    } else {
       console.log('Tables are present or accessible.');
    }

  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

initDatabase();