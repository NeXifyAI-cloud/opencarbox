# Brain

## Architekturübersicht
- Next.js App Router unter `src/app` für UI + API Routes.
- Supabase als Auth + Postgres (RLS) + optionale Storage-Layer.
- AI-Layer über `src/lib/ai/*` mit austauschbaren Providern.
- Operative Helfer (`rate-limit`, `logging`, `config`) als Infrastruktur-Bausteine.

## ADRs
1. **ADR-001: Provider Abstraktion**
   - Entscheidung: Einheitliches Interface `listModels()` und `chatCompletion()`.
   - Grund: neue Provider ohne API-Route-Umbau ergänzen.
2. **ADR-002: Security by Metadata Logging**
   - Entscheidung: nur technische Metadaten in `ai_logs`, keine Prompts/Secrets.
   - Grund: Privacy + Compliance.
3. **ADR-003: In-Memory Rate-Limit als Start**
   - Entscheidung: Token-Bucket in Memory.
   - Grund: schnell, ohne Zusatzinfrastruktur; später auf Redis/Supabase erweiterbar.

## Security/Privacy
- API Keys nie im Klartext rendern; nur masked preview.
- RLS strikt auf `auth.uid() = user_id`.
- API-Fehler liefern Codes statt sensibler Details.

## Provider-Strategie
- DeepSeek + OpenAI-kompatible Endpunkte als Basis.
- NSCALE Header wird zentral im OpenAI-Compat Adapter gesetzt.
- Neue Provider werden als Klasse im gleichen Interface ergänzt.
