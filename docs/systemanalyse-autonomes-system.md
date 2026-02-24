# Ganzheitliche Systemanalyse (Ist-Zustand) und Zielarchitektur (Soll-Zustand)

> Scope: Diese Analyse basiert auf dem beobachtbaren Zustand im Repository `opencarbox` sowie der aktuellen Laufzeitumgebung (Container/Host-OS-Infos, Toolchain, Workflow-Definitionen, Skripte, Dokumentation).

## 1) Systemanalyse

### 1.1 Startpunkt VS Code / Editor-Layer
- Workspace vorhanden: `opencarbox.code-workspace`, aktuell minimal (ein Root-Folder, keine expliziten Workspace-Settings).
- Keine projektspezifischen `.vscode/`-Artefakte gefunden (keine `settings.json`, `extensions.json`, `tasks.json`, `launch.json`, Snippets).
- Konsequenz:
  - Geringe IDE-Deterministik (unterschiedliche lokale Entwickler-Setups).
  - Keine standardisierte Debug-/Task-Landschaft aus dem Repo.

### 1.2 Betriebssystem / Shell / Baseline Runtime
- Beobachtetes OS: Ubuntu 24.04 LTS, Bash-Shell.
- PATH enthält mehrere Runtime-Manager/Toolchains (nvm, pyenv, phpenv, mise, go, java, maven, ruby, elixir etc.).
- Nur wenige aktivierte Systemdienste sichtbar (containernahes Setup).
- Konsequenz:
  - Potenziell hohe Pfad-/Version-Komplexität durch viele parallele Toolchains.
  - Risiko inkonsistenter Build-Ergebnisse zwischen Hosts.

### 1.3 Applikations- & Repo-Architektur
- Primär-Stack laut `package.json` + README:
  - Next.js 14 (App Router), React 18, TypeScript.
  - Supabase (Auth/Data), Prisma.
  - Vercel-Deployment (über Workflows/Skripte angelegt).
  - Vitest/Playwright/Storybook vorhanden.
- Docker/Compose vorhanden (`Dockerfile`, `compose.yaml`) inkl. Healthchecks.
- Konsequenz:
  - Gute Grundlage für reproduzierbare Deployments.
  - Mehrere Betriebsmodi (lokal, Docker, Vercel, CI) müssen strikt harmonisiert bleiben.

### 1.4 Paketmanager und Dependency-Lage
- Primär: `npm@9.12.3` (`packageManager` gesetzt).
- npm ist vorhanden, wird aber teils noch indirekt genutzt (Skripte/Tools nennen `npm run ...`).
- Kein Hinweis auf aktive yarn/pip/composer-Project-Locks im Root.
- Konsequenz:
  - Mischbetrieb npm/npm erhöht Drift-Risiko.
  - Lockfile-Disziplin ist essenziell (bereits mit `npm-lock.yaml` vorhanden).

### 1.5 Laufzeitumgebungen
- Beobachtet: Node 20, Python 3.12, PHP 8.4-dev, Java 21, Git.
- `gh` CLI in aktueller Session nicht installiert/verfügbar.
- Konsequenz:
  - Reiche Toollandschaft, aber unklar standardisiert für alle Runner.
  - Für Workflows mit `gh` muss explizite Installation (bereits teilweise umgesetzt).

### 1.6 Datenbanken
- Supabase + Prisma-Schema vorhanden.
- RLS-Checks und Supabase-bezogene Skripte vorhanden.
- Empfehlung zur Policy-/Budget-Orchestrierung via Supabase Oracle bereits dokumentiert.

### 1.7 Server-Setups (lokal/remote)
- Lokal: Next.js Dev Server + optional Docker Compose.
- Remote: GitHub Actions + Vercel Deploy-Workflows.
- Healthchecks in Container definiert.

### 1.8 Cloud/APIs/Integrationen
- Supabase, Vercel, GitHub Actions, diverse AI-Workflows.
- `tools/export_env.sh` mappt Legacy-Secret-Namen auf Standardnamen.
- AI-Policy in weiten Teilen DeepSeek+NSCALE fail-closed ausgerichtet.

### 1.9 CI/CD & Automatisierung
- Umfangreiche Workflow-Landschaft inklusive:
  - `ci.yml` (lint/typecheck/test/build, ohne AI-Secret-Zwang).
  - `failure-orchestrator.yml` (workflow_run-failure routing, Safe-Autofix/AI-Triage/Issue-Pfade).
  - weitere Automationspfade (deploy, retry, conflict-resolver, auto-improve etc.).
- Positiv:
  - hohe Automationsdichte.
  - deterministische Gates in zentralen Pfaden.
- Risiko:
  - Sehr viele Workflows = erhöhte Wartungskomplexität, Trigger-Überlappungen möglich.

### 1.10 Git/Repository-Organisation
- Dokumentationsstruktur ausgeprägt (`docs/`, `NOTES/`).
- ADR-ähnliche Entscheidungen in `NOTES/brain.md` dokumentiert.
- Backlog/Runbook vorhanden.

