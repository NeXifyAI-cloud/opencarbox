# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue.**
2. Use GitHub's [private vulnerability reporting](https://github.com/NeXifyAI-cloud/opencarbox/security/advisories/new) or email the maintainers directly.
3. Include steps to reproduce the issue and any relevant context.
4. We aim to acknowledge reports within 48 hours and provide a fix timeline within 7 days.

## Secret Hygiene

- Keine echten Tokens, API Keys oder JWTs in versionierten Dateien committen (`env.example`, `docs/*`, Workflows).
- In Templates ausschließlich Platzhalter verwenden (z. B. `<SUPABASE_ACCESS_TOKEN_PLACEHOLDER>`).
- `SUPABASE_SERVICE_ROLE_KEY` darf ausschließlich serverseitig genutzt werden und nie in Client-Bundles landen.
- Vor jedem Commit lokal `pnpm secret:scan` ausführen (wird auch in CI und Husky geprüft).

## Forbidden Providers

- `OPENAI_*` environment variables are explicitly forbidden and blocked by `tools/guard_no_openai.sh`.
- Only **DeepSeek + NSCALE** AI providers are allowed (`AI_PROVIDER=deepseek`).

## Rotation Steps

Wenn ein Secret versehentlich committed wurde:

1. **Sofort revoke/rotieren** im jeweiligen Provider (Supabase/GitHub/Vercel etc.).
2. **Neue Werte setzen** in allen Environments (lokal, CI Secrets, Vercel, Staging/Prod).
3. **Offene Sessions/Tokens invalidieren** (z. B. Supabase Access Tokens und API Keys).
4. **Repository bereinigen**: Secret aus allen getrackten Dateien entfernen und Commit erstellen.
5. **Forensik/Monitoring**: Audit-Logs prüfen (ungewöhnliche API-Calls, Deploys, DB-Zugriffe).
6. **Branch Protection aktivieren**: Required checks inkl. Secret Scan als Pflicht-Status.
7. **Post-Mortem dokumentieren** inkl. Zeitpunkt, Impact und Präventionsmaßnahme.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
