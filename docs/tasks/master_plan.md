# Master-Arbeitsplan - OpenCarBox & Carvantooo

> **ZENTRALE AUFGABENVERWALTUNG**
> Alle Tasks werden hier verwaltet, priorisiert und nachverfolgt.

**Projekt:** OpenCarBox & Carvantooo Multisite Platform
**Start:** 2024-12-05
**Geplantes Ende:** 2025-02-15 (10 Wochen)

---

## 📋 Legende

| Status | Bedeutung |
|--------|-----------|
| ⬜ OFFEN | Task noch nicht begonnen |
| 🔄 IN ARBEIT | Task wird aktuell bearbeitet |
| ✅ ERLEDIGT | Task abgeschlossen |
| 🔍 REVIEW | Task wartet auf Review |
| ❌ ABGEBROCHEN | Task nicht mehr relevant |
| ⏸️ PAUSIERT | Task temporär gestoppt |

---

## 🎯 Phase 1: Fundament (Woche 1)

### TASK-001: Projekt-Initialisierung
- **Status:** ✅ ERLEDIGT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** Keine
- **Beschreibung:** Next.js 14+ Projekt mit TypeScript, Tailwind CSS, ESLint, Prettier aufsetzen
- **Akzeptanzkriterien:**
  - [x] Next.js 14+ App Router initialisiert
  - [x] TypeScript strict mode konfiguriert
  - [x] Tailwind CSS mit Custom Config
  - [x] ESLint + Prettier konfiguriert
  - [x] Git Repository initialisiert
  - [x] .env.example erstellt

### TASK-002: AI-Agenten-Konfiguration
- **Status:** ✅ ERLEDIGT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** Keine
- **Beschreibung:** .cursorrules und project_specs.md erstellen
- **Akzeptanzkriterien:**
  - [x] .cursorrules mit allen Regeln
  - [x] project_specs.md als Gesetzbuch
  - [x] Alle Vorgaben dokumentiert

### TASK-003: Dokumentationsstruktur
- **Status:** ✅ ERLEDIGT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-002
- **Beschreibung:** /docs Ordnerstruktur mit allen notwendigen Dokumenten
- **Akzeptanzkriterien:**
  - [x] /docs/tasks/master_plan.md
  - [x] /docs/architecture/system-overview.md
  - [x] /docs/architecture/data-flow.md
  - [x] /docs/design-system/colors.md
  - [x] /docs/design-system/typography.md
  - [x] /docs/design-system/components.md
  - [x] /docs/api/endpoints.md
  - [x] /docs/changelog/CHANGELOG.md

### TASK-004: Design-System-Tokens
- **Status:** ✅ ERLEDIGT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-001
- **Beschreibung:** Tailwind Config mit allen Design-Tokens (Farben, Typografie, Spacing)
- **Akzeptanzkriterien:**
  - [x] Rot-Blau Farbpalette komplett
  - [x] Typografie-Skala (fluid)
  - [x] Spacing-System (8px Grid)
  - [x] Schatten-System
  - [x] Border-Radius-System
  - [x] Breakpoints

### TASK-005: Datenbank-Schema
- **Status:** ✅ ERLEDIGT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-001
- **Beschreibung:** Supabase Schema mit allen Entitäten (via MCP migriert)
- **Akzeptanzkriterien:**
  - [x] profiles (User) Model
  - [x] products Model
  - [x] categories Model
  - [x] orders + order_items Model
  - [x] vehicles Model
  - [x] services Model
  - [x] appointments Model
  - [x] Relations definiert (RLS Policies)
  - [ ] Seed-Daten (Optional)

### TASK-006: Scripts erstellen
- **Status:** ✅ ERLEDIGT
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-001
- **Beschreibung:** Sync-Docs-to-Rules und Quality-Gate Scripts
- **Akzeptanzkriterien:**
  - [x] sync-docs-to-rules.ts erstellt
  - [x] quality-gate.ts erstellt
  - [x] Husky pre-commit Hook konfigurieren

---

## 🎨 Phase 2: UI-Komponenten-Bibliothek (Woche 2)

### TASK-010: shadcn/ui Setup
- **Status:** ✅ ERLEDIGT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-001, TASK-004
- **Beschreibung:** shadcn/ui initialisieren und an Design-System anpassen
- **Akzeptanzkriterien:**
  - [x] shadcn/ui CLI konfiguriert
  - [x] components.json angepasst
  - [x] Farben überschrieben
  - [x] globals.css mit CSS-Variablen

