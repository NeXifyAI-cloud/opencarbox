import { BenefitsBar } from '@/components/home/benefits-bar';
import { CategoryGrid } from '@/components/home/category-grid';
import { HeroSlider } from '@/components/home/hero-slider';
import { FeaturedProducts, PlatformOverview, SEOContent, TopBrands } from '@/components/home/sections';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={0} />

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
            <div className="mt-10">
              <PlatformOverview />
            </div>
            <CategoryGrid />
            <FeaturedProducts />
            <TopBrands />
            <SEOContent />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
