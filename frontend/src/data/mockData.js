// Carvatoo & OpenCarBox - Premium Mock-Daten
// "Weil dein Auto zur Familie gehört."

// High-Quality Automotive Images (Unsplash)
const images = {
  hero_parts: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1200',
  hero_workshop: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
  hero_car: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=1200',
  
  // Categories
  cat_brakes: 'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&q=80&w=400',
  cat_oil: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?auto=format&fit=crop&q=80&w=400',
  cat_battery: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
  cat_tires: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400',
  cat_tools: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400',
  cat_care: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=400',

  // Products
  prod_brake_disc: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
  prod_oil: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?auto=format&fit=crop&q=80&w=400',
};

export const categories = [
  {
    id: 'ersatzteile',
    name: 'Ersatz- und Verschleißteile',
    icon: 'Settings',
    image: images.cat_brakes,
    subcategories: [
      { id: 'bremsanlage', name: 'Bremsanlage', count: 15420 },
      { id: 'abgasanlage', name: 'Abgasanlage', count: 8930 },
      { id: 'filter', name: 'Filter', count: 12450 },
      { id: 'stossdaempfer', name: 'Stoßdämpfer', count: 6780 },
    ]
  },
  {
    id: 'reifen',
    name: 'Reifen & Felgen',
    icon: 'Circle',
    image: images.cat_tires,
    subcategories: [
      { id: 'sommerreifen', name: 'Sommerreifen', count: 8900 },
      { id: 'winterreifen', name: 'Winterreifen', count: 7650 },
    ]
  },
  {
    id: 'oele',
    name: 'Öle & Schmierstoffe',
    icon: 'Droplet',
    image: images.cat_oil,
    subcategories: [
      { id: 'motoroel', name: 'Motoröl', count: 3450 },
      { id: 'getriebeoel', name: 'Getriebeöl', count: 1230 },
    ]
  },
  {
    id: 'batterien',
    name: 'Batterien & Ladegeräte',
    icon: 'Battery',
    image: images.cat_battery,
    subcategories: [
      { id: 'autobatterien', name: 'Autobatterien', count: 2340 },
    ]
  },
  {
    id: 'werkzeug',
    name: 'Werkzeuge',
    icon: 'Hammer',
    image: images.cat_tools,
    subcategories: [
      { id: 'handwerkzeug', name: 'Handwerkzeug', count: 5670 },
    ]
  },
  {
    id: 'pflege',
    name: 'Pflege & Reinigung',
    icon: 'Sparkles',
    image: images.cat_care,
    subcategories: [
      { id: 'autopflege', name: 'Autopflege', count: 4560 },
    ]
  }
];

export const featuredProducts = [
  {
    id: 1,
    name: 'BOSCH Bremsscheiben Set Vorderachse',
    brand: 'BOSCH',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: images.prod_brake_disc,
    rating: 4.8,
    reviews: 234,
    inStock: true,
    category: 'Bremsanlage'
  },
  {
    id: 2,
    name: 'LIQUI MOLY 5W-30 Motoröl 5L',
    brand: 'LIQUI MOLY',
    price: 42.99,
    originalPrice: 59.99,
    discount: 28,
    image: images.prod_oil,
    rating: 4.7,
    reviews: 891,
    inStock: true,
    category: 'Öle'
  },
  // ... more products can be added here
];

export const bannerSlides = [
  {
    id: 1,
    title: 'Bis zu 50% sparen',
    subtitle: 'auf Bremsanlagen',
    image: images.hero_parts,
    buttonText: 'Jetzt entdecken',
    link: '/kategorie/ersatzteile'
  },
  {
    id: 2,
    title: 'Profi-Werkstatt',
    subtitle: 'Wir kümmern uns um Ihr Auto',
    image: images.hero_workshop,
    buttonText: 'Termin buchen',
    link: '/werkstatt'
  },
  {
    id: 3,
    title: 'Traumauto finden',
    subtitle: 'Geprüfte Gebrauchtwagen',
    image: images.hero_car,
    buttonText: 'Fahrzeuge ansehen',
    link: '/fahrzeuge'
  },
];

// Service-Bereiche für OpenCarBox (Multi-Site Concept)
export const serviceAreas = [
  {
    id: 'shop',
    title: 'Carvatoo Shop',
    description: 'Premium Autoteile mit HSN/TSN-Suche',
    icon: 'ShoppingCart',
    color: 'carvantooo',
    features: ['Über 1 Mio. Teile', '24h Express', 'Bestpreis Garantie'],
    href: '/'
  },
  {

export const vehicleTypes = [
  { id: 'alle', name: 'Alle', icon: 'LayoutGrid' },
  { id: 'auto', name: 'Auto', icon: 'Car' },
  { id: 'eauto', name: 'E-Auto', icon: 'Zap' },
  { id: 'motorrad', name: 'Motorrad', icon: 'Bike' },
  { id: 'transporter', name: 'Transporter', icon: 'Truck' },
];

export const manufacturers = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Ford', 
  'Škoda', 'SEAT', 'Toyota', 'Hyundai', 'Renault', 'Peugeot',
  'Fiat', 'Mazda', 'Honda', 'Nissan', 'Kia', 'Volvo', 'Porsche', 'Mini'
];

export const sidebarCategories = [
  'Startseite',
  'Abgasanlage',
  'Bremsanlage',
  'Elektrik',
  'Filter',
  'Karosserie',
  'Motor',
  'Stoßdämpfer',
  'Zündung',
];

    id: 'werkstatt',
    title: 'OpenCarBox Werkstatt',
    description: 'Meisterbetrieb für Inspektion & Reparatur',
    icon: 'Wrench',
    color: 'opencarbox',
    features: ['Online-Terminbuchung', 'Faire Preise', 'Herstellervorgaben'],
    href: '/werkstatt'
  },
  {
    id: 'autohandel',
    title: 'OpenCarBox Autohandel',
    description: 'Geprüfte Gebraucht- und Neuwagen',
    icon: 'Car',
    color: 'opencarbox',
    features: ['Geprüfte Qualität', 'Finanzierung möglich', 'Inzahlungnahme'],
    href: '/fahrzeuge'
  }
];
