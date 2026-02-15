# Required Checks Policy

Die folgenden Checks sollten als **required checks** in den GitHub-Branch-Protection-Regeln konfiguriert werden:

1. `Fast Gate`
2. `Full Gate / build`
3. `Full Gate / tests (1/2)`
4. `Full Gate / tests (2/2)`
5. `Autofix Oracle Gatekeeper / oracle` (für PRs mit Label `autofix`)

## Autofix Policy

- Autofix darf nur mergen, wenn alle Required Checks auf dem PR-Head erfolgreich sind.
- Oracle Loop-Limit: maximal 2 automatische Fix-Versuche pro PR/SHA (`Autofix-Attempt`).
- Bei Änderungen in verbotenen Pfaden wird `needs-human` gesetzt und Auto-Merge deaktiviert.
