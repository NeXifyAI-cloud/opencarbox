import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { featuredProducts } from '../../data/mockData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const FeaturedProducts = () => {
  return (
    <section className="mt-10 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Top-Angebote</h2>
        <Link 
          to="/angebote" 
          className="text-carvantooo-500 hover:text-carvantooo-600 text-sm font-medium transition-colors"
        >
          Alle Angebote ansehen
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-card-premium overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Discount Badge */}
              <Badge className="absolute top-3 left-3 bg-carvantooo-500 text-white font-bold border-none">
                -{product.discount}%
              </Badge>
              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-carvantooo-500 hover:text-white transform translate-y-2 group-hover:translate-y-0">
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Brand */}
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{product.brand}</span>
              
              {/* Name */}
              <h3 className="font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-carvantooo-500 transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900">
                  {product.price.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-sm text-slate-400 line-through">
                  {product.originalPrice.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success-500' : 'bg-error-500'}`} />
                <span className={`text-xs font-medium ${product.inStock ? 'text-success-700' : 'text-error-700'}`}>
                  {product.inStock ? 'Auf Lager' : 'Nicht verfügbar'}
                </span>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full mt-5 bg-slate-900 hover:bg-carvantooo-500 text-white flex items-center justify-center gap-2 rounded-lg transition-colors h-12 font-bold shadow-lg shadow-slate-900/10 hover:shadow-carvantooo-500/20">
                <ShoppingCart className="h-5 w-5" />
                In den Warenkorb
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
