# OpenCarBox & Carvantooo - Premium Automotive Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

> **Carvantooo** - Weil dein Auto zur Familie gehört.

Eine Premium Automotive Multisite Platform für:

- 🛒 **Carvantooo Shop** - Autoteile & Zubehör
- 🔧 **OpenCarBox Werkstatt** - KFZ-Service & Reparaturen
- 🚗 **OpenCarBox Autohandel** - Fahrzeugmarkt

## 🚀 Quick Start

### Voraussetzungen

- Node.js >= 18.17.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Repository klonen
git clone https://github.com/NeXify-Chat-it-Automate-it/OpenCarBox.git
cd OpenCarBox

# Dependencies installieren (legacy-peer-deps erforderlich)
npm install --legacy-peer-deps

# Prisma Client generieren
npm run db:generate

# Environment konfigurieren
cp .env.example .env.local
# → Trage deine Supabase-Credentials in .env.local ein
```

### Entwicklung

```bash
# Development Server starten
npm run dev
# → http://localhost:3000

# Type-Check
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Tests
npm run test

# Quality Gate (vor Commit)
npm run quality-gate
```

### Build & Deployment

```bash
# Production Build
npm run build

# Start Production Server
npm start
```

## 🛠️ Tech Stack

| Kategorie      | Technologie                                   |
| -------------- | --------------------------------------------- |
| **Frontend**   | Next.js 14 (App Router), React 18, TypeScript |
| **Styling**    | Tailwind CSS, shadcn/ui                       |
| **State**      | TanStack Query, Zustand                       |
| **Backend**    | Supabase (Auth, DB, Storage)                  |
| **ORM**        | Prisma (Schema only)                          |
| **Deployment** | Vercel                                        |

## 🎨 Design System

| Farbe        | Hex       | Verwendung            |
| ------------ | --------- | --------------------- |
| Primary Blue | `#1e3a5f` | Hintergründe, Buttons |
| Accent Teal  | `#4fd1c5` | Links, Icons, Akzente |
| Top Bar      | `#162d47` | Header Top Bar        |

## 📁 Projektstruktur

```
src/
├── app/                # Next.js App Router
├── components/         # React Komponenten
│   ├── layout/        # Header, Footer, Sidebar
│   ├── home/          # Homepage Sections
│   ├── shared/        # Wiederverwendbare Cards
│   └── ui/            # shadcn/ui Basis
├── config/            # Konfigurationen
├── lib/               # Utilities, Supabase Client
├── stores/            # Zustand Stores
└── types/             # TypeScript Types
```

## 🔐 GitHub Secrets (Required)

Für CI/CD müssen folgende Secrets im Repository gesetzt werden:

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
- `DATABASE_URL` - PostgreSQL Connection String

### Vercel

- `VERCEL_TOKEN` - Vercel API Token
- `VERCEL_ORG_ID` - Vercel Organization ID
- `VERCEL_PROJECT_ID` - Vercel Project ID

### Optional

- `SNYK_TOKEN` - Snyk Security Scanning
- `GOOGLE_GENERATIVE_AI_API_KEY` - Oracle AI Integration

## 🤖 Automatisierung

### CI/CD Workflows

- **Quality Gate** - TypeScript, ESLint, Tests bei jedem Push/PR
- **Auto-Merge** - Dependabot PRs automatisch gemergt
- **Auto-Deploy** - Vercel Production bei Push auf main
- **Secret Scan** - Gitleaks Secret Detection (blocking)
- **Security Scan** - Snyk Vulnerability Check

### PagerDuty Incident-Reaktion (proaktiv)

- Setze `PAGERDUTY_INTEGRATION_KEY` (Events API v2 Routing Key) in `.env.local` oder als Secret im Deployment.
- `npm run cline:health` triggert bei Ausfällen automatisch einen Incident und resolved ihn nach Recovery.
- Uncaught Exceptions, Unhandled Rejections und teilweise fehlgeschlagene Auto-Recovery werden ebenfalls automatisch an PagerDuty gesendet.

### Dependabot

- Wöchentliche Updates (Montag 09:00 Wien)
- Gruppiert: Next.js, React, Supabase, Testing, Linting
- Minor/Patch Updates auto-approved

### CodeRabbit

- Automatisches Code Review
- TypeScript strict mode Prüfung
- Deutsche Sprache

## 📚 Dokumentation

- [System Overview](docs/architecture/system-overview.md)
- [API Endpoints](docs/api/endpoints.md)
- [Design System](docs/design-system/colors.md)

## 🧠 Oracle System

Das Projekt nutzt ein KI-gestütztes Oracle-System für:

- Best Practice Dokumentation
- Error Learning
- Task Management
- Memory-System für Patterns

```bash
# Oracle Status
npm run oracle:status

# Nächste Aufgabe
npx tsx scripts/core/oracle.ts next-task
```

### Keine Secret-ähnlichen Beispielwerte im Repository

- In Dokumentation und Beispiel-Dateien dürfen **keine echten oder secret-ähnlichen Werte** stehen (z. B. `sbp_`, `sk_`, `whsec_`, oder komplette DB-Credentials).
- Verwende ausschließlich Platzhalter wie `<set-in-local-env>` oder `<your-secret-here>`.
- Leaks immer sofort rotieren/revoken und aus dem Repo entfernen.
- **Required Check in Branch Protection:** `Secret Scan (Gitleaks)` muss als Pflicht-Check aktiviert sein.

## 🔧 Troubleshooting

### npm install schlägt fehl

```bash
# Mit legacy-peer-deps
npm install --legacy-peer-deps

# Falls Symlink-Fehler
npm install --legacy-peer-deps --no-bin-links
```

### Prisma Client Fehler

```bash
# Client neu generieren
npm run db:generate

# Schema validieren
npx prisma validate
```

### TypeScript Fehler

```bash
# Type-Check ohne Emit
npm run type-check

# TSC neu installieren
npm install -D typescript --legacy-peer-deps
```

## 📄 Lizenz

Proprietär - OpenCarBox GmbH © 2025

---

**OpenCarBox GmbH**  
Rennweg 76, 1030 Wien  
office@opencarbox.co.at
