'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, Eye } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products?page=${pageNum}&limit=12`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setProducts(data.data)
        setTotalPages(data.pagination.pages)
      } else {
        throw new Error(data.error || 'Fehler beim Laden der Produkte')
      }
    } catch (err) {
      // console.error('Fehler beim Laden der Produkte:', err)
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      
      // Fallback: Mock-Daten für Entwicklung
      if (process.env.NODE_ENV === 'development') {
        setProducts([
          {
            id: '1',
            sku: 'CAR-001',
            name: 'Premium Reifen',
            description: 'Hochwertige Sommerreifen',
            price: 89.99,
            stock: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            sku: 'CAR-002',
            name: 'Motoröl',
            description: 'Synthetisches Motoröl 5W-30',
            price: 29.99,
            stock: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '3',
            sku: 'CAR-003',
            name: 'Bremsbeläge',
            description: 'Keramische Bremsbeläge',
            price: 49.99,
            stock: 25,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(page)
  }, [page])

  const handleAddToCart = (product: Product) => {
    // Hier würde später die Cart-Logik implementiert werden
    // console.log('Produkt zum Warenkorb hinzugefügt:', product)
    alert(`${product.name} wurde zum Warenkorb hinzugefügt!`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Fehler beim Laden der Produkte: {error}</div>
        <Button onClick={() => fetchProducts(page)}>Erneut versuchen</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </CardDescription>
                </div>
                <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                  {product.stock > 0 ? `${product.stock} verfügbar` : 'Ausverkauft'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <div className="text-sm">Produktbild</div>
                </div>
              </div>
              
              {product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500">
                  inkl. MwSt.
                </span>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // console.log('Details anzeigen:', product)
                  // Hier würde später die Detailansicht geöffnet werden
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? 'In den Warenkorb' : 'Ausverkauft'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Vorherige
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            {totalPages > 5 && <span className="text-gray-500">...</span>}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Nächste
          </Button>
        </div>
      )}
    </div>
  )
}