### TASK-011: Atoms - Basis-Komponenten
- **Status:** ✅ ERLEDIGT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-010
- **Beschreibung:** Alle atomaren UI-Komponenten
- **Akzeptanzkriterien:**
  - [x] Button (8 Varianten inkl. carvantooo/opencarbox)
  - [x] Input (mit Label, Error, Icons)
  - [x] Badge (9 Varianten inkl. success/warning/info)
  - [x] Icon (Lucide) - wird direkt importiert
  - [x] Avatar (mit SimpleAvatar Wrapper)
  - [x] Spinner (mit PageSpinner, LoadingOverlay)
  - [x] Skeleton (mit SkeletonCard, SkeletonProductCard, etc.)
  - [x] Alle mit TypeScript Props
  - [x] Alle dokumentiert (JSDoc)

### TASK-012: Molecules - Zusammengesetzte Komponenten
- **Status:** ✅ ERLEDIGT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-011
- **Beschreibung:** Zusammengesetzte Komponenten aus Atoms
- **Akzeptanzkriterien:**
  - [x] SearchBar (mit HSN/TSN)
  - [x] ProductCard (3 Varianten: default, compact, horizontal)
  - [x] ServiceCard (3 Varianten: default, compact, featured)
  - [ ] VehicleCard (wird bei Bedarf ergänzt)
  - [x] PriceDisplay (mit PriceCompact)
  - [ ] FormField (wird bei Bedarf ergänzt)
  - [ ] NavItem (wird bei Bedarf ergänzt)
  - [x] Rating (mit RatingCompact)

### TASK-013: Organisms - Komplexe Komponenten
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-012
- **Beschreibung:** Komplexe UI-Einheiten
- **Akzeptanzkriterien:**
  - [ ] Header (mit Marken-Switching)
  - [ ] Footer
  - [ ] ProductGrid
  - [ ] ServiceList
  - [ ] VehicleGallery
  - [ ] ChatWidget
  - [ ] BookingWidget
  - [ ] VehicleFinder (HSN/TSN)

### TASK-014: Storybook Setup
- **Status:** ⬜ OFFEN
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-011
- **Beschreibung:** Storybook für Komponenten-Dokumentation
- **Akzeptanzkriterien:**
  - [ ] Storybook konfiguriert
  - [ ] Alle Komponenten haben Stories
  - [ ] Varianten dokumentiert
  - [ ] Accessibility Tests

---

## 🏗️ Phase 3: Core-Features (Woche 3-5)

### TASK-020: Multisite-Routing
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-013
- **Beschreibung:** Route Groups für die 3 Bereiche
- **Akzeptanzkriterien:**
  - [ ] (marketing) Route Group
  - [ ] (werkstatt) Route Group mit Layout
  - [ ] (autohandel) Route Group mit Layout
  - [ ] (shop) Route Group mit Layout
  - [ ] Marken-spezifisches Theming pro Bereich

### TASK-021: Homepage
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-020, TASK-013
- **Beschreibung:** Premium Landing Page
- **Akzeptanzkriterien:**
  - [ ] Hero mit Glassmorphism
  - [ ] Fahrzeug-Finder prominent
  - [ ] Drei Bereiche vorgestellt
  - [ ] Testimonials
  - [ ] Partner-Logos
  - [ ] CTA-Bereiche
  - [ ] Animationen

### TASK-022: Shop - Produktkatalog
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-020, TASK-005
- **Beschreibung:** Produktlisten und -details
- **Akzeptanzkriterien:**
  - [ ] Kategorieseiten
  - [ ] Produktliste mit Grid/List-Toggle
  - [ ] Filter (Preis, Marke, Verfügbarkeit)
  - [ ] Sortierung
  - [ ] Produktdetailseite
  - [ ] Bildergalerie
  - [ ] Varianten-Auswahl
  - [ ] "Häufig zusammen gekauft"

### TASK-023: Shop - HSN/TSN Fahrzeugsuche
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-022
- **Beschreibung:** Kernfeature Fahrzeugsuche
- **Akzeptanzkriterien:**
  - [ ] HSN/TSN Eingabe
  - [ ] Kennzeichen-Eingabe (optional)
  - [ ] Marke/Modell/Baujahr Auswahl
  - [ ] Ergebnis: Passende Teile
  - [ ] "Meine Garage" speichern
  - [ ] API-Integration (TecDoc oder eigene)

