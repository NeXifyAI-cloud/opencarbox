# Komponenten-Dokumentation - OpenCarBox & Carvantooo

> **Design-System Dokumentation**
> Übersicht aller UI-Komponenten und deren Verwendung.

**Version:** 1.0.0  
**Aktualisiert:** 2024-12-05

---

## Komponenten-Hierarchie (Atomic Design)

```
Atoms → Molecules → Organisms → Templates → Pages
```

---

## Atoms (Basis-Komponenten)

### Button

Primärer Interaktions-Button mit mehreren Varianten.

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'carvantooo' \| 'opencarbox'` | `'default'` | Visuelle Variante |
| `size` | `'default' \| 'sm' \| 'lg' \| 'xl' \| 'icon'` | `'default'` | Größe |
| `isLoading` | `boolean` | `false` | Ladezustand |
| `leftIcon` | `ReactNode` | - | Icon links |
| `rightIcon` | `ReactNode` | - | Icon rechts |

```tsx
<Button variant="carvantooo" size="lg">
  In den Warenkorb
</Button>

<Button variant="opencarbox" isLoading>
  Termin buchen
</Button>
```

### Input

Texteingabefeld mit Label und Fehlerbehandlung.

| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `label` | `string` | Beschriftung |
| `error` | `string` | Fehlermeldung |
| `helperText` | `string` | Hilfstext |

### Badge

Status- und Kategorie-Anzeige.

| Variant | Verwendung |
|---------|------------|
| `default` | Standard |
| `success` | Erfolg, Verfügbar |
| `warning` | Warnung, Wenige |
| `error` | Fehler, Ausverkauft |
| `carvantooo` | Shop-Kontext |
| `opencarbox` | Service-Kontext |

### Avatar

Benutzer- oder Fahrzeug-Bild.

### Spinner

Ladeindikator.

### Skeleton

Platzhalter während des Ladens.

---

## Molecules (Zusammengesetzte Komponenten)

### SearchBar

Suchfeld mit HSN/TSN-Unterstützung.

```tsx
<SearchBar 
  placeholder="Suche nach Ersatzteilen..."
  onSearch={handleSearch}
  showHsnTsn
/>
```

### ProductCard

Produktdarstellung im Grid.

```tsx
<ProductCard
  product={product}
  onAddToCart={handleAdd}
  showCompatibility
/>
```

### ServiceCard

Werkstatt-Service-Darstellung.

### VehicleCard

Fahrzeug-Darstellung (Autohandel).

### PriceDisplay

Preisanzeige mit Währung und UVP.

```tsx
<PriceDisplay
  price={49.99}
  originalPrice={69.99}
  currency="EUR"
/>
```

### FormField

Label + Input + Error kombiniert.

### NavItem

Navigations-Element.

### Rating

Sternebewertung.

---

## Organisms (Komplexe Komponenten)

### Header

Haupt-Navigation mit Marken-Switching.

- Logo (OpenCarBox / Carvantooo je nach Bereich)
- Hauptnavigation
- Suche
- Warenkorb
- Benutzer-Menu

### Footer

Fußzeile mit Links und Kontakt.

### ProductGrid

Produkt-Raster mit Filter und Sortierung.

### ServiceList

Liste der Werkstatt-Services.

### VehicleGallery

Fahrzeug-Bildergalerie mit Zoom.

### ChatWidget

Chatbot-Integration (Botpress).

### BookingWidget

Termin-Buchungsformular.

### VehicleFinder

HSN/TSN-Fahrzeugsuche mit Autocomplete.

```tsx
<VehicleFinder
  onVehicleSelect={handleSelect}
  showSaveToGarage
/>
```

---

## Marken-spezifische Varianten

### Carvantooo (Shop)

- Primärfarbe: Rot (#E53E3E)
- Button-Variante: `variant="carvantooo"`
- Energetisch, Action-orientiert

### OpenCarBox (Services)

- Primärfarbe: Blau (#3182CE)
- Button-Variante: `variant="opencarbox"`
- Vertrauenswürdig, professionell

---

## Verwendungsbeispiele

### Shop-Seite

```tsx
<div className="container">
  <Header variant="shop" />
  
  <main className="py-12">
    <VehicleFinder onVehicleSelect={setVehicle} />
    
    <ProductGrid
      products={products}
      filters={filters}
      onFilterChange={setFilters}
    />
  </main>
  
  <Footer />
</div>
```

### Werkstatt-Seite

```tsx
<div className="container">
  <Header variant="werkstatt" />
  
  <main className="py-12">
    <ServiceList services={services} />
    <BookingWidget serviceId={selectedService} />
  </main>
  
  <Footer />
</div>
```

---

## Accessibility

Alle Komponenten erfüllen WCAG 2.1 AA:

- Tastatur-Navigation
- Screen-Reader-Support
- Ausreichender Kontrast
- Fokus-Indikatoren

---

**Letzte Aktualisierung:** 2024-12-05

