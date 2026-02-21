# Deployment & Wartungs-Leitfaden (OpenCarBox)

Dieser Leitfaden bietet einen strukturierten, schrittweisen Plan zur sicheren Überprüfung, Fehlerbehebung und Bereitstellung des OpenCarBox-Repositorys.

## Phase 1: Initiale Bewertung (Assessment)

**Ziel:** Verständnis des Ist-Zustands, der Abhängigkeiten und der Testabdeckung.

1.  **Repository-Struktur prüfen:**
    *   `src/`: Next.js App Router Code (Neu).
    *   `frontend/`: Legacy React-Codebase (Sollte isoliert oder migriert werden).
    *   `prisma/`: Datenbank-Schema.
2.  **Abhängigkeiten analysieren:**
    *   Befehl: `pnpm list`
    *   Erwartung: Liste aller installierten Pakete ohne kritische Versionskonflikte.
3.  **Status-Quo Build & Test:**
    *   Befehl: `pnpm run build && pnpm run test`
    *   Erwartung: Identifikation von Build-Fehlern oder fehlschlagenden Unit-Tests.

## Phase 2: Priorisierte Fehlerbehebung

**Ziel:** Behebung technischer Blocker und Einhaltung der Quality Gates.

1.  **Linter & Quality Gates:**
    *   Das Repository nutzt `tools/quality-gate.ts`, um `console.log` und Datei-Längen zu prüfen.
    *   **Maßnahme:** Funktionen über 50 Zeilen (z.B. in `src/components/shop/product-grid.tsx`) in kleinere Sub-Komponenten aufteilen.
2.  **AI Provider Compliance:**
    *   Befehl: `./tools/guard_no_openai.sh`
    *   Erwartung: Keine Funde von OpenAI-Bibliotheken oder API-Keys. Nur DeepSeek ist erlaubt.
3.  **Kritische Bugfixes:**
    *   Prüfung von Hooks auf fehlende Abhängigkeiten (z.B. `useMemo` in `ProductGrid`).

## Phase 3: CI/CD Stabilisierung

**Ziel:** Automatisierung der Qualitätssicherung.

1.  **GitHub Actions Workflow:**
    Erstellen Sie `.github/workflows/ci.yml`:
    ```yaml
    name: CI
    on: [push, pull_request]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: pnpm/action-setup@v3
          - uses: actions/setup-node@v4
            with: { node-version: 22, cache: 'pnpm' }
          - run: pnpm install
          - run: ./tools/guard_no_openai.sh
          - run: pnpm run build
          - run: pnpm run test
    ```
2.  **Health Checks:**
    *   Sicherstellen, dass `/api/health` einen `200 OK` Status zurückgibt.

## Phase 4: Bereitstellungsstrategie (Deployment)

**Ziel:** Reproduzierbare Umgebung in Vercel & Supabase.

1.  **Infrastruktur-Setup:**
    *   **Vercel:** Region `fra1` (Frankfurt) für DSGVO-Konformität wählen.
    *   **Supabase:** Projekt in Frankfurt anlegen, Datenbank-URL und Service-Key bereithalten.
2.  **Umgebungsvariablen (Environment Variables):**
    Folgende Variablen müssen in Vercel gesetzt werden:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `DEEPSEEK_API_KEY`
    *   `DATABASE_URL` (Direct Connection für Prisma)

## Phase 5: Validierung & Rollback-Plan

**Ziel:** Sicherheit nach dem Release.

1.  **Post-Deployment Check:**
    *   Überprüfung der Shop-Funktionalität (`/shop`).
    *   Prüfung der AI-Integration (DeepSeek Status).
2.  **Rollback-Verfahren:**
    *   **Vercel:** In der Vercel UI das vorherige Deployment auswählen und auf "Redeploy" -> "Promote to Production" klicken.
    *   **Datenbank:** Falls Migrationen fehlgeschlagen sind, `prisma migrate resolve --rolled-back <migration_name>` verwenden oder Backup in Supabase einspielen.

---

## Risiko-Matrix & Minimierung

| Risiko | Auswirkung | Minimierung |
| :--- | :--- | :--- |
| **Bypass Quality Gate** | Instabiler Code | CI-Blocker für fehlgeschlagene Quality-Gate Skripte. |
| **OpenAI Leak** | Compliance-Verstoß | Automatisierter Guard-Script Check vor jedem Merge. |
| **Regressions** | UI-Fehler | Einführung von Playwright für visuelle Regressionstests. |

## Häufige Fallstricke (Pitfalls)

*   **Linter-Hacks:** Vermeiden Sie `console['log']`, um den Linter zu täuschen. Konfigurieren Sie stattdessen `.eslintrc.json` korrekt.
*   **Große Dateien:** Next.js Komponenten über 50 Zeilen triggern das Quality-Gate. Refaktorieren Sie frühzeitig in `atoms` oder `molecules`.
*   **Fehlende .env.local:** Lokal schlägt der Server ohne Dummy-Daten für Supabase fehl. Nutzen Sie `env.example` als Vorlage.
