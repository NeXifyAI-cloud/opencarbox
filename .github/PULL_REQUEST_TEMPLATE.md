## Summary


## Definition of Done

### CI & Quality
- [ ] CI is green (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` pass)
- [ ] `pnpm env:check` passes (env schema valid, no forbidden providers)
- [ ] Tests added/updated where behavior changed
- [ ] No secrets leaked in code, logs, or docs (`pnpm secret:scan` clean)

### Documentation & Ops
- [ ] NOTES updated (`runbook.md`, `brain.md`, or `backlog.md`) if applicable
- [ ] Documentation updated (`README`, `docs/`) if applicable
- [ ] DB migration / runbook updated if schema changed
- [ ] Orchestrator updated: For new/renamed production workflows, `.github/workflows/failure-orchestrator.yml` (`on.workflow_run.workflows`) updated in same PR

### UI
- [ ] UI changes include screenshot(s)
