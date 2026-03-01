# Prüfplan Digital Operating System (DOS) v1.1

## 🎯 Prüfungsziel, Scope und Leitplanken
Ziel des Prüfplans ist es, Release- und Betriebsfähigkeit für eine Multisite-Next.js-14-Plattform mit drei strikt isolierten Route-Groups sicherzustellen: (shop) Carvantooo, (werkstatt) OpenCarBox Werkstatt, (autohandel) OpenCarBox Autohandel, plus shared. Grundlage sind die „unverhandelbaren Guardrails“, Quality Gates, Security/DSGVO-Anforderungen, Event-Tracking-Pflichten und Performance-Zielwerte.

## 🚫 Nicht verhandelbare Exit-Kriterien
- **G1 Funnel-Zuordnung:** Pro Seite/Feature/Automation.
- **G9 Dual-Brand-Konsistenz:** (shop)=#FFB300, (werkstatt)/(autohandel)=#FFA800, niemals mischen.
- **G3 No One-Off UI:** Ausschließlich `src/components/ui` (shadcn/ui), neue Tokens zuerst in `DESIGN_TOKENS.md`.
- **G4 Tracking First:** Jedes kritische Verhalten als Zod-validiertes Event in `src/lib/events.ts`; kein Merge ohne Event.
- **Security validated:** 0 Critical/High CVEs, Secrets nicht im Repo, RLS/Least Privilege, CSP, DSGVO-Konformität.
- **Performance:** Lighthouse Score ≥ 90; LCP ≤ 2.5s; INP ≤ 200ms.
- **Stabilität:** Error Rate < 0.5%, P99 Latenz < 500ms.
- **CI Quality Gates:** Lint/Typecheck/Preflight/AI Guard/Build/Security/Performance müssen grün sein.

## 🔄 Prüfstrategie und Prüflogik
### 2.1 Grundlogik pro Änderung
- **Kontext:** Bereich (shop/werkstatt/autohandel/shared) + Funnel-Schritt.
- **Konsistenz:** Brand, UI-Komponenten-Regeln, Sprachkonventionen, Copy-Compiler, Claims-Policy.
- **Validierung:** Zod (Forms + Events), TypeScript strict, Prisma Generate/Migrations, RLS-Policies, Webhooks.
- **CI/Governance:** Quality Gates, Security Audit, AI-Guard, Lighthouse CI, Dokumentationspflicht (ADR + STATE/KNOWLEDGE/TODO).

### 2.2 Teststufen
- **Stufe A: Statische Qualität (CI):** Lint, Typecheck, Preflight, AI-Guard, npm audit, Gitleaks, Build, Lighthouse CI.
- **Stufe B: API/Integration:** Supabase RLS, Prisma, Stripe Webhooks, Auth, Storage.
- **Stufe C: E2E User Journeys:** Je Funnel (Shop/Werkstatt/Autohandel), inklusive Tracking-Assertions.
- **Stufe D: Non-Functional:** Performance (Core Web Vitals), Security/DSGVO, Accessibility (WCAG AA), Observability.
- **Stufe E: Release- & Smoke-Tests:** Auf Vercel Preview je PR, danach DoD Gate für Production.

## 📦 Prüfobjekte und Abnahmekriterien
### 3.1 Systemweit
- **G1 Funnel-Zuweisung:** Eindeutige Stage in PR-Beschreibung.
- **G2 Claims-Policy:** Preise „ab …“ und „inkl./exkl. MwSt.“; Kategorisierung FACT/CLAIM/STORY.
- **G3 UI-Regel:** Nur `src/components/ui`.
- **G8 Zero Information Loss:** Erkenntnisse in STATE/KNOWLEDGE/TODO persistieren.
- **G9 Brand-Konsistenz:** Dual-Brand Farben strikt trennen.
- **G10 Sprachkonventionen:** Code Englisch, UI Deutsch, URLs Deutsch, Commits Conventional Commits.

### 3.2 Bereich Shop (Carvantooo)
- **HSN/TSN-Suche:** Sichtbar/benutzbar, Brand #FFB300.
- **Events:** `page_view`, `cta_click`, `search_internal`, `product_view`, `add_to_cart`, `begin_checkout`, `purchase`.
- **Checkout:** Stripe-basiert, Webhook-validiert, idempotente Verarbeitung.

### 3.3 Bereich Werkstatt (OpenCarBox)
- **Terminbuchung:** 5-Schritt-Flow, Brand #FFA800.
- **Events:** `appointment_start`, `appointment_vehicle`, `appointment_slot`, `appointment_booked`, `abandon_appointment`.
- **Automations:** Bestätigung (Email + WhatsApp), Reminder 24h/1h.

### 3.4 Bereich Autohandel (OpenCarBox)
- **Fahrzeuglisting:** Filter (Marke, Preis, Baujahr, Kilometer), Brand #FFA800.
- **Events:** `vehicle_listing_view`, `vehicle_detail_view`, `vehicle_inquiry`, `financing_calculator`.

## 🏁 Definition of Done (DoD)
Ein Release gilt als „Done“, wenn:
- **Technisch:** Alle CI Gates grün (Lint, Typecheck, Build, Security).
- **Inhaltlich:** UI Deutsch, Preise korrekt („ab“, MwSt), Claims kategorisiert.
- **Design:** Nur UI-Library, responsive, Brand-Farben korrekt, 8px Grid, WCAG AA.
- **Tracking:** Events registriert + Zod valid, PII Handling dokumentiert.
- **Governance:** ADR bei Architektur, STATE/KNOWLEDGE/TODO aktualisiert.
