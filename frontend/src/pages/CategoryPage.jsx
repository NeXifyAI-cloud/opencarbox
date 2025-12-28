import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import { featuredProducts } from '../data/mockData'; // Fallback if API fails or for initial render
import { Star, Heart, ShoppingCart, Filter, ChevronDown, Grid, List, ChevronRight, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from '../components/ui/checkbox';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, we'd fetch category details too to get the name
        // For now, we'll try to get products by category
        // If the backend doesn't support filtering by category slug yet, 
        // we might fallback to all products or mocked data.
        
        let data = [];
        try {
            // Try fetching from real API
            // Assuming the backend has a filter ?category=slug
            const response = await productService.getAll({ category: subcategoryId || categoryId });
            data = response.items || response; // Handle paginated or list response
        } catch (err) {
            console.warn("API fetch failed, falling back to mock data", err);
            // Fallback logic
            data = featuredProducts; 
        }

        // If data is empty (API returned nothing or failed), use mock data for demo purposes
        if (!data || data.length === 0) {
            data = featuredProducts;
        }

        setProducts(data);
        setCategoryName(subcategoryId || categoryId || 'Kategorie');
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, subcategoryId]);

  const handleAddToCart = async (product) => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast({
        title: "Hinzugefügt",
        description: `${product.name} wurde zum Warenkorb hinzugefügt.`,
      });
    } else {
       toast({
        variant: "destructive",
        title: "Fehler",
        description: "Konnte nicht zum Warenkorb hinzugefügt werden.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium capitalize">{categoryName}</span>
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2 capitalize">
                {categoryName}
              </h1>
              <p className="text-gray-600">
                {products.length} Produkte gefunden
              </p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {products.length} Ergebnisse
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
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-[#1e3a5f]" />
                </div>
            ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
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
                          src={product.image || product.images?.[0] || 'https://via.placeholder.com/400'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.discount_percent && (
                            <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                              -{product.discount_percent}%
                            </Badge>
                        )}
                        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4fd1c5] hover:text-white">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</span>
                        <Link to={`/produkt/${product.id}`}>
                            <h3 className="font-semibold text-[#1e3a5f] mt-1 line-clamp-2 group-hover:text-[#4fd1c5] transition-colors">
                              {product.name}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating || 4)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.review_count || 0})</span>
                        </div>

                        <div className={`mt-3 flex items-center gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                          <span className="text-xl font-bold text-[#1e3a5f]">
                            {product.price?.toFixed(2).replace('.', ',')} €
                          </span>
                          {product.original_price && (
                              <span className="text-sm text-gray-400 line-through">
                                {product.original_price.toFixed(2).replace('.', ',')} €
                              </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${product.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-xs ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {product.is_active ? 'Auf Lager' : 'Nicht verfügbar'}
                          </span>
                        </div>

                        <Button 
                            onClick={() => handleAddToCart(product)}
                            className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          In den Warenkorb
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" disabled>Zurück</Button>
              <Button variant="outline" className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">1</Button>
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
