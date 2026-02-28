# PRÜFPLAN DOS v1.1

## Testing Plan Overview
Dieser Prüfplan definiert die Abnahmekriterien für alle Features und Bugfixes gemäß Definition of Success (DOS) v1.1.

### Performance Schwellenwerte
- LCP: ≤ 2.5s
- CLS: ≤ 0.1
- INP: ≤ 200ms
- TTFB: ≤ 600ms

### Release Definition of Done
- Lighthouse Score ≥ 90
- Error Rate < 0.5%
- P99 Latenz < 500ms

### Governance Trigger
- Error Rate > 1% -> Automatisches Issue
- LCP > 3s -> Automatisches Issue
- Security Audit Failure -> Block Merge