### 1.11 Monitoring/Logging/Backup
- Teilweise vorhanden (Healthcheck, Runbook/Incidents, Orchestrator-Routing).
- Es fehlt ein zentral sichtbares SLO-/SLI-Dashboard im Repo.
- Backup-Strategie und Disaster-Recovery sind nicht als vollständiger End-to-End-Standard ausdefiniert.

---

## 2) Schwachstellenbericht

### 2.1 Abhängigkeiten
- Kritisch gekoppelt:
  - GitHub Actions ↔ Vercel ↔ Supabase ↔ Secret-Management.
  - AI-Automation ↔ DeepSeek/NSCALE-Preflight.
- SPOF-Risiken:
  - Fehlerhafte oder driftende Secret-Mappings.
  - Überlappende Workflow-Trigger/Automationskaskaden.

### 2.2 Redundanzen
- Teilweise doppelte Skripte/Setup-Pfade (z. B. ähnlich benannte Secret-Set-Skripte).
- Mehrere AI-bezogene Workflows mit ähnlicher Preflight-/Install-Logik.

### 2.3 Inkonsistenzen
- Doku beschreibt teils noch Multi-Provider-Fallback, während Policy DeepSeek-only fordert.
- npm als Standard, aber Mischsignale mit npm-Aufrufen.

### 2.4 Sicherheitslücken / Sicherheitsrisiken
- Hauptrisiko ist nicht ein einzelner CVE-Hinweis im Repo, sondern Konfigurationsdrift:
  - uneinheitliche Env-Namensräume,
  - potentiell unvollständige fail-closed Durchsetzung,
  - hohe Anzahl automationsgetriebener Schreibpfade.

### 2.5 Performance-Bottlenecks
- Viele Workflow-Runs/Matrix-artige Automationen können Laufzeit/Kosten erhöhen.
- Fehlende konsolidierte Priorisierung bei gleichzeitigen Fehlern kann Queues verlängern.

### 2.6 Medienbrüche
- Wissen verteilt über README, docs, NOTES, Workflow-Dateien.
- Kein zentraler "Single Pane of Glass" für Betriebszustand (Build/Deploy/Incidents/Budgets).

### 2.7 Manuelle Prozesse mit Automatisierungspotenzial
- Incident-Triage und Root-Cause-Clusterung noch nicht vollständig geschlossen.
- Policy-Drift-Erkennung (Doku vs. Workflows vs. Scripts) sollte automatisiert werden.

---

## 3) Zielarchitektur (Diagramm-Beschreibung)

## 3.1 Zielbild: Autonomes, selbstüberwachendes System

```text
[Dev/PR Input]
      |
      v
[GitHub Webhook/Event Router]
      |
      +--> [Policy Engine (Supabase Oracle)] --(budgets, kill-switch, guardrails)--> [AI Gate]
      |
      +--> [Deterministic CI Pipeline]
      |         (lint/typecheck/test/build/security)
      |
      +--> [Failure Orchestrator]
                |-- Safe Autofix (non-risky)
                |-- AI Triage (DeepSeek+NSCALE only)
                |-- Manual Escalation Artifacts (Issue + Runbook)

[Artifact Store + Telemetry Bus]
      |
      +--> [Observability Layer]
             (SLO dashboards, error budgets, alerts)
      +--> [Knowledge Layer]
             (ADR, Backlog, Runbook sync)
      +--> [Continuous Optimization Loop]
             (analyze -> adapt -> validate -> monitor -> re-optimize)
```

### 3.2 Module (skalierbar/fehlertolerant)
1. **Control Plane**: Event-Router, Orchestrator, Policy Engine.
2. **Execution Plane**: CI, Tests, Deploy, Migration, Rollback.
3. **Data Plane**: Supabase + Prisma + Backups + Restore-Tests.
4. **AI Plane**: DeepSeek-only Connector mit NSCALE Header Enforcement.
5. **Observability Plane**: Metrics, Logs, Traces, Budget- und Drift-Reports.
6. **Knowledge Plane**: ADR/Runbook/Backlog als versionierte Betriebswahrheit.

### 3.3 Designprinzipien
- Fail-closed by default.
- Idempotente Automationsschritte.
- Deterministische Gates vor jedem riskanten Schritt.
- Rollback-first: jeder Deploy-Pfad hat Backout-Prozedur.

---

## 4) Automatisierungsstrategie

### 4.1 Feedback-Loops (vollautomatisiert)
- **Performance-Loop**: Build-/Test-Zeiten, Web-Vitals, DB-Latenzen -> Schwellenwerte -> Auto-Issue/Auto-PR.
- **Security-Loop**: Secret-Scan, Dependency-Scan, Policy-Drift-Scan -> Block/Quarantine.
- **Update-Loop**: gruppierte Dependency-Updates + Canary-Validierung + kontrollierter Rollout.
- **Testing-Loop**: flaky-test detection, retry-budget, quarantine + auto-generated fixes.
- **Deployment-Loop**: progressive rollout, auto-rollback bei SLO-Verletzung.
- **Monitoring-Loop**: Incident Classification, dedup, priorisierte Remediation.

