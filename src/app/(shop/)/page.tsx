import { ProductsList } from '@/components/shop/products-list'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sidebar } from '@/components/layout/sidebar'
import { Search, Filter, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={0} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Shop Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Auto-Teile Shop</h1>
              <p className="text-gray-600 mb-6">
                Entdecken Sie unsere hochwertigen Auto-Teile und Zubehör für alle Fahrzeugtypen
              </p>

              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Nach Produkten suchen..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Grid
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Liste
                  </Button>
                </div>
              </div>

              {/* Category Tabs */}
              <Tabs defaultValue="all" className="mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-6">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="tires">Reifen</TabsTrigger>
                  <TabsTrigger value="oil">Motoröl</TabsTrigger>
                  <TabsTrigger value="brakes">Bremsen</TabsTrigger>
                  <TabsTrigger value="batteries">Batterien</TabsTrigger>
                  <TabsTrigger value="accessories">Zubehör</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      Zeige <span className="font-semibold">12</span> von <span className="font-semibold">48</span> Produkten
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Sortieren nach:</span>
                      <select className="border rounded-md px-3 py-1 text-sm">
                        <option>Beliebteste</option>
                        <option>Preis: Niedrig zu Hoch</option>
                        <option>Preis: Hoch zu Niedrig</option>
                        <option>Neueste</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Products Grid */}
            <div className="mb-12">
              <ProductsList />
            </div>

            {/* Shop Info Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Warum bei uns kaufen?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚚</div>
                  <h3 className="font-semibold mb-2">Kostenloser Versand</h3>
                  <p className="text-gray-600 text-sm">
                    Ab 50€ Bestellwert liefern wir kostenfrei innerhalb Deutschlands
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔧</div>
                  <h3 className="font-semibold mb-2">Fachberatung</h3>
                  <p className="text-gray-600 text-sm">
                    Unser Expertenteam berät Sie gerne bei der Produktauswahl
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <h3 className="font-semibold mb-2">30 Tage Rückgabe</h3>
                  <p className="text-gray-600 text-sm">
                    Zufriedenheitsgarantie mit 30-tägigem Rückgaberecht
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary text-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Bleiben Sie informiert</h2>
              <p className="mb-6 opacity-90">
                Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive Angebote
              </p>
              <div className="max-w-md mx-auto flex gap-2">
                <Input
                  placeholder="Ihre E-Mail-Adresse"
                  className="bg-white text-gray-900"
                />
                <Button variant="secondary">Anmelden</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}