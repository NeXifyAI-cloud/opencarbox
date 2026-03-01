# Farbsystem - OpenCarBox & Carvantooo

> **VERBINDLICHE FARBDEFINITIONEN**
> Alle Farben müssen exakt nach diesen Vorgaben verwendet werden.

---

## 🎨 Marken-Farbzuordnung

| Marke | Bereich | Primärfarbe | Verwendung |
|-------|---------|-------------|------------|
| **Carvantooo** | Onlineshop | Gelb `#FFB300` | CTAs, Warenkorb, Aktionen |
| **OpenCarBox** | Werkstatt, Autohandel | Orange `#FFA800` | Navigation, Vertrauen, Services |

---

## 🟡 Carvantooo Gelb-Spektrum (DOS v1.1)

Für alle Shop-bezogenen Elemente, E-Commerce-Aktionen, Kauf-CTAs.

```css
/* Carvantooo Gelb-Palette */
--carvantooo-500: #FFB300;   /* ✓ PRIMARY - Hauptfarbe */
--carvantooo-600: #E6A100;   /* Hover State */
--carvantooo-700: #CC8F00;   /* Active State */
```

### Spezial-Effekte

```css
/* Glow-Effekt für CTAs */
--carvantooo-glow: rgba(255, 179, 0, 0.4);
box-shadow: 0 0 20px var(--carvantooo-glow);

/* Gradient für Buttons und Hero */
--carvantooo-gradient: linear-gradient(135deg, #FFB300 0%, #E6A100 100%);

/* Glassmorphism Background */
--carvantooo-glass: rgba(229, 62, 62, 0.1);
backdrop-filter: blur(20px);
```

### Anwendungsbeispiele

| Element | Farbe | Variable |
|---------|-------|----------|
| Primary Button | #E53E3E | `--carvantooo-500` |
| Button Hover | #C53030 | `--carvantooo-600` |
| Button Active | #9B2C2C | `--carvantooo-700` |
| Sale Badge | #FED7D7 bg, #822727 text | `--carvantooo-100`, `--carvantooo-800` |
| Error Message | #FFF5F5 bg | `--carvantooo-50` |
| Icon aktiv | #F56565 | `--carvantooo-400` |

---

## 🟠 OpenCarBox Orange-Spektrum (DOS v1.1)

Für Werkstatt-Services, Autohandel, Vertrauens-Elemente, Navigation.

```css
/* OpenCarBox Orange-Palette */
--opencarbox-500: #FFA800;   /* ✓ PRIMARY - Hauptfarbe */
--opencarbox-600: #E69700;   /* Hover State */
--opencarbox-700: #CC8600;   /* Active State */
```

### Spezial-Effekte

```css
/* Glow-Effekt */
--opencarbox-glow: rgba(255, 168, 0, 0.4);

/* Gradient */
--opencarbox-gradient: linear-gradient(135deg, #FFA800 0%, #E69700 100%);

/* Glassmorphism */
--opencarbox-glass: rgba(49, 130, 206, 0.1);
```

### Anwendungsbeispiele

| Element | Farbe | Variable |
|---------|-------|----------|
| Primary Button (Service) | #3182CE | `--opencarbox-500` |
| Navigation aktiv | #3182CE | `--opencarbox-500` |
| Link | #4299E1 | `--opencarbox-400` |
| Info Badge | #BEE3F8 bg, #2A4365 text | `--opencarbox-100`, `--opencarbox-800` |
| Service-Card Border | #90CDF4 | `--opencarbox-200` |

---

## ⚪ Neutrale Palette (Slate)

Für Text, Hintergründe, Borders - bereichsübergreifend.

```css
/* Slate Grau-Palette */
--slate-50:  #F8FAFC;   /* Page Background */
--slate-100: #F1F5F9;   /* Card Background, Secondary BG */
--slate-200: #E2E8F0;   /* Border Default */
--slate-300: #CBD5E1;   /* Border Hover */
--slate-400: #94A3B8;   /* Placeholder Text */
--slate-500: #64748B;   /* Muted Text */
--slate-600: #475569;   /* Secondary Text */
--slate-700: #334155;   /* Primary Text */
--slate-800: #1E293B;   /* Headings */
--slate-900: #0F172A;   /* Display Text, Dark Headlines */
--slate-950: #020617;   /* Dark Mode Background */
```