### TASK-024: Shop - Warenkorb
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-022
- **Beschreibung:** Warenkorb-Funktionalität
- **Akzeptanzkriterien:**
  - [ ] Warenkorb-State (Zustand)
  - [ ] Mini-Cart im Header
  - [ ] Warenkorb-Seite
  - [ ] Mengen ändern
  - [ ] Artikel entfernen
  - [ ] Versandkosten-Vorschau
  - [ ] Persistenz (localStorage)

### TASK-025: Shop - Checkout
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-024
- **Beschreibung:** Checkout-Prozess
- **Akzeptanzkriterien:**
  - [ ] Multi-Step Checkout
  - [ ] Lieferadresse
  - [ ] Rechnungsadresse
  - [ ] Versandart
  - [ ] Zahlungsart (Stripe)
  - [ ] Bestellübersicht
  - [ ] AGB-Bestätigung
  - [ ] Bestellbestätigung

### TASK-026: Werkstatt - Service-Übersicht
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-020
- **Beschreibung:** Service-Seiten für OpenCarBox
- **Akzeptanzkriterien:**
  - [ ] Service-Kategorien
  - [ ] Service-Detailseiten
  - [ ] Preisübersicht
  - [ ] Leistungsbeschreibungen
  - [ ] Vorher-Nachher Galerie

### TASK-027: Werkstatt - Terminbuchung
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-026
- **Beschreibung:** Online-Terminbuchung
- **Akzeptanzkriterien:**
  - [ ] Service-Auswahl
  - [ ] Fahrzeug-Angabe
  - [ ] Kalender mit freien Slots
  - [ ] Zeitslot-Auswahl
  - [ ] Kontaktdaten
  - [ ] Bestätigung
  - [ ] E-Mail-Benachrichtigung

### TASK-028: Autohandel - Fahrzeugkatalog
- **Status:** ⬜ OFFEN
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-020
- **Beschreibung:** Fahrzeug-Listings
- **Akzeptanzkriterien:**
  - [ ] Fahrzeugliste mit Filtern
  - [ ] Fahrzeug-Detailseite
  - [ ] Bildergalerie (360°-Ansicht optional)
  - [ ] Technische Daten
  - [ ] Finanzierungsrechner
  - [ ] Probefahrt-Anfrage

---

## 🔌 Phase 4: Integrationen (Woche 6-7)

### TASK-030: Stripe Integration
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-025
- **Beschreibung:** Zahlungsabwicklung
- **Akzeptanzkriterien:**
  - [ ] Stripe Checkout Session
  - [ ] Webhook-Handler
  - [ ] Zahlungsstatus-Tracking
  - [ ] Rechnungs-PDF-Generierung
  - [ ] Fehlerbehandlung

### TASK-031: Meilisearch Integration
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-022
- **Beschreibung:** Produktsuche
- **Akzeptanzkriterien:**
  - [ ] Meilisearch aufgesetzt
  - [ ] Produkte indexiert
  - [ ] Typo-Toleranz konfiguriert
  - [ ] Facetten-Filter
  - [ ] Instant-Search UI

### TASK-032: Chatbot Integration
- **Status:** ⬜ OFFEN
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-013
- **Beschreibung:** Botpress Chatbot
- **Akzeptanzkriterien:**
  - [ ] Botpress konfiguriert
  - [ ] Shop-Bot Flows
  - [ ] Service-Bot Flows
  - [ ] Widget integriert
  - [ ] Fallback zu Live-Chat

### TASK-033: WhatsApp Integration
- **Status:** ⬜ OFFEN
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-025, TASK-027
- **Beschreibung:** WhatsApp Business API
- **Akzeptanzkriterien:**
  - [ ] API-Anbindung
  - [ ] Bestellbestätigungen
  - [ ] Termin-Erinnerungen
  - [ ] Support-Kanal
  - [ ] Template-Messages

### TASK-034: E-Mail Integration
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-025, TASK-027
- **Beschreibung:** React Email + Resend
- **Akzeptanzkriterien:**
  - [ ] E-Mail-Templates (React Email)
  - [ ] Bestellbestätigung
  - [ ] Versandbenachrichtigung
  - [ ] Terminbestätigung
  - [ ] Passwort-Reset
  - [ ] Newsletter-Anmeldung

### TASK-035: Preisvergleichsportale
- **Status:** ⬜ OFFEN
- **Priorität:** MITTEL
- **Abhängigkeiten:** TASK-022, TASK-030
- **Beschreibung:** Portal-Anbindungen
- **Akzeptanzkriterien:**
  - [ ] Check24 Export
  - [ ] billiger.de Export
  - [ ] guenstiger.de Export
  - [ ] geizkragen.at Export
  - [ ] Automatische Synchronisation

---

