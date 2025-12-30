-- =====================================================
-- NeXify Oracle & Memory System - Database Migration
-- =====================================================
-- Erstellt Tabellen für Project Memory und Audit Logs

-- Tabelle: project_memory
-- Speichert Best Practices, Anti-Patterns und Wissen
CREATE TABLE IF NOT EXISTS project_memory (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('BEST_PRACTICE', 'ANTIPATTERN', 'KNOWLEDGE', 'TODO')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für schnelle Suche
CREATE INDEX IF NOT EXISTS idx_project_memory_type ON project_memory(type);
CREATE INDEX IF NOT EXISTS idx_project_memory_category ON project_memory(category);
CREATE INDEX IF NOT EXISTS idx_project_memory_tags ON project_memory USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_project_memory_content ON project_memory USING GIN(to_tsvector('german', content));

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_memory_updated_at
BEFORE UPDATE ON project_memory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabelle: audit_logs
-- Protokolliert alle Agent-Aktionen
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'WARNING')),
  details JSONB,
  error_message TEXT,
  stack_trace TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für Analyse
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);

-- RLS Policies (falls benötigt - hier erstmal offen für Service Role)
ALTER TABLE project_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Service Role hat vollen Zugriff
CREATE POLICY "Service role has full access to project_memory"
  ON project_memory
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to audit_logs"
  ON audit_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed: Initiales Wissen
INSERT INTO project_memory (id, type, category, title, content, tags)
VALUES
  ('mem_001', 'BEST_PRACTICE', 'supabase', 'RLS immer aktiviert', 'Row Level Security muss für alle Tabellen aktiviert sein. Clients sehen nur ihre eigenen Daten.', ARRAY['supabase', 'security', 'rls']),
  ('mem_002', 'BEST_PRACTICE', 'nextjs', 'API Routes für externe Calls', 'Stripe, TecDoc, Meilisearch nur über API Routes aufrufen, nie direkt vom Client.', ARRAY['nextjs', 'api', 'security']),
  ('mem_003', 'BEST_PRACTICE', 'react', 'TanStack Query für Fetching', 'Niemals useEffect für Data Fetching. Immer TanStack Query verwenden.', ARRAY['react', 'data-fetching', 'tanstack-query']),
  ('mem_004', 'ANTIPATTERN', 'typescript', 'Kein any Type', 'TypeScript strict mode: Niemals "any" verwenden. Typen müssen explizit sein.', ARRAY['typescript', 'types', 'strict-mode']),
  ('mem_005', 'KNOWLEDGE', 'architecture', 'Drei Verticals', 'Plattform hat drei Bereiche: (shop) Carvantooo, (werkstatt) OpenCarBox, (autohandel) OpenCarBox', ARRAY['architecture', 'business-logic'])
ON CONFLICT (id) DO NOTHING;

-- Erfolg-Log
INSERT INTO audit_logs (id, action, resource, status, details)
VALUES (
  'audit_init',
  'database_migration',
  'supabase/migrations/003_nexify_memory.sql',
  'SUCCESS',
  '{"message": "NeXify Memory System initialized", "tables": ["project_memory", "audit_logs"]}'::jsonb
);
