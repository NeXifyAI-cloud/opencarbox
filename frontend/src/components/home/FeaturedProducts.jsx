import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { featuredProducts } from '../../data/mockData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const FeaturedProducts = () => {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Top-Angebote</h2>
        <Link 
          to="/angebote" 
          className="text-[#4fd1c5] hover:text-[#38b2ac] text-sm font-medium transition-colors"
        >
          Alle Angebote ansehen
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Discount Badge */}
              <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold">
                -{product.discount}%
              </Badge>
              {/* Wishlist Button */}
              <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4fd1c5] hover:text-white">
                <Heart className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Brand */}
              <span className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</span>
              
              {/* Name */}
              <h3 className="font-semibold text-[#1e3a5f] mt-1 line-clamp-2 group-hover:text-[#4fd1c5] transition-colors">
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
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xl font-bold text-[#1e3a5f]">
                  {product.price.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-2 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'Auf Lager' : 'Nicht verfügbar'}
                </span>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
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
