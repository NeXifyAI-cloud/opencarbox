import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import { categories, featuredProducts } from '../data/mockData';
import { Star, Heart, ShoppingCart, Filter, ChevronDown, Grid, List, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from '../components/ui/checkbox';

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);

  const category = categories.find(c => c.id === categoryId) || categories[0];
  const subcategory = subcategoryId 
    ? category?.subcategories?.find(s => s.id === subcategoryId) 
    : null;

  // Mock products for category
  const categoryProducts = [...featuredProducts, ...featuredProducts].map((p, i) => ({
    ...p,
    id: p.id + i * 10,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={0} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/kategorie/${category?.id}`} className="hover:text-[#4fd1c5]">
            {category?.name?.split(',')[0]}
          </Link>
          {subcategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#1e3a5f] font-medium">{subcategory.name}</span>
            </>
          )}
        </nav>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
            
            {/* Filters */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </h3>
              
              {/* Price Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preis</h4>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Von" 
                    className="w-20 px-2 py-1 text-sm border rounded"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Bis" 
                    className="w-20 px-2 py-1 text-sm border rounded"
                  />
                  <span>€</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Marke</h4>
                <div className="space-y-2">
                  {['BOSCH', 'BREMBO', 'MANN-FILTER', 'SKF', 'LIQUI MOLY'].map((brand) => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox id={brand} />
                      <label htmlFor={brand} className="text-sm text-gray-600">{brand}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Verfügbarkeit</h4>
                <div className="flex items-center gap-2">
                  <Checkbox id="instock" />
                  <label htmlFor="instock" className="text-sm text-gray-600">Nur verfügbare Artikel</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                {subcategory?.name || category?.name?.split(',')[0]}
              </h1>
              <p className="text-gray-600">
                {subcategory 
                  ? `${subcategory.count?.toLocaleString('de-DE')} Produkte gefunden`
                  : `Entdecken Sie unser umfangreiches Sortiment an ${category?.name?.split(',')[0]}`
                }
              </p>
            </div>

            {/* Subcategories (if on main category) */}
            {!subcategoryId && category?.subcategories && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/kategorie/${category.id}/${sub.id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:border-[#4fd1c5] hover:shadow-md transition-all text-center"
                  >
                    <h3 className="font-semibold text-[#1e3a5f]">{sub.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{sub.count?.toLocaleString('de-DE')} Artikel</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {categoryProducts.length} Ergebnisse
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue="relevanz">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sortieren nach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevanz">Relevanz</SelectItem>
                    <SelectItem value="preis-asc">Preis aufsteigend</SelectItem>
                    <SelectItem value="preis-desc">Preis absteigend</SelectItem>
                    <SelectItem value="bewertung">Beste Bewertung</SelectItem>
                    <SelectItem value="beliebtheit">Beliebtheit</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-48'
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                      -{product.discount}%
                    </Badge>
                    <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4fd1c5] hover:text-white">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</span>
                    <h3 className="font-semibold text-[#1e3a5f] mt-1 line-clamp-2 group-hover:text-[#4fd1c5] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    <div className={`mt-3 flex items-center gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                      <span className="text-xl font-bold text-[#1e3a5f]">
                        {product.price.toFixed(2).replace('.', ',')} €
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'Auf Lager' : 'Nicht verfügbar'}
                      </span>
                    </div>

                    <Button className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      In den Warenkorb
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" disabled>Zurück</Button>
              <Button variant="outline" className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <span className="px-2">...</span>
              <Button variant="outline">10</Button>
              <Button variant="outline">Weiter</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
