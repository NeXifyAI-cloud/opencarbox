// Mock-Daten für Carvatoo Shop

export const categories = [
  {
    id: 'ersatzteile',
    name: 'Ersatz- und Verschleißteile',
    icon: 'Settings',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop',
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
    name: 'Reifen, Felgen, Kompletträder',
    icon: 'Circle',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
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
    name: 'Batterien und Ladegeräte',
    icon: 'Battery',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'autobatterien', name: 'Autobatterien', count: 2340 },
      { id: 'ladegeraete', name: 'Ladegeräte', count: 890 },
      { id: 'starthilfe', name: 'Starthilfe', count: 450 },
    ]
  },
  {
    id: 'oele',
    name: 'Öle, Schmierung, Additive',
    icon: 'Droplet',
    image: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'motoroel', name: 'Motoröl', count: 3450 },
      { id: 'getriebeoel', name: 'Getriebeöl', count: 1230 },
      { id: 'bremsfl', name: 'Bremsflüssigkeit', count: 890 },
      { id: 'additive', name: 'Additive', count: 2340 },
    ]
  },
  {
    id: 'pflege',
    name: 'Pflege und Lackierung',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'autopflege', name: 'Autopflege', count: 4560 },
      { id: 'lackpflege', name: 'Lackpflege', count: 2340 },
      { id: 'innenraumpflege', name: 'Innenraumpflege', count: 1890 },
      { id: 'glasreiniger', name: 'Glasreiniger', count: 780 },
    ]
  },
  {
    id: 'zubehoer',
    name: 'Zubehör und Pannenhilfe',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'warndreieck', name: 'Warndreieck & Warnweste', count: 340 },
      { id: 'verbandskasten', name: 'Verbandskasten', count: 120 },
      { id: 'abschleppseil', name: 'Abschleppseil', count: 89 },
      { id: 'pannenhilfe', name: 'Pannenhilfe-Sets', count: 230 },
    ]
  },
  {
    id: 'saison',
    name: 'Saisonartikel',
    icon: 'Sun',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'frostschutz', name: 'Frostschutzmittel', count: 890 },
      { id: 'eiskratzer', name: 'Eiskratzer', count: 340 },
      { id: 'schneeketten', name: 'Schneeketten', count: 560 },
    ]
  },
  {
    id: 'lampen',
    name: 'Glühlampen und Leuchten',
    icon: 'Lightbulb',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'scheinwerfer', name: 'Scheinwerferlampen', count: 2340 },
      { id: 'rueckleuchten', name: 'Rückleuchten', count: 1890 },
      { id: 'led', name: 'LED-Beleuchtung', count: 3450 },
    ]
  },
  {
    id: 'dachboxen',
    name: 'Dachboxen und Trägersysteme',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'dachbox', name: 'Dachboxen', count: 450 },
      { id: 'dachtraeger', name: 'Dachträger', count: 890 },
      { id: 'fahrradtraeger', name: 'Fahrradträger', count: 670 },
    ]
  },
  {
    id: 'tuning',
    name: 'Tuning und Styling',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'sportauspuff', name: 'Sportauspuff', count: 1230 },
      { id: 'spoiler', name: 'Spoiler', count: 890 },
      { id: 'bodykits', name: 'Bodykits', count: 340 },
    ]
  },
  {
    id: 'werkzeug',
    name: 'Werkzeuge und Werkstatt',
    icon: 'Hammer',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=200&fit=crop',
    subcategories: [
      { id: 'handwerkzeug', name: 'Handwerkzeug', count: 5670 },
      { id: 'wagenheber', name: 'Wagenheber', count: 340 },
      { id: 'diagnose', name: 'Diagnosegeräte', count: 890 },
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
  { id: 'bosch', name: 'BOSCH', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/200px-Bosch-logo.svg.png' },
  { id: 'ate', name: 'ATE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/ATE_logo.svg/200px-ATE_logo.svg.png' },
  { id: 'brembo', name: 'Brembo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Brembo_logo.svg/200px-Brembo_logo.svg.png' },
  { id: 'mann', name: 'MANN-FILTER', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/MANN-FILTER_logo.svg/200px-MANN-FILTER_logo.svg.png' },
  { id: 'liquimoly', name: 'LIQUI MOLY', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Liqui_Moly_logo.svg/200px-Liqui_Moly_logo.svg.png' },
  { id: 'skf', name: 'SKF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/SKF_logo.svg/200px-SKF_logo.svg.png' },
  { id: 'luk', name: 'LuK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/LuK_Logo.svg/200px-LuK_Logo.svg.png' },
  { id: 'valeo', name: 'Valeo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Valeo_Logo.svg/200px-Valeo_Logo.svg.png' },
];

export const featuredProducts = [
  {
    id: 1,
    name: 'BOSCH Bremsscheiben Set Vorderachse',
    brand: 'BOSCH',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1635784458812-1d4c2c3e8f8b?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
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
  { id: 'emotorrad', name: 'E-Motorrad', icon: 'Zap' },
  { id: 'transporter', name: 'Transporter', icon: 'Truck' },
  { id: 'etransporter', name: 'E-Transporter', icon: 'Zap' },
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
    title: 'Riesenauswahl: Über',
    subtitle: '3 Millionen Teile'
  },
  {
    icon: 'Truck',
    title: 'Versand heute bei',
    subtitle: 'Bestellungen bis 15 Uhr'
  },
  {
    icon: 'RotateCcw',
    title: '30 Tage kostenlose',
    subtitle: 'Rücksendungen'
  },
  {
    icon: 'Shield',
    title: 'Herstellergarantie',
    subtitle: 'auf alle Produkte'
  },
];

export const bannerSlides = [
  {
    id: 1,
    title: 'Bis zu 50% sparen',
    subtitle: 'auf Elektrik-Teile',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop',
    buttonText: 'Jetzt entdecken',
    link: '/kategorie/elektrik'
  },
  {
    id: 2,
    title: 'Werkzeuge',
    subtitle: 'Profi-Qualität für Ihr Auto',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=400&fit=crop',
    buttonText: 'Zum Sortiment',
    link: '/kategorie/werkzeug'
  },
  {
    id: 3,
    title: 'Wintercheck',
    subtitle: 'Machen Sie Ihr Auto winterfit',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=400&fit=crop',
    buttonText: 'Mehr erfahren',
    link: '/kategorie/saison'
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
