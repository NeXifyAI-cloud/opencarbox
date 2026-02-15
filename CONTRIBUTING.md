# Contributing Guidelines

## Auto-Merge Regeln

Der Auto-Merge-Workflow (`.github/workflows/auto-merge.yml`) ist bewusst restriktiv konfiguriert:

- Auto-Merge läuft nur für Pull Requests aus **nicht-Fork Repositories**.
- Auto-Merge läuft nur für PRs, deren Head-Repository dem `github.repository_owner` gehört,
  **oder** wenn der auslösende Actor in `AUTO_MERGE_TRUSTED_ACTORS` hinterlegt ist
  (kommaseparierte Repository-Variable, z. B. `dependabot[bot],octocat`).
- Das Label `auto-merge` darf nur von Maintainern mit Write/Maintain/Admin-Rechten gesetzt werden.
- Dependabot-PRs werden nur für Minor/Patch-Versionen automatisch freigegeben.

## Wann Auto-Merge greift

Auto-Merge wird nur aktiviert (nicht sofort gemergt), wenn eine der folgenden Bedingungen erfüllt ist:

1. Dependabot-PR mit Patch/Minor-Update.
2. PR wurde mit `APPROVED` reviewed.
3. PR trägt das Label `auto-merge`.

Das tatsächliche Mergen erfolgt erst, wenn Branch-Protection-Bedingungen erfüllt sind.

## Empfohlene Branch-Protection für `main`

Damit Auto-Merge sicher ist, müssen in GitHub für `main` mindestens diese Regeln gesetzt sein:

1. **Require a pull request before merging**.
2. **Require approvals** mit mindestens **1 Review**.
3. **Require status checks to pass before merging** (mindestens der CI-Workflow, z. B. `Quality Gate & Deployment`).
4. Optional: **Dismiss stale pull request approvals when new commits are pushed**.
5. Optional: **Require conversation resolution before merging**.

> Ohne diese Branch-Protection-Regeln wird `gh pr merge --auto` nicht die gewünschte Sicherheitswirkung erzielen.
