import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Heart, Phone, 
  ChevronDown, Menu, X, Car, Zap, Bike, Truck, LayoutGrid, Wrench, ShoppingBag,
  Calendar, MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { manufacturers } from '../../data/mockData';

const Header = ({ cartItems = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState('alle');
  const location = useLocation();

  const vehicleTypes = [
    { id: 'alle', name: 'Alle', icon: LayoutGrid },
    { id: 'auto', name: 'Auto', icon: Car },
    { id: 'eauto', name: 'E-Auto', icon: Zap },
    { id: 'motorrad', name: 'Motorrad', icon: Bike },
    { id: 'transporter', name: 'Transporter', icon: Truck },
  ];

  // Helper to check active section
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/kategorie') || location.pathname.startsWith('/produkt');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full shadow-sm sticky top-0 z-50">
      {/* 1. Service Switcher Top Bar */}
      <div className="bg-[#162d47] text-gray-300 text-xs py-2 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/') ? 'text-[#4fd1c5] font-bold' : ''}`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Teile-Shop</span>
            </Link>
            <Link 
              to="/werkstatt" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/werkstatt') ? 'text-[#4fd1c5] font-bold' : ''}`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Werkstatt</span>
            </Link>
            <Link 
              to="/fahrzeuge" 
              className={`flex items-center gap-2 hover:text-white transition-colors ${isActive('/fahrzeuge') ? 'text-[#4fd1c5] font-bold' : ''}`}
            >
              <Car className="h-3.5 w-3.5" />
              <span>Fahrzeugmarkt</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/kontakt" className="hover:text-white hidden sm:block">Hilfe & Kontakt</Link>
            <Link to="/business" className="hover:text-white hidden md:block">Für Geschäftskunden</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="bg-[#1e3a5f] text-white py-4 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="bg-white/10 rounded-xl p-2 group-hover:bg-white/20 transition-colors">
                <Car className="h-8 w-8 text-[#4fd1c5]" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#4fd1c5] transition-colors">Carvatoo</span>
                <p className="text-[10px] text-gray-300 uppercase tracking-widest -mt-1">OpenCarBox Platform</p>
              </div>
            </Link>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full flex">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text"
                  placeholder={
                    isActive('/werkstatt') ? "Service oder Reparatur suchen..." :
                    isActive('/fahrzeuge') ? "Fahrzeugmarke oder Modell suchen..." :
                    "Artikel-Nr., OE-Nummer oder Teilename suchen..."
                  }
                  className="pl-10 pr-4 py-2.5 h-11 rounded-l-lg border-none text-gray-900 focus:ring-2 focus:ring-[#4fd1c5]"
                />
                <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold rounded-l-none px-8 h-11 transition-colors">
                  Suchen
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Account */}
              <Link to="/konto" className="flex flex-col items-center group">
                <div className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
                  <User className="h-6 w-6" />
                </div>
                <span className="text-[10px] text-gray-300 group-hover:text-white mt-0.5 hidden sm:block">Konto</span>
              </Link>

              {/* Wishlist */}
              <Link to="/merkzettel" className="flex flex-col items-center group">
                <div className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
                  <Heart className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-[#4fd1c5] rounded-full"></span>
                </div>
                <span className="text-[10px] text-gray-300 group-hover:text-white mt-0.5 hidden sm:block">Merkzettel</span>
              </Link>

              {/* Cart */}
              <Link to="/warenkorb" className="flex flex-col items-center group relative">
                <div className="p-2 rounded-full bg-[#4fd1c5] text-[#1e3a5f] hover:bg-[#38b2ac] transition-colors relative shadow-lg">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#1e3a5f]">
                      {cartItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-300 group-hover:text-white mt-0.5 hidden sm:block">Warenkorb</span>
              </Link>

              {/* Mobile Toggle */}
              <button 
                className="md:hidden p-2 text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search (Visible only on mobile) */}
          <div className="mt-4 md:hidden pb-2">
            <div className="relative w-full flex">
              <Input 
                type="text"
                placeholder="Suchen..."
                className="w-full h-10 rounded-lg border-none text-gray-900"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4fd1c5] p-1.5 rounded-md text-[#1e3a5f]">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contextual Sub-Bar (Changes based on section) */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {isActive('/werkstatt') ? (
            // Workshop Context Bar
            <div className="flex justify-between items-center overflow-x-auto gap-4">
              <div className="flex items-center gap-6 text-sm font-medium text-[#1e3a5f] whitespace-nowrap">
                <Link to="/werkstatt" className="flex items-center gap-2 hover:text-[#4fd1c5]"><Wrench className="h-4 w-4" /> Services</Link>
                <Link to="/werkstatt#termine" className="flex items-center gap-2 hover:text-[#4fd1c5]"><Calendar className="h-4 w-4" /> Termin buchen</Link>
                <Link to="/werkstatt#standorte" className="flex items-center gap-2 hover:text-[#4fd1c5]"><MapPin className="h-4 w-4" /> Standorte</Link>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4 text-[#4fd1c5]" />
                Werkstatt-Hotline: <span className="font-bold text-[#1e3a5f]">+43 1 987 65 43</span>
              </div>
            </div>
          ) : isActive('/fahrzeuge') ? (
            // Dealership Context Bar
            <div className="flex justify-between items-center overflow-x-auto gap-4">
              <div className="flex items-center gap-6 text-sm font-medium text-[#1e3a5f] whitespace-nowrap">
                <Link to="/fahrzeuge" className="flex items-center gap-2 hover:text-[#4fd1c5]"><Car className="h-4 w-4" /> Alle Fahrzeuge</Link>
                <Link to="/fahrzeuge?type=new" className="hover:text-[#4fd1c5]">Neuwagen</Link>
                <Link to="/fahrzeuge?type=used" className="hover:text-[#4fd1c5]">Gebrauchtwagen</Link>
                <Link to="/ankauf" className="hover:text-[#4fd1c5] text-[#4fd1c5]">Fahrzeugankauf</Link>
              </div>
            </div>
          ) : (
            // Shop Vehicle Selection (Default)
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="w-full lg:w-auto flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
                <span className="text-sm font-bold text-[#1e3a5f] whitespace-nowrap">Fahrzeug wählen:</span>
                <div className="flex gap-2">
                  {vehicleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedVehicleType(type.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                          selectedVehicleType === type.id
                            ? 'bg-[#1e3a5f] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {type.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="w-full lg:w-auto flex gap-2">
                <Select>
                  <SelectTrigger className="h-9 text-xs w-full lg:w-48 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Hersteller" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((brand) => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-9 text-xs w-full lg:w-48 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Modell" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="golf">Golf VII</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-9">
                  <span className="hidden sm:inline">Teile finden</span>
                  <span className="sm:hidden">Go</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full z-50">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-[#e6fffa] border border-gray-100">
                <ShoppingBag className="h-6 w-6 mx-auto text-[#1e3a5f] mb-2" />
                <span className="text-sm font-bold text-[#1e3a5f]">Shop</span>
              </Link>
              <Link to="/werkstatt" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-[#e6fffa] border border-gray-100">
                <Wrench className="h-6 w-6 mx-auto text-[#1e3a5f] mb-2" />
                <span className="text-sm font-bold text-[#1e3a5f]">Werkstatt</span>
              </Link>
              <Link to="/fahrzeuge" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-[#e6fffa] border border-gray-100">
                <Car className="h-6 w-6 mx-auto text-[#1e3a5f] mb-2" />
                <span className="text-sm font-bold text-[#1e3a5f]">Autohandel</span>
              </Link>
              <Link to="/konto" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-[#e6fffa] border border-gray-100">
                <User className="h-6 w-6 mx-auto text-[#1e3a5f] mb-2" />
                <span className="text-sm font-bold text-[#1e3a5f]">Mein Konto</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
