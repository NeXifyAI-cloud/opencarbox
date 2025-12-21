import { type FC } from 'react';
import Link from 'next/link';
import { ShoppingCart, Wrench, Car, Phone, Menu, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  variant?: 'default' | 'shop' | 'service';
}

/**
 * Globaler Header mit Marken-Umschaltung
 */
export const Header: FC<HeaderProps> = ({ variant = 'default' }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container-content flex h-20 items-center justify-between">
        {/* Logo-Bereich */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className={cn(
              "text-2xl font-display font-bold tracking-tighter",
              variant === 'shop' ? "text-carvantooo-500" : "text-opencarbox-500"
            )}>
              {variant === 'shop' ? 'CARVANTOOO' : 'OPENCARBOX'}
            </span>
            {variant !== 'shop' && (
              <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground mt-1">
                by Carvantooo
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/shop"
              className={cn(
                "text-sm font-medium hover:text-carvantooo-500 transition-colors flex items-center gap-1.5",
                variant === 'shop' && "text-carvantooo-500"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              Shop
            </Link>
            <Link
              href="/werkstatt"
              className={cn(
                "text-sm font-medium hover:text-opencarbox-500 transition-colors flex items-center gap-1.5",
                variant === 'service' && "text-opencarbox-500"
              )}
            >
              <Wrench className="w-4 h-4" />
              Werkstatt
            </Link>
            <Link
              href="/fahrzeuge"
              className="text-sm font-medium hover:text-opencarbox-500 transition-colors flex items-center gap-1.5"
            >
              <Car className="w-4 h-4" />
              Autohandel
            </Link>
          </nav>
        </div>

        {/* Action-Bereich */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 mr-4">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">+43 1 798 134 10</span>
          </div>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>

          <Button
            className={cn(
              "hidden md:flex",
              variant === 'shop' ? "btn-gradient-red" : "btn-gradient-blue"
            )}
          >
            {variant === 'shop' ? 'Warenkorb (0)' : 'Termin buchen'}
          </Button>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
