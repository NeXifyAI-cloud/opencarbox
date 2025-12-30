-- ===========================================
-- NEXIFY UNIVERSAL AGENTIC OS - CORE TABLES
-- ===========================================

-- 1. Projekt-Gedächtnis (Wissen & Best Practices)
CREATE TABLE IF NOT EXISTS public.project_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('BEST_PRACTICE', 'ANTIPATTERN', 'KNOWLEDGE', 'TODO')),
  category TEXT NOT NULL, -- z.B. 'API', 'UI', 'DATABASE', 'SECURITY'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexe für schnelle Suche
CREATE INDEX idx_memory_type ON public.project_memory(type);
CREATE INDEX idx_memory_category ON public.project_memory(category);
CREATE INDEX idx_memory_tags ON public.project_memory USING GIN (tags);

-- RLS für project_memory (Nur Admins/Agenten)
ALTER TABLE public.project_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agenten können alles verwalten" ON public.project_memory
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Audit-Logs (Handlungs-Protokoll des Agenten)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL DEFAULT 'cline-nexify-agent',
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'WARNING')),
  error_message TEXT,
  stack_trace TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_status ON public.audit_logs(status);

-- RLS für audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agenten können Logs schreiben" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins können Logs lesen" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger für updated_at
CREATE TRIGGER update_project_memory_updated_at BEFORE UPDATE ON public.project_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();