# GitLab Oracle 24/7 Bot Setup

Dieser Bot beantwortet GitLab-Anfragen dauerhaft (24/7), indem er offene Issues überwacht und auf neue Kommentare reagiert.

## 1) Token in GitLab erstellen und einbinden

1. GitLab → **Settings → Access Tokens** (Project Access Token oder Personal Access Token).
2. Scopes aktivieren:
   - `api`
   - `read_repository`
   - `write_repository`
3. Token **nur lokal/secret** speichern, z. B. in `.env.local` oder CI Variables:

```bash
GITLAB_TOKEN=glpat-...
GITLAB_PROJECT_ID=<namespace%2Fproject oder project-id>
GITLAB_BOT_USERNAME=<bot-username>
```

> Sicherheitsregel: Token niemals committen, niemals in Tickets/Chat posten.

## 2) KI-Modell konfigurieren

DeepSeek (empfohlen):

```bash
DEEPSEEK_API_KEY=<secret>
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

Alternativ OpenAI:

```bash
OPENAI_API_KEY=<secret>
OPENAI_MODEL=gpt-4o-mini
```

## 3) Bot starten

Einmaliger Lauf (Smoke-Test):

```bash
npm run bot:oracle:gitlab:once
```

Dauerbetrieb:

```bash
npm run bot:oracle:gitlab
```

Dauerbetrieb mit Auto-Restart (empfohlen):

```bash
npm run bot:oracle:watch
```

## 4) Wie der Bot reagiert

- Überwacht offene Issues im konfigurierten Projekt.
- Liest neue Kommentare (`notes`) seit dem letzten Stand.
- Antwortet, wenn ein Kommentar `?` enthält oder den Trigger `/oracle` nutzt.
- Ignoriert eigene Bot-Kommentare (über `GITLAB_BOT_USERNAME`).
- Speichert Laufzustand in `.cline/oracle-gitlab-bot-state.json`.

## 5) Optional: 24/7 als Systemdienst

Für echten 24/7-Betrieb auf einem Server zusätzlich als Service laufen lassen (z. B. `systemd`, Docker, Kubernetes, GitLab Runner).

Beispiel mit `systemd` (vereinfacht):

```ini
[Unit]
Description=OpenCarBox Oracle GitLab Bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/OpenCarBox
EnvironmentFile=/opt/OpenCarBox/.env.local
ExecStart=/usr/bin/npm run bot:oracle:watch
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Danach:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now opencarbox-oracle-bot.service
```
