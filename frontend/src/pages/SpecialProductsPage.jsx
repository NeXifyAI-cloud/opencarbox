import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, Filter, Grid, List, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { featuredProducts } from '../data/mockData';
import { Badge } from '../components/ui/badge';

const SpecialProductsPage = ({ title, type }) => {
  const [viewMode, setViewMode] = useState('grid');
  // In a real app, fetch products based on 'type' (new, bestseller, offers)
  // For demo, we just shuffle or slice mock data
  const products = featuredProducts; 

  const getBreadcrumb = () => {
    switch(type) {
      case 'new': return 'Neuheiten';
      case 'bestseller': return 'Bestseller';
      case 'offers': return 'Angebote';
      default: return title;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium">{getBreadcrumb()}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">{title}</h1>
          <p className="text-gray-600">
            {type === 'new' && 'Entdecken Sie die neuesten Produkte in unserem Sortiment.'}
            {type === 'bestseller' && 'Unsere beliebtesten Produkte - von Kunden empfohlen.'}
            {type === 'offers' && 'Sichern Sie sich die besten Schnäppchen und Rabatte.'}
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{products.length} Artikel</span>
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

        {/* Products */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''}`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-48'}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                    -{product.discount}%
                  </Badge>
                )}
                {type === 'new' && (
                  <Badge className="absolute top-3 left-3 bg-blue-500 text-white font-bold">
                    NEU
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
                      <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className={`mt-3 flex items-center gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                  <span className="text-xl font-bold text-[#1e3a5f]">
                    {product.price.toFixed(2).replace('.', ',')} €
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice.toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                </div>

                <Button className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white flex items-center justify-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  In den Warenkorb
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialProductsPage;
