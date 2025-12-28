# Deployment-Anleitung

Dieses Dokument beschreibt die Vercel-Konfiguration und CI/CD-Setup für das OpenCarBox Projekt.

## Branch-Strukturen

Das Projekt verwendet zwei unterschiedliche Projektstrukturen je nach Branch:

### Main Branch
- **Struktur**: Next.js Projekt im Root-Verzeichnis
- **Package.json Pfad**: `/package.json`
- **Technologie-Stack**: TypeScript (95.7%), Next.js 14, Supabase
- **Build-Output**: `.next/` im Root

### Finales_Design Branch
- **Struktur**: Monorepo mit Frontend und Backend
- **Package.json Pfad**: `/frontend/package.json`
- **Technologie-Stack**: Python (FastAPI) + React, MongoDB
- **Build-Output**: `frontend/.next/` oder `frontend/build/`

## Vercel-Konfiguration

### Standard-Konfiguration (vercel.json)

Die `vercel.json` im Root ist für den **Main Branch** optimiert:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next"
}
```

### Konfiguration für Finales_Design Branch

Für den `finales_Design` Branch müssen in den **Vercel Project Settings** folgende Anpassungen vorgenommen werden:

1. **Root Directory** auf `frontend` setzen
2. **Build Command**: `npm run build`
3. **Install Command**: `npm install --legacy-peer-deps`
4. **Output Directory**: `.next` (relativ zum Root Directory)

#### Alternative: Branch-spezifische Konfiguration

Sie können auch eine branch-spezifische `vercel.json` im `finales_Design` Branch erstellen:

```json
{
  "framework": "nextjs",
  "buildCommand": "cd frontend && npm run build",
  "installCommand": "cd frontend && npm install --legacy-peer-deps",
  "outputDirectory": "frontend/.next"
}
```

## CI/CD Workflow

Der CI/CD Workflow (`.github/workflows/ci-cd.yml`) unterstützt automatisch beide Projektstrukturen:

### Automatische Projekterkennung

Der Workflow erkennt automatisch, wo sich die `package.json` befindet:

1. Prüft zuerst auf `package.json` im Root (Main Branch)
2. Falls nicht gefunden, prüft auf `frontend/package.json` (Finales_Design Branch)
3. Setzt entsprechend `project_root` und `is_monorepo` Variablen

### Unterstützte Branches

Der Workflow wird ausgelöst für:
- **Push**: `main`, `develop`, `finales_Design`
- **Pull Requests**: gegen `main` oder `develop`

### Workflow-Schritte

1. **Checkout Repository**: Code auschecken
2. **Detect Project Structure**: Automatische Erkennung der Projektstruktur
3. **Setup Node.js**: Node.js 20 mit npm Cache
4. **Install Dependencies**: `npm ci --legacy-peer-deps` im erkannten Verzeichnis
5. **Linting**: ESLint ausführen (Fehler werden toleriert)
6. **Type Check**: TypeScript Type-Check (Fehler werden toleriert)
7. **Build Project**: Projekt bauen
8. **Deploy**: Automatisches Deployment nach Vercel (nur für `main` Branch)

## Repository Secrets

Für das Vercel-Deployment werden folgende GitHub Secrets benötigt:

### VERCEL_TOKEN

**Wie erhalten:**
1. Gehen Sie zu [Vercel Account Settings](https://vercel.com/account/tokens)
2. Klicken Sie auf "Create Token"
3. Geben Sie einen Namen ein (z.B. "GitHub Actions OpenCarBox")
4. Wählen Sie den Scope (empfohlen: Full Account)
5. Kopieren Sie den generierten Token

**Setup in GitHub:**
1. Gehen Sie zu Repository Settings → Secrets and variables → Actions
2. Klicken Sie auf "New repository secret"
3. Name: `VERCEL_TOKEN`
4. Value: Der generierte Token von Vercel

### VERCEL_ORG_ID

**Wie erhalten:**
1. Gehen Sie zu Ihrem Vercel-Projekt
2. Settings → General
3. Scrollen Sie zu "Project ID"
4. Kopieren Sie die "Team ID" oder "Org ID"

Alternativ über CLI:
```bash
npx vercel link
cat .vercel/project.json
```

**Setup in GitHub:**
1. Repository Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VERCEL_ORG_ID`
4. Value: Die Org/Team ID

### VERCEL_PROJECT_ID

**Wie erhalten:**
1. Gehen Sie zu Ihrem Vercel-Projekt
2. Settings → General
3. Kopieren Sie die "Project ID"

Alternativ über CLI:
```bash
npx vercel link
cat .vercel/project.json
```

**Setup in GitHub:**
1. Repository Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `VERCEL_PROJECT_ID`
4. Value: Die Project ID

## NPM-Konfiguration

Die `.npmrc` Datei ist bereits konfiguriert für `--legacy-peer-deps`:

```
legacy-peer-deps=true
```

Dies löst Peer-Dependency-Konflikte während der Installation.

## Build-Fehlerbehandlung

### Linting-Fehler
- Werden toleriert (`|| true`)
- Brechen den Build nicht ab
- Sollten aber trotzdem behoben werden

### Type-Check-Fehler
- Werden toleriert (`continue-on-error: true`)
- Brechen den Build nicht ab
- Werden im Workflow-Log angezeigt

### Build-Fehler
- Führen zum Workflow-Fehler
- Müssen behoben werden für erfolgreichen Deploy
- Deployment wird nur bei erfolgreichem Build ausgelöst

## Lokale Entwicklung

### Main Branch
```bash
npm install --legacy-peer-deps
npm run dev
```

### Finales_Design Branch
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Häufige Probleme

### "ENOENT: no such file or directory, open '/vercel/path0/package.json'"

**Problem**: Vercel sucht `package.json` im falschen Verzeichnis

**Lösung**: 
- Für `finales_Design` Branch: Root Directory in Vercel Project Settings auf `frontend` setzen
- Oder: Branch-spezifische `vercel.json` erstellen

### Build schlägt mit Peer-Dependency-Warnung fehl

**Problem**: Inkompatible Peer-Dependencies

**Lösung**: 
- Prüfen Sie, ob `.npmrc` vorhanden ist
- Verwenden Sie `npm install --legacy-peer-deps`
- Aktualisieren Sie die betroffenen Pakete

### CI/CD läuft nicht bei Push

**Problem**: Branch ist nicht in der Trigger-Liste

**Lösung**:
- Fügen Sie den Branch zu `on.push.branches` in `.github/workflows/ci-cd.yml` hinzu
- Oder erstellen Sie einen Pull Request gegen einen unterstützten Branch

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die GitHub Actions Logs
2. Prüfen Sie die Vercel Deployment Logs
3. Erstellen Sie ein GitHub Issue mit detaillierter Fehlerbeschreibung
