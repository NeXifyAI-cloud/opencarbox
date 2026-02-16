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
- **Status:** 🔄 IN ARBEIT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-012
- **Beschreibung:** Komplexe UI-Einheiten
- **Akzeptanzkriterien:**
  - [x] Header (mit Marken-Switching)
  - [x] Footer
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
- **Status:** ✅ ERLEDIGT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-013
- **Beschreibung:** Route Groups für die 3 Bereiche
- **Akzeptanzkriterien:**
  - [x] (marketing) Route Group
  - [x] (werkstatt) Route Group mit Layout
  - [x] (autohandel) Route Group mit Layout
  - [x] (shop) Route Group mit Layout
  - [x] Marken-spezifisches Theming pro Bereich

### TASK-021: Homepage
- **Status:** ✅ ERLEDIGT
- **Priorität:** HOCH
- **Abhängigkeiten:** TASK-020, TASK-013
- **Beschreibung:** Premium Landing Page
- **Akzeptanzkriterien:**
  - [x] Hero mit Glassmorphism
  - [x] Fahrzeug-Finder prominent
  - [x] Drei Bereiche vorgestellt
  - [x] Testimonials
  - [x] Partner-Logos
  - [x] CTA-Bereiche
  - [x] Animationen

### TASK-022: Shop - Produktkatalog
- **Status:** 🔄 IN ARBEIT
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-020, TASK-005
- **Beschreibung:** Produktlisten und -details
- **Gate:** M1
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
- **Gate:** M2
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
- **Gate:** M2
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

### Integrationsmatrix (Risiko, Testtiefe, Fallback)

| Integration | technisches Risiko | Compliance/Datenschutz-Risiko | Testtiefe (Unit/Int/E2E) | Fallback bei Ausfall | Go/No-Go-Kriterium |
|---|---|---|---|---|---|
| TASK-030 Stripe Integration | **Mittel-Hoch** – Webhooks sind asynchron/idempotent zu verarbeiten; Fehler bei Signaturprüfung oder Retry-Logik können Zahlungsstatus verfälschen. | **Hoch** – Zahlungsdaten, Rechnungsbezug, Aufbewahrungspflichten; PCI-DSS-Scope minimieren (keine Kartendaten selbst speichern). | **Unit:** Preis-/Währungsvalidierung, Signatur-Validation. **Int:** Checkout + Webhook gegen Test-Keys. **E2E:** Erfolgreiche/fehlgeschlagene Zahlung inkl. Bestellstatus. | Zahlungsart „Vorkasse/Rechnung“ aktivieren, Orders mit Status `payment_pending` parken, manuelle Nachbearbeitung im Admin. | **Go**, wenn Checkout + Webhook in Staging stabil (0 kritische Bugs, idempotente Verarbeitung nachgewiesen). **No-Go**, wenn Zahlungsstatus inkonsistent oder Webhook-Signaturen fehlschlagen. |
| TASK-031 Meilisearch Integration | **Mittel** – Index-Schema/Sync-Job kann driften; Relevanz-/Facettenkonfiguration beeinflusst Conversion direkt. | **Mittel** – primär Produktdaten, aber mögliche PII-Leaks vermeiden (z. B. keine Kundendaten indexieren). | **Unit:** Query-Builder/Filter-Mapping. **Int:** Reindex + Delta-Updates. **E2E:** Suche, Facetten, Tippfehler-Toleranz im Shop-Flow. | Soft-Fallback auf DB-basierte Suche (vereinfachtes Matching), Hinweis „eingeschränkte Suche“ im UI. | **Go**, wenn Index-Sync deterministisch und Such-Recall für definierte Top-Queries erreicht ist. **No-Go**, wenn stale/fehlende Treffer > akzeptierter Schwellenwert. |
| TASK-033 WhatsApp Integration | **Mittel-Hoch** – Provider/API-Limits, Template-Freigaben und Zustellstatus-Callbacks sind fehleranfällig. | **Hoch** – Opt-in/Opt-out, Telefonnummern als personenbezogene Daten, Nachweis Einwilligung & Löschkonzept nötig. | **Unit:** Template-Parameter, Nummernformatierung, Consent-Checks. **Int:** Versand + Delivery-Status via Sandbox/API-Mock. **E2E:** Bestellung/Termin löst korrekte Nachricht aus. | Fallback auf E-Mail/SMS, Queue-Retry mit Dead-Letter-Handling, kritische Nachrichten zusätzlich im Kundenkonto anzeigen. | **Go**, wenn Opt-in-Prozess auditierbar und Zustellrate in Staging im Zielkorridor liegt. **No-Go**, wenn Consent-Flow oder Abmeldeprozess nicht rechtskonform umgesetzt ist. |
| TASK-034 E-Mail Integration | **Mittel** – Zustellbarkeit (SPF/DKIM/DMARC), Template-Rendering und Provider-Limits können Kommunikation blockieren. | **Mittel-Hoch** – Transaktions- und ggf. Marketing-Mails mit DSGVO-Anforderungen (Double-Opt-in, Abmeldelink, Datenminimierung). | **Unit:** Template-Rendering/Snapshot, Token-Generierung. **Int:** Versandpipeline mit Resend in Testmodus. **E2E:** Bestellung/Termin/Reset-Mail inkl. Links und Ablaufzeiten. | Wiederholte Zustellung per Queue, alternativer SMTP/Provider-Connector, kritische Infos im Account-Dashboard bereitstellen. | **Go**, wenn Auth-DNS korrekt, Bounces überwacht und Kernmails Ende-zu-Ende verifiziert sind. **No-Go**, wenn Reset-/Bestellmails nicht zuverlässig oder compliance-konform zugestellt werden. |

