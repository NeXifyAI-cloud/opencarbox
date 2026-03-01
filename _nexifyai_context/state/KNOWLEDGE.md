# Erworbenes Wissen

## Projekt-Architektur
- Multisite-Plattform für OpenCarBox (Werkstatt/Autohandel) und Carvantooo (Shop).
- Tech-Stack: Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase.
- Sprach-Konvention (G10): Englisch für Code/Git, Deutsch für UI/Doku.
- **DOS v1.1 Konformität:** Strikte Trennung der Markenfarben (Shop: #FFB300, Service: #FFA800) und 8px Grid System.

## Prüfstrategie (DOS v1.1)
- **Closed-Loop, CI-getrieben:** Jede Änderung wird gegen Funnel-Zuordnung, Brand-Konsistenz, Zod-Validierung und Quality Gates geprüft.
- **Teststufen:** Statische CI-Checks (A), API/Integration (B), E2E User Journeys (C), Non-Functional Performance/Security (D), Release Smoke-Tests (E).
- **Definition of Done:** Technisch grün, Inhaltlich/Design korrekt, Tracking validiert, Governance dokumentiert.

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
