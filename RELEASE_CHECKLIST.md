# Release Checklist

## Deployment-Tooling: Vercel CLI

- [ ] **Vor jedem geplanten Release (mind. 1x pro Monat)** prüfen, ob es eine neue stabile Vercel-CLI-Version gibt (`npm view vercel version`).
- [ ] **Nur nach erfolgreichem Testlauf in Preview** Version in `.github/workflows/auto-deploy.yml` über `env.VERCEL_CLI_VERSION` bumpen.
- [ ] **Nie `latest` verwenden**: Installationsstep muss auf `vercel@${{ env.VERCEL_CLI_VERSION }}` zeigen, damit Deployments reproduzierbar bleiben.
- [ ] **Nach dem Bump** Workflow manuell mit `workflow_dispatch` für `preview` starten und prüfen, dass im Deploy-Log die erwartete CLI-Version ausgegeben wird (`Using Vercel CLI version: ...`).
- [ ] **Produktions-Rollout** erst nach erfolgreichem Preview-Lauf freigeben.

## Bump-Prozess (wann/how)

1. Neue Zielversion festlegen (Changelog/Release Notes prüfen).
2. `VERCEL_CLI_VERSION` in `.github/workflows/auto-deploy.yml` aktualisieren.
3. Pull Request erstellen und Deploy-Log mit CLI-Version aus dem Preview-Run verlinken.
4. Nach Merge Auto-Deploy auf `main` beobachten und Version im Produktions-Deploy-Log gegenprüfen.
