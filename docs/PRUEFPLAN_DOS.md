# Prüfungsplan: Digital Operating System (DOS) v1.1

## Prüfungsziel, Scope und Leitplanken (aus DOS abgeleitet)

Ziel des Prüfplans ist es, Release- und Betriebsfähigkeit für eine Multisite-Next.js-14-Plattform mit drei strikt isolierten Route-Groups sicherzustellen: (shop) Carvantooo, (werkstatt) OpenCarBox Werkstatt, (autohandel) OpenCarBox Autohandel, plus shared. Grundlage sind die „unverhandelbaren Guardrails“, Quality Gates, Security/DSGVO-Anforderungen, Event-Tracking-Pflichten und Performance-Zielwerte. (Siehe Guardrails G1–G10, CI Gates, Security/Compliance, Performance-Standards, Definition of Done.)

## Nicht verhandelbar für die Abnahme (harte Exit-Kriterien)

1. **Funnel-Zuordnung** pro Seite/Feature/Automation (G1).
2. **Dual-Brand-Konsistenz**: (shop)=#FFB300, (werkstatt)/(autohandel)=#FFA800, niemals mischen (G9).
3. **No One-Off UI**: ausschließlich `src/components/ui` (shadcn/ui), neue Tokens zuerst in `DESIGN_TOKENS.md` (G3).
4. **Tracking First**: jedes kritische Verhalten als Zod-validiertes Event in `src/lib/events.ts`; kein Merge ohne Event (G4).
5. **Security validated**: 0 Critical/High CVEs, Secrets nicht im Repo, RLS/Least Privilege, CSP, DSGVO-Konformität (Kap. 11).
6. **Performance**: Core Web Vitals Zielwerte; Lighthouse Score ≥ 90; LCP ≤ 2.5s; INP ≤ 200ms; etc. (Kap. 12).
7. **Stabilität messbar**: Error Rate < 0.5%, P99 Latenz < 500ms (Sentry + Vercel Analytics).
8. **CI Quality Gates** grün (Lint/Typecheck/Preflight/AI Guard/Build/Security/Performance).

## NeXifyAI Master Einbindung (Governance)

NeXifyAI Master ist als verbindlicher Co-Entscheider in „Standard-Ergänzungen“ und im monatlichen Qualitäts-Audit vorgesehen; Architektur-/Breaking-Entscheidungen werden via ADRs dokumentiert. Der Prüfplan setzt daher auf prüfbare Artefakte (ADR, STATE/KNOWLEDGE/TODO) und CI-automatisierte Gates, statt manuelle Einzelabnahmen.

## Prüfstrategie und Prüflogik (Closed-Loop, CI-getrieben)

### 2.1 Grundlogik pro Änderung
Jede Prüfung folgt derselben Kette:
- **Kontext**: Bereich (shop/werkstatt/autohandel/shared) + Funnel-Schritt (Awareness/Education/Consideration/Conversion/Retention).
- **Konsistenz**: Brand, UI-Komponenten-Regeln, Sprachkonventionen, Copy-Compiler, Claims-Policy.
- **Validierung**: Zod (Forms + Events), TypeScript strict, Prisma Generate/Migrations, RLS-Policies, Webhooks.
- **CI/Governance**: Quality Gates, Security Audit, AI-Guard, Lighthouse CI, Dokumentationspflicht (ADR + STATE/KNOWLEDGE/TODO).

### 2.2 Teststufen
- **Stufe A: Statische Qualität (CI)**: Lint, Typecheck, Preflight, AI-Guard, npm audit, Gitleaks, Build, Lighthouse CI.
- **Stufe B: API/Integration**: Supabase RLS, Prisma, Stripe Webhooks, Auth, Storage, geplante Integrationen (Meilisearch, TecDoc) über kontraktbasierte Tests.
- **Stufe C: E2E User Journeys**: je Funnel (Shop/Werkstatt/Autohandel), inklusive Tracking-Assertions (Events fired + Schema valid + keine PII).
- **Stufe D: Non-Functional**: Performance (Core Web Vitals), Security/DSGVO, Accessibility (WCAG AA), Observability (Sentry/Vercel), Resilience (Fehlerpfade).
- **Stufe E: Release- & Smoke-Tests**: auf Vercel Preview je PR, danach Gate für Production per Release-Prozess/DoD.

## Prüfobjekte und Abnahmekriterien nach Systembereichen

### 3.1 Systemweit (gilt für alle Route-Groups + shared)

#### A) Guardrail-Compliance-Prüfungen
- **G1 Funnel-Zuweisung**: Jede Seite/Feature/Automation hat in PR-Beschreibung und (wo sinnvoll) in Code/Metadata eine eindeutige Funnel-Stage.
- **G2 Claims-Policy**: Preisangaben immer „ab …“ und „inkl./exkl. MwSt.“; Aussagen als FACT/CLAIM/STORY kategorisiert.
- **G3 UI-Regel**: keine ad-hoc UI; nur `src/components/ui`; neue Komponenten über Tokens/Designsystem.
- **G4 Tracking First**: kritische Aktionen müssen Event-Registrierung und Zod-Schema haben.
- **G8 Zero Information Loss**: jede relevante Erkenntnis (Bugs, Entscheidungen, Learnings) wird in STATE/KNOWLEDGE/TODO persistiert.
- **G9 Brand-Konsistenz (Dual-Brand)**: Shop/Service-Farben strikt.
- **G10 Sprachkonventionen**: Code Englisch, UI Deutsch, URLs Deutsch, Commits Conventional Commits (Englisch).

