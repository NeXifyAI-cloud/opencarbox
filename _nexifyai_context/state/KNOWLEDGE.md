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

## Security & Workflow Hardening (2026-02-24)
- **Workflow Run Context:** Workflows, die durch `workflow_run` getriggert werden, laufen in einem privilegierten Kontext. Niemals ungetestete `head_sha` direkt auschecken, ohne den Branch zu validieren oder auf den Default-Branch zu prüfen.
- **Secure PR Creation:** Bei der Verwendung von `gh pr create` in automatisierten Skripten müssen alle dynamischen Eingaben (Titel, Branch-Namen) über Umgebungsvariablen übergeben werden, um Shell-Injektionen zu verhindern.
- **Frontend URL Validation:** Benutzereingaben für Bild-URLs müssen strikt auf Protokolle (`http://`, `https://`) geprüft werden, um `javascript:` Injektionen zu vermeiden.
