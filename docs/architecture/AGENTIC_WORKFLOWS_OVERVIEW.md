# Agentic Workflows (GitHub Next) – Research Overview

## Purpose
Agentic Workflows explore **natural-language programming for GitHub Actions**. Instead of writing custom scripts against the GitHub API, repository behavior is described in Markdown and then compiled into standard GitHub Actions YAML.

This is presented by GitHub Next as a **research prototype** (not a product / technical preview), intended to test what works for practical repository automation.

## What it is
- A Markdown-based workflow definition containing:
  - `on` triggers
  - `permissions`
  - `safe-outputs`
  - declared `tools`
  - natural-language instructions for an agentic coding model
- A compile step (currently via `gh aw`) that produces normal GitHub Actions workflow YAML.
- Execution remains GitHub-native (logs, permissions, environments, controls, auditability).

## Why this matters
Agentic Workflows target tasks that are repetitive and collaborative, but not easily expressible as strict heuristics:
- issue triage
- documentation upkeep
- continuous QA and test improvement
- accessibility checks

The approach favors intent-level authoring in plain language while preserving GitHub Actions operational controls.

## Design principles highlighted by GitHub Next
- **GitHub-native execution** and observability
- **Model/coding-agent portability** (e.g., Codex, Claude Code)
- **Actions-first alignment** (repo-centric, auditable, source-controlled)
- **Composable, shareable workflow/tool components**
- **Security-first guardrails** with explicit constraints and visible artifacts
- **No hidden prompt logic**; generated YAML is inspectable

## Security posture (prototype direction)
The design emphasizes:
- least-privilege permissions
- allow-listed tools
- explicit write paths via controlled outputs (e.g., create PR)
- auditable logs and human-visible side effects
- additional checks during compilation for Actions context safety

GitHub Next also calls out ongoing work around stronger agent security controls such as proxy filtering, container configuration, and policy hooks.

## Minimal example shape
A minimal pattern used in the published examples:
1. trigger on push to `main`
2. read-only repo permissions
3. restricted safe output (e.g., one PR creation path)
4. tool allow-list (e.g., `edit`, `web-fetch`)
5. prompt describing intent and steps (analyze changes, update docs, open PR)

## Relationship to Continuous AI
Agentic Workflows are positioned as one demonstrator under the broader **Continuous AI** initiative, focused on practical, transparent, and reusable repository automation.

## References
- `github.com/github/gh-aw`
- `github.com/githubnext/agentics`
