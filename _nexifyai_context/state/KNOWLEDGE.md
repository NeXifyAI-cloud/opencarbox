# Erworbenes Wissen

## Projekt-Architektur
- Multisite-Plattform für OpenCarBox (Werkstatt/Autohandel) und Carvantooo (Shop).
- Tech-Stack: Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase.
- Sprach-Konvention (G10): Englisch für Code/Git, Deutsch für UI/Doku.

## Sicherheits-Anforderungen
- Keine autonome Kontrolle über das System.
- Traceability durch Logging aller Aktionen (Zeitstempel, User, Aktion).
- Eskalationspfade für kritische Aktionen erforderlich.
- Refusal-Workflow für Anfragen nach vollständiger Autonomie.

## Implementierte Sicherheits-Infrastruktur
- **AuditLog-System:** Erlaubt die lückenlose Rückverfolgung von Agenten-Aktionen.
- **Prisma Client Singleton:** Zentralisierte Datenbankverbindung für Next.js.
- **Sicherheits-Workflows:** Dokumentiert in `docs/SAFETY_PROTOCOLS.md`.
- **Ablehnungs-Workflow:** Dokumentiert in `docs/REFUSAL_WORKFLOW.md`.

## Prüfstrategie (DOS v1.1)
Jede Änderung folgt der Kette:
1. **Kontext:** Bereich (shop/werkstatt/autohandel/shared) + Funnel-Schritt (Awareness/Education/Consideration/Conversion/Retention).
2. **Konsistenz:** Brand, UI-Komponenten-Regeln, Sprachkonventionen, Copy-Compiler, Claims-Policy.
3. **Validierung:** Zod (Forms + Events), TypeScript strict, Prisma Generate/Migrations, RLS-Policies, Webhooks.
4. **CI/Governance:** Quality Gates, Security Audit, AI-Guard, Lighthouse CI, Dokumentationspflicht (ADR + STATE/KNOWLEDGE/TODO).

## Teststufen
- **Stufe A (Statisch):** Lint, Typecheck, Preflight, AI-Guard, npm audit, Gitleaks, Build, Lighthouse CI.
- **Stufe B (Integration):** Supabase RLS, Prisma, Stripe Webhooks, Auth, Storage, kontraktbasierte Tests.
- **Stufe C (E2E User Journeys):** Funnel-spezifische Journeys inkl. Tracking-Assertions.
- **Stufe D (Nicht-Funktional):** Performance (Core Web Vitals), Security/DSGVO, Accessibility (WCAG AA), Observability, Resilience.
- **Stufe E (Release/Smoke):** Vercel Preview pro PR -> Gate für Production.
