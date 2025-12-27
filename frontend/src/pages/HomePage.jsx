import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import HeroSlider from '../components/home/HeroSlider';
import BenefitsBar from '../components/home/BenefitsBar';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TopBrands from '../components/home/TopBrands';
import AppBanner from '../components/home/AppBanner';
import InfoSection from '../components/home/InfoSection';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Wrench, Car, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart.item_count} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <HeroSlider />
            <BenefitsBar />

            {/* Platform Overview / Cross-Linking */}
            <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shop Teaser */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <ShoppingBag className="h-10 w-10 text-[#1e3a5f] mb-4 relative z-10" />
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Teile & Zubehör</h3>
                <p className="text-gray-600 text-sm mb-4 relative z-10">
                  Über 3 Millionen Ersatzteile für alle Marken. Top-Qualität zu fairen Preisen.
                </p>
                <Link to="/kategorien" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Zum Shop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Workshop Teaser */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <Wrench className="h-10 w-10 text-[#4fd1c5] mb-4 relative z-10" />
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Werkstatt-Service</h3>
                <p className="text-gray-600 text-sm mb-4 relative z-10">
                  Montage, Wartung und Reparatur. Buchen Sie Ihren Termin direkt online.
                </p>
                <Link to="/werkstatt" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Termin vereinbaren <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Dealership Teaser */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <Car className="h-10 w-10 text-[#1e3a5f] mb-4 relative z-10" />
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 relative z-10">Fahrzeugmarkt</h3>
                <p className="text-gray-600 text-sm mb-4 relative z-10">
                  Geprüfte Gebraucht- und Neuwagen. Finden Sie Ihr Traumauto bei uns.
                </p>
                <Link to="/fahrzeuge" className="text-[#4fd1c5] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Fahrzeuge ansehen <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <CategoryGrid />
            <FeaturedProducts />
            <TopBrands />
            <AppBanner />
            <InfoSection />

            {/* SEO Content */}
            <section className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                Carvatoo - Die OpenCarBox Plattform
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="mb-4">
                  Carvatoo ist mehr als nur ein Online-Shop. Als Teil der OpenCarBox Plattform bieten wir Ihnen 
                  ein ganzheitliches Erlebnis rund um Ihr Auto. Von hochwertigen Ersatzteilen über professionelle 
                  Werkstatt-Services bis hin zum Fahrzeugkauf - alles aus einer Hand.
                </p>
                
                <h3 className="text-lg font-semibold text-[#1e3a5f] mt-6 mb-3">
                  Ein Ökosystem für Ihre Mobilität
                </h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li><strong>Shop:</strong> Große Auswahl und niedrige Preise für 3 Mio. Teile</li>
                  <li><strong>Werkstatt:</strong> Kompetente Meisterbetriebe für Einbau und Wartung</li>
                  <li><strong>Handel:</strong> Zertifizierte Fahrzeuge mit Garantie</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
