# Design Tokens (DOS v1.1)

## 🎨 Branding Colors (G9)
Die Markenfarben sind unverhandelbar und dürfen nicht vermischt werden.

| Marke | Bereich | Primärfarbe | HSL | Verwendung |
|-------|---------|-------------|-----|------------|
| **Carvantooo** | Shop | `#FFB300` | `42 100% 50%` | CTAs, Shop-Buttons, Highlights |
| **OpenCarBox** | Werkstatt & Autohandel | `#FFA800` | `40 100% 50%` | Service-Elemente, Navigation, Vertrauen |

## 📐 Grid System (G3)
- **Basis-Einheit:** 8px Grid.
- **Spacing-Scale:** Vielfache von 8px (8, 16, 24, 32, 40, 48, 64, 80, 96, 128).
- **Gaps:** Standardmäßig 16px oder 24px zwischen Elementen.

## 🔘 UI-Komponenten (G3)
- **Quelle:** Ausschließlich `src/components/ui` (shadcn/ui).
- **CTA-Typen:** Maximal 3 CTA-Typen (Primary, Secondary, Outline/Ghost).
- **Border-Radius:** Standardmäßig 8px (`rounded-lg`).

## 📱 Breakpoints
- **Mobile:** 375px
- **Tablet:** 768px
- **Desktop:** 1024px / 1280px / 1440px

## 🔍 Accessibility (WCAG AA)
- **Kontrast:** Mindestens 4.5:1 für Text.
- **Interaktion:** Alle Elemente über Tastatur erreichbar, klare Fokus-Indikatoren.
