# Operations Runbook - CI/CD Pipeline

Dieses Dokument dient als Leitfaden für den Betrieb und die Fehlerbehebung der OpenCarBox CI/CD-Pipeline.

## 1. Lokale Reproduktion der Pipeline

Um Fehler in der CI lokal zu finden, können die folgenden Befehle in der angegebenen Reihenfolge ausgeführt werden:

### Build & Tests
```bash
# 1. Abhängigkeiten installieren
pnpm i --frozen-lockfile

# 2. Prisma Client generieren
pnpm db:generate

# 3. Linting
pnpm lint

# 4. Type Check
pnpm typecheck

# 5. Unit Tests
pnpm test

# 6. Build
pnpm build
```

### Preflight Checks
```bash
npx tsx tools/preflight.ts ci
```

## 2. Monitoring & Debugging

### GitHub Actions
- Die Logs sind unter dem Tab **Actions** im GitHub Repository einsehbar.
- Bei Fehlern im `Post-Deployment Health Check`: Überprüfe die Vercel-Logs für die betroffene Deployment-URL.

### Health Endpoints
- Die Applikation stellt unter `/api/health` einen Status-Endpunkt bereit.
- Ein erfolgreicher Status gibt `HTTP 200 OK` zurück.

## 3. Fehlerbehebung & Rollback

### Automatischer Rollback (Vercel)
Die Pipeline führt automatisch einen Rollback durch, wenn der Health-Check nach einem Produktions-Deployment fehlschlägt.

### Manueller Rollback
Falls ein manueller Rollback erforderlich ist:
```bash
pnpm dlx vercel rollback --token=$VERCEL_TOKEN --yes
```
Oder über das Vercel Dashboard das gewünschte vorherige Deployment auswählen und auf "Redeploy" bzw. "Promote to Production" klicken.

### Häufige Fehler
1. **pnpm Lock-File Konflikt**: Sicherstellen, dass `pnpm-lock.yaml` aktuell ist und keine `package-lock.json` existiert.
2. **Fehlende Secrets**: Überprüfe, ob alle erforderlichen Secrets (VERCEL_TOKEN, VERCEL_PROJECT_ID, etc.) in den GitHub/GitLab Einstellungen hinterlegt sind.
3. **Datenbank-Migrationen**: Bei Fehlern im Build/Start-Prozess prüfen, ob Prisma-Migrationen erfolgreich auf die Ziel-Datenbank angewendet wurden.

## 4. Validierungskriterien für Pipeline-Änderungen
Jede Änderung an den Workflow-Dateien muss:
1. Den `lint` Job erfolgreich bestehen.
2. Erfolgreich bauen (`build`).
3. Den Health-Check im Staging-Environment bestehen.
