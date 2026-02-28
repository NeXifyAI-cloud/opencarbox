## 2025-05-15 - [Intl Formatter Caching]
**Learning:** Recreating `Intl.NumberFormat` and `Intl.DateTimeFormat` instances in every render or loop is extremely expensive. Caching these instances can lead to a ~50x performance improvement in formatting-heavy paths like product lists or dashboards.
**Action:** Always use centralized formatting utilities that implement caching for `Intl` instances, or implement a local cache if a specialized formatter is needed.

## 2025-05-15 - [Safety Boundaries and Scope Control]
**Learning:** Adding unrelated dependencies or modifying core configuration files (package.json, tsconfig.json) during a performance optimization task violates safety boundaries and makes PRs harder to review. Even if meant well for testing purposes, these changes must be explicitly requested or avoided.
**Action:** Stick strictly to the "Never do" and "Ask first" boundaries. Use existing project tools for verification or perform temporary tests without committing environmental changes.
