# AI Autofix Policy

## Provider policy
- Only NSCALE and DeepSeek are allowed for automated fix generation.
- GitHub Copilot, GitHub Models, and any other AI provider are forbidden in autofix workflows.

## Safety boundaries
- Forbidden paths: `prisma/migrations/**`, `supabase/migrations/**`, `.env*`, and secret/token files.
- No major dependency upgrades are performed automatically.
- Autofix output must be unified diff only and applied with guardrails.

## Loop and escalation policy
- Maximum 2 autofix attempts per failing SHA.
- After the limit is reached, automation must add `needs-human` and stop.

## Auto-merge policy
Auto-merge is only allowed when all are true:
1. PR has `autofix` label.
2. PR does **not** have `needs-human` label.
3. Author association is trusted (`MEMBER`, `COLLABORATOR`, `OWNER`).
4. PR is non-fork.
5. Required checks are green.
6. Forbidden path guard passes.
