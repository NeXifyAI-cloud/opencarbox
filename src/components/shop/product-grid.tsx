"use client"

import * as React from "react"
import { Star, ShoppingCart, Eye, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"

interface Product {
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

const mockProducts: Product[] = [
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

interface ProductGridProps {
  category?: string
  limit?: number
  showFilters?: boolean
  products?: Product[]
}

export function ProductGrid({ category, limit, showFilters = true, products: customProducts }: ProductGridProps) {
  const [wishlist, setWishlist] = React.useState<(string | number)[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = React.useState<Record<string | number, boolean>>({})

  const categories = Array.from(new Set((customProducts || mockProducts).map(p => p.category)))

  const filteredProducts = React.useMemo(() => {
    let filtered = customProducts || mockProducts

    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    return filtered
  }, [customProducts, category, selectedCategory, limit])

  const toggleWishlist = (productId: string | number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleAddToCart = (productId: string | number) => {
    setIsAddingToCart(prev => ({ ...prev, [productId]: true }))
    // In einer echten App würde hier der Cart-Store aufgerufen werden.
    // Wir simulieren hier nur den Loading-State für die UX-Verbesserung.
    setTimeout(() => {
      setIsAddingToCart(prev => ({ ...prev, [productId]: false }))
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={cn(
              selectedCategory === null &&
                "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700"
            )}
          >
            Alle Kategorien
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                selectedCategory === cat &&
                  "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card
            key={product.id}
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600">Neu</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-blue-500 hover:bg-blue-600">Empfohlen</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlist.includes(product.id) ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  wishlist.includes(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
            </Button>

            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-muted">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="p-4">
                <div className="aspect-square relative rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-lg leading-tight">
                    {product.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </CardHeader>

            <CardContent className="pb-2">
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount || product.reviews || 0} Bewertungen)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-4">
              <Button
                className="flex-1 bg-gradient-to-r from-carvantooo-500 to-carvantooo-700 hover:from-carvantooo-600 hover:to-carvantooo-800"
                size="lg"
                loading={isAddingToCart[product.id]}
                onClick={() => handleAddToCart(product.id)}
              >
                {!isAddingToCart[product.id] && <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />}
                In den Warenkorb
              </Button>
              <Button variant="outline" size="icon" aria-label="Details anzeigen">
                <Eye className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Keine Produkte gefunden</h3>
          <p className="text-muted-foreground">
            Es wurden keine Produkte in dieser Kategorie gefunden.
          </p>
        </div>
      )}
    </div>
  )
}
