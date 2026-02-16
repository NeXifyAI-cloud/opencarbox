# Security

## Secret Hygiene

- Keine echten Tokens, API Keys oder JWTs in versionierten Dateien committen (`env.example`, `docs/*`, Workflows).
- In Templates ausschließlich Platzhalter verwenden (z. B. `<SUPABASE_ACCESS_TOKEN_PLACEHOLDER>`).
- `SUPABASE_SERVICE_ROLE_KEY` darf ausschließlich serverseitig genutzt werden und nie in Client-Bundles landen.
- Vor jedem Commit lokal `npm run secret:scan` ausführen (wird auch in CI und Husky geprüft).

## Rotation Steps

Wenn ein Secret versehentlich committed wurde:

1. **Sofort revoke/rotieren** im jeweiligen Provider (Supabase/GitHub/Vercel etc.).
2. **Neue Werte setzen** in allen Environments (lokal, CI Secrets, Vercel, Staging/Prod).
3. **Offene Sessions/Tokens invalidieren** (z. B. Supabase Access Tokens und API Keys).
4. **Repository bereinigen**: Secret aus allen getrackten Dateien entfernen und Commit erstellen.
5. **Forensik/Monitoring**: Audit-Logs prüfen (ungewöhnliche API-Calls, Deploys, DB-Zugriffe).
6. **Branch Protection aktivieren**: Required checks inkl. Secret Scan als Pflicht-Status.
7. **Post-Mortem dokumentieren** inkl. Zeitpunkt, Impact und Präventionsmaßnahme.
