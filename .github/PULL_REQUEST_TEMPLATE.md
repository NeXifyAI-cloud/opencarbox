# 🎯 OpenCarBox PR Template (DOS v1.1)

## 📋 Zusammenfassung
<!-- Kurze Beschreibung: Was wird geändert und warum? -->

## 🎯 Business Funnel & Ziel
<!-- Welcher Funnel: (shop), (werkstatt), oder (autohandel)? -->
- [ ] **Shop**: Add-to-cart, Checkout, Payment
- [ ] **Werkstatt**: Booking, Appointment, Service
- [ ] **Autohandel**: Vehicle browsing, Inquiry, Contact

## 🎨 Brand & UI
<!-- Brand-Compliance überprüft? -->
- [ ] **Shop** (#FFB300): Farben und Spacing korrekt
- [ ] **Werkstatt/Autohandel** (#FFA800): Farben und Spacing korrekt
- [ ] Responsive (Mobile ≤375px, Tablet ≤768px, Desktop ≥1024px)
- [ ] Accessibility: ARIA labels, Keyboard navigation

## 📊 Tracking & Events
<!-- Sind alle tracking events vom Funnel registriert? -->
- [ ] Events definiert in `src/lib/events.ts` (Zod schema)
- [ ] Events tracked mit eindeutigem `event_id`
- [ ] Keine PII in Events (G6: Zero information loss = nur business data)
- [ ] WhatsApp opt-in tracking (falls relevant)

## 🔒 Security & DSGVO
<!-- Sicherheitschecks bestanden? -->
- [ ] No PII leaked in logs/events
- [ ] RLS policies: lesend/schreibend korrekt
- [ ] Sensitive env vars nicht in code/docs
- [ ] Supabase Auth genutzt (nicht custom)
- [ ] DSGVO: Consent vor Tracking (G10)

## ⚡ Performance & KPIs
<!-- Performance targets gemäß DOS v1.1 -->
- [ ] **LCP** ≤ 2.5s
- [ ] **CLS** ≤ 0.1
- [ ] **INP** ≤ 200ms
- [ ] **TTFB** ≤ 600ms

## 📈 KPI Targets (per Area)
<!-- Sind die KPI-Ziele definiert? -->

### Shop
- [ ] Add-to-cart rate ≥ 8%
- [ ] Checkout conversion ≥ 35%
- [ ] Cart abandonment < 65%

### Werkstatt
- [ ] Booking rate ≥ 40%
- [ ] No-show rate ≤ 10%
- [ ] Booking abandonment ≤ 55%

### Autohandel
- [ ] Inquiry submission rate ≥ 5%
- [ ] Vehicle view to inquiry ratio ≥ 2%

## ✅ Quality Checklist

### Code Quality
- [ ] `pnpm lint` ✅ (ESLint, no warnings)
- [ ] `pnpm typecheck` ✅ (TypeScript strict, no `any`)
- [ ] `pnpm test -- --run` ✅ (Coverage ≥ 80%)
- [ ] `pnpm build` ✅ (Production build successful)

### Guardrails (G1-G10)
- [ ] **G1** - Funnel assignment: eindeutig zugeordnet
- [ ] **G2** - Claims policy: keine Überversprechen
- [ ] **G3** - UI rules: kein Inline-CSS, nur Tailwind
- [ ] **G4** - Tracking-first: Events vor Features
- [ ] **G5** - Customer data: alle PII encrypted
- [ ] **G6** - Zero information loss: nur business data tracked
- [ ] **G7** - HSN/TSN integrity: validiert für alle Autos
- [ ] **G8** - KPI monitoring: Dashboard live
- [ ] **G9** - Dual-brand enforcement: korrekte Farben/Messaging
- [ ] **G10** - DSGVO compliance: German-first, consent-driven

### CI Quality Gates
- [ ] Security Audit: 0 vulnerabilities
- [ ] Lighthouse CI: Score ≥ 90
- [ ] AI Guard: DeepSeek-only (NSCALE header)
- [ ] Preflight checks: All green

### Documentation
- [ ] README/docs aktualisiert (falls nötig)
- [ ] NOTES/runbook.md aktualisiert
- [ ] DB migrations + rollback documented (falls schema change)
- [ ] Deutsche Texte (UI), englisch Code

## 🔗 Zugehörige Issues
<!-- Verlinke Issues: Fixes #123, Closes #456 -->
- Fixes: 
- Related to:

## 🧪 Testing
<!-- Wie wurde getestet? -->
- [ ] Lokal getestet (alle Browser)
- [ ] Staging URL getestet
- [ ] E2E Tests erstellt/aktualisiert
- [ ] Performance profiling (Chrome DevTools)

## 📸 Screenshots
<!-- Falls UI-Änderungen -->

## 🔄 Abhängigkeiten
<!-- Abhängige PRs oder Issues -->

---

## Definition of Done (DoD)
✅ Dieser PR ist **produktionsreif**, wenn:
1. Alle CI checks **grün**
2. Mindestens **1 Code Review** approved
3. Akzeptanzkriterien aus linked issue **verifiziert**
4. **Keine Regressions** (pnpm test coverage ≥ 80%)
5. **DOS v1.1** Guardrails (G1-G10) erfüllt
6. **KPI-Targets** definiert und trackbar

---

**Bot Status**: OpenClaw Bot wird diese PR automatisch analysieren.  
**Reviewer**: Bitte überprüfe alle Checkboxen vor "Approve".
