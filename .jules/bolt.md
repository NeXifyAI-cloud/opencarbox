# Bolt's Performance Journal

## 2025-05-22 - [Intl Formatting Optimization]
**Learning:** Re-instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` objects repeatedly (especially in render loops or lists) is a significant performance bottleneck. In local benchmarks, caching these formatters provided a ~79x speed improvement for instantiation and usage in a loop.
**Action:** Always use the centralized, cached formatters in `src/lib/utils.ts` instead of creating new instances locally in components.
