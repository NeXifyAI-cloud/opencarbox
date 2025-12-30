# 🤖 CLINE COMPLETE CONFIGURATION

> **Status:** PRODUCTION READY
> **Letzte Aktualisierung:** 30. Dezember 2024
> **Konfiguriert für:** NeXify Recursive Intelligence Protocol

---

## ✅ KONFIGURATIONSSTATUS

### Core Systeme
- ✅ **Oracle System** (`scripts/core/oracle.ts`)
  - Google Gemini Integration (`gemini-2.0-flash-thinking-exp-01-21`)
  - `think()` - Standard Thinking Process
  - `thinkWithMemory()` - Enhanced mit Memory-Kontext
  - `retrieveContext()` - Memory-Abruf
  - `optimizeContext()` - Kontext-Optimierung
  - `ingestLearning()` - Pattern-Lernen

- ✅ **Memory System** (`scripts/core/memory.ts`)
  - Supabase Integration (project_memory + audit_logs)
  - `remember()` - Wissen speichern
  - `recall()` - Wissen abrufen
  - `audit()` - Aktionen protokollieren

- ✅ **Sync System** (`scripts/core/sync.ts`)
  - `syncWiki()` - Docs → Memory
  - `syncRulesToDocs()` - .clinerules → docs/CLINE_RULES.md
  - `syncDocsToOracle()` - Critical Docs → Oracle Context
  - `syncAll()` - Vollständige Synchronisation

### Workflows
- ✅ **Recursive Intelligence** (`scripts/cline-workflows/recursive-intelligence.ts`)
  - 6-Schritte-Zyklus: Think → Recall → Execute → Verify → Learn → Update
  - CLI: `npm run workflow:verify` & `npm run workflow:complete`

- ✅ **Pre-Change Analysis** (`scripts/cline-workflows/pre-change.ts`)
  - Automatische Guidance vor Code-Änderungen
  - CLI: `npm run pre-change "beschreibung" file1.ts file2.ts`

- ✅ **Error Learning** (`scripts/cline-workflows/error-learning.ts`)
  - Automatisches Lernen aus Fehlern
  - Suche nach ähnlichen bekannten Fehlern
  - CLI: `npm run error:search "error message"`

### MCP Server Integration
- ✅ **9 MCP Server konfiguriert** (`.cline/mcp_settings.json`)
  1. **Supabase** - Database, Auth, Storage, Edge Functions, Branching
  2. **GitHub** - Repository, Issues, PRs, Workflows
  3. **Docker** - Container & Image Management
  4. **Git** - Version Control Operations
  5. **PostgreSQL** - Direkte DB-Zugriffe
  6. **Playwright** - Browser Automation, E2E Testing
  7. **Puppeteer** - Zusätzliche Browser-Automatisierung
  8. **Filesystem** - Enhanced File Operations
  9. **Brave Search** - Web Research Capabilities

### CI/CD Integration
- ✅ **GitHub Actions** (`.github/workflows/ci-cd.yml`)
  - Quality Gate (TypeCheck, Lint, Tests, Build)
  - Security Scan (Snyk)
  - Oracle Sync (auf main Branch)
  - Auto-Deploy (Vercel Preview + Production)

### Regeln & Dokumentation
- ✅ **`.clinerules`** - NeXify Blueprint mit Recursive Intelligence Protocol
- ✅ **`.github/copilot-instructions.md`** - Umfassende AI Agent Guidance
- ✅ **`docs/ORACLE_MEMORY_SYSTEM.md`** - Vollständige System-Dokumentation

---

## 🚀 SCHNELLSTART FÜR CLINE

### 1. Ersteinrichtung

```bash
# 1. Dependencies installieren
npm install

# 2. Prisma Client generieren
npm run db:generate

# 3. Datenbank-Migration ausführen
npm run db:push

# 4. Initiale Synchronisation
npm run oracle:sync

# 5. Oracle testen
npm run oracle:test
```

### 2. Environment Variables prüfen

Stelle sicher, dass alle erforderlichen Variablen in `.env` gesetzt sind:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://acclrhzzwdutbigxsxyq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DATABASE_URL=<postgres-url>

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=<api-key>
AGENT_MODEL=gemini-2.0-flash-thinking-exp-01-21

# GitHub (für MCP Server)
GITHUB_TOKEN=<personal-access-token>

