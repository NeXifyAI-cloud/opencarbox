# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

### Fixed

#### 🔴 Kritisch
- **package.json**: Doppeltes `prepare` Script entfernt (Zeile 56)
  - Ursache: Konflikt zwischen `prepare: "husky || true"` und `prepare: "husky"`
  - Fix: Zweites Script entfernt
  - Commit: `fix(package): remove duplicate prepare script`

#### 🟡 Hoch
- **.env.local**: Erstellt mit korrekten Supabase-Credentials
  - `NEXT_PUBLIC_SUPABASE_URL`: https://cwebcfgdraghzeqgfsty.supabase.co
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: [Anon Key konfiguriert]
  - `DATABASE_URL`: PostgreSQL Connection String
  - Commit: `chore(env): add local environment configuration`

#### 🟢 Mittel
- **README.md**: Überarbeitet mit klaren Setup-Anweisungen
- **CI/CD**: Workflows validiert (keine Änderungen nötig)

### Known Issues

1. **npm install**: Erfordert Umgebung mit Symlink-Unterstützung
   - Workaround: `--no-bin-links` oder Docker verwenden
   - Status: Umgebungsbedingt, kein Code-Fehler

2. **Prisma Client**: Muss nach Installation generiert werden
   - Befehl: `npm run db:generate`
   - Status: Post-Install Schritt

### Security

- Keine Secrets im Repository (alle in `.env.example` als Platzhalter)
- `.env.local` in `.gitignore` eingetragen
- Supabase RLS aktiv für alle Tabellen

---

## [1.0.0] - 2025-01-XX

### Added
- Initiale Release von OpenCarBox & Carvantooo
- Next.js 14 mit App Router
- Supabase Integration (Auth, DB, Storage)
- Prisma ORM mit vollständigem Schema
- Tailwind CSS Design System
- shadcn/ui Komponenten-Bibliothek
- CI/CD Pipeline (GitHub Actions)
- Vercel Deployment Konfiguration

### Features
- 🛒 Shop: Produktkatalog mit Kategorien
- 🔧 Werkstatt: Service-Buchung
- 🚗 Autohandel: Fahrzeugmarkt
- 👤 Benutzer-Authentifizierung
- 🛡️ Admin-Dashboard (geplant)

---

## Migration Guide

### Von Unreleased zu Stable

1. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fülle die Werte aus dem Vault/Secret-Manager
   ```

2. **Dependencies installieren**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Prisma Client generieren**
   ```bash
   npm run db:generate
   ```

4. **Datenbank synchronisieren**
   ```bash
   npm run db:push
   ```

5. **Verification**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

---

**Maintainer**: OpenCarBox GmbH  
**Kontakt**: office@opencarbox.co.at
