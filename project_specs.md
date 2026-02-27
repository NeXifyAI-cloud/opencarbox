# OpenCarBox & Carvantooo - System-Spezifikation

> **GESETZBUCH** - Dieses Dokument ist die zentrale Wahrheitsquelle für das gesamte Projekt.
> Alle Entscheidungen, Implementierungen und Dokumentationen müssen hiermit konform sein.

**Version:** 1.0.0  
**Erstellt:** 2024-12-05  
**Zuletzt aktualisiert:** 2024-12-05

---

## 🎯 1. Projekt-Kern

### 1.1 Mission

Entwicklung einer hochprofessionellen Multisite E-Commerce Plattform für die OpenCarBox GmbH, die als Showcase-Projekt für Folgeaufträge dient und höchste Qualitätsstandards erfüllt.

### 1.2 Kunde

| Feld | Wert |
|------|------|
| **Firma** | OpenCarBox GmbH |
| **Geschäftsführer** | Herr Arac Metehan |
| **Adresse** | Rennweg 76, 1030 Wien, Österreich |
| **Firmenbuch-Nr.** | FN 534799 w |
| **UID-Nummer** | ATU75630015 |
| **Rechtsform** | GmbH |

### 1.3 Rechtsraum & Compliance

- **Primär:** Österreich
- **Sekundär:** Deutschland, EU
- **DSGVO:** Vollständig konform
- **Server-Standort:** EU (Vercel EU oder AWS Frankfurt)
- **Impressumspflicht:** Ja (österreichisches Recht)
- **Schreibweisen:** DIN 5008 für alle deutschen Texte

---

## 🏷️ 2. Markenarchitektur

### 2.1 Markenstruktur

```
┌─────────────────────────────────────────────────────────────┐
│                    OPENCARBOX GMBH                          │
│                   (Dachmarke/Firma)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐│
│  │                     │    │                             ││
│  │    CARVANTOOO       │    │  OPENCARBOX by Carvantooo   ││
│  │    ═══════════      │    │  ════════════════════════   ││
│  │                     │    │                             ││
│  │    Onlineshop       │    │  Werkstatt + Autohandel     ││
│  │    (Rot-Akzent)     │    │  (Blau-Akzent)              ││
│  │                     │    │                             ││
│  └─────────────────────┘    └─────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Marken-Details

| Marke | Bereich | Claim | Primärfarbe | Charakter |
|-------|---------|-------|-------------|-----------|
| **Carvantooo** | Onlineshop | "With Carvantooo Parts, Your Car Drives Better" | Rot `#FFB300` | Dynamisch, Action, E-Commerce |
| **OpenCarBox** | Werkstatt | "Weil das Auto zur Familie gehört" | Blau `#FFA800` | Vertrauen, Familie, Service |
| **OpenCarBox** | Autohandel | "Ihr Traumauto wartet" | Blau `#FFA800` | Professionell, Beratung |

### 2.3 Logo-Verwendung

- **Header:** OpenCarBox Logo (Hauptmarke) + "powered by Carvantooo" (Subline)
- **Shop-Bereich:** Carvantooo Logo prominent
- **Werkstatt/Autohandel:** OpenCarBox Logo mit "by Carvantooo" Badge
- **Footer:** Beide Logos mit Erklärung der Markenverbindung
- **Favicon:** Kombiniertes Symbol (O+C)

---

## 🎨 3. Design-System

### 3.1 Design-Philosophie

**"Automotive Premium"** - Hochwertig, technisch, aber warm und zugänglich.

**Inspirationen:**
- Porsche Design System (Präzision)
- Tesla Shop (Modernität)
- BMW Konfigurator (Premium-Feeling)
- Apple Store (Klarheit)

**Kernprinzipien:**
1. **Präzision:** Pixel-perfekte Ausrichtungen, mathematisches 8px Grid
2. **Tiefe:** Subtile Schatten, Glassmorphism, Layering
3. **Bewegung:** Purposeful Animations (nicht dekorativ)
4. **Kontrast:** Starke visuelle Hierarchie
5. **Weißraum:** Großzügig, Luxus-Gefühl

### 3.2 Farbpalette

#### Carvantooo (Shop) - Rot-Spektrum
```css
--carvantooo-50:  #FFF5F5;   /* Hintergrund subtle */
--carvantooo-100: #FED7D7;   /* Hintergrund light */
--carvantooo-200: #FEB2B2;   /* Border light */
--carvantooo-300: #FC8181;   /* Text subtle */
--carvantooo-400: #F56565;   /* Icon default */
--carvantooo-500: #FFB300;   /* ✓ Primary default */
--carvantooo-600: #C53030;   /* Primary hover */
--carvantooo-700: #9B2C2C;   /* Primary active */
--carvantooo-800: #822727;   /* Text dark */
--carvantooo-900: #63171B;   /* Text darkest */
--carvantooo-glow: rgba(229, 62, 62, 0.4);
--carvantooo-gradient: linear-gradient(135deg, #FFB300 0%, #9B2C2C 100%);
```

