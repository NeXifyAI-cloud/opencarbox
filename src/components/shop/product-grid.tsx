"use client"

import * as React from "react"
import { Star, ShoppingCart, Eye, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Product, mockProducts } from "./mock-products"

interface ProductGridProps {
  category?: string
  limit?: number
  showFilters?: boolean
  products?: Product[]
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

function ProductCard({
  product,
  onToggleWishlist,
  isWishlisted
}: {
  product: Product,
  onToggleWishlist: (id: string | number) => void,
  isWishlisted: boolean
}) {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Neu</Badge>}
        {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
        {product.isFeatured && <Badge className="bg-blue-500 hover:bg-blue-600">Empfohlen</Badge>}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={() => onToggleWishlist(product.id)}
      >
        <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
      </Button>

      <div className="relative aspect-square overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        <div className="p-4">
          <div className="aspect-square relative rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
        </div>
      </div>

      <CardHeader className="pb-2">
        <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
        <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button className="flex-1 bg-gradient-to-r from-carvantooo-500 to-carvantooo-700 hover:from-carvantooo-600 hover:to-carvantooo-800" size="lg">
          <ShoppingCart className="mr-2 h-4 w-4" /> In den Warenkorb
        </Button>
        <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Keine Produkte gefunden</h3>
      <p className="text-muted-foreground">Es wurden keine Produkte in dieser Kategorie gefunden.</p>
    </div>
  )
}

export function ProductGrid({ category, limit, showFilters = true, products: customProducts }: ProductGridProps) {
  const [wishlist, setWishlist] = React.useState<(string | number)[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const categories = React.useMemo(() => Array.from(new Set((customProducts || mockProducts).map(p => p.category))), [customProducts])

  const filteredProducts = React.useMemo(() => {
    let filtered = customProducts || mockProducts
    if (category) filtered = filtered.filter(p => p.category === category)
    if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory)
    if (limit) filtered = filtered.slice(0, limit)
    return filtered
  }, [category, selectedCategory, limit])

  const toggleWishlist = (productId: string | number) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId])
  }

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={cn(selectedCategory === null && "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700")}
          >
            Alle Kategorien
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={cn(selectedCategory === cat && "bg-gradient-to-r from-carvantooo-500 to-carvantooo-700")}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />
        ))}
      </div>

      {filteredProducts.length === 0 && <EmptyState />}
    </div>
  )
}
