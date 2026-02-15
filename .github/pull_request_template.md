## Checklist
- [ ] `npm run security:scan-secrets`
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm run test -- --run` (falls vorhanden)
- [ ] `npm run build`
- [ ] Perf-Budget ok (falls aktiv)

## Notes
- Risky paths (migrations/env/vercel) require `needs-human`.
