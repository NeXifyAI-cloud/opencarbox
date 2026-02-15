# Security Policy

## Supported Versions

Die aktive `main`-Linie wird unterstützt. Sicherheitsfixes auf Legacy-Branches laufen nur über Repair-PRs.

## Secrets & Sensitive Data

- Keine echten Secrets in tracked files.
- Nutze ausschließlich Platzhalter in Beispieldateien.
- Pflichtcheck: `npm run security:scan-secrets`.

## CI/CD Sicherheitsgrenzen

- Keine automatisierten Änderungen in:
  - `prisma/migrations/`
  - `supabase/migrations/`
  - `.env*`
  - `vercel.json`
- Falls solche Änderungen notwendig sind, PR mit Label `needs-human`.

## Dependency Policy

- Automatische Updates: nur Patch/Minor.
- Major-Upgrades nur über separaten PR mit Risikoanalyse und Label `needs-human`.

## Reporting

Bitte Security-Probleme vertraulich über die Repository Security Advisories melden.
