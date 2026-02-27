# PRUEFPLAN_DOS v1.1

Dieses Dokument definiert die verbindlichen Abnahmekriterien für alle produktiven Änderungen.

## 1. Lighthouse/Performance Acceptance
Jede Route muss im Lighthouse Audit einen Score von **≥ 90** in allen Kategorien erreichen.
- **LCP:** ≤ 2.5s
- **CLS:** ≤ 0.1
- **INP:** ≤ 200ms
- **TTFB:** ≤ 600ms

## 2. Monitoring & KPI Acceptance
- **Error Rate:** < 0.5% über 24h
- **Latenz (P99):** < 500ms
- **Tracking Coverage:** 100% der im Feature-Ticket definierten Events müssen im Monitoring ankommen.

## 3. Governance Trigger
Bei folgenden Ereignissen wird automatisch ein Issue der Kategorie `Incident` oder `KPI Alert` erstellt:
- Error Rate > 1%
- LCP > 3s
- KPI unter Schwellenwert (definiert in ENV-Thresholds)
- Security Audit schlägt fehl (High/Critical)
- Gitleaks erkennt Leak
- Tracking Event fehlt bei Conversion-Feature
