# GitHub Secrets Setup - Checkliste

## 📋 Required Secrets für CI/CD

Gehe zu: `https://github.com/NeXify-Chat-it-Automate-it/OpenCarBox/settings/secrets/actions`

### 🗄️ Supabase Secrets

```bash
NEXT_PUBLIC_SUPABASE_URL
# Wert: https://acclrhzzwdutbigxsxyq.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
# Wert: aus .env kopieren (eyJhbGciOiJIUzI1NiIsInR5cCI6...)

SUPABASE_SERVICE_ROLE_KEY
# Wert: aus .env kopieren (Service Role Key)

DATABASE_URL
# Wert: postgresql://postgres:PASSWORD@db.acclrhzzwdutbigxsxyq.supabase.co:5432/postgres
```

### 🤖 Google AI (Oracle)

```bash
GOOGLE_GENERATIVE_AI_API_KEY
# Wert: aus .env kopieren (AIzaSy...)
```

### ☁️ Vercel Deployment

```bash
VERCEL_TOKEN
# Wert: pPwzP0jhHYgwXhpS5P0aCLWO

VERCEL_PROJECT_ID
# Wert: prj_hJUOVM8ETLfdGvSlxzlBkuqCgx86

VERCEL_ORG_ID
# Wert: team_nexifyai
```

### 🔒 Security Scanning (Optional)

```bash
SNYK_TOKEN
# Wert: Snyk Account Token (falls vorhanden)
```

### 💳 Stripe (wenn implementiert)

```bash
STRIPE_SECRET_KEY
# Wert: sk_test_... oder sk_live_...

STRIPE_WEBHOOK_SECRET
# Wert: whsec_...
```

### 📧 Resend Email (wenn implementiert)

```bash
RESEND_API_KEY
# Wert: re_...
```

## ⚡ Automatisiertes Setzen via CLI

Wenn du `gh` (GitHub CLI) und optional `vercel` CLI installiert hast, kannst du die Secrets direkt aus Umgebungsvariablen setzen:

```bash
chmod +x scripts/set-deployment-secrets.sh
GITHUB_OWNER=NeXify-Chat-it-Automate-it \
REPO_NAME=OpenCarBox \
GH_TOKEN=... \
NEXT_PUBLIC_SUPABASE_URL=... \
NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
SUPABASE_SERVICE_ROLE_KEY=... \
DEEPSEEK_API_KEY=... \
AI_PROVIDER=deepseek \
DEEPSEEK_BASE_URL=https://api.deepseek.com \
NSCALE_API_KEY=... \
./scripts/set-deployment-secrets.sh
```

Optional: mit `VERCEL_TOKEN` setzt das Script zusätzlich die `production`-Envs in Vercel.

## ✅ Setup-Schritte

1. **GitHub öffnen:**
   ```
   https://github.com/NeXify-Chat-it-Automate-it/OpenCarBox/settings/secrets/actions
   ```

2. **Für jedes Secret:**
   - Klicke "New repository secret"
   - Name: (wie oben)
   - Value: (aus .env kopieren)
   - Klicke "Add secret"

3. **Verifizieren:**
   - Alle Secrets sollten in der Liste erscheinen
   - Bei Push zu `main` sollte CI/CD Pipeline starten

## 🚀 Pipeline-Ablauf

```mermaid
graph LR
    A[Push/PR] --> B[Quality Gate]
    B --> C{Tests OK?}
    C -->|Yes| D[Security Scan]
    C -->|No| E[Fail]
    D --> F{Branch?}
    F -->|PR| G[Deploy Preview]
    F -->|main| H[Deploy Production]
    H --> I[Oracle Sync]
```

### Quality Gate prüft:
- ✅ TypeScript Type Check
- ✅ ESLint
- ✅ Prettier
- ✅ Tests
- ✅ Build

### Security Scan:
- 🔒 Snyk Vulnerability Check

### Oracle Sync (nur main):
- 📚 Sync docs → Memory
- 📝 Audit Log erstellen

### Deployment:
- 🌐 Vercel Preview (PRs)
- 🚀 Vercel Production (main)

## 🔧 Troubleshooting

### Pipeline schlägt fehl?

1. **Check Secrets:**
   ```bash
   # Lokal testen ob Secrets korrekt sind
   npm run type-check
   npm run test
   npm run build
   ```

2. **Check GitHub Actions Log:**
   - Gehe zu Actions Tab
   - Klicke auf fehlgeschlagenen Run
   - Schaue welcher Step fehlschlug

3. **Häufige Fehler:**
   - `DATABASE_URL missing` → Secret falsch gesetzt
   - `VERCEL_TOKEN invalid` → Token abgelaufen
   - `Build failed` → Lokale Probleme, erst lokal fixen

## 📊 Status-Badge

Füge in README.md ein:

```markdown
![CI/CD](https://github.com/NeXify-Chat-it-Automate-it/OpenCarBox/workflows/Quality%20Gate%20&%20Deployment/badge.svg)
```

## 🔄 Auto-Deployment

Nach Setup:
- ✅ Push zu `main` → Automatisches Production Deployment
- ✅ Pull Request → Preview Deployment
- ✅ Tests bestanden → Automatisches Merge (optional)

---

**Setup-Zeit:** ~10 Minuten
**Wartung:** Automatisch
**Status:** 🟢 Bereit für Automation
