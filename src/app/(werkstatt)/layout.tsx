import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { type FC, type ReactNode } from 'react';

interface ServiceLayoutProps {
  children: ReactNode;
}

/**
 * Layout für den OpenCarBox Werkstatt-Bereich
 */
const ServiceLayout: FC<ServiceLayoutProps> = ({ children }) => {
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

export default ServiceLayout;