#### OpenCarBox (Services) - Blau-Spektrum
```css
--opencarbox-50:  #EBF8FF;
--opencarbox-100: #BEE3F8;
--opencarbox-200: #90CDF4;
--opencarbox-300: #63B3ED;
--opencarbox-400: #4299E1;
--opencarbox-500: #FFA800;   /* ✓ Primary default */
--opencarbox-600: #2B6CB0;   /* Primary hover */
--opencarbox-700: #2C5282;   /* Primary active */
--opencarbox-800: #2A4365;   /* Text dark */
--opencarbox-900: #1A365D;   /* Text darkest */
--opencarbox-glow: rgba(49, 130, 206, 0.4);
--opencarbox-gradient: linear-gradient(135deg, #FFA800 0%, #1A365D 100%);
```

#### Neutrale Palette
```css
--slate-50:  #F8FAFC;   /* Page Background */
--slate-100: #F1F5F9;   /* Card Background */
--slate-200: #E2E8F0;   /* Border */
--slate-300: #CBD5E1;   /* Border hover */
--slate-400: #94A3B8;   /* Placeholder */
--slate-500: #64748B;   /* Text muted */
--slate-600: #475569;   /* Text secondary */
--slate-700: #334155;   /* Text primary */
--slate-800: #1E293B;   /* Headings */
--slate-900: #0F172A;   /* Display text */
--slate-950: #020617;   /* Dark mode bg */
```

#### Status-Farben
```css
--success: #10B981;   /* Emerald 500 */
--warning: #F59E0B;   /* Amber 500 */
--error:   #EF4444;   /* Red 500 */
--info:    #FFA800;   /* Blue 500 */
```

### 3.3 Typografie

