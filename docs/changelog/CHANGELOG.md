# Changelog

Alle nennenswerten Änderungen am OpenCarBox & Carvantooo Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

---

## [Unveröffentlicht]

### Hinzugefügt

- **2024-12-05: Projekt-Initialisierung**
  - `.cursorrules` - AI-Agenten-Konfiguration mit allen Regeln
  - `project_specs.md` - System-Spezifikation (Gesetzbuch)
  - `package.json` - Dependencies und Scripts
  - `tsconfig.json` - TypeScript Konfiguration (strict)
  - `tailwind.config.ts` - Premium Design-System mit Rot-Blau Palette
  - `next.config.js` - Next.js Konfiguration

- **2024-12-05: Dokumentationsstruktur**
  - `docs/tasks/master_plan.md` - Zentraler Arbeitsplan
  - `docs/architecture/system-overview.md` - Architektur-Übersicht
  - `docs/design-system/colors.md` - Farbsystem-Dokumentation
  - `docs/changelog/CHANGELOG.md` - Diese Datei

- **2024-12-05: Scripts**
  - `scripts/sync-docs-to-rules.ts` - Auto-Sync Docs → .cursorrules
  - `scripts/quality-gate.ts` - Qualitäts-Prüfungen

- **2024-12-05: Source-Struktur**
  - `src/app/globals.css` - Globale Styles mit CSS-Variablen
  - `src/app/layout.tsx` - Root Layout mit Fonts
  - `src/app/page.tsx` - Homepage (Platzhalter)
  - `src/lib/utils.ts` - Utility-Funktionen

### Geändert

- (Noch keine Änderungen)

### Entfernt

- (Noch nichts entfernt)

### Behoben

- (Noch keine Fixes)

### Sicherheit

- (Noch keine Sicherheits-Updates)

---

## Versions-Historie

### Kommende Version: 1.0.0 (geplant)

**Geplante Features:**

- [ ] Vollständige UI-Komponenten-Bibliothek
- [ ] Shop-Funktionalität mit HSN/TSN-Suche
- [ ] Werkstatt-Terminbuchung
- [ ] Autohandel-Katalog
- [ ] Stripe-Zahlungsintegration
- [ ] Admin-Panel

---

## Konventionen

### Kategorien

- **Hinzugefügt** - Für neue Features
- **Geändert** - Für Änderungen an bestehenden Features
- **Veraltet** - Für bald zu entfernende Features
- **Entfernt** - Für entfernte Features
- **Behoben** - Für Bug-Fixes
- **Sicherheit** - Für Sicherheits-Updates

### Format

```markdown
## [Version] - YYYY-MM-DD

### Kategorie

- **TASK-ID: Kurzbeschreibung**
  - Detaillierte Beschreibung der Änderung
  - Betroffene Dateien: `datei1.ts`, `datei2.tsx`
  - Autor: Name
```

---

**Letzte Aktualisierung:** 2024-12-05

