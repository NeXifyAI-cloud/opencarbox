# Erworbenes Wissen

## Projekt-Architektur
- Multisite-Plattform für OpenCarBox (Werkstatt/Autohandel) und Carvantooo (Shop).
- Tech-Stack: Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase.
- Sprach-Konvention (G10): Englisch für Code/Git, Deutsch für UI/Doku.
- Branding (DOS v1.1): Shop = #FFB300, Werkstatt/Autohandel = #FFA800.

## Prüfstrategie (DOS v1.1)
- Zentraler Prüfplan in `docs/PRUEFPLAN_DOS.md`.
- G3: Keine One-Off UI (shadcn/ui only, Design Tokens in `DESIGN_TOKENS.md`).
- G4: Tracking First (Zod-validierte Events in `src/lib/events.ts`).
- G9: Dual-Brand Konsistenz (Farben strikt trennen).

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
