# Contributing Guide

## Branching
- Feature/Fix Branches von `develop` erstellen.
- Branch-Namen: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.

## Commit-Konvention
- Empfohlenes Format: `type(scope): message`.
- Beispiele:
  - `fix(ci): prevent duplicate production deploy triggers`
  - `docs(security): replace secret examples with placeholders`

## Lokale Pflichtchecks vor PR
```bash
npm ci --legacy-peer-deps
npm run type-check
npm run lint
npm run test -- --run
npm run build
```

## PR-Anforderungen
- Problem/Ursache/Fix kurz beschreiben.
- Verifikationsschritte mit konkreten Commands angeben.
- Bei Infrastruktur-Änderungen: erforderliche GitHub/Vercel Settings dokumentieren.

## Sicherheit
- Keine Secrets in Commits, Issues oder PR-Kommentaren.
- Env-Variablen nur über GitHub/Vercel Secrets pflegen.
