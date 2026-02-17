## Summary
<!-- Describe what this PR does and why -->

## Definition of Done

### CI & Quality
- [ ] CI is green (`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` pass)
- [ ] Tests added/updated where behavior changed
- [ ] No secrets leaked in code, logs, or docs (`pnpm secret:scan` clean)

### Documentation & Ops
- [ ] NOTES updated (`runbook.md`, `brain.md`, or `backlog.md`) if applicable
- [ ] Documentation updated (`README`, `docs/`) if applicable
- [ ] DB migration / runbook updated if schema changed
- [ ] Orchestrator checked: Bei neuen/umbenannten produktiven Workflows wurde `.github/workflows/failure-orchestrator.yml` (`on.workflow_run.workflows`) in derselben PR aktualisiert

### Security & Compliance
- [ ] Branch protection contract checked (see `NOTES/runbook.md`)
- [ ] No `OPENAI_*` or forbidden provider references introduced
- [ ] UI changes include screenshot(s)
