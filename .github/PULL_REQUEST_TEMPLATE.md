## Summary

<!-- Kurze Beschreibung der Änderung und Motivation -->

## Checklist

### CI & Quality
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass locally
- [ ] CI checks are green (ci / quick-checks, ci / test-and-build)
- [ ] Tests added/updated where behavior changed

### Documentation & Operations
- [ ] NOTES updated (`runbook.md`, `brain.md`, `backlog.md`) if relevant
- [ ] Documentation updated (`README`, `docs/`) if relevant
- [ ] Migrations included and runbook updated if database schema changed

### Security & Secrets
- [ ] No secrets added to code, logs, or docs
- [ ] `pnpm secret:scan` passes
- [ ] OPENAI_* / forbidden provider references not introduced

### Deployment & Release
- [ ] UI changes include screenshot(s)
- [ ] DB migration / rollback runbook updated if relevant
- [ ] Vercel Preview deployment verified (if applicable)

### Orchestrator & Workflows
- [ ] Bei neuen/umbenannten produktiven Workflows wurde `.github/workflows/failure-orchestrator.yml` (`on.workflow_run.workflows`) in derselben PR aktualisiert
- [ ] Branch protection contract checked (see NOTES/runbook.md)

### Definition of Done
- [ ] All CI checks green
- [ ] Code review approved (min 1 reviewer)
- [ ] Acceptance criteria from linked issue verified
- [ ] No regressions introduced
