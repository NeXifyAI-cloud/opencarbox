import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { carBrands } from '../data/mockData';

const MarkenPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Marken</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Unsere Top Marken</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {carBrands.map((brand) => (
            <Link 
              key={brand.id} 
              to={`/marke/${brand.id}`}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center hover:shadow-md hover:border-[#4fd1c5] transition-all group"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                {/* Fallback for logo if needed */}
                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="font-bold text-gray-700 group-hover:text-[#1e3a5f]">{brand.name}</span>
            </Link>
          ))}
          
          {/* Add some more generic brands for filler */}
          {['Bosch', 'Continental', 'Mahle', 'Mann-Filter', 'Sachs', 'Valeo', 'Luk', 'SKF'].map((name) => (
            <Link 
              key={name} 
              to={`/marke/${name.toLowerCase()}`}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center hover:shadow-md hover:border-[#4fd1c5] transition-all group"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-gray-50 rounded-full text-xl font-bold text-gray-400 group-hover:bg-[#4fd1c5] group-hover:text-white transition-colors">
                {name[0]}
              </div>
              <span className="font-bold text-gray-700 group-hover:text-[#1e3a5f]">{name}</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarkenPage;
