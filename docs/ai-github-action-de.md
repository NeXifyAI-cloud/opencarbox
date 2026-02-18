# KI-GitHub-Aktion 🤖

Optimieren Sie Ihren GitHub-Workflow mit KI-gestützter Automatisierung.

**GitHub-Sterne · Lizenz: MIT · Neueste Veröffentlichung**

## ✨ Übersicht

Die AI GitHub Action nutzt das OpenAI Agents Framework, um GitHub-Workflows intelligent zu automatisieren. Diese Action analysiert Pull Requests, Issues und Code-Repositories und liefert wertvolles Feedback, automatisierte Code-Reviews und hilfreiche Antworten.

> Hinweis für dieses Repository: AI-Automation ist **DeepSeek-only**. Jeder AI-Request muss den `NSCALE_API_KEY`-Header mitsenden. Es gibt **keinen** OpenAI-Fallback.

## 🚀 Hauptmerkmale

- **Automatisierte PR-Reviews** – Umfassendes Feedback zur Codequalität mit optionaler Auto-Genehmigung für hochwertige Beiträge.
- **Issue-Analyse** – KI-generierte Antworten mit Kategorisierung und Priorisierung.
- **Code-Scanning** – Erkennung von Sicherheitslücken und Verstößen gegen Best Practices.
- **Benutzerdefinierte Anweisungen** – Verhalten der KI an Projektanforderungen anpassen.
- **Tracing** – Nachvollziehbarkeit über das Agent SDK.

## 📋 Anwendungsbeispiele

### Pull-Request-Review

```yaml
name: AI PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  pr-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: AI PR Review
        uses: aguirreibarra/ai-github-action@main
        with:
          action-type: pr-review
          deepseek-api-key: ${{ secrets.DEEPSEEK_API_KEY }}
          nscale-api-key: ${{ secrets.NSCALE_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          custom-prompt: "Focus on security best practices and performance optimization"
```

Die PR-Review-Aktion analysiert Pull Requests und reicht ein Review mit zeilengenauem Feedback ein.

### Issue-Analyse

```yaml
name: AI Issue Analysis

on:
  issues:
    types: [opened, labeled]

jobs:
  analyze:
    permissions:
      issues: write
    runs-on: ubuntu-latest
    if: github.event.action == 'opened' || contains(github.event.issue.labels.*.name, 'needs-triage')
    steps:
      - name: AI Issue Analysis
        uses: aguirreibarra/ai-github-action@main
        with:
          action-type: issue-analyze
          deepseek-api-key: ${{ secrets.DEEPSEEK_API_KEY }}
          nscale-api-key: ${{ secrets.NSCALE_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Remove needs-triage label
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            try {
              await github.rest.issues.removeLabel({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                name: 'needs-triage'
              });
            } catch (e) {
              // Label might not exist, that's okay
            }
```

### Code-Scanning

```yaml
name: AI Code Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Weekly scan
  workflow_dispatch:

jobs:
  scan:
    permissions:
      contents: read
      issues: write
    runs-on: ubuntu-latest
    steps:
      - name: AI Code Scan
        uses: aguirreibarra/ai-github-action@main
        with:
          action-type: code-scan
          deepseek-api-key: ${{ secrets.DEEPSEEK_API_KEY }}
          nscale-api-key: ${{ secrets.NSCALE_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## ⚙️ Konfigurationsoptionen

| Eingabe | Beschreibung | Erforderlich | Standard |
|---|---|---|---|
| `action-type` | Art der Aktion (`pr-review`, `issue-analyze`, `code-scan`) | Ja | - |
| `deepseek-api-key` | DeepSeek API-Schlüssel | Ja | - |
| `nscale-api-key` | NSCALE API-Schlüssel (Header für jeden AI-Request) | Ja | - |
| `github-token` | GitHub-Token für API-Zugriff | Ja | - |
| `model` | Zu verwendendes DeepSeek-Modell | Nein | `deepseek-chat` |
| `max-turns` | Maximale Anzahl Agent-Turns | Nein | `30` |
| `custom-prompt` | Benutzerdefinierte Systemanweisung | Nein | - |

## 🔍 Debugging mit `LOG_LEVEL`

Die Ausführlichkeit der Logs kann über die Umgebungsvariable `LOG_LEVEL` gesteuert werden:

```yaml
steps:
  - name: AI PR Review
    uses: aguirreibarra/ai-github-action@main
    with:
      action-type: pr-review
      deepseek-api-key: ${{ secrets.DEEPSEEK_API_KEY }}
      nscale-api-key: ${{ secrets.NSCALE_API_KEY }}
      github-token: ${{ secrets.GITHUB_TOKEN }}
    env:
      LOG_LEVEL: DEBUG # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

## 🤝 Beitragen

Beiträge sind willkommen. Richtlinien finden Sie in `CONTRIBUTING.md`.

## 📜 Lizenz

MIT-Lizenz.
