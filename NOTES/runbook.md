# Runbook

## Local bootstrap
1. Run `bash tools/setup/00_prereq_check.sh`.
2. Export required tokens/secrets in shell.
3. Execute setup scripts in numeric order (`10` → `50`).

## API quick checks
- `curl http://localhost:3000/api/health`
- `curl -X POST http://localhost:3000/api/ai/chat -H "Authorization: Bearer <JWT>" -H "content-type: application/json" -d '{"provider":"openai_compat","messages":[{"role":"user","content":"hello"}]}'`

## Incident response
- CI red: check `ci`, `security`, and `autofix` workflows; if autofix branch exists, review and merge.
- AI provider errors: verify provider key/env vars and inspect metadata logs in `ai_logs`.
