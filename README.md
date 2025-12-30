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

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Type-Check
npm run type-check

# Quality Gate (vor Commit)
npm run quality-gate
```

## 🛠️ Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State** | TanStack Query, Zustand |
| **Backend** | Supabase (Auth, DB, Storage) |
| **ORM** | Prisma (Schema only) |
| **Deployment** | Vercel |

## 🎨 Design System

| Farbe | Hex | Verwendung |
|-------|-----|------------|
| Primary Blue | `#1e3a5f` | Hintergründe, Buttons |
| Accent Teal | `#4fd1c5` | Links, Icons, Akzente |
| Top Bar | `#162d47` | Header Top Bar |

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
- **Security Scan** - Snyk Vulnerability Check

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

## 📄 Lizenz

Proprietär - OpenCarBox GmbH © 2025

---

**OpenCarBox GmbH**  
Rennweg 76, 1030 Wien  
office@opencarbox.co.at