### Anwendungsbeispiele

| Element | Farbe | Variable |
|---------|-------|----------|
| Page Background | #F8FAFC | `--slate-50` |
| Card Background | #FFFFFF oder #F1F5F9 | `white` oder `--slate-100` |
| Border | #E2E8F0 | `--slate-200` |
| Placeholder | #94A3B8 | `--slate-400` |
| Body Text | #334155 | `--slate-700` |
| Headline | #1E293B | `--slate-800` |
| Hero Headline | #0F172A | `--slate-900` |

---

## ✅ Status-Farben

Für Feedback, Validierung, Benachrichtigungen.

```css
/* Erfolg - Grün */
--success-50:  #ECFDF5;
--success-500: #10B981;
--success-700: #047857;

/* Warnung - Amber */
--warning-50:  #FFFBEB;
--warning-500: #F59E0B;
--warning-700: #B45309;

/* Fehler - Rot */
--error-50:  #FEF2F2;
--error-500: #EF4444;
--error-700: #B91C1C;

/* Info - Blau */
--info-50:  #EFF6FF;
--info-500: #3B82F6;
--info-700: #1D4ED8;
```

### Anwendung

| Status | Hintergrund | Text/Icon | Border |
|--------|-------------|-----------|--------|
| Erfolg | `--success-50` | `--success-700` | `--success-500` |
| Warnung | `--warning-50` | `--warning-700` | `--warning-500` |
| Fehler | `--error-50` | `--error-700` | `--error-500` |
| Info | `--info-50` | `--info-700` | `--info-500` |

---

## 🌙 Dark Mode Palette

Eigenständiges Design, nicht nur invertiert.

```css
/* Dark Mode Basis */
--dark-bg-primary:   #0A0A0B;   /* Near black (nicht pure black) */
--dark-bg-secondary: #141416;   /* Cards */
--dark-bg-tertiary:  #1C1C1F;   /* Elevated Elements */
--dark-bg-hover:     #242428;   /* Hover States */

/* Dark Mode Borders */
--dark-border:       #2A2A2E;   /* Subtle borders */
--dark-border-hover: #3A3A3F;   /* Border hover */

/* Dark Mode Text */
--dark-text-primary:   #FAFAFA; /* High contrast */
--dark-text-secondary: #A1A1AA; /* Muted */
--dark-text-tertiary:  #71717A; /* Subtle */

/* Akzentfarben bleiben lebendig */
--dark-carvantooo: #F87171;     /* Lighter red for dark mode */
--dark-opencarbox: #60A5FA;     /* Lighter blue for dark mode */
```

---

## 📐 Kontrast-Anforderungen (WCAG 2.1 AA)

| Kombination | Kontrast | Status |
|-------------|----------|--------|
| `--slate-700` auf `--slate-50` | 8.5:1 | ✅ AAA |
| `--slate-600` auf `white` | 5.9:1 | ✅ AA |
| `--carvantooo-500` auf `white` | 4.5:1 | ✅ AA |
| `--opencarbox-500` auf `white` | 4.6:1 | ✅ AA |
| `--slate-400` auf `white` | 3.0:1 | ⚠️ Nur für große Texte |

---

## 🎯 60-30-10 Regel

Für ausgewogene Farbverteilung:

```
60% - Neutrale Farben (Slate)
      → Hintergründe, Text, große Flächen

30% - Sekundärfarbe (Blau für OpenCarBox, oder umgekehrt)
      → Navigation, Cards, Akzente

10% - Primärfarbe (Rot für Carvantooo CTAs)
      → Buttons, Highlights, wichtige Aktionen
```

---

## 📦 Tailwind Config Integration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        carvantooo: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E53E3E',
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
        },
        opencarbox: {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2B6CB0',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
        },
      },
    },
  },
}
```

---

**Letzte Aktualisierung:** 2024-12-05

