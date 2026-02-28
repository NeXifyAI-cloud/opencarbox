# Pull Request Template

**Title Format:** `<type>(area): short description`
**type:** `feat | fix | refactor | chore | perf | docs`
**area:** `shop | werkstatt | autohandel | shared | infra`

---

## 1. Funnel-Zuordnung (G1 – Pflicht)

- [ ] Awareness
- [ ] Education
- [ ] Consideration
- [ ] Conversion
- [ ] Retention

**Begründung (1–2 Sätze):**
*Welche KPI wird direkt beeinflusst?*

---

## 2. Bereich

- [ ] shop
- [ ] werkstatt
- [ ] autohandel
- [ ] shared

---

## 3. Brand-Check (G9)

- [ ] Shop verwendet ausschließlich #FFB300
- [ ] Werkstatt/Autohandel ausschließlich #FFA800
- [ ] Keine Logoabweichungen
- [ ] Kein Farben-Mixing

---

## 4. UI-Regel (G3)

- [ ] Nur `src/components/ui` verwendet
- [ ] Keine One-Off Components
- [ ] 8px Grid eingehalten
- [ ] Max. 3 CTA-Typen

---

## 5. Tracking (G4 – Pflicht)

**Neue/Betroffene Events:**

- [ ] Event in `src/lib/events.ts` registriert
- [ ] Zod-Schema validiert
- [ ] Keine PII im Payload
- [ ] Pseudonymisierte `user_id`
- [ ] Event-Flow getestet (Preview)

**Event-Liste:**
<!-- Liste der neuen/geänderten Events hier eintragen -->

---

## 6. Security / DSGVO

- [ ] Keine neuen Secrets im Code
- [ ] RLS geprüft (falls DB)
- [ ] Stripe Webhooks validiert (falls betroffen)
- [ ] WhatsApp Opt-in korrekt umgesetzt

---

## 7. Performance

**Preview Lighthouse Score:**
LCP:
CLS:
INP:
TTFB:

- [ ] ≥ 90 Score

---

## 8. Migration / Risk

- [ ] Prisma Migration?
- [ ] Breaking Change?
- [ ] Rollback dokumentiert?
- [ ] ADR erstellt (falls Architektur betroffen)

---

## 9. CI Status

- [ ] Lint
- [ ] Typecheck
- [ ] Preflight
- [ ] AI Guard
- [ ] Security Audit
- [ ] Lighthouse CI

---

## Reviewer Check

- [ ] Screenshots beigefügt
- [ ] Funnel plausibel
- [ ] Claims Policy eingehalten
- [ ] Copy Compiler Stufen geprüft
