# Required Checks Policy

Die folgenden Checks sollten als **required checks** in den GitHub-Branch-Protection-Regeln konfiguriert werden:

1. `Fast Gate`
2. `Full Gate / build`
3. `Full Gate / tests (1/2)`
4. `Full Gate / tests (2/2)`
5. `Autofix Automation / scope-guard` (für PRs mit Label `autofix`)

## Gate-Inhalte

- **Fast Gate:** Secret-Scan, Typecheck, Lint.
- **Full Gate:** Build, Tests (mit maximal einem Flake-Rerun), Performance-Budget.

## Autofix Policy

- Autofix darf nur mergen, wenn alle Required Checks auf dem PR-Head erfolgreich sind.
- Oracle/Autofix Loop-Limit: maximal 2 automatische Fix-Versuche pro SHA (`Autofix-Attempt`).
- Bei Änderungen in verbotenen Pfaden wird `needs-human` gesetzt und Auto-Merge deaktiviert.

## Security/Policy Defaults

- Keine Secrets in tracked files (nur Platzhalter/Examples).
- Keine automatischen Änderungen in `prisma/migrations` oder `supabase/migrations`.
- Keine automatischen Major-Upgrades; nur Patch/Minor in automatisierten Flows.
