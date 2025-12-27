// Carvatoo - Premium Mock-Daten
// "Weil dein Auto zur Familie gehört."

// Updated with Unsplash images (Fixed: Pexels links were broken)
const productImages = {
  bremsscheibe: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  oelfilter: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=400&h=400&fit=crop',
  motoroel: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=400&h=400&fit=crop',
  batterie: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
  werkzeug: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop',
  reifen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  stossdaempfer: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  bremsen: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
};

// Kategorie-Bilder (Updated with Unsplash)
const categoryImages = {
  ersatzteile: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  reifen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  batterien: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
  oele: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=400&h=400&fit=crop',
  pflege: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop',
  zubehoer: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop',
  saison: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  lampen: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=400&fit=crop',
  dachboxen: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=400&fit=crop',
  tuning: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop',
  werkzeug: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop',
};

// Hero-Banner Bilder (Updated with Unsplash)
const heroImages = {
  slide1: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop',
  slide2: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=600&fit=crop',
  slide3: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
};

export const categories = [
  {
    id: 'ersatzteile',
    name: 'Ersatz- und Verschleißteile',
    icon: 'Settings',
    image: categoryImages.ersatzteile,
    subcategories: [
      { id: 'bremsanlage', name: 'Bremsanlage', count: 15420 },
      { id: 'abgasanlage', name: 'Abgasanlage', count: 8930 },
      { id: 'filter', name: 'Filter', count: 12450 },
      { id: 'stossdaempfer', name: 'Stoßdämpfer', count: 6780 },
      { id: 'kuehlung', name: 'Kühlung', count: 9340 },
      { id: 'zuendung', name: 'Zündung', count: 7890 },
      { id: 'lenkung', name: 'Lenkung', count: 5670 },
      { id: 'kupplung', name: 'Kupplung', count: 4320 },
    ]
  },
  {
    id: 'reifen',
    name: 'Reifen & Felgen',
    icon: 'Circle',
    image: categoryImages.reifen,
    subcategories: [
      { id: 'sommerreifen', name: 'Sommerreifen', count: 8900 },
      { id: 'winterreifen', name: 'Winterreifen', count: 7650 },
      { id: 'ganzjahresreifen', name: 'Ganzjahresreifen', count: 4320 },
      { id: 'felgen', name: 'Felgen', count: 12340 },
      { id: 'komplettraeder', name: 'Kompletträder', count: 3450 },
    ]
  },
  {
    id: 'batterien',
    name: 'Batterien & Ladegeräte',
    icon: 'Battery',
    image: categoryImages.batterien,
    subcategories: [
      { id: 'autobatterien', name: 'Autobatterien', count: 2340 },
      { id: 'ladegeraete', name: 'Ladegeräte', count: 890 },
      { id: 'starthilfe', name: 'Starthilfe', count: 450 },
    ]
  },
  {
    id: 'oele',
    name: 'Öle & Schmierstoffe',
    icon: 'Droplet',
    image: categoryImages.oele,
    subcategories: [
      { id: 'motoroel', name: 'Motoröl', count: 3450 },
      { id: 'getriebeoel', name: 'Getriebeöl', count: 1230 },
      { id: 'bremsfl', name: 'Bremsflüssigkeit', count: 890 },
      { id: 'additive', name: 'Additive', count: 2340 },
    ]
  },
  {
    id: 'pflege',
    name: 'Pflege & Reinigung',
    icon: 'Sparkles',
    image: categoryImages.pflege,
    subcategories: [
      { id: 'autopflege', name: 'Autopflege', count: 4560 },
      { id: 'lackpflege', name: 'Lackpflege', count: 2340 },
      { id: 'innenraumpflege', name: 'Innenraumpflege', count: 1890 },
      { id: 'glasreiniger', name: 'Glasreiniger', count: 780 },
    ]
  },
  {
    id: 'zubehoer',
    name: 'Zubehör & Pannenhilfe',
    icon: 'Wrench',
    image: categoryImages.zubehoer,
    subcategories: [
      { id: 'warndreieck', name: 'Warndreieck & Warnweste', count: 340 },
      { id: 'verbandskasten', name: 'Verbandskasten', count: 120 },
      { id: 'abschleppseil', name: 'Abschleppseil', count: 89 },
      { id: 'pannenhilfe', name: 'Pannenhilfe-Sets', count: 230 },
    ]
  },
  {
    id: 'werkzeug',
    name: 'Werkzeuge',
    icon: 'Hammer',
    image: categoryImages.werkzeug,
    subcategories: [
      { id: 'handwerkzeug', name: 'Handwerkzeug', count: 5670 },
      { id: 'wagenheber', name: 'Wagenheber', count: 340 },
      { id: 'diagnose', name: 'Diagnosegeräte', count: 890 },
    ]
  },
  {
    id: 'lampen',
    name: 'Glühlampen & Leuchten',
    icon: 'Lightbulb',
    image: categoryImages.lampen,
    subcategories: [
      { id: 'scheinwerfer', name: 'Scheinwerferlampen', count: 2340 },
      { id: 'rueckleuchten', name: 'Rückleuchten', count: 1890 },
      { id: 'led', name: 'LED-Beleuchtung', count: 3450 },
    ]
  },
];

