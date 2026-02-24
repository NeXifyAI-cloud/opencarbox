# QA Master Checklist (global)

## SYSTEM
- [ ] Route Isolation korrekt
- [ ] Kein Cross-Brand Import
- [ ] No One-Off UI
- [ ] Sprachregel: Code EN / UI DE

## TRACKING
- [ ] Page Views
- [ ] CTA Clicks
- [ ] Bereichsspezifische Events
- [ ] Keine PII in Events

## PERFORMANCE
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1
- [ ] INP ≤ 200ms
- [ ] TTFB ≤ 600ms

## SECURITY
- [ ] 0 High/Critical CVEs
- [ ] Gitleaks 0 Findings
- [ ] HTTPS + CSP

## OBSERVABILITY
- [ ] Error Rate < 0.5%
- [ ] P99 < 500ms

# Bereichsspezifische E2E-Checklisten

## SHOP E2E
- [ ] HSN/TSN Suche
- [ ] Produktfilter
- [ ] add_to_cart
- [ ] begin_checkout
- [ ] purchase Webhook validiert
- [ ] Garage Speicherung isoliert

## WERKSTATT E2E
- [ ] service_view
- [ ] appointment_start
- [ ] appointment_vehicle
- [ ] appointment_slot
- [ ] appointment_booked
- [ ] Reminder Automation getestet

## AUTOHANDEL E2E
- [ ] vehicle_listing_view
- [ ] vehicle_detail_view
- [ ] financing_calculator
- [ ] vehicle_inquiry
- [ ] Lead-Benachrichtigung intern ausgelöst
