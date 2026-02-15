# AI Autofix Policy (NSCALE + DeepSeek only)

Provider policy:
- Allowed: NSCALE and DeepSeek only.
- Forbidden: GitHub AI/Copilot.

Output policy:
- AI must output unified diff only.
- No prose in AI output.

Guards:
- Forbidden paths: prisma/migrations/**, supabase/migrations/**, .env*, .vercel/**
- No secrets/tokens may be introduced.
- No major dependency upgrades.
- Infra-only failures are not autofixed.

Merge:
- Auto-merge only for PRs labeled `autofix` or `maintenance`, trusted association, non-fork, required checks green, no `needs-human`.
