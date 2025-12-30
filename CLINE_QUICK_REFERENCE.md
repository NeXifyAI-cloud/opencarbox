# 🎯 CLINE QUICK REFERENCE

> Schnellzugriff für häufigste Operationen

---

## �️ ABSTURZSICHERHEIT (NEU!)

```bash
# System Health Check
npm run cline:health

# Manuelles Recovery bei Problemen
npm run cline:recover

# Status aller Resilience-Systeme
npm run cline:status

# Auto-Restart Daemon starten (läuft im Hintergrund)
npm run cline:auto-restart

# Auto-Restart Status prüfen
npm run cline:auto-status

# Dev Server mit automatischem Neustart bei Absturz
npm run watch:dev
```

---

## �🔥 MOST USED COMMANDS

```bash
# Pre-Change Analysis (vor jeder größeren Änderung)
npm run pre-change "Was du machen willst" file1.ts file2.ts

# Verify (nach Implementierung)
npm run workflow:verify

# Complete (bei erfolgreicher Verify)
npm run workflow:complete

# Oracle testen
npm run oracle:test

# Full Sync (1x täglich empfohlen)
npm run oracle:sync

# Error Search (bei Problemen)
npm run error:search "error message"
```

---

## 💡 CLINE WORKFLOW CHEAT SHEET

### Neue Feature implementieren

```
1. npm run pre-change "Feature X implementieren" src/path/to/file.ts
   → Lese Oracle Guidance

2. Implementiere Feature in Cline
   → Nutze Guidance als Leitfaden

3. npm run workflow:verify
   → Prüfe ob alles funktioniert

4. npm run workflow:complete
   → Speichere Learning
```

### Bug fixen

```
1. npm run error:search "Bug description"
   → Prüfe ob ähnlicher Fehler bekannt

2. Analysiere Root Cause (nicht nur Symptom!)
   → Oracle fragen falls unklar

3. Fixe Bug

4. npm run workflow:verify
   → Tests laufen lassen

5. npm run workflow:complete
   → Lösung als ANTIPATTERN speichern
```

### Code Refactoring

```
1. npm run pre-change "Refactor X weil Y" files...
   → Oracle gibt Safe Refactoring Strategy

2. Refactoring durchführen
   → Incrementell, nicht alles auf einmal

3. npm run workflow:verify nach jedem Schritt
   → Sicherstellen dass nichts bricht

4. npm run workflow:complete
   → Pattern als BEST_PRACTICE speichern
```

---

## 🧠 ORACLE QUICK CALLS

### In TypeScript/Cline

```typescript
import { Oracle } from '@/scripts/core/oracle'

// Standard Think
const r = await Oracle.think("Frage?", "Kontext")

// Mit Memory (empfohlen!)
const r = await Oracle.thinkWithMemory("Frage?", "Kontext")

// Kontext erweitern
await Oracle.optimizeContext("New knowledge...")

// Learning speichern
await Oracle.ingestLearning({ data })
```

---

## 💾 MEMORY QUICK CALLS

```typescript
import { Memory } from '@/scripts/core/memory'

// Best Practice speichern
await Memory.remember({
  type: 'BEST_PRACTICE',
  category: 'api',
  title: 'Kurztitel',
  content: 'Detaillierte Beschreibung...',
  tags: ['tag1', 'tag2']
})

// Antipattern speichern
await Memory.remember({
  type: 'ANTIPATTERN',
  category: 'security',
  title: 'Was vermeiden',
  content: 'Warum und wie richtig...',
  tags: ['avoid', 'security']
})

// Wissen abrufen
const memories = await Memory.recall('suchbegriff')

// Aktion protokollieren
await Memory.audit({
  action: 'create_feature',
  resource: 'file.ts',
  status: 'SUCCESS'
})
```

---

## 📋 CHECKLIST: Definition of Done

Bevor du ein Feature als "fertig" markierst:

- [ ] Code vollständig implementiert (kein TODO/Placeholder)
- [ ] `npm run workflow:verify` erfolgreich
- [ ] Tests geschrieben & grün
- [ ] Memory-Eintrag erstellt (Best Practice oder Learning)
- [ ] Oracle-Kontext aktualisiert (bei größeren Features)
- [ ] Docs aktualisiert (falls neue API/Pattern)
- [ ] .clinerules angepasst (falls neue globale Regel)

---

## 🚨 IMPORTANT RULES (nie vergessen!)

### No-Void Policy

❌ `// TODO: Implement this later`
✅ Sofort vollständig implementieren

### Root Cause First

❌ Quick Fix ohne Analyse
✅ Oracle fragen → Root Cause → Lösung → Speichern

### Think Before Execute

❌ Direkt Code schreiben
✅ `npm run pre-change` → Guidance lesen → Implementieren

### Learn From Everything

❌ Fix und vergessen
✅ Fix → `npm run workflow:complete` → Memory speichern

---

## 🔗 MCP SERVER @ A GLANCE

```
Supabase    → DB, Auth, Storage, Edge Functions
GitHub      → Repos, Issues, PRs, Workflows
Docker      → Containers, Images
Git         → Branches, Commits, Merges
PostgreSQL  → Direct SQL
Playwright  → Browser Automation, E2E
Puppeteer   → Browser Automation (alternative)
Filesystem  → Enhanced File Ops
Brave       → Web Search & Research
```

Alle automatisch verfügbar in Cline Settings → MCP Servers

---

## ⚡ HOTKEYS & SHORTCUTS

### Cline Commands

- `/think [prompt]` → Oracle fragen (custom Cline command)
- `/recall [query]` → Memory durchsuchen (custom)
- `/verify` → Workflow Verify ausführen (custom)

### VS Code Terminal

- `Ctrl + `` → Terminal öffnen
- `Ctrl + Shift + P` → Command Palette
- `Ctrl + P` → Quick File Open

---

## 📞 QUICK LINKS

- **Full Config**: `CLINE_CONFIGURATION.md`
- **Oracle Docs**: `docs/ORACLE_MEMORY_SYSTEM.md`
- **AI Instructions**: `.github/copilot-instructions.md`
- **Rules**: `.clinerules`
- **MCP Config**: `.cline/mcp_settings.json`
- **Project Specs**: `project_specs.md`

---

## 🎯 DAILY WORKFLOW

```bash
# Morgens
npm run oracle:sync           # Sync latest docs

# Bei jedem Feature/Fix
npm run pre-change "..."      # Guidance holen
# → Implementierung
npm run workflow:verify       # Testen
npm run workflow:complete     # Lernen

# Abends (optional)
npm run oracle:sync           # Final sync
git add . && git commit && git push  # Push to trigger CI/CD
```

---

**REMEMBER:** Diese Commands sind deine Werkzeuge für autonome, lernfähige Entwicklung. Nutze sie konsequent!

🚀 **Happy Coding mit NeXify Recursive Intelligence!**
