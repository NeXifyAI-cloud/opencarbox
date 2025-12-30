import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { type FC, type ReactNode } from 'react';

interface ShopLayoutProps {
  children: ReactNode;
}

/**
 * Layout für den Carvantooo Shop-Bereich
 */
const ShopLayout: FC<ShopLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-slate-50 texture-noise">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ShopLayout;
