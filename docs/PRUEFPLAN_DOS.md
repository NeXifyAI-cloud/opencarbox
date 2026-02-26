# Prüfungsplan OpenCarBox (DOS v1.1)

## 1. Prüfungsziel, Scope und Leitplanken
Ziel des Prüfplans ist es, Release- und Betriebsfähigkeit für eine Multisite-Next.js-14-Plattform mit drei strikt isolierten Route-Groups sicherzustellen: (shop) Carvantooo, (werkstatt) OpenCarBox Werkstatt, (autohandel) OpenCarBox Autohandel, plus shared. Grundlage sind die „unverhandelbaren Guardrails“, Quality Gates, Security/DSGVO-Anforderungen, Event-Tracking-Pflichten und Performance-Zielwerte. (Siehe Guardrails G1–G10, CI Gates, Security/Compliance, Performance-Standards, Definition of Done.)

### Harte Exit-Kriterien (Nicht verhandelbar für die Abnahme):
- **G1 Funnel-Zuordnung:** Pro Seite/Feature/Automation.
- **G9 Dual-Brand-Konsistenz:** (shop)=#FFB300, (werkstatt)/(autohandel)=#FFA800, niemals mischen.
- **G3 No One-Off UI:** Ausschließlich src/components/ui (shadcn/ui), neue Tokens zuerst in DESIGN_TOKENS.md.
- **G4 Tracking First:** Jedes kritische Verhalten als Zod-validiertes Event in src/lib/events.ts; kein Merge ohne Event.
- **Security validated:** 0 Critical/High CVEs, Secrets nicht im Repo, RLS/Least Privilege, CSP, DSGVO-Konformität.
- **Performance:** Core Web Vitals Zielwerte; Lighthouse Score ≥ 90; LCP ≤ 2.5s; INP ≤ 200ms; etc.
- **Stabilität messbar:** Error Rate < 0.5%, P99 Latenz < 500ms (Sentry + Vercel Analytics).
- **CI Quality Gates grün:** Lint/Typecheck/Preflight/AI Guard/Build/Security/Performance.

## 2. Prüfstrategie und Prüflogik (Closed-Loop, CI-getrieben)

### 2.1 Grundlogik pro Änderung
Jede Prüfung folgt derselben Kette:
1. **Kontext:** Bereich (shop/werkstatt/autohandel/shared) + Funnel-Schritt (Awareness/Education/Consideration/Conversion/Retention).
2. **Konsistenz:** Brand, UI-Komponenten-Regeln, Sprachkonventionen, Copy-Compiler, Claims-Policy.
3. **Validierung:** Zod (Forms + Events), TypeScript strict, Prisma Generate/Migrations, RLS-Policies, Webhooks.
4. **CI/Governance:** Quality Gates, Security Audit, AI-Guard, Lighthouse CI, Dokumentationspflicht (ADR + STATE/KNOWLEDGE/TODO).

### 2.2 Teststufen
- **Stufe A: Statische Qualität (CI):** Lint, Typecheck, Preflight, AI-Guard, npm audit, Gitleaks, Build, Lighthouse CI.
- **Stufe B: API/Integration:** Supabase RLS, Prisma, Stripe Webhooks, Auth, Storage, kontraktbasierte Tests.
- **Stufe C: E2E User Journeys:** Je Funnel (Shop/Werkstatt/Autohandel), inklusive Tracking-Assertions (Events fired + Schema valid + keine PII).
- **Stufe D: Non-Functional:** Performance (Core Web Vitals), Security/DSGVO, Accessibility (WCAG AA), Observability (Sentry/Vercel), Resilience (Fehlerpfade).
- **Stufe E: Release- & Smoke-Tests:** Auf Vercel Preview je PR, danach Gate für Production per Release-Prozess/DoD.

## 3. Prüfobjekte und Abnahmekriterien nach Systembereichen

### 3.1 Systemweit (gilt für alle Route-Groups + shared)
- **G1 Funnel-Zuweisung:** Jede Seite/Feature/Automation hat in PR-Beschreibung und Code/Metadata eine eindeutige Funnel-Stage.
- **G2 Claims-Policy:** Preisangaben immer „ab …“ und „inkl./exkl. MwSt.“; Aussagen als FACT/CLAIM/STORY kategorisiert.
- **G3 UI-Regel:** Keine ad-hoc UI; nur src/components/ui.
- **G4 Tracking First:** Kritische Aktionen müssen Event-Registrierung und Zod-Schema haben.
- **G8 Zero Information Loss:** Erkenntnisse in STATE/KNOWLEDGE/TODO persistieren.
- **G9 Brand-Konsistenz:** Shop/Service-Farben strikt trennen.
- **G10 Sprachkonventionen:** Code Englisch, UI Deutsch, URLs Deutsch, Commits Conventional (Englisch).

### 3.2 Bereich Shop (Carvantooo /shop)
- **HSN/TSN-Suche:** Sichtbar/benutzbar, Brand #FFB300.
- **Events:** `page_view`, `cta_click`, `search_internal`, `hsn_tsn_lookup`, `product_filter`, `product_view`, `add_to_cart`, `begin_checkout`, `purchase`.
- **Checkout:** Stripe-Integration, Webhooks sicher, keine PII in Events.
- **Retention:** „Meine Garage“, RLS-Isolation.

### 3.3 Bereich Werkstatt (OpenCarBox /werkstatt)
- **Brand:** #FFA800.
- **Terminbuchung:** 5-Schritt-Flow (`appointment_start` bis `appointment_booked`).
- **Automations:** Bestätigung, Reminder (24h/1h).

### 3.4 Bereich Autohandel (OpenCarBox /autohandel)
- **Fahrzeuglisting/Detail:** Filter korrekt, Events (`vehicle_listing_view`, `vehicle_detail_view`).
- **Lead-Generierung:** `vehicle_inquiry`, Finanzierungsrechner.

## 4. Release-Abnahme (Definition of Done)
Ein Release gilt als „Done“, wenn:
1. **Technisch:** Alle CI Gates grün (Lint/Type/Build/Security/Tests).
2. **Inhaltlich:** UI Deutsch, Preise korrekt (ab + MwSt.), Claims kategorisiert.
3. **Design:** UI-Library verwendet, responsive, Brand korrekt, 8px Grid, WCAG AA.
4. **Tracking:** Events registriert + Zod valid, PII-Handling dokumentiert.
5. **Governance:** ADR bei Architektur, STATE/KNOWLEDGE/TODO aktuell, Funnel zugewiesen.