## 👨‍💼 Phase 5: Admin & Polish (Woche 8-9)

### TASK-040: Admin-Dashboard
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-022, TASK-027
- **Beschreibung:** Backend-Verwaltung
- **Akzeptanzkriterien:**
  - [ ] Dashboard mit KPIs
  - [ ] Produktverwaltung
  - [ ] Bestellverwaltung
  - [ ] Terminverwaltung
  - [ ] Fahrzeugverwaltung
  - [ ] Kundenverwaltung
  - [ ] Content-Management

### TASK-041: SEO-Optimierung
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-022, TASK-026, TASK-028
- **Beschreibung:** Suchmaschinenoptimierung
- **Akzeptanzkriterien:**
  - [ ] Meta-Tags dynamisch
  - [ ] Schema.org Markup
  - [ ] Sitemap.xml
  - [ ] robots.txt
  - [ ] Canonical URLs
  - [ ] Open Graph Tags

### TASK-042: Performance-Optimierung
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** Alle Core-Tasks
- **Beschreibung:** Core Web Vitals optimieren
- **Akzeptanzkriterien:**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] Image Optimization
  - [ ] Code Splitting
  - [ ] Caching-Strategien

### TASK-043: Accessibility-Audit
- **Status:** ⬜ OFFEN
- **Priorität:** HOCH
- **Abhängigkeiten:** Alle UI-Tasks
- **Beschreibung:** WCAG 2.1 AA Compliance
- **Akzeptanzkriterien:**
  - [ ] Alle Seiten geprüft
  - [ ] Screenreader-Test
  - [ ] Tastatur-Navigation
  - [ ] Kontrast-Check
  - [ ] Fokus-Indikatoren

---

## 🚀 Phase 6: Launch (Woche 10)

### TASK-050: Testing
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** Alle Tasks
- **Beschreibung:** Umfassende Tests
- **Akzeptanzkriterien:**
  - [ ] Unit Tests (80%+ Coverage)
  - [ ] Integration Tests
  - [ ] E2E Tests (kritische Flows)
  - [ ] Cross-Browser Tests
  - [ ] Mobile Tests

### TASK-051: Staging-Deployment
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-050
- **Beschreibung:** Staging-Umgebung
- **Akzeptanzkriterien:**
  - [ ] Vercel Staging aufgesetzt
  - [ ] Umgebungsvariablen konfiguriert
  - [ ] Datenbank migriert
  - [ ] End-to-End getestet

### TASK-052: Production-Launch
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-051
- **Beschreibung:** Go-Live
- **Akzeptanzkriterien:**
  - [ ] Production-Deployment
  - [ ] DNS konfiguriert
  - [ ] SSL-Zertifikat aktiv
  - [ ] Monitoring aktiviert
  - [ ] Backup-Strategie

---

## 📊 Status-Übersicht

| Phase | Tasks | Erledigt | In Arbeit | Offen |
|-------|-------|----------|-----------|-------|
| Phase 1: Fundament | 6 | 5 | 1 | 0 |
| Phase 2: UI-Komponenten | 5 | 3 | 0 | 2 |
| Phase 3: Core-Features | 9 | 0 | 0 | 9 |
| Phase 4: Integrationen | 6 | 0 | 0 | 6 |
| Phase 5: Admin & Polish | 4 | 0 | 0 | 4 |
| Phase 6: Launch | 3 | 0 | 0 | 3 |
| **GESAMT** | **33** | **8** | **1** | **24** |

---

## 📝 Notizen

### Wichtige Entscheidungen
- 2024-12-05: Markenarchitektur finalisiert (Carvantooo = Shop, OpenCarBox = Services)
- 2024-12-05: Tech-Stack festgelegt (Next.js 14, Supabase, Stripe)
- 2024-12-05: Design-System definiert (Rot-Blau, Premium-Ästhetik)
- 2024-12-30: Supabase Migration auf acclrhzzwdutbigxsxyq (Production)
- 2024-12-05: UI-Komponenten-Bibliothek gestartet (Button, Input, Badge, Avatar, Spinner, Skeleton)
- 2024-12-30: Oracle Self-Optimization System implementiert

### Risiken
- TecDoc API Zugang muss beantragt werden
- Stripe Account benötigt Verifizierung
- WhatsApp Business API erfordert Meta-Genehmigung

### Offene Fragen
- [ ] Domain-Strategie: opencarbox.at oder carvantooo.at als Hauptdomain?
- [ ] Welche TecDoc-Alternative falls Zugang verzögert?

---

**Letzte Aktualisierung:** 2024-12-06
