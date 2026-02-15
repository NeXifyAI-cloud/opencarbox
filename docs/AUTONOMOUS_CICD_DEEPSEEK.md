# Autonomes CI/CD mit DeepSeek (OpenCarBox)

## Ziel

Dieses Setup hält PRs, Kommentare und CI-Berichte **autonom** aktuell:

- `oracle.yml`: Gatekeeper, Attempt-Loop-Limit, PR-Kommentare
- `autofix.yml`: Scope-Guard, `needs-human`, Auto-Merge-Block
- `ci-health.yml`: Nightly Trend-Report + Auto-Commit nach `docs/ci-health.md`
- `branch-hygiene.yml`: Inaktive Branches erkennen (Dry-Run) und optional sicher bereinigen

## DeepSeek + NScale statt statischer Regeln für Analyse

Die CI nutzt einen KI-Router (`scripts/ci/ai-decision.ts`) mit Priorität **NScale (OSS-Modelle)** -> **DeepSeek** -> **Fallback** für:

1. **Fehlerklassifikation + Fix-Reason** im Oracle-Gate
2. **Risiko-/Empfehlungs-Kommentare** im Autofix-Scope-Guard
3. **Trend-/Flake-Insights** im CI-Health-Report
4. **Branch-Hygiene-Empfehlungen**/Klassifikation für Stale-Branches

Erforderliche Secrets:

```env
NSCALE_API_KEY=<your_nscale_api_key>
DEEPSEEK_API_KEY=<your_deepseek_api_key>
```

Optionale Modelle/Endpoints:

```env
NSCALE_MODEL=openai/gpt-oss-120b
NSCALE_BASE_URL=https://inference.api.nscale.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

## Wichtiger Hinweis zur Plattform

GitHub Actions verarbeitet weiterhin die Repository-Ereignisse (PR, Check Runs, Workflow Runs).
NScale/DeepSeek übernehmen die **Entscheidungs- und Analyseebene** innerhalb der Workflows.

## Betriebsregeln

- Ohne KI-Keys laufen die Workflows mit deterministischen Fallback-Texten weiter.
- Verbotene Pfade bleiben immer human-gated (`needs-human`).
- Oracle limitiert Autofix-Schleifen (`Autofix-Attempt`).
