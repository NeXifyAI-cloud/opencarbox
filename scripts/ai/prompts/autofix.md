Output ONLY a valid unified diff (git patch). No prose.

Constraints:
- Minimal fix only; address the failing checks indicated by logs.
- Do NOT change prisma/migrations/** or supabase/migrations/**.
- Do NOT modify any .env* files or introduce secrets/tokens.
- No major dependency upgrades.
- If only forbidden changes would fix it, output an empty diff.

You are given error-summary.json and log tails.
