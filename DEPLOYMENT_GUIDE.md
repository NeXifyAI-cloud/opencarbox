# Deployment & Wartungs-Leitfaden (OpenCarBox)

Dieser Leitfaden bietet einen strukturierten, schrittweisen Plan zur sicheren Überprüfung, Fehlerbehebung und Bereitstellung des OpenCarBox-Repositorys.

## Phase 1: Initiale Bewertung (Assessment)

**Ziel:** Verständnis des Ist-Zustands, der Abhängigkeiten und der Testabdeckung.

1.  **Repository-Struktur prüfen:**
    *   `src/`: Next.js App Router Code (Neu).
    *   `frontend/`: Legacy React-Codebase.
    *   `prisma/`: Datenbank-Schema.
2.  **Abhängigkeiten analysieren:**
    *   Befehl: `pnpm list`
3.  **Status-Quo Build & Test:**
    *   Befehl: `pnpm run build && pnpm run test`

## Phase 2: Geheimnisverwaltung (Secrets & Environment)

**Ziel:** Sicherstellen, dass alle Dienste (GitHub, Vercel, Supabase, AI) korrekt konfiguriert sind.

### 1. Lokale Konfiguration (`.env.local`)
Erstellen Sie eine `.env.local` Datei (diese wird von Git ignoriert) mit den folgenden Schlüsseln:
- `AI_PROVIDER=deepseek`
- `DEEPSEEK_API_KEY`
- `NSCALE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (PostgreSQL Connection String für Supabase)
- `SUPABASE_SERVICE_ROLE_KEY`
- `VERCEL_TOKEN` & `VERCEL_PROJEKT_ID`
- `CLASSIC_TOKEN_GITHUB_NEU` (für automatisierte Skripte)

### 2. Automatisierte Einrichtung der Secrets
Das Repository enthält Skripte, um Secrets automatisch in GitHub und Vercel zu setzen:
- **GitHub Secrets:** Nutzen Sie `scripts/set-deploy-secrets.sh`.
  ```bash
  export GITHUB_OWNER="NeXifyAI-cloud"
  export REPO_NAME="opencarbox"
  export CLASSIC_TOKEN_GITHUB_NEU="..."
  # ... weitere Variablen exportieren ...
  ./scripts/set-deploy-secrets.sh
  ```
- **Vercel Env Vars:** Wenn `VERCEL_TOKEN` gesetzt ist, wird das obige Skript auch Vercel-Umgebungsvariablen aktualisieren.

## Phase 3: Datenbank-Setup (Supabase)

**Ziel:** Migration des Schemas auf die PostgreSQL-Instanz von Supabase.

1.  **Prisma Provider anpassen:**
    In `prisma/schema.prisma` muss der Provider für das Deployment von `sqlite` auf `postgresql` umgestellt werden:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
2.  **Schema pushen:**
    ```bash
    npx prisma db push
    ```

## Phase 4: CI/CD Stabilisierung

**Ziel:** Automatisierung der Qualitätssicherung.

1.  **GitHub Actions Workflow:**
    Stellen Sie sicher, dass `.github/workflows/auto-deploy.yml` korrekt konfiguriert ist. Alle benötigten Secrets (siehe Phase 2) müssen im GitHub Repository unter *Settings > Secrets and variables > Actions* hinterlegt sein.

## Phase 5: Validierung & Rollback-Plan

**Ziel:** Sicherheit nach dem Release.

1.  **Post-Deployment Check:**
    *   Überprüfung der Shop-Funktionalität (`/shop`).
    *   Prüfung der AI-Integration (DeepSeek Status).
2.  **Rollback-Verfahren:**
    *   **Vercel:** In der Vercel UI das vorherige Deployment auswählen und auf "Redeploy" -> "Promote to Production" klicken.
    *   **Datenbank:** Falls Migrationen fehlgeschlagen sind, `prisma migrate resolve --rolled-back <migration_name>` verwenden oder Backup in Supabase einspielen.

---

## Risiko-Matrix & Minimierung

| Risiko | Auswirkung | Minimierung |
| :--- | :--- | :--- |
| **Bypass Quality Gate** | Instabiler Code | CI-Blocker für fehlgeschlagene Quality-Gate Skripte. |
| **OpenAI Leak** | Compliance-Verstoß | Automatisierter Guard-Script Check (`tools/guard_no_openai.sh`). |
| **Regressions** | UI-Fehler | Einführung von Playwright für visuelle Regressionstests. |

## Liste aller benötigten Umgebungsvariablen

| Variable | Zweck | Platform |
| :--- | :--- | :--- |
| `DEEPSEEK_API_KEY` | AI Integration | Vercel, GitHub |
| `NSCALE_API_KEY` | AI Provider Support | Vercel, GitHub |
| `DATABASE_URL` | Supabase DB Verbindung | Vercel, GitHub |
| `NEXT_PUBLIC_SUPABASE_URL` | Client API Zugriff | Vercel, GitHub |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Authentifizierung | Vercel, GitHub |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Backend Zugriff | Vercel, GitHub |
| `VERCEL_TOKEN` | Deployment Automatisierung | GitHub |
| `GH_TOKEN` / `CLASSIC_TOKEN_GITHUB_NEU` | Repository Management | GitHub, Lokale Skripte |
| `TINYBIRD_TOKEN` | Echtzeit-Analytics | Vercel (optional) |
| `RENDER_API_KEY` | Cloud Hosting Management | Vercel (optional) |