### TASK-030: Stripe Integration
- **Status:** ⬜ OFFEN
- **Priorität:** KRITISCH
- **Abhängigkeiten:** TASK-025
- **Beschreibung:** Zahlungsabwicklung
- **Gate:** M2
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
- **Gate:** M3
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
- **Gate:** M3
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
- **Gate:** M3
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
- **Gate:** M3
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
- **Gate:** M3
- **Akzeptanzkriterien:**
  - [ ] Production-Deployment
  - [ ] DNS konfiguriert
  - [ ] SSL-Zertifikat aktiv
  - [ ] Monitoring aktiviert
  - [ ] Backup-Strategie

---

## 🌊 Execution Waves

### Welle A (Core Commerce)
- **Tasks:** TASK-022, TASK-024, TASK-025
- **Harte Exit-Kriterien:** Produktkatalog inkl. Filter/Sortierung live, Warenkorb mit Persistenz stabil, Checkout inkl. Stripe-Webhook + E2E Happy Path (Produktdetail → Warenkorb → Zahlung → Bestellbestätigung) erfolgreich.
- **Messgrößen:**
  - Checkout-Conversion im Staging ≥ 60% für Testnutzer
  - Technische Fehlerquote im Checkout < 1% (5xx/4xx ohne User-Fehler)
  - Warenkorbabbruchrate im Testbetrieb < 35%
- **Blocker/Abhängigkeiten:** TASK-020 Routing, TASK-005 Datenmodell, Stripe-Testkonto + Webhook-Endpunkt, Seed-/Testdaten für Produkte.
- **Zieltermin:** 2025-01-10

### Welle B (Service Business)
- **Tasks:** TASK-026, TASK-027, TASK-034
- **Harte Exit-Kriterien:** Service-Übersicht vollständig, Terminbuchung Ende-zu-Ende inkl. Slot-Auswahl/Bestätigung, transaktionale E-Mails (Termin- & Bestellkontext) produktionsnah versendbar.
- **Messgrößen:**
  - Buchungsabschlussrate im Staging ≥ 70%
  - E-Mail-Zustellrate ≥ 98% bei Testsendungen
  - No-Show-relevante Datenvollständigkeit (Fahrzeug + Kontakt + Slot) = 100%
