# .cline Directory

> Cline AI Agent Konfigurationsverzeichnis

---

## 📁 Inhalt

### `mcp_settings.json`
Konfiguration für 9 MCP (Model Context Protocol) Server:

1. **Supabase** - Database, Auth, Storage, Edge Functions, Branching
2. **GitHub** - Repository, Issues, PRs, Workflows
3. **Docker** - Container & Image Management
4. **Git** - Version Control Operations
5. **PostgreSQL** - Direct SQL Execution
6. **Playwright** - Browser Automation, E2E Tests
7. **Puppeteer** - Alternative Browser Automation
8. **Filesystem** - Enhanced File Operations
9. **Brave Search** - Web Research

**Setup:** Diese Datei wird automatisch von Cline erkannt. Stelle sicher, dass alle Environment Variables in `.env` gesetzt sind.

### `custom_commands.md`
12 Custom Slash-Commands für Cline:

- `/think` - Oracle Thinking Process
- `/recall` - Memory durchsuchen
- `/verify` - Workflow Verification
- `/learn` - Erkenntnis speichern
- `/sync` - Full Synchronisation
- `/error-search` - Fehler-Similarity-Search
- `/pre-change` - Pre-Change Analysis
- `/audit` - Audit Log Entry
- `/context` - Critical Files anzeigen
- `/quality` - Quality Gate
- `/help-nexify` - NeXify Protocol Hilfe

**Setup:** Import in Cline Settings → Custom Commands

---

## 🚀 Quick Start

### 1. MCP Server aktivieren
1. Öffne Cline Settings (⚙️)
2. Gehe zu "MCP Servers"
3. Alle 9 Server sollten automatisch aus `mcp_settings.json` geladen werden
4. Prüfe Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `GITHUB_TOKEN`
   - `BRAVE_API_KEY` (optional)

### 2. Custom Commands importieren
1. Cline Settings → Custom Commands
2. Import `custom_commands.md`
3. Teste mit `/help-nexify` in Cline Chat

---

## 🔒 Security

**WICHTIG:**
- MCP Settings können Environment Variables referenzieren: `${VARIABLE_NAME}`
- Setze NIEMALS Secrets direkt in `mcp_settings.json`
- Alle Credentials gehören in `.env` (nicht committed)

---

## 📚 Weitere Dokumentation

- **Vollständige Config:** `../CLINE_CONFIGURATION.md`
- **Quick Reference:** `../CLINE_QUICK_REFERENCE.md`
- **Perfection Summary:** `../CLINE_PERFECTION_SUMMARY.md`
- **Agent Rules:** `../.clinerules`

---

**Version:** 1.0.0
**Last Updated:** 30. Dezember 2024