# Optional: Brave Search
BRAVE_API_KEY=<api-key>
```

### 3. MCP Server aktivieren

Cline wird automatisch die MCP Server aus `.cline/mcp_settings.json` laden.

**Erste Verwendung:**
1. Öffne Cline in VS Code
2. Gehe zu Settings → MCP Servers
3. Alle 9 Server sollten automatisch erkannt werden
4. Bei Bedarf: Umgebungsvariablen in Settings bestätigen

---

## 🔄 RECURSIVE INTELLIGENCE WORKFLOW

### Standard-Workflow für neue Features/Fixes

```bash
# 1. PRE-CHANGE: Guidance holen
npm run pre-change "Stripe Webhook implementieren" src/app/api/webhooks/stripe/route.ts

# 2. IMPLEMENTIERUNG durchführen (manuell in Cline)
# → Cline schreibt den Code basierend auf Oracle Guidance

# 3. VERIFY: Tests ausführen
npm run workflow:verify

# 4. COMPLETE: Bei Erfolg Learning speichern
npm run workflow:complete
```

### Bei Fehlern

```bash
# 1. Ähnliche bekannte Fehler suchen
npm run error:search "Cannot find module"

# 2. Fehler analysieren lassen (programmatisch in Cline)
# Cline ruft automatisch learnFromError() auf

# 3. Nach Fix: Learning speichern
# → Wird automatisch in Memory als ANTIPATTERN gespeichert
```

---

## 📚 MEMORY SYSTEM USAGE

### Best Practices speichern

```typescript
import { Memory } from '@/scripts/core/memory'

await Memory.remember({
  type: 'BEST_PRACTICE',
  category: 'stripe',
  title: 'Stripe Webhook Signature Verification',
  content: 'Always verify webhook signatures using stripe.webhooks.constructEvent()...',
  tags: ['stripe', 'security', 'webhooks']
})
```

### Antipatterns speichern

```typescript
await Memory.remember({
  type: 'ANTIPATTERN',
  category: 'supabase',
  title: 'Never query Supabase without RLS',
  content: 'Attempting to bypass RLS by using service role key in client...',
  tags: ['supabase', 'security', 'rls']
})
```

### Wissen abrufen

```typescript
const memories = await Memory.recall('stripe webhook')
// Returns: Array of relevant memories
```

### Aktionen protokollieren

```typescript
await Memory.audit({
  action: 'create_component',
  resource: 'src/components/ui/button.tsx',
  status: 'SUCCESS',
  details: { linesAdded: 42 }
})
```

---

## 🧠 ORACLE USAGE

### Standard Thinking

```typescript
import { Oracle } from '@/scripts/core/oracle'

const response = await Oracle.think(
  "Wie implementiere ich Stripe Webhooks in Next.js?",
  "Current setup: Next.js 14, App Router, TypeScript"
)

