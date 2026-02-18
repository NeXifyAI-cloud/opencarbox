'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { manufacturers } from '@/lib/mock-data';
import {
    Bike,
    Car,
    Heart,
    LayoutGrid,
    Search,
    ShoppingBag,
    ShoppingCart,
    Truck,
    User,
    Wrench,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  cartItems?: number;
}

const vehicleTypes = [
  { id: 'alle', name: 'Alle', icon: LayoutGrid },
  { id: 'auto', name: 'Auto', icon: Car },
  { id: 'eauto', name: 'E-Auto', icon: Zap },
  { id: 'motorrad', name: 'Motorrad', icon: Bike },
  { id: 'transporter', name: 'Transpo', icon: Truck },
];

export function Header({ cartItems = 0 }: HeaderProps) {
  const [selectedVehicleType, setSelectedVehicleType] = useState('alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname.startsWith('/kategorie') || pathname.startsWith('/produkt');
    return pathname.startsWith(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/kategorien?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="w-full shadow-sm sticky top-0 z-50">
      {/* 1. Service Switcher Top Bar */}
      <div className="bg-primary-900 text-gray-300 text-sm py-3 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/') ? 'text-secondary-400 font-bold' : ''}`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Teile-Shop</span>
            </Link>
            <Link
              href="/werkstatt"
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/werkstatt') ? 'text-secondary-400 font-bold' : ''}`}
            >
              <Wrench className="h-4 w-4" />
              <span>Werkstatt</span>
            </Link>
            <Link
              href="/fahrzeuge"
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/fahrzeuge') ? 'text-secondary-400 font-bold' : ''}`}
            >
              <Car className="h-4 w-4" />
              <span>Fahrzeugmarkt</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/kontakt" className="hover:text-white hidden sm:block transition-colors">Hilfe & Kontakt</Link>
            <Link href="/business" className="hover:text-white hidden md:block transition-colors">Für Geschäftskunden</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="bg-primary-800 text-white py-6 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 flex-shrink-0 group">
              <div className="bg-white/10 rounded-xl p-2.5 group-hover:bg-white/20 transition-colors">
                <Car className="h-10 w-10 text-secondary-400" />
              </div>
              <div>
                <span className="text-3xl font-bold tracking-tight text-white group-hover:text-secondary-400 transition-colors">Carvantooo</span>
                <p className="text-[11px] text-gray-300 uppercase tracking-widest -mt-1 font-medium">OpenCarBox Platform</p>
              </div>
            </Link>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-3xl hidden md:flex">
              <form onSubmit={handleSearch} className="relative w-full flex shadow-lg rounded-lg">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Artikel-Nr., OE-Nummer oder Teilename suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 h-14 rounded-l-lg border-none text-gray-900 focus:ring-2 focus:ring-secondary-400 text-base"
                />
                <Button type="submit" className="bg-secondary-500 hover:bg-secondary-600 text-primary-800 font-bold text-base rounded-l-none px-10 h-14 transition-colors">
                  Suchen
                </Button>
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Account */}
              <Link href="/konto" className="flex flex-col items-center group">
                <div className="p-2.5 rounded-full hover:bg-white/10 transition-colors relative">
                  <User className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-300 group-hover:text-white mt-1 hidden sm:block font-medium">Konto</span>
              </Link>

              {/* Wishlist */}
              <Link href="/merkzettel" className="flex flex-col items-center group">
                <div className="p-2.5 rounded-full hover:bg-white/10 transition-colors relative">
                  <Heart className="h-6 w-6" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-secondary-400 rounded-full border-2 border-primary-800"></span>
                </div>
                <span className="text-xs text-gray-300 group-hover:text-white mt-1 hidden sm:block font-medium">Merkzettel</span>
              </Link>

              {/* Cart */}
              <Link href="/warenkorb" className="flex flex-col items-center group relative">
                <div className="p-2.5 rounded-full bg-secondary-500 text-primary-800 hover:bg-secondary-600 transition-colors relative shadow-lg">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-300 group-hover:text-white mt-1 hidden sm:block font-medium">Warenkorb</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vehicle Selector Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-primary-800">Fahrzeug wählen:</span>

            {/* Vehicle Type Pills */}
            <div className="flex gap-2">
              {vehicleTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedVehicleType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedVehicleType === type.id
                        ? 'bg-primary-800 text-white'
                        : 'bg-white text-primary-800 border border-gray-200 hover:border-secondary-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type.name}
                  </button>
                );
              })}
            </div>

            {/* Manufacturer Select */}
            <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <SelectValue placeholder="Hersteller wählen" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Model Select */}
            <Select disabled={!selectedManufacturer}>
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <SelectValue placeholder="Modell wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="golf">Golf</SelectItem>
                <SelectItem value="passat">Passat</SelectItem>
                <SelectItem value="polo">Polo</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-secondary-500 hover:bg-secondary-600 text-primary-800 font-semibold">
              Teile finden
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
