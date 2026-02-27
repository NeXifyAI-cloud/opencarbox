## 2025-05-15 - [Intl.NumberFormat Caching]
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` is expensive. Caching these instances in a central utility provides a measurable performance boost during frequent renders, such as in product lists.
**Action:** Always use centralized, cached Intl formatters instead of local instantiations in components.
