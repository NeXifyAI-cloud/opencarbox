# Spacing-System - OpenCarBox & Carvantooo

> **Design-System Dokumentation**
> Das 8px-Grid Spacing-System für konsistente Abstände.

**Version:** 1.0.0  
**Aktualisiert:** 2024-12-05

---

## Grundprinzip: 8px Grid

Alle Abstände basieren auf einem 8px-Raster für visuelle Konsistenz und einfache Berechnung.

---

## Spacing-Skala

| Token | Rem | Pixel | Verwendung |
|-------|-----|-------|------------|
| `space-0` | 0 | 0px | Kein Abstand |
| `space-1` | 0.25rem | 4px | Minimaler Abstand, Icon-Gaps |
| `space-2` | 0.5rem | 8px | Kompakte Elemente |
| `space-3` | 0.75rem | 12px | Input-Padding |
| `space-4` | 1rem | 16px | Standard-Gap |
| `space-5` | 1.25rem | 20px | Button-Padding |
| `space-6` | 1.5rem | 24px | Card-Padding |
| `space-8` | 2rem | 32px | Section-Gap |
| `space-10` | 2.5rem | 40px | Große Abstände |
| `space-12` | 3rem | 48px | Section-Padding |
| `space-16` | 4rem | 64px | Hero-Abstände |
| `space-20` | 5rem | 80px | Große Sections |
| `space-24` | 6rem | 96px | Section-Trennung |
| `space-32` | 8rem | 128px | Hero-Padding |

---

## CSS-Variablen

```css
:root {
  --space-0:  0;
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}
```

---

## Verwendungsrichtlinien

### Komponenten-Innenabstände (Padding)

| Komponente | Padding |
|------------|---------|
| Button (sm) | `space-2 space-3` |
| Button (md) | `space-2 space-4` |
| Button (lg) | `space-3 space-6` |
| Input | `space-2 space-3` |
| Card | `space-4` bis `space-6` |
| Modal | `space-6` |
| Container | `space-4` (mobile) / `space-8` (desktop) |

### Komponenten-Außenabstände (Gap/Margin)

| Kontext | Abstand |
|---------|---------|
| Icon zu Text | `space-2` |
| Buttons nebeneinander | `space-3` |
| Form-Fields | `space-4` |
| Cards im Grid | `space-4` bis `space-6` |
| Sections | `space-12` bis `space-24` |

### Layout-Abstände

| Element | Wert |
|---------|------|
| Header-Höhe | `space-16` (64px) |
| Footer-Padding | `space-12` |
| Container max-width | 1280px |
| Container-Padding | `space-4` (mobile) / `space-8` (desktop) |
| Section-Padding | `space-16` bis `space-24` |

---

## Tailwind-Klassen

Die Spacing-Werte sind in Tailwind verfügbar:

```html
<!-- Padding -->
<div class="p-4">16px padding</div>
<div class="px-6 py-4">24px horizontal, 16px vertical</div>

<!-- Margin -->
<div class="mt-8">32px margin-top</div>
<div class="mb-12">48px margin-bottom</div>

<!-- Gap (Flexbox/Grid) -->
<div class="flex gap-4">16px zwischen Items</div>
<div class="grid gap-6">24px Grid-Gap</div>

<!-- Space Between -->
<div class="space-y-4">16px zwischen Children</div>
```

---

## Best Practices

1. **Konsistenz:** Nutze immer die definierten Spacing-Werte
2. **Hierarchie:** Größere Abstände = wichtigere Trennung
3. **Mobile-First:** Kleinere Abstände auf Mobile, größere auf Desktop
4. **Breathing Room:** Genug Weißraum für Premium-Gefühl

---

## Beispiel: Card-Layout

```tsx
<Card className="p-6">                    {/* space-6 = 24px */}
  <CardHeader className="pb-4">           {/* space-4 = 16px */}
    <CardTitle>Titel</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">     {/* space-4 zwischen Items */}
    <p>Inhalt</p>
    <div className="flex gap-3">          {/* space-3 = 12px */}
      <Button>Aktion 1</Button>
      <Button>Aktion 2</Button>
    </div>
  </CardContent>
</Card>
```

---

**Letzte Aktualisierung:** 2024-12-05

