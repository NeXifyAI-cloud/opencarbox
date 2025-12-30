'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  User,
  Phone,
  Car,
  Wrench,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { useCartStore } from '@/stores/cart-store';

/**
 * Navigation-Item Interface
 */
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  badge?: string;
}

/**
 * Haupt-Navigation für alle Bereiche
 */
const mainNavigation: NavItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    icon: <ShoppingBag className="h-4 w-4" />,
    children: [
      { label: 'Alle Produkte', href: '/shop/produkte' },
      { label: 'Kategorien', href: '/shop/kategorien' },
      { label: 'Angebote', href: '/shop/angebote', badge: 'Sale' },
      { label: 'Neuheiten', href: '/shop/neuheiten' },
    ],
  },
  {
    label: 'Werkstatt',
    href: '/werkstatt',
    icon: <Wrench className="h-4 w-4" />,
    children: [
      { label: 'Services', href: '/werkstatt/services' },
      { label: 'Termin buchen', href: '/werkstatt/termin' },
      { label: 'Preise', href: '/werkstatt/preise' },
    ],
  },
  {
    label: 'Autohandel',
    href: '/autohandel',
    icon: <Car className="h-4 w-4" />,
    children: [
      { label: 'Fahrzeuge', href: '/autohandel/fahrzeuge' },
      { label: 'Ankauf', href: '/autohandel/ankauf' },
      { label: 'Finanzierung', href: '/autohandel/finanzierung' },
    ],
  },
];

/**
 * Ermittelt die aktive Marke basierend auf dem Pfad
 */
function getActiveBrand(pathname: string): 'carvantooo' | 'opencarbox' {
  if (pathname.startsWith('/shop')) {
    return 'carvantooo';
  }
  return 'opencarbox';
}

/**
 * Header-Komponente mit Marken-Switching.
 * Zeigt Carvantooo-Branding im Shop, OpenCarBox sonst.
 *
 * @example
 * <Header />
 */
export function Header() {
  const pathname = usePathname();
  const { isMobileNavOpen, toggleMobileNav, setSearchOpen } = useUIStore();
  const { itemCount } = useCartStore();

  const activeBrand = getActiveBrand(pathname);
  const isCarvantooo = activeBrand === 'carvantooo';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isCarvantooo ? 'border-carvantooo-200' : 'border-opencarbox-200'
      )}
    >
      {/* Top Bar */}
      <div
        className={cn(
          'hidden border-b py-1.5 text-xs sm:block',
          isCarvantooo
            ? 'bg-carvantooo-600 text-white'
            : 'bg-opencarbox-600 text-white'
        )}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+4312345678" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              +43 1 234 567 8
            </a>
            <span className="hidden md:inline">Mo-Fr: 08:00 - 18:00 | Sa: 09:00 - 14:00</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/hilfe" className="hover:underline">Hilfe</Link>
            <Link href="/kontakt" className="hover:underline">Kontakt</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            {isCarvantooo ? (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-carvantooo-500 font-bold text-white">
                  C
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-lg font-bold text-carvantooo-600">Carvantooo</span>
                  <span className="text-[10px] text-muted-foreground">Parts & More</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-opencarbox-500 font-bold text-white">
                  O
                </div>
                <div className="hidden flex-col sm:flex">
                  <span className="text-lg font-bold text-opencarbox-600">OpenCarBox</span>
                  <span className="text-[10px] text-muted-foreground">by Carvantooo</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {mainNavigation.map((item) => (
              <NavDropdown key={item.href} item={item} activeBrand={activeBrand} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Suche */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Suche</span>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/konto">
                <User className="h-5 w-5" />
                <span className="sr-only">Mein Konto</span>
              </Link>
            </Button>

            {/* Warenkorb */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/warenkorb">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant={isCarvantooo ? 'carvantooo' : 'opencarbox'}
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
                <span className="sr-only">Warenkorb</span>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileNav}
              className="lg:hidden"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menü</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <MobileNav activeBrand={activeBrand} onClose={toggleMobileNav} />
      )}
    </header>
  );
}

/**
 * Desktop Navigation Dropdown
 */
function NavDropdown({
  item,
  activeBrand,
}: {
  item: NavItem;
  activeBrand: 'carvantooo' | 'opencarbox';
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? activeBrand === 'carvantooo'
              ? 'bg-carvantooo-50 text-carvantooo-600'
              : 'bg-opencarbox-50 text-opencarbox-600'
            : 'text-foreground hover:bg-muted'
        )}
      >
        {item.icon}
        {item.label}
        {item.children && <ChevronDown className="h-3 w-3" />}
      </Link>

      {/* Dropdown */}
      {item.children && isOpen && (
        <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border bg-background p-2 shadow-lg">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                pathname === child.href
                  ? 'bg-muted font-medium'
                  : 'hover:bg-muted'
              )}
            >
              {child.label}
              {child.badge && (
                <Badge variant="destructive" className="text-[10px]">
                  {child.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Mobile Navigation
 */
function MobileNav({
  activeBrand,
  onClose,
}: {
  activeBrand: 'carvantooo' | 'opencarbox';
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="absolute inset-x-0 top-full border-b bg-background lg:hidden">
      <nav className="container py-4">
        {mainNavigation.map((item) => (
          <div key={item.href} className="border-b last:border-0">
            <Link
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-2 py-3 text-base font-medium',
                pathname.startsWith(item.href)
                  ? activeBrand === 'carvantooo'
                    ? 'text-carvantooo-600'
                    : 'text-opencarbox-600'
                  : 'text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>

            {item.children && (
              <div className="pb-3 pl-6">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between py-2 text-sm',
                      pathname === child.href
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {child.label}
                    {child.badge && (
                      <Badge variant="destructive" className="text-[10px]">
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Mobile Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant={activeBrand === 'carvantooo' ? 'carvantooo' : 'opencarbox'}
            className="w-full"
            asChild
          >
            <Link href="/konto" onClick={onClose}>
              <User className="mr-2 h-4 w-4" />
              Mein Konto
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
}

