import { type FC, type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface ShopLayoutProps {
  children: ReactNode;
}

/**
 * Layout für den Carvantooo Shop-Bereich
 */
const ShopLayout: FC<ShopLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="shop" />
      <main className="flex-grow bg-slate-50 texture-noise">
        {children}
      </main>
      <Footer variant="shop" />
    </div>
  );
};

