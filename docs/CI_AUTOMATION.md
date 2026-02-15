# CI Automation

Workflows:
- fast-gate: quick checks on push/PR; uploads logs as artifact `ci-logs`.
- full-gate: tests/build/perf; uploads logs as artifact `ci-logs`.
- autofix: triggered by failed gate runs; uses NSCALE/DeepSeek to generate a diff-only fix; opens/updates autofix PR.
- pr-backlog-worker: processes PRs labeled `nexifyai:queue` (e.g. PR #45) and provides feedback.
- branch-maintenance: nightly creates repair PRs for existing branches and queues them.
- oracle: ensures required checks are green and blocks `needs-human`.
- automerge: auto-merges safe `autofix`/`maintenance` PRs.

Labels:
- nexifyai:queue : PR should be processed autonomously.
- needs-human : risky changes or untrusted PR; no auto-merge.
- maintenance : repair PRs from branch-maintenance.
- autofix : generated fix PRs from autofix workflow.