#### B) CI/CD Quality Gates
- ESLint 0 Errors; TypeScript strict 0 Errors; Preflight 0 Violations.
- AI Guard: keine verbotenen Provider-SDKs/Env Vars.
- Prisma Generate ok; Build ok.
- Security Audit: 0 Critical/High CVEs + Gitleaks 0 Findings.
- Lighthouse CI: LCP < 2.5s, Score ≥ 90.

#### C) Observability-/Stabilitätskriterien
- Sentry: Error Rate Ziel < 0.5% (kritisch > 2% mit error-triage).
- Vercel Analytics: P99 Latenz Ziel ≤ 500ms (kritisch > 2000ms).
- Keine Crashloops; Uptime Ziel ≥ 99.9%.

#### D) Security/Compliance (DSGVO + Automotive)
- HTTPS/HSTS, Basis-CSP, keine unsicheren Inline Scripts.
- Supabase RLS Least Privilege; Secrets nur in GitHub/Vercel Secrets.
- Stripe: keine Kartendaten im System, Webhooks sicher.
- WhatsApp: nur mit explizitem Opt-in; PII nicht in Events; Events pseudonymisiert (UUID).

#### E) Accessibility und Responsive
- WCAG 2.1 AA, Kontrast ≥ 4.5:1; Mobile-first Breakpoints.
- CTA-Design max. 3 Typen; 8px Grid eingehalten.

### 3.2 Bereich Shop (Carvantooo /shop, Primärziel: Stripe Checkout)
- **Awareness → Education**: /shop Startseite. HSN/TSN-Suche, Brand korrekt (#FFB300).
- **Consideration**: Kategorien / Produktliste / Filter.
- **Conversion**: Warenkorb → Checkout → Purchase (Stripe). add_to_cart, begin_checkout, purchase.
- **Retention**: „Meine Garage“. garage_vehicle_added Event.

### 3.3 Bereich Werkstatt (OpenCarBox /werkstatt, Primärziel: Terminbuchung)
- **Einstieg / Leistungen**: Services klar, Preise transparent, Brand #FFA800.
- **Terminbuchung 5-Schritt-Flow**: appointment_start, appointment_vehicle, appointment_slot, appointment_booked.

### 3.4 Bereich Autohandel (OpenCarBox /autohandel, Primärziel: Kaufanfrage)
- **Fahrzeuglisting**: vehicle_listing_view Event.
- **Fahrzeugdetail**: vehicle_detail_view Event, Financing Calculator.
- **Kaufanfrage (Lead)**: vehicle_inquiry Event.

### 3.5 Shared-Bereich (/ueber-uns, /datenschutz, /impressum, /auth)
- Rechtlich einwandfrei, konsistente Claims, Auth via Supabase RLS.

## Testfälle-Katalog (Must-have)

### 4.1 Funktionale Tests
- Routing & Isolation.
- Form-Validierung (Zod).
- Stripe Checkout + Webhooks.
- Supabase RLS (Isolation pro User).
- Automations/Trigger (Cart Reminder, Appointment Reminder).

### 4.2 Tracking- & Event-Tests
- Event-Schema in `src/lib/events.ts`.
- PII-Safety (Keine E-Mail/Telefon in Payloads).
- Coverage (Page Views, CTA Clicks, Core Funnel Events).

### 4.3 Design-/Brand-Tests
- Dual-Brand Regeln (Shop #FFB300, Werkstatt #FFA800).
- Komponenten-Regel (shadcn/ui only).
- Copy-Compiler (8 Stufen).

### 4.4 Performance-Tests
- Lighthouse CI (Score ≥ 90).
- Optimierungen (next/image, WebP, Lazy Loading).

### 4.5 Security-Tests
- CI Audit, CSP, Secrets, RLS, WhatsApp Opt-in.

### 4.6 Resilience/Fehlerpfade
- Strukturierte Fehlerbehandlung, keine symptomatischen Fixes ohne ADR.

## Prüfumgebung, Testdaten, Rollen
- **Preview**: Standard für QA.
- **Production**: Nur via PR-Merge und Release-Flow.
- **Testdaten**: Keine PII, Stripe Testmode.
- **Rollen**: Pascal (Breaking Changes), NeXifyAI Master (Standards), Reviewer (Checkliste).

## Release-Abnahme (Definition of Done)
- Technisch: CI Gates grün.
- Inhaltlich: Deutsch, Claims korrekt, Copy-Compiler.
- Design: UI-Library, responsive, Brand korrekt.
- Tracking: Events registriert, PII-safe.
- Governance: ADR, STATE/KNOWLEDGE/TODO aktuell.
