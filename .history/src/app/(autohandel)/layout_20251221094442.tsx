import { type FC, type ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface AutohandelLayoutProps {
  children: ReactNode;
}

/**
 * Layout für den OpenCarBox Autohandel-Bereich
 */
const AutohandelLayout: FC<AutohandelLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="service" />
      <main className="flex-grow bg-slate-50 texture-noise">
        {children}
      </main>
      <Footer variant="service" />
    </div>
  );
};

