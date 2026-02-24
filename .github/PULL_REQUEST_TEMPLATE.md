# Pull Request

## Funnel-Zuordnung (G1 – Pflicht)
- [ ] Awareness
- [ ] Education
- [ ] Consideration
- [ ] Conversion
- [ ] Retention

**Begründung (1–2 Sätze):**
Welche KPI wird direkt beeinflusst?

## Bereich
- [ ] (shop)
- [ ] (werkstatt)
- [ ] (autohandel)
- [ ] shared

## Brand-Check (G9)
- [ ] Shop verwendet ausschließlich #FFB300
- [ ] Werkstatt/Autohandel ausschließlich #FFA800
- [ ] Keine Logoabweichungen
- [ ] Kein Farben-Mixing

## UI-Regel (G3)
- [ ] Nur src/components/ui verwendet
- [ ] Keine One-Off Components
- [ ] 8px Grid eingehalten
- [ ] Max. 3 CTA-Typen

## Tracking (G4 – Pflicht)
**Neue/Betroffene Events:**
- [ ] Event in src/lib/events.ts registriert
- [ ] Zod-Schema validiert
- [ ] Keine PII im Payload
- [ ] Pseudonymisierte user_id
- [ ] Event-Flow getestet (Preview)

**Event-Liste:**

## Security / DSGVO
- [ ] Keine neuen Secrets im Code
- [ ] RLS geprüft (falls DB)
- [ ] Stripe Webhooks validiert (falls betroffen)
- [ ] WhatsApp Opt-in korrekt umgesetzt

## Performance
**Preview Lighthouse Score:**
LCP:
CLS:
INP:
TTFB:
- [ ] ≥ 90 Score

## Migration / Risk
- [ ] Prisma Migration?
- [ ] Breaking Change?
- [ ] Rollback dokumentiert?
- [ ] ADR erstellt (falls Architektur betroffen)

## CI Status
- [ ] Lint
- [ ] Typecheck
- [ ] Preflight
- [ ] AI Guard
- [ ] Security Audit
- [ ] Lighthouse CI

## Reviewer Check
- [ ] Screenshots beigefügt
- [ ] Funnel plausibel
- [ ] Claims Policy eingehalten
- [ ] Copy Compiler Stufen geprüft