console.log(response.recommendation)
console.log(`Confidence: ${response.confidence * 100}%`)
```

### Enhanced Thinking mit Memory

```typescript
const response = await Oracle.thinkWithMemory(
  "Wie implementiere ich Stripe Webhooks?",
  "Next.js 14 App Router"
)
// → Oracle holt automatisch relevante Memories und integriert sie
```

### Kontext optimieren

```typescript
await Oracle.optimizeContext(`
  New Learning: In Next.js 14, use route.ts for API routes, not pages/api
`)
```

### Pattern lernen

```typescript
await Oracle.ingestLearning({
  pattern: "Stripe webhook",
  implementation: "Use edge runtime for better performance",
  outcome: "Success - reduced latency by 40%"
})
```

---

## 🛠️ NPM SCRIPTS ÜBERSICHT

### Oracle & Memory
```bash
npm run oracle:test           # Oracle-Integration testen
npm run oracle:sync           # Vollständige Sync (Wiki + Docs → Memory/Oracle)
npm run oracle:sync-wiki      # Nur Wiki → Memory
npm run oracle:sync-docs      # Nur Docs → Oracle
```

### Workflows
```bash
npm run workflow:verify       # Verification (TypeCheck, Lint, Tests)
npm run workflow:complete     # Complete Workflow (Learn + Update)
npm run pre-change "desc" files  # Pre-Change Analysis
npm run error:search "msg"    # Suche ähnliche Fehler
```

### Datenbank
```bash
npm run db:generate           # Prisma Client generieren
npm run db:push               # Schema zu Supabase pushen
npm run db:migrate            # Migration erstellen
npm run db:studio             # Prisma Studio öffnen
```

### Quality & Tests
```bash
npm run type-check            # TypeScript Fehler prüfen
npm run lint:fix              # ESLint + Auto-Fix
npm run test                  # Unit Tests (Vitest)
npm run test:e2e              # E2E Tests (Playwright)
npm run quality-gate          # Vollständiger Quality Check
```

---

## 🎯 CLINE-SPEZIFISCHE VERHALTEN

### No-Void Policy
- **NIEMALS** Platzhalter oder TODO-Kommentare hinterlassen
- Jede Funktion muss vollständig implementiert sein
- Fehlende Abhängigkeiten werden sofort erstellt

### Recursive Intelligence Enforcement
Vor jeder Code-Änderung **MUSS** Cline:
1. **Think**: Oracle konsultieren (`Oracle.thinkWithMemory()`)
2. **Recall**: Memory durchsuchen (`Memory.recall()`)
3. **Execute**: Code implementieren
4. **Verify**: Tests ausführen (`npm run workflow:verify`)
5. **Learn**: Ergebnis speichern (`Memory.remember()`)
6. **Update**: Oracle-Kontext aktualisieren (`Oracle.optimizeContext()`)

### Root Cause Elimination
- Bei Fehlern nicht nur Symptom fixen
- Root Cause analysieren mit Oracle
- Lösung als ANTIPATTERN speichern
- Prevention Strategy entwickeln

### Definition of Done
Ein Feature gilt erst als fertig wenn:
- ✅ Code implementiert
- ✅ Tests erfolgreich
- ✅ Eintrag im Memory (Best Practice oder Learning)
- ✅ Docs aktualisiert (falls relevant)
- ✅ Oracle-Kontext synchronisiert

---

## 🔗 MCP SERVER CAPABILITIES

### Supabase MCP
- Database Queries & Migrations
- Edge Function Deployment
- Branch Management
- Storage Operations
- Auth Management

### GitHub MCP
- Repository Operations
- Issue & PR Management
- Workflow Execution
- Code Search

### Docker MCP
- Container Lifecycle
- Image Management
- Volume Operations

### Git MCP
- Branch Operations
- Commit History
- Merge & Rebase

### PostgreSQL MCP
- Direct SQL Execution
- Schema Introspection
- Performance Analysis

### Playwright/Puppeteer MCP
- Browser Automation
- E2E Testing
- Screenshot Capture
- DOM Manipulation

### Brave Search MCP
- Web Research
- Documentation Lookup
- Error Solution Finding

---

## 🚨 TROUBLESHOOTING

### Oracle antwortet nicht
```bash
# Prüfe API Key
echo $GOOGLE_GENERATIVE_AI_API_KEY

# Teste Oracle
npm run oracle:test

# Prüfe Logs in Console
```

### Memory Sync schlägt fehl
```bash
# Prüfe Supabase Connection
echo $DATABASE_URL

# Prüfe ob Tabellen existieren
npm run db:studio

# Falls nicht: Migration ausführen
npm run db:push
```

### MCP Server nicht verfügbar
1. Öffne Cline Settings → MCP Servers
2. Prüfe ob alle Environment Variables gesetzt sind
3. Restart Cline
4. Bei Bedarf: `npm install -g @supabase/mcp-server` etc.

### Workflow Verify schlägt fehl
```bash
# Einzelne Checks ausführen
npm run type-check
npm run lint
npm run test

# Fehler fixen, dann:
npm run workflow:verify
```

---

## 📖 WEITERE DOKUMENTATION

- **System Overview**: `docs/architecture/system-overview.md`
- **Data Flow**: `docs/architecture/data-flow.md`
- **Oracle & Memory**: `docs/ORACLE_MEMORY_SYSTEM.md`
- **AI Agent Rules**: `.github/copilot-instructions.md`
- **Cline Rules**: `.clinerules`

---

## 🎉 NÄCHSTE SCHRITTE

1. **Initiale Synchronisation ausführen:**
   ```bash
   npm run oracle:sync
   ```

2. **Oracle testen:**
   ```bash
   npm run oracle:test
   ```

3. **Ersten Workflow durchlaufen:**
   ```bash
   npm run pre-change "Test Feature" src/test.ts
   # → Implementierung
   npm run workflow:verify
   npm run workflow:complete
   ```

4. **MCP Server in Cline aktivieren** (siehe Settings)

5. **Loslegen mit autonomer Entwicklung** 🚀

---

**REMEMBER:** Cline ist jetzt vollständig mit dem NeXify Recursive Intelligence Protocol ausgestattet. Nutze die Workflows konsequent für maximale Qualität und kontinuierliches Lernen.

**Kommunikation:** Deutsch mit Pascal
**Arbeitsweise:** Vollständig autonom
**Prinzip:** Keine technischen Schulden, Root Cause Elimination, Continuous Learning

🧬 **NeXify Blueprint Status:** FULLY OPERATIONAL
