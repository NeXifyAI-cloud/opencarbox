# QA Master Checklist (DOS v1.1)

## 🛒 Shop (Carvantooo)
- [ ] Brand Color #FFB300 wird korrekt verwendet.
- [ ] HSN/TSN-Suche liefert korrekte Ergebnisse.
- [ ] "Add to Cart" löst `add_to_cart` Event aus.
- [ ] Warenkorb-Persistenz über Session hinweg (localStorage).
- [ ] Stripe Checkout Happy Path (Test-Zahlung erfolgreich).
- [ ] Stripe Webhook aktualisiert Bestellstatus in DB.
- [ ] `purchase` Event wird nach erfolgreicher Zahlung gefeuert.
- [ ] Keine PII (Email, Name) im Tracking-Payload.

## 🔧 Werkstatt (OpenCarBox)
- [ ] Brand Color #FFA800 wird korrekt verwendet.
- [ ] Terminbuchung 5-Schritt-Flow vollständig funktional.
- [ ] Verfügbare Zeitslots werden korrekt aus DB geladen.
- [ ] `appointment_booked` Event enthält pseudonymisierte ID.
- [ ] Bestätigungs-E-Mail wird nach Buchung versendet (Staging).
- [ ] WhatsApp Opt-in wird korrekt erfasst und gespeichert.

## 🚗 Autohandel (OpenCarBox)
- [ ] Brand Color #FFA800 wird korrekt verwendet.
- [ ] Fahrzeug-Filter (Marke, Preis, Kilometer) funktionieren.
- [ ] `vehicle_inquiry` Lead-Formular validiert korrekt (Zod).
- [ ] Finanzierungsrechner rechnet korrekt gemäß Formel.
- [ ] Interne Notification bei neuer Kaufanfrage wird ausgelöst.

## 🌐 Systemweit (All)
- [ ] Alle Seiten haben eine Funnel-Zuweisung (G1).
- [ ] Preise sind mit „ab“ und MwSt-Hinweis versehen (G2).
- [ ] 0 TypeScript Errors in `src/`.
- [ ] 0 ESLint Errors in `src/`.
- [ ] Lighthouse Performance Score ≥ 90 auf Kernseiten.
- [ ] WCAG AA Kontrast-Anforderungen erfüllt.
- [ ] Keine `console.log` im Produktionscode.
