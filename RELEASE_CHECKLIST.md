# Release Checklist

## 1) Code-Qualität
- [ ] `npm run type-check` erfolgreich
- [ ] `npm run lint` erfolgreich (nur bekannte, dokumentierte Warnings)
- [ ] `npm run test -- --run` erfolgreich
- [ ] `npm run build` erfolgreich

## 2) CI/CD
- [ ] Quality Gate Workflow grün
- [ ] Preview Deployment für PR erfolgreich
- [ ] Production Deployment nur einmal ausgelöst (kein Doppel-Deploy)

## 3) Konfiguration / Secrets
- [ ] GitHub Secrets vollständig gesetzt
- [ ] Vercel Env Vars für Preview/Production konsistent
- [ ] Domain, Redirects und Header geprüft

## 4) Datenbank
- [ ] Prisma Schema validiert
- [ ] Supabase Migrationen geprüft
- [ ] Rollback-Plan dokumentiert

## 5) Sicherheit
- [ ] Keine Secrets im Repo/History/Artefakten
- [ ] Security-Scanner Ergebnisse geprüft
- [ ] Kritische Findings behoben oder bewusst akzeptiert + dokumentiert

## 6) Produktivnahme
- [ ] Smoke-Test auf Live-URL (Startseite, Shop, Kontakt)
- [ ] Monitoring/Alerts aktiv
- [ ] Stakeholder-Freigabe dokumentiert
