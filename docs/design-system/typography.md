# Typografie-System - OpenCarBox & Carvantooo

> **VERBINDLICHE TYPOGRAFIE-DEFINITIONEN**
> Alle Schriftarten, Größen und Hierarchien müssen exakt nach diesen Vorgaben verwendet werden.

---

## 🎨 Font-Stack

### Primär-Schriftarten

```css
/* Display Font - Für Headlines */
--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;

/* Body Font - Für Fließtext */
--font-body: 'Inter', system-ui, sans-serif;

/* Monospace Font - Für Preise, Nummern, Code */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font-Loading

Die Fonts werden über Next.js Font Optimization geladen:

```typescript
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-body',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-mono',
});
```

---

## 📏 Typografie-Skala (Fluid)

### Responsive Font-Größen

Alle Text-Größen verwenden `clamp()` für fluid Typography:

```css
/* Extra Small - Labels, Meta-Informationen */
--text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12-14px */

/* Small - Sekundärer Text, Captions */
--text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);      /* 14-16px */

/* Base - Body Text */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16-18px */

/* Large - Wichtige Texte */
--text-lg:   clamp(1.125rem, 1rem + 0.625vw, 1.25rem);     /* 18-20px */

/* Extra Large - Subheadings */
--text-xl:   clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);      /* 20-24px */

/* 2XL - Section Headings */
--text-2xl:  clamp(1.5rem, 1.25rem + 1.25vw, 2rem);        /* 24-32px */

/* 3XL - Page Headings */
--text-3xl:  clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);    /* 30-40px */

/* 4XL - Hero Headings */
--text-4xl:  clamp(2.25rem, 1.75rem + 2.5vw, 3rem);        /* 36-48px */

/* 5XL - Display Headings */
--text-5xl:  clamp(3rem, 2rem + 5vw, 4.5rem);              /* 48-72px */

/* Hero - Massive Headlines */
--text-hero: clamp(3.5rem, 2.5rem + 5vw, 6rem);            /* 56-96px */
```

---

## 📐 Schrift-Hierarchie

### H1 - Haupt-Überschrift

**Verwendung:** Hero-Headlines, Landing-Page Titel

```css
font-family: var(--font-display);
font-size: clamp(2.25rem, 1.75rem + 2.5vw, 3rem); /* 36-48px */
font-weight: 700;
line-height: 1.1;
letter-spacing: -0.02em;
```

**Tailwind Klasse:**
```tsx
<h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
```

### H2 - Sektionen-Überschrift

**Verwendung:** Hauptabschnitte, Feature-Überschriften

```css
font-family: var(--font-display);
font-size: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem); /* 30-40px */
font-weight: 600;
line-height: 1.2;
letter-spacing: -0.02em;
```

**Tailwind Klasse:**
```tsx
<h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
```

### H3 - Unter-Überschrift

**Verwendung:** Subsections, Card-Titel

```css
font-family: var(--font-display);
font-size: clamp(1.5rem, 1.25rem + 1.25vw, 2rem); /* 24-32px */
font-weight: 600;
line-height: 1.3;
```

**Tailwind Klasse:**
```tsx
<h3 className="text-2xl md:text-3xl font-display font-semibold">
```

### H4 - Karten-Titel

**Verwendung:** Produktnamen, Service-Namen

```css
font-family: var(--font-display);
font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); /* 20-24px */
font-weight: 600;
line-height: 1.4;
```

### Body Text

**Verwendung:** Fließtext, Beschreibungen

```css
font-family: var(--font-body);
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem); /* 16-18px */
font-weight: 400;
line-height: 1.6;
```

**Tailwind Klasse:**
```tsx
<p className="text-base font-body leading-relaxed">
```

### Small Text

**Verwendung:** Meta-Informationen, Captions, Labels

```css
font-family: var(--font-body);
font-size: clamp(0.875rem, 0.8rem + 0.375vw, 1rem); /* 14-16px */
font-weight: 400;
line-height: 1.5;
```

---

## 💰 Preis-Darstellung

Preise verwenden **JetBrains Mono** für klare, monospace Lesbarkeit:

```tsx
<span className="font-mono text-2xl font-bold text-slate-900">
  {formatPrice(price)}
</span>
```

**Formatierungsfunktion:**
```typescript
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}
```

**Beispiel:** `€ 129,90` oder `129,90 €`

---

## 📊 Letter Spacing

### Überschriften

- **Tighter:** `-0.03em` - Für sehr große Headlines
- **Tight:** `-0.02em` - Standard für H1-H3
- **Normal:** `0em` - Für Body Text

### Body Text

- **Normal:** `0em` - Standard
- **Wide:** `0.02em` - Für kleine Caps
- **Wider:** `0.05em` - Für Labels

---

## ⚖️ Line Height

### Überschriften

- **H1-H2:** `1.0 - 1.2` (tight, kompakt)
- **H3-H4:** `1.3 - 1.4` (moderat)

### Body Text

- **Standard:** `1.6` (relaxed, gute Lesbarkeit)
- **Komprimiert:** `1.5` (für Listen, Tabellen)
- **Weit:** `1.8` (für lange Artikel)

---

## 🎯 Font Weights

| Gewicht | Wert | Verwendung |
|---------|------|------------|
| **Thin** | 100 | Nicht verwendet |
| **Light** | 300 | Subtile Akzente |
| **Regular** | 400 | Body Text (Standard) |
| **Medium** | 500 | Betonungen, Links |
| **Semibold** | 600 | Headings H2-H4 |
| **Bold** | 700 | H1, CTAs, wichtige Betonungen |
| **Extra Bold** | 800 | Display Text |

---

## 📱 Responsive Typography

### Mobile-First Ansatz

Alle Text-Größen skalieren automatisch basierend auf Viewport-Breite:

```tsx
// Mobile: 36px, Desktop: 48px
<h1 className="text-4xl md:text-5xl">

// Mobile: 24px, Desktop: 32px
<h2 className="text-2xl md:text-3xl">

// Mobile: 16px, Desktop: 18px
<p className="text-base md:text-lg">
```

### Breakpoint-basierte Anpassungen

```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
```

---

## 🌐 Mehrsprachigkeit

### Unterstützte Sprachen

- **Deutsch (primär)** - Vollständig unterstützt
- **Österreichische Varianten** - DIN 5008 konform
- **Englisch (optional)** - Für internationale Kunden

### Character-Sets

- **Latin:** Standard-Zeichen
- **Latin Extended:** Ä, Ö, Ü, ß, etc.

---

## ✅ Best Practices

### ✅ DO

- Verwende `font-display` für Headlines
- Verwende `font-body` für Fließtext
- Verwende `font-mono` für Preise und Nummern
- Nutze fluid Typography mit `clamp()`
- Achte auf ausreichenden Zeilenabstand (min. 1.5)

### ❌ DON'T

- Keine festen Pixel-Größen ohne `clamp()`
- Kein Mixing von Font-Familien ohne Grund
- Keine zu engen Line-Heights (< 1.3)
- Keine zu dünnen Font-Weights (< 300)

---

## 📦 Tailwind Utilities

### Vordefinierte Klassen

```tsx
// Headlines
<h1 className="text-hero font-display font-bold">Hero Headline</h1>
<h2 className="text-4xl font-display font-semibold">Section</h2>

// Body
<p className="text-base font-body">Fließtext</p>

// Preise
<span className="text-2xl font-mono font-bold">€ 129,90</span>

// Responsive
<h1 className="text-3xl md:text-4xl lg:text-5xl">
```

---

**Letzte Aktualisierung:** 2024-12-05

