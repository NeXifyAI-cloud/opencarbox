# MASTER-PLAN: Vollständige Fertigstellung OpenCarBox

**Status:** AKTIV | **Priorität:** KRITISCH | **Deadline:** 02.01.2026 08:00 Uhr

## 🎯 ÜBERSICHT

Dieser Master-Plan definiert die vollständige Fertigstellung des OpenCarBox-Systems gemäß dem CLINE MASTER PROMPT. Das System muss produktionsreif, unternehmensfähig und vollständig integriert sein.

---

## 📋 PHASE 1: DESIGN-SYSTEM-VEREINHEITLICHUNG (KEIN ROT)

### 1.1 Neue Farbpalette basierend auf Sharon UI Base Tokens (DOS v1.1)

**Primärfarbe:** OpenCarBox Orange (Service Primary)
- `primary.DEFAULT`: `#FFA800`
- `primary.light`: `#FFBF33`
- `primary.dark`: `#B37600`

**Sekundärfarbe:** Carvantooo Yellow-Orange (Shop Primary)
- `secondary.DEFAULT`: `#FFB300`
- `secondary.light`: `#FFC533`
- `secondary.dark`: `#B37D00`

**Neutrale Palette:** Sharon UI Neutral Scale
- `neutral.50` bis `neutral.950`

### 1.2 Tailwind Config Update
- Entfernen aller Rot-basierten Farben (`carvantooo.*`)
- Implementieren der Sharon UI Base Tokens
- Anpassen aller Gradienten und Schatten
- Update der Komponenten-Farbzuweisungen

### 1.3 Globale CSS Variablen
- CSS Custom Properties für neue Farbpalette
- Dark Mode Varianten
- Konsistente Design Tokens

### 1.4 Komponenten-Refactoring
- Alle Button-Varianten auf neue Farben
- Input, Card, Badge Komponenten
- Header, Footer, Navigation
- Alle Shop-, Werkstatt- und Autohandel-Komponenten

---

## 🛒 PHASE 2: SHOP-BEREICH VOLLSTÄNDIG

### 2.1 Produktkatalog (TASK-022)
- [ ] Kategorieseiten mit Filter-System
- [ ] Produktliste mit Grid/List-Toggle
- [ ] Erweiterte Filter (Preis, Marke, Verfügbarkeit, Bewertung)
- [ ] Mehrere Sortieroptionen
- [ ] Produktdetailseite mit Bildergalerie
- [ ] Varianten-Auswahl (Größe, Farbe, etc.)
- [ ] "Häufig zusammen gekauft" Sektion
- [ ] Kundenbewertungen und Sterne-Rating
- [ ] Produktverfügbarkeit in Echtzeit

### 2.2 HSN/TSN Fahrzeugsuche (TASK-023)
- [ ] HSN/TSN Eingabe-Interface
- [ ] Kennzeichen-Eingabe (optional)
- [ ] Marke/Modell/Baujahr Auswahl
- [ ] API-Integration (TecDoc oder Alternative)
- [ ] Ergebnisliste mit passenden Teilen
- [ ] "Meine Garage" Feature
- [ ] Fahrzeughistorie speichern
- [ ] Teilekompatibilitätsprüfung

### 2.3 Warenkorb (TASK-024)
- [ ] Globaler Cart-State Management
- [ ] Mini-Cart im Header
- [ ] Warenkorb-Seite mit voller Funktionalität
- [ ] Mengenänderung (+/- Buttons)
- [ ] Artikel entfernen
- [ ] Versandkosten-Vorschau
- [ ] Gutschein-Code Eingabe
- [ ] Persistenz (localStorage + Server-Sync)
- [ ] Cross-Device Synchronisation

### 2.4 Checkout-Prozess (TASK-025)
- [ ] Multi-Step Checkout (3-4 Schritte)
- [ ] Lieferadresse mit Validierung
- [ ] Rechnungsadresse (optional anders)
- [ ] Versandart-Auswahl (Standard, Express, Abholung)
- [ ] Zahlungsart Integration (Stripe, PayPal, Vorkasse)
- [ ] Bestellübersicht mit detaillierter Aufstellung
- [ ] AGB und Widerrufsrecht Bestätigung
- [ ] Bestellbestätigungsseite
- [ ] E-Mail-Bestätigung

---

