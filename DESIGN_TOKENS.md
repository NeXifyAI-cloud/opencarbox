# Design Tokens - OpenCarBox & Carvantooo

> **VERBINDLICHE DESIGN-VORGABEN (DOS v1.1)**
> Alle UI-Komponenten müssen diese Tokens verwenden. Keine One-Off Styles (G3).

## 🎨 Branding Farben (G9)

| Bereich | Marke | Primärfarbe | HSL / Hex | Verwendung |
|---------|-------|-------------|-----------|------------|
| **Shop** | Carvantooo | #FFB300 | `42 100% 50%` | CTAs, Warenkorb, Shop-Aktionen |
| **Werkstatt** | OpenCarBox | #FFA800 | `40 100% 50%` | Services, Termine, Werkstatt-Aktionen |
| **Autohandel** | OpenCarBox | #FFA800 | `40 100% 50%` | Fahrzeug-Listings, Kaufanfragen |

### Dual-Brand Isolation
- **Shop**: Verwendet ausschließlich `#FFB300` für Primär-Aktionen.
- **Werkstatt/Autohandel**: Verwendet ausschließlich `#FFA800` für Primär-Aktionen.
- **Shared**: Verwendet neutrale Farben oder markenspezifische Farben je nach Kontext-Seite.

## 📐 Grid & Spacing
- **Grid-System**: 8px Baseline Grid.
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px.

## 🔘 UI-Komponenten (G3)
- **Library**: Ausschließlich `src/components/ui` (shadcn/ui).
- **CTAs**: Maximal 3 Typen (Primary, Secondary, Ghost).
- **Radius**: Standard 8px (`--radius: 0.5rem`).

## 🖋️ Typografie
- **Headlines**: Plus Jakarta Sans (Semibold/Bold).
- **Body**: Inter (Regular/Medium).

## 🌑 Dark Mode
- Hintergrund: `--background: 222.2 84% 4.9%` (Slate 950).
- Foreground: `--foreground: 210 40% 98%` (Slate 50).