- **Blocker/Abhängigkeiten:** Verfügbarkeit freier Slot-Logik/Kalender, Resend-Domain-Verifizierung, Vorlagenfreigabe für E-Mail-Templates.
- **Zieltermin:** 2025-01-24

### Welle C (Search & Integrations)
- **Tasks:** TASK-023, TASK-031, TASK-030
- **Harte Exit-Kriterien:** HSN/TSN-Suche liefert belastbare Teiletreffer, Meilisearch mit Facetten + Instant Search produktiv nutzbar, Stripe-Integration mit Webhook-Robustheit und Retry-Handling abgenommen.
- **Messgrößen:**
  - Suchrelevanz: Top-3-Trefferquote ≥ 80% für definierte Testfälle
  - P95 Suchlatenz < 400 ms
  - Zahlungsstatus-Synchronisierung (Webhook → Order-Status) < 30 Sekunden
- **Blocker/Abhängigkeiten:** TecDoc/Alternativdatenquelle, Suchindex-Pipeline, Stripe-Event-Signing-Secret + Retry-Strategie.
- **Zieltermin:** 2025-02-07

### Welle D (Launch Readiness)
- **Tasks:** TASK-041, TASK-042, TASK-043, TASK-050, TASK-051, TASK-052
- **Harte Exit-Kriterien:** SEO-Baseline vollständig, Performance- und Accessibility-Ziele erreicht, Testpaket für kritische Flows grün, Staging sign-off, Production-Launch mit Monitoring/Backup aktiv.
- **Messgrößen:**
  - Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
  - Accessibility: WCAG 2.1 AA ohne blocker-severity Findings
  - E2E-Passrate kritischer Journeys = 100% vor Go-Live
  - Uptime in der ersten Launch-Woche ≥ 99.9%
- **Blocker/Abhängigkeiten:** DNS/SSL-Freigaben, Observability-Stack (Logs/Metrics/Alerts), Freigabe durch Stakeholder nach Staging-Abnahme.
- **Zieltermin:** 2025-02-15

---

## 🧭 Sprint-Plan (operativ)

### Sprint A (Commerce Core)
- **Tasks:** TASK-022, TASK-024, TASK-025
- **Owner-Rollen (Lead / Mitwirkung):** Lead BE, Mitwirkung FE + QA + DevOps
- **Definition of Done (DoD):** Produktkatalog, Warenkorb und Checkout sind funktional integriert, gegen reale Testdaten validiert und mit stabilen API-Contracts dokumentiert.
- **Harte Exit-Kriterien:**
  - Produktliste inkl. Filter/Sortierung und Produktdetailseite ist auf Staging freigegeben.
  - Warenkorb-Persistenz (localStorage + Server-Sync sofern vorhanden) funktioniert über Browser-Neustarts.
  - Checkout-Happy-Path (Produktdetail → Warenkorb → Zahlung → Bestellbestätigung) läuft als E2E-Test stabil grün.
  - Stripe-Webhook verarbeitet mindestens `checkout.session.completed` und setzt Bestellstatus idempotent.
- **Risiken + Mitigation:**
  - **Risiko:** Unklare Produktdaten/Variantenlogik verzögert Frontend-Umsetzung. **Mitigation:** Frühzeitiger Datenvertrag (JSON-Schema + Beispielpayloads) zwischen FE/BE.
  - **Risiko:** Stripe-Fehlerfälle (Timeouts, doppelte Events) führen zu inkonsistenten Orders. **Mitigation:** Idempotency-Key-Strategie + Retry-Handling + Dead-Letter-Logging.
  - **Risiko:** Performance-Einbruch bei großen Katalogen. **Mitigation:** Pagination, serverseitige Filterung und Bildoptimierung ab erstem Inkrement.
