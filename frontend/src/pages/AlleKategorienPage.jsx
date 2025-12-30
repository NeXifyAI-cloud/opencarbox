import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, Box } from 'lucide-react';
import { categories } from '../data/mockData';

const AlleKategorienPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Alle Kategorien</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Alle Kategorien</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <Box className="text-[#4fd1c5]" />
                <h2 className="font-bold text-[#1e3a5f] text-lg">
                  <Link to={`/kategorie/${cat.id}`} className="hover:underline">
                    {cat.name.split(',')[0]}
                  </Link>
                </h2>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {cat.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link 
                        to={`/kategorie/${cat.id}/${sub.id}`}
                        className="text-gray-600 hover:text-[#4fd1c5] flex justify-between items-center text-sm group"
                      >
                        <span>{sub.name}</span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                  <Link 
                    to={`/kategorie/${cat.id}`} 
                    className="text-sm font-bold text-[#1e3a5f] hover:text-[#4fd1c5]"
                  >
                    Alle {cat.name.split(',')[0]} ansehen
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlleKategorienPage;