## 🔧 PHASE 3: WERKSTATT-BEREICH VOLLSTÄNDIG

### 3.1 Service-Übersicht (TASK-026)
- [ ] Service-Kategorien (Inspektion, Reparatur, Wartung)
- [ ] Service-Detailseiten mit Leistungsbeschreibung
- [ ] Preisübersicht transparent
- [ ] Vorher-Nachher Galerie
- [ ] Kundenbewertungen für Services
- [ ] Zertifizierungen und Garantien
- [ ] Service-Pakete (Basic, Premium, Komplett)

### 3.2 Terminbuchung (TASK-027)
- [ ] Service-Auswahl mit Preisanzeige
- [ ] Fahrzeug-Angabe (HSN/TSN oder manuell)
- [ ] Kalender-Integration mit freien Slots
- [ ] Zeitslot-Auswahl (30-Minuten Intervalle)
- [ ] Kontaktdaten-Formular
- [ ] Terminbestätigung mit QR-Code
- [ ] E-Mail- und SMS-Benachrichtigung
- [ ] Erinnerungen (24h vor Termin)
- [ ] Stornierungsmöglichkeit

### 3.3 Werkstatt-Dashboard
- [ ] Terminübersicht für Kunden
- [ ] Service-Historie
- [ ] Rechnungen und Dokumente
- [ ] Fahrzeug-Profil mit Service-Intervallen
- [ ] Wartungsplaner
- [ ] Erinnerungen für nächste Inspektion

---

## 🚗 PHASE 4: AUTOHANDEL-BEREICH VOLLSTÄNDIG

### 4.1 Fahrzeugkatalog (TASK-028)
- [ ] Fahrzeugliste mit erweiterten Filtern
- [ ] Fahrzeug-Detailseite mit 360°-Ansicht
- [ ] Bildergalerie (innen/außen)
- [ ] Technische Daten komplett
- [ ] Ausstattungsliste
- [ ] Fahrzeughistorie (Unfallfreiheit, Service)
- [ ] TÜV- und AU-Berichte

### 4.2 Finanzierungsrechner
- [ ] Leasing vs. Kauf Vergleich
- [ ] Anzahlung und Ratenberechnung
- [ ] Zinssatz-Kalkulation
- [ ] Online-Finanzierungsantrag
- [ ] Sofort-Entscheidung (optional)

### 4.3 Probefahrt-Anfrage
- [ ] Online-Probefahrt buchen
- [ ] Wunschtermin und -ort
- [ ] Fahrzeugvorführung
- [ ] Follow-up System

### 4.4 Inserat-Management
- [ ] Fahrzeug inserieren (für Händler)
- [ ] Preisverhandlung
- [ ] Kontaktanfragen
- [ ] Verkaufsstatistiken

---

## 🏗️ PHASE 5: BACKEND-GESCHÄFTSLOGIK

### 5.1 Benutzerverwaltung
- [ ] Registrierung mit E-Mail-Verifikation
- [ ] Login/Logout mit Session-Management
- [ ] Passwort-Reset
- [ ] Profilverwaltung
- [ ] Zwei-Faktor-Authentifizierung

### 5.2 Rollen- & Rechtesystem
- [ ] Kunden (Standard)
- [ ] Händler (Autohandel)
- [ ] Werkstatt-Mitarbeiter
- [ ] Administrator
- [ ] Fein-granulare Berechtigungen

### 5.3 Zahlungsabwicklung (TASK-030)
- [ ] Stripe Integration komplett
- [ ] Webhook-Handler für Zahlungsstatus
- [ ] Rechnungs-PDF-Generierung
- [ ] Zahlungserinnerungen
- [ ] Mahnwesen
- [ ] Zahlungsmethoden-Management

### 5.4 Warenwirtschaft
- [ ] Lagerbestandsverwaltung
- [ ] Bestellprozess automatisieren
- [ ] Lieferanten-Management
- [ ] Einkauf und Beschaffung
- [ ] Retouren und Umtausch

### 5.5 Fahrzeugverwaltung
- [ ] Fahrzeug-Datenbank
- [ ] Service-Historie pro Fahrzeug
- [ ] Wartungsplaner
- [ ] Ersatzteil-Kompatibilität
- [ ] Fahrzeug-Wertschätzung

