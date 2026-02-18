# GitHub MCP Server Einrichtung für OpenCarBox

## Übersicht

Der GitHub MCP Server ermöglicht AI-Agenten direkten Zugriff auf GitHub-Funktionen wie Repository-Management, Issue-Tracking, Pull Requests, CI/CD-Workflows und Code-Analyse.

## Konfiguration

### 1. MCP Server Konfiguration

Die Konfiguration befindet sich in `.cline/mcp_settings.json`:

```json
"github": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer ${GITHUB_TOKEN}",
    "X-MCP-Insiders": "true"
  },
  "description": "GitHub MCP Server (Insiders) - Repository operations, issues, pull requests, actions, code security, early access features"
}
```

**Insiders Mode**: Der Header `X-MCP-Insiders: "true"` aktiviert frühen Zugang zu neuen Features und experimentellen Tools.

### 2. Umgebungsvariablen

Der GitHub Token wird in der `.env.local` Datei gespeichert:

```bash
# .env.local
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

**WICHTIG**: Die `.env.local` Datei ist in `.gitignore` enthalten und wird niemals committet.

### 3. Template für neue Entwickler

Für neue Entwickler existiert eine `env.example` Datei mit Platzhaltern:

```bash
# env.example
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

## Verfügbare Funktionen

Der GitHub MCP Server bietet folgende Toolsets:

### Standard-Toolsets
- **repos**: Repository-Operationen (Lesen, Erstellen, Aktualisieren)
- **issues**: Issue-Management (Erstellen, Kommentieren, Schließen)
- **pull_requests**: Pull Request-Operationen
- **actions**: GitHub Actions Workflows
- **code_security**: Code-Sicherheitsanalyse
- **users**: Benutzerinformationen

### Erweiterte Toolsets (optional)
- **gists**: GitHub Gists
- **projects**: GitHub Projects
- **discussions**: GitHub Discussions
- **dependabot**: Dependabot Security Alerts
- **notifications**: Benachrichtigungen

## Verwendung

### 1. Repository-Operationen
- Repository-Inhalte lesen
- Dateien durchsuchen
- Commits analysieren
- Branch-Management

### 2. Issue & PR Management
- Issues erstellen und verwalten
- Pull Requests reviewen
- Labels und Milestones setzen
- Automatische Workflows

### 3. CI/CD Integration
- GitHub Actions Workflows überwachen
- Build-Status prüfen
- Deployment-Pipelines steuern

### 4. Code-Analyse
- Code-Sicherheits-Scans
- Dependency-Vulnerabilities
- Code-Qualitäts-Metriken

## Sicherheitshinweise

### Token-Sicherheit
1. **NIEMALS** den GitHub Token im Code committen
2. Token regelmäßig rotieren (alle 90 Tage)
3. Minimal notwendige Berechtigungen vergeben
4. Token in Umgebungsvariablen speichern

### Berechtigungen
Der verwendete Token sollte folgende Berechtigungen haben:
- `repo` (für Repository-Operationen)
- `read:org` (für Organisationsinformationen)
- `workflow` (für GitHub Actions)

## Troubleshooting

### Häufige Probleme

#### 1. 401 Unauthorized
- Token ist abgelaufen oder ungültig
- Token hat nicht genügend Berechtigungen
- Token-Format ist falsch

**Lösung**: Neuen Token mit korrekten Berechtigungen generieren

#### 2. Rate Limiting
- GitHub API Rate Limit erreicht

**Lösung**: 
- Authentifizierte Requests verwenden (höheres Limit)
- Caching implementieren
- Requests bündeln

#### 3. Netzwerk-Probleme
- MCP Server nicht erreichbar
- Firewall blockiert Verbindung

**Lösung**:
- Netzwerkverbindung prüfen
- Proxy-Einstellungen konfigurieren

## Testing

### Server-Verfügbarkeit testen
```bash
curl -I "https://api.githubcopilot.com/mcp/"
```

Erwartete Antwort: `401 Unauthorized` (ohne Token)

### Mit Token testen
```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" "https://api.githubcopilot.com/mcp/"
```

## Integration mit CLINE

### Auto-Approval Konfiguration
In `.cline/auto_approve.json` können bestimmte GitHub-Operationen automatisch genehmigt werden:

```json
{
  "github": [
    "list_repos",
    "get_repo",
    "list_issues",
    "get_issue",
    "list_pull_requests",
    "get_pull_request"
  ]
}
```

### Best Practices
1. **Read-Only Operationen** automatisch genehmigen
2. **Write-Operationen** manuell bestätigen
3. **Sicherheitsrelevante Operationen** immer manuell prüfen

## Wartung

### Regelmäßige Tasks
1. **Token-Rotation**: Alle 90 Tage
2. **Berechtigungs-Review**: Monatlich
3. **Log-Review**: Wöchentlich
4. **Security-Scan**: Bei jedem Major-Release

### Monitoring
- API-Usage über GitHub Insights
- Error-Rate über Logs
- Performance-Metriken

## Referenzen

### Offizielle Dokumentation
- [GitHub MCP Server Docs](https://github.com/github/github-mcp-server)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [GitHub REST API Docs](https://docs.github.com/en/rest)

### OpenCarBox-spezifisch
- [CLINE Konfiguration](./CLINE_CONFIGURATION.md)
- [Security Guidelines](../SECURITY.md)
- [CI/CD Setup](../docs/architecture/data-flow.md)

---

**Letzte Aktualisierung**: 17.02.2026  
**Verantwortlich**: AI-Agent / NeXifyAI Master  
**Status**: ✅ Produktionsbereit