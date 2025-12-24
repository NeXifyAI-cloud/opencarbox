import React from 'react';
import { topBrands } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopBrands = () => {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Top-Marken im Shop</h2>
        <Link 
          to="/marken" 
          className="text-[#4fd1c5] hover:text-[#38b2ac] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Alle Marken <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {topBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/marke/${brand.id}`}
              className="flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="h-12 w-24 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-sm font-semibold text-[#1e3a5f]">{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