export const carBrands = [
  { id: 'audi', name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo.png' },
  { id: 'bmw', name: 'BMW', logo: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
  { id: 'vw', name: 'Volkswagen', logo: 'https://www.carlogos.org/car-logos/volkswagen-logo.png' },
  { id: 'opel', name: 'Opel', logo: 'https://www.carlogos.org/car-logos/opel-logo.png' },
  { id: 'ford', name: 'Ford', logo: 'https://www.carlogos.org/car-logos/ford-logo.png' },
  { id: 'skoda', name: 'Škoda', logo: 'https://www.carlogos.org/car-logos/skoda-logo.png' },
  { id: 'seat', name: 'SEAT', logo: 'https://www.carlogos.org/car-logos/seat-logo.png' },
  { id: 'toyota', name: 'Toyota', logo: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
  { id: 'hyundai', name: 'Hyundai', logo: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
  { id: 'renault', name: 'Renault', logo: 'https://www.carlogos.org/car-logos/renault-logo.png' },
  { id: 'peugeot', name: 'Peugeot', logo: 'https://www.carlogos.org/car-logos/peugeot-logo.png' },
];

export const topBrands = [
  { id: 'bosch', name: 'BOSCH' },
  { id: 'ate', name: 'ATE' },
  { id: 'brembo', name: 'Brembo' },
  { id: 'mann', name: 'MANN-FILTER' },
  { id: 'liquimoly', name: 'LIQUI MOLY' },
  { id: 'skf', name: 'SKF' },
  { id: 'luk', name: 'LuK' },
  { id: 'valeo', name: 'Valeo' },
];

export const featuredProducts = [
  {
    id: 1,
    name: 'BOSCH Bremsscheiben Set Vorderachse',
    brand: 'BOSCH',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: productImages.bremsscheibe,
    rating: 4.8,
    reviews: 234,
    inStock: true,
    category: 'Bremsanlage'
  },
  {
    id: 2,
    name: 'MANN-FILTER Ölfilter W 712/95',
    brand: 'MANN-FILTER',
    price: 12.49,
    originalPrice: 18.99,
    discount: 34,
    image: productImages.oelfilter,
    rating: 4.9,
    reviews: 567,
    inStock: true,
    category: 'Filter'
  },
  {
    id: 3,
    name: 'LIQUI MOLY 5W-30 Motoröl 5L',
    brand: 'LIQUI MOLY',
    price: 42.99,
    originalPrice: 59.99,
    discount: 28,
    image: productImages.motoroel,
    rating: 4.7,
    reviews: 891,
    inStock: true,
    category: 'Öle'
  },
  {
    id: 4,
    name: 'BREMBO Bremsbeläge Set Premium',
    brand: 'BREMBO',
    price: 54.99,
    originalPrice: 79.99,
    discount: 31,
    image: productImages.bremsen,
    rating: 4.8,
    reviews: 345,
    inStock: true,
    category: 'Bremsanlage'
  },
  {
    id: 5,
    name: 'SKF Radlager Kit Hinterachse',
    brand: 'SKF',
    price: 67.99,
    originalPrice: 99.99,
    discount: 32,
    image: productImages.stossdaempfer,
    rating: 4.6,
    reviews: 178,
    inStock: true,
    category: 'Radlager'
  },
  {
    id: 6,
    name: 'VARTA Blue Dynamic Autobatterie 60Ah',
    brand: 'VARTA',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    image: productImages.batterie,
    rating: 4.9,
    reviews: 432,
    inStock: true,
    category: 'Batterien'
  },
];

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

export const benefits = [
  {
    icon: 'Users',
    title: 'Über 3 Millionen',
    subtitle: 'zufriedene Kunden'
  },
  {
    icon: 'Package',
    title: 'Riesenauswahl',
    subtitle: '3 Millionen+ Teile'
  },
  {
    icon: 'Truck',
    title: 'Blitzschnell',
    subtitle: 'Bestellung bis 15 Uhr'
  },
  {
    icon: 'RotateCcw',
    title: '30 Tage',
    subtitle: 'Rückgaberecht'
  },
  {
    icon: 'Shield',
    title: 'Garantie',
    subtitle: 'auf alle Produkte'
  },
];

export const bannerSlides = [
  {
    id: 1,
    title: 'Bis zu 50% sparen',
    subtitle: 'auf Bremsanlagen',
    image: heroImages.slide1,
    buttonText: 'Jetzt entdecken',
    link: '/kategorie/ersatzteile'
  },
  {
    id: 2,
    title: 'Profi-Werkzeuge',
    subtitle: 'für Ihre Werkstatt',
    image: heroImages.slide2,
    buttonText: 'Zum Sortiment',
    link: '/kategorie/werkzeug'
  },
  {
    id: 3,
    title: 'Wintercheck',
    subtitle: 'Jetzt Reifen wechseln',
    image: heroImages.slide3,
    buttonText: 'Reifen finden',
    link: '/kategorie/reifen'
  },
];

export const sidebarCategories = [
  'Startseite',
  'Abgasanlage',
  'Achsaufhängung',
  'Anhängerkupplung',
  'Antrieb: Achse',
  'Antrieb: Rad',
  'Bremsanlage',
  'Elektrik',
  'Filter',
  'Heizung / Lüftung',
  'Innenausstattung',
  'Karosserie',
  'Klimaanlage',
  'Kühlung',
  'Lenkung',
  'Motor',
  'Riementrieb',
  'Scheibenreinigung',
  'Stoßdämpfer',
  'Zündung / Glühanlage',
];

// Service-Bereiche für OpenCarBox
export const serviceAreas = [
  {
    id: 'shop',
    title: 'Carvatoo Shop',
    description: 'Premium Autoteile mit HSN/TSN-Suche',
    icon: 'ShoppingCart',
    color: 'teal',
    features: ['Über 1 Mio. Teile', '24h Express', 'Bestpreis Garantie'],
    href: '/'
  },
  {
    id: 'werkstatt',
    title: 'OpenCarBox Werkstatt',
    description: 'Meisterbetrieb für Inspektion & Reparatur',
    icon: 'Wrench',
    color: 'navy',
    features: ['Online-Terminbuchung', 'Faire Preise', 'Herstellervorgaben'],
    href: '/werkstatt'
  },
  {
    id: 'autohandel',
    title: 'OpenCarBox Autohandel',
    description: 'Geprüfte Gebraucht- und Neuwagen',
    icon: 'Car',
    color: 'navy',
    features: ['Geprüfte Qualität', 'Finanzierung möglich', 'Inzahlungnahme'],
    href: '/fahrzeuge'
  }
];

// Firmeninfos
export const companyInfo = {
  name: 'Carvatoo',
  legalName: 'OpenCarBox GmbH',
  claim: 'Weil dein Auto zur Familie gehört.',
  phone: '+43 1 798 134 10',
  email: 'office@carvatoo.at',
  address: {
    street: 'Rennweg 76',
    postalCode: '1030',
    city: 'Wien',
    country: 'Österreich'
  },
  legal: {
    firmenbuch: 'FN 534799 w',
    uid: 'ATU75630015',
    gericht: 'Handelsgericht Wien'
  }
};

// Werkstatt Services
export const workshopServices = [
  {
    id: 'inspection',
    name: 'Inspektion & Wartung',
    description: 'Regelmäßige Wartung nach Herstellervorgaben zum Erhalt der Garantie.',
    priceFrom: 89.00,
    duration: '1-2 Stunden',
    icon: 'ClipboardList'
  },
  {
    id: 'oil-change',
    name: 'Ölwechsel',
    description: 'Inklusive Markenöl und Ölfilter. Schnell und sauber.',
    priceFrom: 49.90,
    duration: '30-45 Minuten',
    icon: 'Droplet'
  },
  {
    id: 'brakes',
    name: 'Bremsenservice',
    description: 'Austausch von Bremsscheiben und Belägen. Sicherheitscheck inklusive.',
    priceFrom: 129.00,
    duration: '1-2 Stunden',
    icon: 'Disc'
  },
  {
    id: 'tires',
    name: 'Reifenservice',
    description: 'Radwechsel, Wuchten und Montage. Einlagerung möglich.',
    priceFrom: 29.90,
    duration: '30-60 Minuten',
    icon: 'Circle'
  },
  {
    id: 'ac',
    name: 'Klimaservice',
    description: 'Dichtheitsprüfung, Desinfektion und Auffüllen des Kältemittels.',
    priceFrom: 69.00,
    duration: '45-60 Minuten',
    icon: 'Wind'
  },
  {
    id: 'hu-au',
    name: 'HU / AU Vorführung',
    description: 'Haupt- und Abgasuntersuchung durch anerkannte Prüforganisationen.',
    priceFrom: 120.00,
    duration: '1 Tag',
    icon: 'ShieldCheck'
  }
];

// Autohandel (Cars for Sale)
export const carsForSale = [
  {
    id: 'car-1',
    brand: 'Volkswagen',
    model: 'Golf VII GTI',
    year: 2019,
    price: 24900,
    mileage: 45000,
    fuel: 'Benzin',
    transmission: 'Automatik',
    power: '245 PS',
    color: 'Deep Black Perleffekt',
    image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800&h=600&fit=crop',
    features: ['Navi', 'LED-Scheinwerfer', 'ACC', 'Sitzheizung'],
    isNew: false
  },
  {
    id: 'car-2',
    brand: 'Audi',
    model: 'A4 Avant 40 TDI',
    year: 2021,
    price: 32500,
    mileage: 28000,
    fuel: 'Diesel',
    transmission: 'Automatik',
    power: '190 PS',
    color: 'Gletscherweiß Metallic',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    features: ['Virtual Cockpit', 'Matrix-LED', 'Anhängerkupplung', 'Standheizung'],
    isNew: false
  },
  {
    id: 'car-3',
    brand: 'BMW',
    model: '330i M Sport',
    year: 2022,
    price: 45900,
    mileage: 15000,
    fuel: 'Benzin',
    transmission: 'Automatik',
    power: '258 PS',
    color: 'Portimao Blau',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    features: ['M Sportpaket', 'Head-Up Display', 'Laserlicht', 'Schiebedach'],
    isNew: false
  },
  {
    id: 'car-4',
    brand: 'Mercedes-Benz',
    model: 'C 220 d T-Modell',
    year: 2020,
    price: 29900,
    mileage: 55000,
    fuel: 'Diesel',
    transmission: 'Automatik',
    power: '194 PS',
    color: 'Obsidianschwarz',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    features: ['Avantgarde', 'Widescreen', 'Park-Paket', 'Ambientebeleuchtung'],
    isNew: false
  },
  {
    id: 'car-5',
    brand: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    price: 49900,
    mileage: 5000,
    fuel: 'Elektro',
    transmission: 'Automatik',
    power: '498 PS',
    color: 'Pearl White',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    features: ['Autopilot', 'Premium Innenraum', '19 Zoll Felgen', 'Wärmepumpe'],
    isNew: false
  },
  {
    id: 'car-6',
    brand: 'Porsche',
    model: '911 Carrera S (992)',
    year: 2021,
    price: 129900,
    mileage: 12000,
    fuel: 'Benzin',
    transmission: 'Automatik',
    power: '450 PS',
    color: 'Indischrot',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&h=600&fit=crop',
    features: ['Sport Chrono', 'Sportabgasanlage', 'Bose', 'Lift-System'],
    isNew: false
  }
];

