# DOS v1.1 Prüfplan & Governance

## Lighthouse / Monitoring Acceptance Block
Alle Features müssen folgende Schwellenwerte im Lighthouse Preview einhalten:
- **Lighthouse Score:** ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- **LCP (Largest Contentful Paint):** ≤ 2.5s
- **CLS (Cumulative Layout Shift):** ≤ 0.1
- **INP (Interaction to Next Paint):** ≤ 200ms
- **TTFB (Time to First Byte):** ≤ 600ms

## Governance Trigger (Automatisiert)
Ein Issue wird automatisch erzeugt, wenn:
- **Error Rate:** > 1%
- **LCP:** > 3s
- **KPI:** unter definiertem Threshold
- **Security Audit:** schlägt fehl
- **Gitleaks:** erkennt ein Leak
- **Tracking:** Event fehlt bei einem Conversion-Feature

## Monitoring / Observability
- **Error Rate:** < 0.5% (Zielwert)
- **P99 Latenz:** < 500ms
