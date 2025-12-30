import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { type FC, type ReactNode } from 'react';

interface AutohandelLayoutProps {
  children: ReactNode;
}

/**
 * Layout für den OpenCarBox Autohandel-Bereich
 */
const AutohandelLayout: FC<AutohandelLayoutProps> = ({ children }) => {
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

export default AutohandelLayout;