- **Geschätzte Dauer:** 12 Arbeitstage

### Sprint B (Service & Termine)
- **Tasks:** TASK-026, TASK-027, TASK-034
- **Owner-Rollen (Lead / Mitwirkung):** Lead FE, Mitwirkung BE + QA + DevOps
- **Definition of Done (DoD):** Service-Navigation, Terminbuchung und transaktionale E-Mails sind Ende-zu-Ende produktionsnah abgebildet; relevante Betriebsmetriken (Buchungsrate, Zustellrate) sind messbar.
- **Harte Exit-Kriterien:**
  - Service-Kategorien und Service-Detailseiten sind vollständig und inhaltlich freigegeben.
  - Terminbuchung inkl. Slot-Auswahl, Validierung und Bestätigungsansicht ist E2E-testbar.
  - Termin- und Bestell-E-Mails werden über Resend in Staging mit verifizierter Domain zugestellt.
  - Fehlerpfade (keine Slots, ungültige Eingaben, Mailversandfehler) sind mit klaren User-Meldungen behandelt.
- **Risiken + Mitigation:**
  - **Risiko:** Slot-Logik kollidiert bei Parallelbuchungen. **Mitigation:** Serverseitige Sperrmechanik (optimistic/pessimistic locking) + Konflikt-Tests.
  - **Risiko:** E-Mail-Zustellung scheitert wegen DNS/SPF/DKIM. **Mitigation:** Domain-Setup im Sprint-Start, Zustelltests mit Seed-Empfängerlisten.
  - **Risiko:** Hohe Formularabbruchrate bei Terminfluss. **Mitigation:** Schrittweise Formulare, Auto-Save und UX-Review nach erstem Usability-Test.
- **Geschätzte Dauer:** 10 Arbeitstage

### Sprint C (Launch Readiness)
- **Tasks:** TASK-041, TASK-042, TASK-043, TASK-050
- **Owner-Rollen (Lead / Mitwirkung):** Lead QA, Mitwirkung FE + BE + DevOps
- **Definition of Done (DoD):** SEO, Performance, Accessibility und Testabdeckung erfüllen die definierten Launch-Schwellen; Abweichungen sind dokumentiert, priorisiert und ohne blocker offen.
- **Harte Exit-Kriterien:**
  - SEO-Basis (Meta, Sitemap, robots, Canonical, strukturierte Daten) ist vollständig und geprüft.
  - Core Web Vitals auf Staging erfüllen Zielwerte: LCP < 2.5s, INP < 200ms, CLS < 0.1.
  - Accessibility-Audit erreicht WCAG 2.1 AA ohne blocker-severity Findings.
  - Kritische E2E-Journeys laufen im CI stabil mit 100% Passrate über mindestens 3 aufeinanderfolgende Runs.
- **Risiken + Mitigation:**
  - **Risiko:** Späte Performance-Regression durch letzte Feature-Änderungen. **Mitigation:** Performance-Budget im CI + Freeze-Fenster vor Sprint-Ende.
  - **Risiko:** Accessibility-Fixes erfordern tiefe UI-Refactors. **Mitigation:** Frühzeitiger Audit-Slice pro Hauptseite statt Big-Bang-Audit.
  - **Risiko:** Flaky E2E-Tests blockieren Freigabe. **Mitigation:** Test-Stabilisierung (deterministische Testdaten, Retries nur gezielt, klare Quarantäne-Regeln).
- **Geschätzte Dauer:** 9 Arbeitstage

---

## 📊 Status-Übersicht

| Phase | Tasks | Erledigt | In Arbeit | Offen |
|-------|-------|----------|-----------|-------|
| Phase 1: Fundament | 6 | 5 | 1 | 0 |
| Phase 2: UI-Komponenten | 5 | 3 | 1 | 1 |
| Phase 3: Core-Features | 9 | 2 | 1 | 6 |
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