### 4.2 Selbstheilungsmechanismen
- Safe-Autofix für deterministische Klassen (format/import/lint/simple typing).
- AI-Triage nur innerhalb Guardrails (Dateigröße, Dateityp, Max-Calls, Workflow-Edit-Verbot).
- Unsicher/Fix nicht möglich -> Issue + Backlog + Runbook-Update (closed feedback artifact).

### 4.3 Standardisierte Konfigurations-/Versionsstrategie
- Strikter Standard-Env-Namensraum + zentrales Mapping-Script.
- Single package manager policy (npm), lockfile strikt.
- Version Pinning für kritische Tooling-Komponenten in CI.
- Konfigurations-Drift-Checks als eigener Workflow (docs/workflow/scripts parity).

### 4.4 Dokumentation/Transparenz
- ADR-Pflicht für Architektur- und Prozessentscheidungen.
- Runbook als Incident Source-of-Truth.
- Backlog mit Akzeptanzkriterien + Risiko/Backout je Task.
- Wöchentlicher automatisch generierter Systemzustandsbericht.

---

## 5) Sicherheitsstrategie

1. **Provider-Härtung**: DeepSeek-only + NSCALE-Header Pflicht, keine OPENAI_* Nutzung.
2. **Secret Hygiene**: niemals in Logs, nur Metadaten; Secret-Scan als Gate.
3. **Least Privilege**: Workflow-Permissions minimal; Token-Scope minimieren.
4. **Policy Enforcement**: Preflight in allen AI-relevanten Pfaden.
5. **Supply Chain**: Dependabot gruppiert, Review-Gates, signierte Artefakte optional.
6. **Backup/DR**:
   - tägliche DB-Backups,
   - regelmäßige Restore-Drills,
   - dokumentierter RTO/RPO.

---

## 6) Iterationsmodell (geschlossener autonomer Kreislauf)

### Zyklus
1. **Analyse** (Telemetry + Drift + Incidents).
2. **Anpassung** (Safe fix / AI fix / Config update).
3. **Validierung** (deterministische Testkette).
4. **Monitoring** (SLO/Security/Budget Nachkontrolle).
5. **Re-Optimierung** (Priorisierung neuer Engpässe).

### Abbruch-/Reife-Kriterien je Iteration
- Alle Komponenten an zentrale Policy angebunden.
- Keine ungesteuerten manuellen Eingriffe in Standardfällen.
- Automatischer Backout vorhanden und getestet.
- Dokumentation synchron zum Ist-Zustand.

---

## 7) Roadmap zur Umsetzung (Impact x Aufwand priorisiert)

### Phase 0 (Sofort, hoher Impact, niedriger Aufwand)
1. Doku-Konsolidierung: DeepSeek-only Aussagen in README/docs harmonisieren.
2. Workflow-Inventar automatisieren: Trigger-Graph + Ownership + Kritikalität.
3. Drift-Check einführen (Env-Mapping + Policy-Checks als CI-Step).

### Phase 1 (hoch, mittel)
4. Zentrales Observability-Dashboard (CI/Deploy/Incidents/SLO).
5. Einheitliche Incident-Taxonomie + dedup keys über alle Workflows.
6. Standardisierte Restore-Drills für Supabase-Datenpfade.

### Phase 2 (hoch, mittel-hoch)
7. Supabase Oracle voll aktivieren (Budgets/Kill-Switch/Policy-RPC als Gatekeeper).
8. Progressive Deployment + automatische Rollback-Entscheidung bei SLO-Verletzung.

### Phase 3 (strategisch, höherer Aufwand)
9. Vollständige Self-Healing-Klassifizierung (Fixbarkeitsscore, Risiko-Score, Auto-Backout).
10. Langfristig: einheitlicher Control-Plane-Service für alle Workflow-Entscheidungen.

### Priorisierungsmatrix
- **P1**: Doku- und Policy-Drift eliminieren, deterministic gates absichern.
- **P2**: Observability + Incident-Standardisierung + Restore-Tests.
- **P3**: Oracle-Governance + progressive rollout automation.
- **P4**: Vollautonome Closed-Loop-Optimierung mit Reifegrad-Metriken.

---

## 8) Zusammenfassung (Management-kompakt)
- Das System ist bereits stark automatisiert und nah an einem autonomen Betriebsmodell.
- Die größten Risiken liegen nicht in fehlender Funktionalität, sondern in **Komplexitätsdrift** (viele Workflows, verteilte Doku, parallele Pfade).
- Mit einer klaren Control-Plane-Disziplin (Policy Engine + Observability + dokumentierte Loops) entsteht ein stabiler, geschlossener, selbstoptimierender Kreislauf.
