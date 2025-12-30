// Carvantooo - Premium Mock-Daten
// "Weil dein Auto zur Familie gehört."

// Product Images
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

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  subcategories: { id: string; name: string; count: number }[];
}

export interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
}

export const categories: Category[] = [
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

export const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: 'Bis zu 50% sparen',
    subtitle: 'auf Bremsanlagen',
    buttonText: 'Jetzt entdecken',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Premium Werkzeug',
    subtitle: 'für Profis & Heimwerker',
    buttonText: 'Zum Angebot',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Winterreifen Sale',
    subtitle: 'Top-Marken zu Tiefpreisen',
    buttonText: 'Jetzt sichern',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop',
  },
];

export const featuredProducts: FeaturedProduct[] = [
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

export const manufacturers = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Opel', 'Ford',
  'Škoda', 'SEAT', 'Toyota', 'Hyundai', 'Renault', 'Peugeot',
  'Fiat', 'Mazda', 'Honda', 'Nissan', 'Kia', 'Volvo', 'Porsche', 'Mini'
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