### 5.6 Terminlogik
- [ ] Kalender-Management
- [ ] Ressourcen-Planung (Werkstattplätze)
- [ ] Konflikt-Erkennung
- [ ] Wartezeiten-Kalkulation
- [ ] Pufferzeiten einplanen

### 5.7 Rechnungsstellung
- [ ] Automatische Rechnungsgenerierung
- [ ] Mehrwertsteuer-Berechnung
- [ ] Zahlungsfristen
- [ ] Mahnstufen
- [ ] Export (PDF, Excel)

### 5.8 Buchungslogik
- [ ] Doppelte Buchführung
- [ ] Umsatzsteuer-Voranmeldung
- [ ] Gewinn- und Verlustrechnung
- [ ] Bilanzierung
- [ ] Steuerliche Aspekte

### 5.9 CRM-Funktionalität
- [ ] Kunden-Datenbank
- [ ] Kommunikations-Historie
- [ ] Follow-up System
- [ ] Lead-Management
- [ ] Vertriebspipeline

---

## 🗄️ PHASE 6: DATENBANK-ARCHITEKTUR

### 6.1 Supabase Schema Finalisierung
- [ ] Alle Tabellen mit korrekten Relationen
- [ ] Row-Level Security (RLS) Policies
- [ ] Indizes für Performance
- [ ] Constraints und Validierungen
- [ ] Migrations-System

### 6.2 Daten-Integrität
- [ ] Foreign Key Constraints
- [ ] Unique Constraints
- [ ] Check Constraints
- [ ] Trigger für komplexe Logik
- [ ] Datenvalidierung auf DB-Ebene

### 6.3 Performance-Optimierung
- [ ] Query-Optimierung
- [ ] Index-Strategie
- [ ] Partitionierung (falls nötig)
- [ ] Caching-Strategie
- [ ] Connection Pooling

### 6.4 Backup-Strategie
- [ ] Automatische Backups
- [ ] Point-in-Time Recovery
- [ ] Backup-Testing
- [ ] Disaster Recovery Plan
- [ ] Daten-Migrationstools

---

## 🔄 PHASE 7: CI/CD PIPELINES

### 7.1 GitHub Actions / GitLab CI
- [ ] Build Pipeline (TypeScript, Next.js)
- [ ] Test Pipeline (Unit, Integration, E2E)
- [ ] Linting und Code Quality
- [ ] Security Scanning
- [ ] Docker Image Build
- [ ] Deployment Automation

### 7.2 Environment Strategy
- [ ] Development (lokale Entwicklung)
- [ ] Staging (QA und Testing)
- [ ] Production (Live-System)
- [ ] Feature-Branch Deployments
- [ ] Preview Deployments für PRs

### 7.3 Deployment Automation
- [ ] Vercel Integration
- [ ] Database Migrations
- [ ] Environment Variables Management
- [ ] Zero-Downtime Deployments
- [ ] Rollback-Strategie

### 7.4 Monitoring und Alerting
- [ ] Application Performance Monitoring
- [ ] Error Tracking (Sentry)
- [ ] Uptime Monitoring
- [ ] Log Aggregation
- [ ] Alerting Rules

---

## 🔐 PHASE 8: SICHERHEITSANFORDERUNGEN

### 8.1 OWASP Top 10 Compliance
- [ ] Injection Prevention
- [ ] Broken Authentication Protection
- [ ] Sensitive Data Exposure
- [ ] XML External Entities (XXE)
- [ ] Broken Access Control
- [ ] Security Misconfiguration
- [ ] Cross-Site Scripting (XSS)
- [ ] Insecure Deserialization
- [ ] Using Components with Known Vulnerabilities
- [ ] Insufficient Logging & Monitoring

### 8.2 Input-Validierung
- [ ] Server-seitige Validierung aller Inputs
- [ ] Zod Schema Validation
- [ ] SQL Injection Prevention
- [ ] XSS Protection
- [ ] CSRF Tokens

### 8.3 Authentication & Authorization
- [ ] Secure Session Management
- [ ] JWT Best Practices
- [ ] Rate Limiting
- [ ] Brute Force Protection
- [ ] Multi-Factor Authentication

### 8.4 Data Protection
- [ ] Encryption at Rest
- [ ] Encryption in Transit (TLS)
- [ ] PII Data Masking
- [ ] Data Retention Policies
- [ ] GDPR Compliance

