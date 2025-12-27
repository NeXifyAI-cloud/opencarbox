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

const HomePage = () => {
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart.item_count} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <HeroSlider />
            <BenefitsBar />
            <CategoryGrid />
            <FeaturedProducts />
            <TopBrands />
            <AppBanner />
            <InfoSection />

            {/* SEO Content */}
            <section className="mt-10 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                Carvatoo - Dein Online-Shop für günstige Kfz-Teile & Zubehör
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="mb-4">
                  Carvatoo ist mit über 3 Mio. Kfz-Teilen und Autozubehör einer der größten 
                  Online-Shops für Autoteile aller gängigen Automarken. In der Regel versenden wir 
                  lagernde Teile noch am gleichen Werktag, wenn du vor 15 Uhr bestellst.
                </p>
                
                <h3 className="text-lg font-semibold text-[#1e3a5f] mt-6 mb-3">
                  Deine Vorteile beim Kauf von Kfz-Teilen bei uns
                </h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Große Auswahl und niedrige Preise</li>
                  <li>Kaufberatung und qualifizierter Support</li>
                  <li>Mehr als 150.000 Produkte sofort lieferbar</li>
                  <li>Garantie und Rückgaberecht</li>
                  <li>Fokus auf Qualität und Markenhersteller</li>
                  <li>Sicherer und bequemer Online-Kauf mit vielen Bezahloptionen</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#1e3a5f] mt-6 mb-3">
                  Riesiges Sortiment von Kfz-Teilen und Kfz-Zubehör
                </h3>
                <p>
                  Unser umfangreiches PKW-Teile Sortiment sorgt für sicheres Bremsen mit hochwertigen 
                  Bremsscheiben und Bremsbelägen. Für deinen Auspuff findest du Endschalldämpfer, 
                  Katalysatoren, Lambdasonden, Rußpartikelfilter und Turbolader. Auch sämtliche Filter, 
                  wie zum Beispiel Kraftstofffilter, Luftfilter, Ölfilter und Innenraumfilter kannst 
                  du bei uns günstig bestellen.
                </p>
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
