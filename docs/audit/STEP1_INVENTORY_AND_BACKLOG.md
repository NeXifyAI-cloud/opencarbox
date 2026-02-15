# Schritt 1 – Repository-Inventar & Issue-Backlog

## 1) Strukturierte Übersicht (Ist-Zustand)

### Tech-Stack
- **Framework:** Next.js 14 (App Router), React 18, TypeScript strict.
- **Styling/UI:** Tailwind CSS, shadcn/ui, Radix UI.
- **State/Data:** TanStack Query, Zustand, Supabase JS/SSR, Prisma Client.
- **Testing:** Vitest, Playwright (konfiguriert, E2E-Skripte vorhanden).
- **Tooling:** ESLint, Prettier, Husky, lint-staged, Storybook.
- **Deployment:** Vercel (`vercel.json`, GitHub Actions Deploy Jobs).

### Entry Points / Hauptmodule
- **App Router Einstieg:** `src/app/layout.tsx`, `src/app/page.tsx`.
- **Domain-Routen:** `src/app/(shop)/*`, `src/app/(werkstatt)/*`, `src/app/(autohandel)/*`.
- **Middleware:** `src/middleware.ts` mit Supabase-Middleware in `src/lib/supabase/middleware.ts`.
- **Gemeinsame Module:** `src/components/*`, `src/lib/*`, `src/hooks/*`, `src/stores/*`.

### Datenflüsse & APIs
- **Supabase:** Browser-/Server-/Middleware-Clients in `src/lib/supabase/*`.
- **DB:** Prisma Schema unter `prisma/schema.prisma`; SQL-Migrations in `supabase/migrations/*`.
- **Externe APIs:** Stripe, Resend, OpenAI/Google Generative AI in Dependencies sichtbar.

### Auth / Hosting
- **Auth:** Supabase-basierte Auth-Integration (indirekt via Clients/Middleware sichtbar).
- **Hosting:** Vercel (Build/Install Commands in `vercel.json`, mehrfache Deploy-Workflows in `.github/workflows`).

### Wichtige Configs
- **Package Manager:** npm (`package-lock.json` vorhanden).
- **Node Version:** Engines `>=18.17.0`, CI nutzt Node 20.
- **Framework Config:** `next.config.js` (Headers, Redirects, standalone output).
- **Env Vars:** in README, `.env.example`, `.github/SECRETS_SETUP.md` dokumentiert.
- **CI/CD:** `.github/workflows/ci-cd.yml`, `auto-deploy.yml`, `auto-merge.yml`.

## 2) Lokale Reproduzierbarkeit (aktueller Check)
- `npm run type-check` ✅
- `npm run lint` ✅ (mit Warnings zu `<img>`)
- `npm run test -- --run` ❌ (vor Fix: keine Testdateien, Exit 1)
- `npm run build` ✅ (mit Edge-Warnings wegen Supabase in Middleware-Pfad)

## 3) Issue Backlog (Priorisiert)

### P0
1. **CI-Testschritt kann hart fehlschlagen, wenn keine Tests vorhanden sind.**
   - **Impact:** PRs/Deploy blockiert trotz funktionierendem Code.
   - **Fix-Plan:** Baseline-Unit-Tests ergänzen (mindestens Utility Smoke Tests), danach CI lokal verifizieren.

2. **Sicherheitsrisiko: Beispielwerte in Secrets-Doku enthielten reale Muster/IDs/Tokens.**
   - **Impact:** Risiko versehentlicher Secret-Leaks / schlechtes Security-Hygiene-Signal.
   - **Fix-Plan:** Werte vollständig auf Platzhalter umstellen, Hinweis auf Secret-Management ergänzen.

### P1
3. **Doppelte/überschneidende Deployment-Workflows (`ci-cd.yml` + `auto-deploy.yml`).**
   - **Impact:** Doppel-Deploys, Race Conditions, inkonsistente Releases.
   - **Fix-Plan:** Deployment-Strategie konsolidieren (ein Workflow mit klaren Triggern, Concurrency, Environment Gates).

4. **Edge-Runtime-Warnungen im Build (Supabase Libraries nutzen Node APIs).**
   - **Impact:** Potenzielle Runtime-Probleme in Middleware/Edge.
   - **Fix-Plan:** Supabase Middleware-Setup gegen Next.js Edge-Empfehlung prüfen, ggf. Version/Import-Pfad anpassen.

### P2
5. **Performance/Lint-Warnungen durch `<img>` statt `next/image`.**
   - **Impact:** schlechtere LCP/Bandbreite.
   - **Fix-Plan:** Komponenten inkrementell auf `next/image` umstellen.

6. **Repo-Hygiene: `node_modules` im Repository vorhanden.**
   - **Impact:** großes Repo, langsame CI, Supply-Chain/Review erschwert.
   - **Fix-Plan:** Tracking prüfen, aus Git entfernen, `.gitignore` absichern.

7. **Node/NPM Umgebungswarnung (`Unknown env config "http-proxy"`).**
   - **Impact:** potenzielle Build-Instabilität bei npm-Major-Upgrade.
   - **Fix-Plan:** CI/Runner ENV prüfen und bereinigen.

## 4) Konkreter Fix-Plan (nächste Schritte)
1. **P0 zuerst:** Security-Doku bereinigen + minimale Testabdeckung einführen.
2. **Verifikation:** `type-check`, `lint`, `test -- --run`, `build` lokal.
3. **P1 danach:** CI/CD-Workflow konsolidieren, Deploy-Trigger und Concurrency härten.
4. **Edge-Kompatibilität:** Supabase Middleware Imports/Versionen prüfen und Edge-Warnungen eliminieren.
5. **P2:** `next/image` Migration + Repo-Aufräumen (`node_modules` Tracking), anschließend README/Docs aktualisieren.

## 5) Nicht bestätigbar (ohne externen Zugriff)
Folgende Punkte sind aus lokalem Repo **nicht bestätigbar**:
- GitHub Branch Protection Rules / Required Checks / CODEOWNERS Enforcement.
- Tatsächlich gesetzte GitHub Secrets/Environment-Scopes.
- Vercel Project Settings (Build & Output Overrides, Env Scopes, Domains, Deploy Hooks).

### Verifizierungs-Checkliste dafür
1. GitHub → Settings → Branches: Required checks, review counts, linear history.
2. GitHub → Settings → Secrets and variables (Actions + Environments): Vollständigkeit & Scopes.
3. Vercel → Project Settings: Build Command, Install Command, Root Dir, Node Version.
4. Vercel → Environment Variables: Preview/Production-Parität.
5. Vercel → Domains/Redirects/Headers: Übereinstimmung mit `vercel.json` und `next.config.js`.
