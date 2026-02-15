Output ONLY a valid unified diff (git patch). No prose.

Constraints:
- Minimal fix only; address the failing checks from logs.
- Do NOT change prisma/migrations/** or supabase/migrations/**.
- Do NOT modify any .env* files or introduce secrets/tokens.
- No major dependency upgrades.
- If only forbidden changes would fix it, output an empty diff.
