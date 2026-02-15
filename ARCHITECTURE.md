# OpenCarBox Architekturüberblick

## Systemkontext
- **Frontend & BFF:** Next.js 14 App Router (`src/app/*`).
- **State & Client Data:** TanStack Query + Zustand (`src/stores/*`, `src/components/providers/*`).
- **Persistenz:** Supabase (Auth/DB/Storage) und Prisma-Schema als DB-Vertrag.
- **Deployment:** Vercel (Preview + Production via GitHub Actions).

## Request-Fluss
1. Request trifft Next.js App Router.
2. Middleware (`src/middleware.ts`) aktualisiert Supabase Session.
3. Server Components / Route Handler laden Daten via Supabase/Services.
4. UI-Rendering mit Tailwind/shadcn-Komponenten.

## Wichtige Verzeichnisse
- `src/app` – Seiten und Layouts.
- `src/components` – UI/Layout/Domain-Komponenten.
- `src/lib/supabase` – Browser/Server/Middleware Clients.
- `src/lib` – Utilities und gemeinsame Hilfsfunktionen.
- `prisma` + `supabase/migrations` – Datenmodell und SQL-Migrationen.
- `.github/workflows` – CI/CD und Deployment.

## Betriebsrelevante Konfiguration
- `next.config.js` – Security-Header, Redirects, Bildquellen, standalone output.
- `vercel.json` – Build/Install Kommandos, Region, Redirects/Headers.
- `tsconfig.json` – strict TypeScript-Konfiguration.
- `.eslintrc.json` – Lint-Regeln für Next.js/TypeScript.

## Aktuelle technische Schulden
- Edge-Warnungen im Middleware-Buildpfad (Supabase Runtime-Hinweis).
- Bildoptimierung ist auf `next/image` für zentrale Karten migriert; weitere Performance-Tuning-Potenziale bleiben (z. B. Caching/Remote-Image-Strategie).
- Security-Scan Workflow ist auf einen festen Snyk-Action-Commit (v1.0.0) gepinnt.
