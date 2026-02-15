# Autonomes CI/CD mit DeepSeek (OpenCarBox)

## Ziel

Dieses Setup hält PRs, Kommentare und CI-Berichte **autonom** aktuell:

- `oracle.yml`: Gatekeeper, Attempt-Loop-Limit, PR-Kommentare
- `autofix.yml`: Scope-Guard, `needs-human`, Auto-Merge-Block
- `ci-health.yml`: Nightly Trend-Report + Auto-Commit nach `docs/ci-health.md`

## DeepSeek statt statischer Regeln für Analyse

Die CI nutzt DeepSeek API für:

1. **Fehlerklassifikation + Fix-Reason** im Oracle-Gate
2. **Risiko-/Empfehlungs-Kommentare** im Autofix-Scope-Guard
3. **Trend-/Flake-Insights** im CI-Health-Report

Erforderliches Secret:

```env
DEEPSEEK_API_KEY=<your_deepseek_api_key>
```

## Wichtiger Hinweis zur Plattform

GitHub Actions verarbeitet weiterhin die Repository-Ereignisse (PR, Check Runs, Workflow Runs).
DeepSeek übernimmt die **Entscheidungs- und Analyseebene** innerhalb der Workflows.

## Betriebsregeln

- Ohne `DEEPSEEK_API_KEY` laufen die Workflows mit regelbasierten Fallback-Texten weiter.
- Verbotene Pfade bleiben immer human-gated (`needs-human`).
- Oracle limitiert Autofix-Schleifen (`Autofix-Attempt`).
