# DESIGN_TOKENS.md - OpenCarBox & Carvantooo

Dieses Dokument dient als zentrale Source of Truth für UI-Tokens und Design-Regeln gemäß DOS v1.1.

## 🎨 Branding & Farben (G9)

Strikte Trennung der Markenfarben. Niemals mischen.

| Marke | Bereich | Primary Color | Hex Code |
|-------|---------|---------------|----------|
| **Carvantooo** | Shop | Shop Primary | `#FFB300` |
| **OpenCarBox** | Werkstatt & Autohandel | Service Primary | `#FFA800` |

### Farbregeln
- **Shop**: Ausschließlich `#FFB300` für Primär-Aktionen und Branding.
- **Werkstatt/Autohandel**: Ausschließlich `#FFA800` für Primär-Aktionen und Branding.
- **Neutral**: Slate-Palette für Texte und Hintergründe.

## 📐 Layout & Spacing (G3)

### 8px Grid System
Alle Abstände (Margin, Padding, Gaps) müssen Vielfache von 8px sein.
- `xs`: 4px (Ausnahme für feine Justierung)
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Komponenten-Regel
- **Keine One-Off UI**: Es dürfen keine Ad-hoc-Styles oder Inline-CSS für UI-Elemente verwendet werden.
- **Source of Truth**: Ausschließlich Komponenten aus `src/components/ui` (shadcn/ui) verwenden.
- Neue UI-Muster müssen erst hier als Token definiert werden, bevor sie implementiert werden.

## 🔘 Call-to-Action (CTA) Design

Maximal 3 Typen von CTAs sind erlaubt:
1. **Primary**: Gefüllter Button in Markenfarbe.
2. **Secondary**: Outline Button in Markenfarbe oder Slate.
3. **Ghost/Link**: Text-Link oder dezentere Schaltfläche.

## 📱 Responsiveness
- Mobile-first Breakpoints (375px, 768px, 1024px, 1280px, 1440px).
- Alle UI-Elemente müssen auf allen Breakpoints geprüft sein.

## ♿ Barrierefreiheit (WCAG 2.1 AA)
- Kontrastverhältnis von mindestens 4.5:1 für Texte.
- Fokus-Zustände für alle interaktiven Elemente.
- Semantisches HTML.
