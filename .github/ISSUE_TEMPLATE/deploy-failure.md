---
name: Bug Report
about: Automatisch erstellt bei fehlgeschlagenem Deployment
title: "🐛 Bug Report"
labels: bug
assignees: ''
---

## 🚨 Auto-Deployment fehlgeschlagen

**Commit:** `{{ env.GITHUB_SHA }}`
**Branch:** `main`
**Workflow:** Auto-Deploy Production

### Logs
Bitte prüfe die [GitHub Actions Logs]({{ env.GITHUB_SERVER_URL }}/{{ env.GITHUB_REPOSITORY }}/actions) für Details.

### Mögliche Ursachen
- [ ] Build-Fehler
- [ ] TypeScript-Fehler
- [ ] Fehlende Environment Variables
- [ ] Vercel API Probleme

### Nächste Schritte
1. Logs prüfen
2. Fehler lokal reproduzieren
3. Fix erstellen und pushen