#### Font-Stack
```css
--font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Typografie-Skala (Fluid)
```css
--text-xs:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12-14px */
--text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);      /* 14-16px */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16-18px */
--text-lg:   clamp(1.125rem, 1rem + 0.625vw, 1.25rem);     /* 18-20px */
--text-xl:   clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);      /* 20-24px */
--text-2xl:  clamp(1.5rem, 1.25rem + 1.25vw, 2rem);        /* 24-32px */
--text-3xl:  clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);    /* 30-40px */
--text-4xl:  clamp(2.25rem, 1.75rem + 2.5vw, 3rem);        /* 36-48px */
--text-5xl:  clamp(3rem, 2rem + 5vw, 4.5rem);              /* 48-72px */
--text-hero: clamp(3.5rem, 2.5rem + 5vw, 6rem);            /* 56-96px */
```

### 3.4 Spacing-System (8px Grid)

```css
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
```

### 3.5 Breakpoints (Mobile-First)

```css
--screen-xs:  475px;   /* Large phones */
--screen-sm:  640px;   /* Small tablets */
--screen-md:  768px;   /* Tablets */
--screen-lg:  1024px;  /* Small laptops */
--screen-xl:  1280px;  /* Desktops */
--screen-2xl: 1536px;  /* Large screens */
--screen-3xl: 1920px;  /* Ultra-wide */
```

### 3.6 Schatten-System

```css
--shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-glow-red:  0 0 20px var(--carvantooo-glow);
--shadow-glow-blue: 0 0 20px var(--opencarbox-glow);
```

### 3.7 Border-Radius

```css
--radius-none: 0;
--radius-sm:   0.125rem;  /* 2px */
--radius-md:   0.375rem;  /* 6px */
--radius-lg:   0.5rem;    /* 8px */
--radius-xl:   0.75rem;   /* 12px */
--radius-2xl:  1rem;      /* 16px */
--radius-3xl:  1.5rem;    /* 24px */
--radius-full: 9999px;
```

---

## 🛠️ 4. Technologie-Stack

### 4.1 Frontend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Next.js | 14+ | Framework (App Router) |
| TypeScript | 5+ | Typisierung (strict mode) |
| Tailwind CSS | 3+ | Styling |
| shadcn/ui | Latest | UI-Komponenten-Basis |
| Radix UI | Latest | Headless Primitives |
| Framer Motion | Latest | Animationen |
| Zustand | Latest | Client State |
| TanStack Query | Latest | Server State |
| React Hook Form | Latest | Formulare |
| Zod | Latest | Validierung |

### 4.2 Backend

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Next.js API Routes | - | API Layer |
| Server Actions | - | Mutations |
| Prisma | Latest | ORM |
| Supabase | Latest | PostgreSQL + Auth + Storage |

### 4.3 Integrationen

| Integration | Zweck |
|-------------|-------|
| Stripe | Zahlungsabwicklung |
| Meilisearch | Produktsuche |
| Botpress | Chatbot |
| WhatsApp Business API | Kundenkommunikation |
| React Email + Resend | E-Mail-Versand |
| TecDoc API | HSN/TSN Fahrzeugdaten |

### 4.4 DevOps

| Tool | Zweck |
|------|-------|
| Vercel | Hosting & Deployment |
| GitHub Actions | CI/CD |
| Sentry | Error Tracking |
| Vitest | Unit Tests |
| Playwright | E2E Tests |

---

## 📁 5. Projekt-Struktur

```
opencarbox/
├── .cursorrules                    # AI-Agenten-Konfiguration (JSON)
├── .github/
│   └── workflows/
│       ├── ai-review.yml           # AI Code Review
│       ├── ci.yml                  # Continuous Integration
│       └── deploy.yml              # Deployment
├── docs/                           # System-Wiki (DIN-konform)
│   ├── architecture/               # Architektur-Dokumentation
│   │   ├── system-overview.md
│   │   ├── data-flow.md
│   │   └── diagrams/               # Mermaid Diagramme
│   ├── api/                        # API-Dokumentation
│   │   └── endpoints.md
│   ├── changelog/                  # Änderungshistorie
│   │   └── CHANGELOG.md
│   ├── components/                 # Komponenten-Dokumentation
│   │   └── index.md
│   ├── design-system/              # Design-System-Docs
│   │   ├── colors.md
│   │   ├── typography.md
│   │   ├── spacing.md
│   │   └── components.md
│   └── tasks/                      # Aufgaben-Management
│       └── master_plan.md
├── prisma/
│   ├── schema.prisma               # Datenbank-Schema
│   ├── migrations/                 # DB Migrations
│   └── seed.ts                     # Testdaten
├── public/
│   ├── fonts/                      # Custom Fonts
│   ├── images/                     # Statische Bilder
│   │   ├── logos/
│   │   ├── hero/
│   │   └── products/
│   └── icons/                      # Custom Icons
├── scripts/
│   ├── sync-docs-to-rules.ts       # Auto-Sync Docs → .cursorrules
│   └── quality-gate.ts             # Qualitäts-Checks
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (marketing)/            # Landing, About, etc.
│   │   ├── (werkstatt)/            # OpenCarBox Werkstatt
│   │   ├── (autohandel)/           # OpenCarBox Autohandel
│   │   ├── (shop)/                 # Carvantooo Shop
│   │   ├── admin/                  # Admin Panel
│   │   ├── api/                    # API Routes
│   │   ├── layout.tsx              # Root Layout
│   │   ├── page.tsx                # Homepage
│   │   └── globals.css             # Global Styles
│   ├── components/
│   │   ├── ui/                     # Basis UI (shadcn/ui)
│   │   ├── layout/                 # Header, Footer, Nav
│   │   ├── shared/                 # Übergreifende Komponenten
│   │   ├── shop/                   # Shop-spezifisch
│   │   ├── werkstatt/              # Werkstatt-spezifisch
│   │   ├── autohandel/             # Autohandel-spezifisch
│   │   └── chat/                   # Chat/WhatsApp
│   ├── hooks/                      # Custom React Hooks
│   ├── lib/                        # Utilities & Clients
│   │   ├── db.ts                   # Prisma Client
│   │   ├── stripe.ts               # Stripe Client
│   │   ├── meilisearch.ts          # Search Client
│   │   ├── whatsapp.ts             # WhatsApp API
│   │   ├── email.ts                # Email Client
│   │   ├── hsn-tsn.ts              # Fahrzeugsuche
│   │   ├── utils.ts                # Utility Functions
│   │   └── validators.ts           # Zod Schemas
│   ├── stores/                     # Zustand Stores
│   │   ├── cart.ts                 # Warenkorb
│   │   ├── garage.ts               # Meine Garage
│   │   └── ui.ts                   # UI State
│   └── types/                      # TypeScript Types
│       ├── index.ts
│       ├── product.ts
│       ├── order.ts
│       ├── vehicle.ts
│       └── service.ts
├── tests/
│   ├── unit/                       # Unit Tests
│   ├── integration/                # Integration Tests
│   └── e2e/                        # E2E Tests (Playwright)
├── .env.example                    # Umgebungsvariablen Vorlage
├── .eslintrc.json                  # ESLint Config
├── .prettierrc                     # Prettier Config
├── components.json                 # shadcn/ui Config
├── next.config.js                  # Next.js Config
├── package.json                    # Dependencies
├── postcss.config.js               # PostCSS Config
├── project_specs.md                # DIESES DOKUMENT
├── tailwind.config.ts              # Tailwind Config
├── tsconfig.json                   # TypeScript Config
└── _scaffold_log.md                # Erstellungsprotokoll
```

---

## 📋 6. Coding-Standards

### 6.1 Sprach-Konventionen

| Bereich | Sprache | Beispiel |
|---------|---------|----------|
| Variablen, Funktionen | Englisch | `getUserById()`, `isLoading` |
| Klassen, Types | Englisch | `ProductCard`, `OrderStatus` |
| Kommentare | Deutsch | `// Berechnet den Gesamtpreis inkl. MwSt.` |
| JSDoc | Deutsch | `@param preis - Der Nettopreis in Euro` |
| UI-Texte | Deutsch | "In den Warenkorb", "Jetzt buchen" |
| URLs/Slugs | Deutsch | `/werkstatt/terminbuchung`, `/produkte/bremsbelaege` |
| Dokumentation | Deutsch | Alle .md Dateien |

