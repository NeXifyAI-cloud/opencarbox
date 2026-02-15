# Security

Secret hygiene:
- Never commit tokens/keys/secrets into the repository.
- Use GitHub Actions secrets and Vercel environment variables.
- `npm run security:scan-secrets` is required and runs in CI.

Rotation steps (incident response):
1) Revoke/rotate exposed token(s) at the provider.
2) Replace secrets in GitHub/Vercel.
3) If a secret was committed to git history, purge history and rotate again.
