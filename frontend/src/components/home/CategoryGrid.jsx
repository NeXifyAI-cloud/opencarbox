import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/mockData';
import { 
  Settings, Circle, Battery, Droplet, Sparkles, Wrench, 
  Sun, Lightbulb, Package, Zap, Hammer, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Settings,
  Circle,
  Battery,
  Droplet,
  Sparkles,
  Wrench,
  Sun,
  Lightbulb,
  Package,
  Zap,
  Hammer,
};

const CategoryGrid = () => {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Kategorien</h2>
        <Link 
          to="/kategorien" 
          className="text-[#4fd1c5] hover:text-[#38b2ac] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Alle Kategorien <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Settings;
          return (
            <Link
              key={category.id}
              to={`/kategorie/${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#4fd1c5]/30 transition-all duration-300">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <Icon className="h-6 w-6 text-[#4fd1c5]" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-[#1e3a5f] group-hover:text-[#4fd1c5] transition-colors line-clamp-2">
                    {category.name.split(',')[0]}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