### 6.2 Code-Regeln

```typescript
// ✓ RICHTIG
/**
 * Berechnet den Gesamtpreis inklusive Mehrwertsteuer.
 * @param netPrice - Der Nettopreis in Euro
 * @param vatRate - Der MwSt.-Satz (Standard: 0.20 für AT)
 * @returns Der Bruttopreis in Euro
 */
export function calculateGrossPrice(netPrice: number, vatRate: number = 0.20): number {
  return netPrice * (1 + vatRate);
}

// ✗ FALSCH - Kein console.log, keine any-Types, keine fehlende Doku
export function calc(p: any) {
  console.log(p);
  return p * 1.2;
}
```

### 6.3 Komponenten-Standard

```tsx
// ✓ RICHTIG - Vollständig typisierte Komponente mit Dokumentation
import { type FC } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props für die Button-Komponente
 */
interface ButtonProps {
  /** Der anzuzeigende Text */
  children: React.ReactNode;
  /** Die Variante des Buttons */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Die Größe des Buttons */
  size?: 'sm' | 'md' | 'lg';
  /** Ist der Button deaktiviert? */
  disabled?: boolean;
  /** Click-Handler */
  onClick?: () => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Primärer Button für Aktionen.
 * Verwendet das Carvantooo Rot für Shop-Aktionen
 * und OpenCarBox Blau für Service-Aktionen.
 */
export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2',
        // Varianten...
        className
      )}
    >
      {children}
    </button>
  );
};
```

---

## 🔄 7. Workflow-Regeln

### 7.1 Vor JEDEM Task

1. **Lade Kontext:**
   - `project_specs.md` (dieses Dokument)
   - `/docs/tasks/master_plan.md`
   - `.cursorrules`

2. **Analysiere IST-Situation:**
   - Bestehender Code im betroffenen Bereich
   - Abhängigkeiten zu anderen Komponenten
   - Offene Tasks und deren Status

3. **Verstehe SOLL-Zustand:**
   - Was ist das Ziel des Tasks?
   - Welche Anforderungen müssen erfüllt werden?
   - Welche Zusammenhänge bestehen?

4. **Plane Umsetzung:**
   - Effizientester Weg
   - Wiederverwendung existierender Patterns
   - Berücksichtigung aller Vorgaben

### 7.2 Während der Umsetzung

- Strikte TypeScript-Typisierung
- Wiederverwendbare Komponenten (DRY)
- Fehler sofort fixen
- Tests schreiben
- Accessibility beachten

### 7.3 Nach JEDEM Task

1. Dokumentation in `/docs` aktualisieren
2. Changelog-Eintrag erstellen
3. Task-Status in `master_plan.md` updaten
4. `npm run sync-rules` ausführen
5. Selbst-Reflektion durchführen

---

## 🚫 8. Verbotene Praktiken

- ❌ `console.log` in Production Code
- ❌ `any` Type in TypeScript (außer absolut notwendig)
- ❌ Hardcodierte Secrets oder API-Keys
- ❌ Code ohne Dokumentation
- ❌ Komponenten ohne TypeScript Props
- ❌ Ignorieren von Linter-Fehlern
- ❌ TODOs ohne Timeline
- ❌ Rückfragen bei trivialen Entscheidungen
- ❌ Code-Duplikation
- ❌ Inline-Styles (außer dynamische Werte)

---

## 📖 9. Referenzen

- **Design System:** `/docs/design-system/`
- **API Dokumentation:** `/docs/api/`
- **Komponenten:** `/docs/components/`
- **Architektur:** `/docs/architecture/`
- **Changelog:** `/docs/changelog/CHANGELOG.md`
- **Master Plan:** `/docs/tasks/master_plan.md`

---

**Dieses Dokument ist verbindlich für alle Entwicklungsarbeiten.**

