export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount?: number
  reviews?: number
  isNew?: boolean
  isSale?: boolean
  isFeatured?: boolean
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Winterreifen Set",
    description: "4x Winterreifen 225/45 R17 mit hervorragender Nasshaftung",
    price: 599.99,
    originalPrice: 749.99,
    image: "/images/products/winter-tires.jpg",
    category: "Reifen",
    rating: 4.8,
    reviewCount: 124,
    isSale: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Sport-Lenkrad",
    description: "Alcantara Sportlenkrad mit Multifunktion und Heizung",
    price: 349.99,
    image: "/images/products/steering-wheel.jpg",
    category: "Interieur",
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
  },
  {
    id: "3",
    name: "LED Scheinwerfer Set",
    description: "Hochwertige LED Scheinwerfer mit Tagfahrlicht",
    price: 429.99,
    originalPrice: 499.99,
    image: "/images/products/led-headlights.jpg",
    category: "Beleuchtung",
    rating: 4.7,
    reviewCount: 203,
    isSale: true,
  },
  {
    id: "4",
    name: "Sportfahrwerk",
    description: "Tieferlegungsfahrwerk für verbesserte Straßenlage",
    price: 899.99,
    image: "/images/products/suspension.jpg",
    category: "Fahrwerk",
    rating: 4.6,
    reviewCount: 67,
  },
  {
    id: "5",
    name: "Carbon Spoiler",
    description: "Carbonfaser Heckspoiler für aerodynamisches Design",
    price: 279.99,
    image: "/images/products/spoiler.jpg",
    category: "Aerodynamik",
    rating: 4.5,
    reviewCount: 42,
    isNew: true,
  },
  {
    id: "6",
    name: "Performance Bremsen",
    description: "Sportbremsen mit perforierten Scheiben",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "/images/products/brakes.jpg",
    category: "Bremsen",
    rating: 4.9,
    reviewCount: 156,
    isSale: true,
    isFeatured: true,
  },
]
