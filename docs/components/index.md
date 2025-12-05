# Komponenten-Bibliothek - OpenCarBox & Carvantooo

> **Komponenten-Übersicht**
> Alle verfügbaren UI-Komponenten der Plattform.

**Version:** 1.0.0  
**Aktualisiert:** 2024-12-05

---

## Verzeichnis

### Atoms (`src/components/ui/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| Button | `button.tsx` | Fertig | Primärer Aktions-Button |
| Input | `input.tsx` | Offen | Texteingabefeld |
| Badge | `badge.tsx` | Offen | Status-Anzeige |
| Avatar | `avatar.tsx` | Offen | Benutzer-/Fahrzeugbild |
| Spinner | `spinner.tsx` | Offen | Ladeindikator |
| Skeleton | `skeleton.tsx` | Offen | Lade-Platzhalter |
| Card | `card.tsx` | Offen | Container-Komponente |
| Dialog | `dialog.tsx` | Offen | Modal-Dialog |
| Select | `select.tsx` | Offen | Dropdown-Auswahl |
| Checkbox | `checkbox.tsx` | Offen | Checkbox |
| Radio | `radio.tsx` | Offen | Radio-Button |
| Tabs | `tabs.tsx` | Offen | Tab-Navigation |
| Tooltip | `tooltip.tsx` | Offen | Hover-Info |
| Toast | `toast.tsx` | Offen | Benachrichtigung |

### Molecules (`src/components/shared/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| SearchBar | `search-bar.tsx` | Offen | Suchfeld mit HSN/TSN |
| ProductCard | `product-card.tsx` | Offen | Produkt-Karte |
| ServiceCard | `service-card.tsx` | Offen | Service-Karte |
| VehicleCard | `vehicle-card.tsx` | Offen | Fahrzeug-Karte |
| PriceDisplay | `price-display.tsx` | Offen | Preisanzeige |
| FormField | `form-field.tsx` | Offen | Formularfeld |
| NavItem | `nav-item.tsx` | Offen | Navigation |
| Rating | `rating.tsx` | Offen | Sternebewertung |

### Organisms (`src/components/layout/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| Header | `header.tsx` | Offen | Haupt-Header |
| Footer | `footer.tsx` | Offen | Fußzeile |
| MobileNav | `mobile-nav.tsx` | Offen | Mobile Navigation |
| Sidebar | `sidebar.tsx` | Offen | Seitenleiste |

### Shop-spezifisch (`src/components/shop/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| ProductGrid | `product-grid.tsx` | Offen | Produkt-Raster |
| ProductFilter | `product-filter.tsx` | Offen | Filter-Panel |
| CartWidget | `cart-widget.tsx` | Offen | Mini-Warenkorb |
| CheckoutForm | `checkout-form.tsx` | Offen | Checkout |

### Werkstatt-spezifisch (`src/components/werkstatt/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| ServiceList | `service-list.tsx` | Offen | Service-Liste |
| BookingWidget | `booking-widget.tsx` | Offen | Terminbuchung |
| TimeSlotPicker | `time-slot-picker.tsx` | Offen | Zeitauswahl |

### Autohandel-spezifisch (`src/components/autohandel/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| VehicleGallery | `vehicle-gallery.tsx` | Offen | Fahrzeug-Galerie |
| FinanceCalculator | `finance-calculator.tsx` | Offen | Finanzierung |
| TestDriveForm | `test-drive-form.tsx` | Offen | Probefahrt |

### Chat (`src/components/chat/`)

| Komponente | Datei | Status | Beschreibung |
|------------|-------|--------|--------------|
| ChatWidget | `chat-widget.tsx` | Offen | Chatbot |
| WhatsAppButton | `whatsapp-button.tsx` | Offen | WhatsApp |

---

## Import-Beispiele

```tsx
// Atoms
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Molecules
import { SearchBar } from '@/components/shared/search-bar';
import { ProductCard } from '@/components/shared/product-card';

// Organisms
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Shop-spezifisch
import { ProductGrid } from '@/components/shop/product-grid';
import { CartWidget } from '@/components/shop/cart-widget';
```

---

## Entwicklungs-Richtlinien

1. **TypeScript:** Alle Props müssen typisiert sein
2. **JSDoc:** Deutsche Dokumentation für alle Props
3. **Accessibility:** WCAG 2.1 AA Compliance
4. **Responsive:** Mobile-First Design
5. **Varianten:** Carvantooo (Rot) und OpenCarBox (Blau)

---

**Letzte Aktualisierung:** 2024-12-05

