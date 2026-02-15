Output ONLY a valid unified diff (git patch). No prose.

Constraints:
- Minimal fix only (address failing checks).
- Do NOT change prisma/migrations/** or supabase/migrations/**.
- Do NOT modify any .env* files or introduce secrets.
- No major dependency upgrades.
- If only forbidden fixes would help, output an empty diff.

You will be given error-summary.json + relevant log tails.