---

## 🌐 PHASE 9: INTEGRATIONEN

### 9.1 Meilisearch Integration (TASK-031)
- [ ] Produkt-Suchindex
- [ ] Fahrzeug-Suchindex
- [ ] Service-Suchindex
- [ ] Typo-Toleranz
- [ ] Facetten-Filter
- [ ] Instant-Search UI

### 9.2 E-Mail Integration (TASK-034)
- [ ] React Email Templates
- [ ] Resend Integration
- [ ] Transaktionale E-Mails
- [ ] Marketing E-Mails (opt-in)
- [ ] Newsletter System

### 9.3 WhatsApp Integration (TASK-033)
- [ ] WhatsApp Business API
- [ ] Bestellbestätigungen
- [ ] Termin-Erinnerungen
- [ ] Support-Kanal
- [ ] Template Messages

### 9.4 Chatbot Integration (TASK-032)
- [ ] Botpress Integration
- [ ] Shop-Assistent
- [ ] Werkstatt-Beratung
- [ ] Autohandel-Beratung
- [ ] Live-Chat Fallback

### 9.5 Preisvergleichsportale (TASK-035)
- [ ] Check24 Export
- [ ] billiger.de Export
- [ ] guenstiger.de Export
- [ ] geizkragen.at Export
- [ ] Automatische Synchronisation

---

## 👨‍💼 PHASE 10: ADMIN-DASHBOARD

### 10.1 Dashboard Overview
- [ ] KPIs und Metriken
- [ ] Umsatz-Statistiken
- [ ] Bestellübersicht
- [ ] Kundenstatistiken
- [ ] Lagerbestandsübersicht

### 10.2 Verwaltungsmodule
- [ ] Produktverwaltung (CRUD)
- [ ] Bestellverwaltung
- [ ] Terminverwaltung
- [ ] Fahrzeugverwaltung
- [ ] Kundenverwaltung
- [ ] Mitarbeiterverwaltung

### 10.3 Content-Management
- [ ] Seiten-Editor
- [ ] Blog-System
- [ ] FAQ-Management
- [ ] Dokumenten-Verwaltung
- [ ] Medien-Bibliothek

### 10.4 Reporting
- [ ] Umsatz-Reports
- [ ] Kunden-Reports
- [ ] Bestell-Reports
- [ ] Lager-Reports
- [ ] Export-Funktionen

---

## 🚀 PHASE 11: DEPLOYMENT & LAUNCH

### 11.1 Staging Deployment (TASK-051)
- [ ] Vercel Staging Environment
- [ ] Test-Datenbank
- [ ] Integration Testing
- [ ] User Acceptance Testing
- [ ] Performance Testing

### 11.2 Production Launch (TASK-052)
- [ ] Domain Configuration (opencarbox.at)
- [ ] SSL Certificate
- [ ] DNS Setup
- [ ] Production Database
- [ ] Go-Live Checkliste

### 11.3 Post-Launch Monitoring
- [ ] Error Monitoring
- [ ] Performance Monitoring
- [ ] User Analytics
- [ ] Conversion Tracking
- [ ] SEO Monitoring

### 11.4 Backup & Recovery
- [ ] Automated Backups
- [ ] Disaster Recovery Plan
- [ ] Business Continuity
- [ ] Data Retention Compliance

---

## ✅ QUALITÄTSSICHERUNG

### 12.1 Testing Strategy
- [ ] Unit Tests (80%+ Coverage)
- [ ] Integration Tests
- [ ] End-to-End Tests (kritische Flows)
- [ ] Performance Tests
- [ ] Security Tests
- [ ] Accessibility Tests

### 12.2 Code Quality
- [ ] ESLint (0 Errors)
- [ ] TypeScript (strict mode)
- [ ] Prettier Formatting
- [ ] Code Reviews
- [ ] Documentation

### 12.3 Performance
- [ ] Lighthouse Score > 90
- [ ] Core Web Vitals Optimierung
- [ ] Bundle Size Optimization
- [ ] Image Optimization
- [ ] Caching Strategy

### 12.4 Accessibility
- [ ] WCAG 2.1 AA Compliance
- [ ] Screen Reader Testing
- [ ] Keyboard Navigation
- [ ] Color Contrast
- [ ] ARIA Labels