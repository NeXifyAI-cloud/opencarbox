## 2025-05-15 - [Intl Formatter Caching]
**Learning:** Recreating `Intl.NumberFormat` and `Intl.DateTimeFormat` instances in every render or loop is extremely expensive. Caching these instances can lead to a ~50x performance improvement in formatting-heavy paths like product lists or dashboards.
**Action:** Always use centralized formatting utilities that implement caching for `Intl` instances, or implement a local cache if a specialized formatter is needed.
