import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Heart, Phone, 
  ChevronDown, Menu, X, Car, Zap, Bike, Truck, LayoutGrid 
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

  const vehicleTypes = [
    { id: 'alle', name: 'Alle', icon: LayoutGrid },
    { id: 'auto', name: 'Auto', icon: Car },
    { id: 'eauto', name: 'E-Auto', icon: Zap },
    { id: 'motorrad', name: 'Motorrad', icon: Bike },
    { id: 'transporter', name: 'Transporter', icon: Truck },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#1e3a5f] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="text-[#4fd1c5]">✓</span> Über 3 Millionen Teile
            </span>
            <span className="hidden md:flex items-center gap-2">
              <span className="text-[#4fd1c5]">✓</span> 30 Tage Rückgaberecht
            </span>
            <span className="hidden lg:flex items-center gap-2">
              <span className="text-[#4fd1c5]">✓</span> Blitzschnelle Lieferung
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/konto" className="hover:text-[#4fd1c5] transition-colors hidden sm:block">
              Mein Kundenkonto
            </Link>
            <Link to="/merkzettel" className="hover:text-[#4fd1c5] transition-colors hidden sm:block">
              Merkzettel
            </Link>
            <Link to="/newsletter" className="hover:text-[#4fd1c5] transition-colors hidden md:block">
              Newsletter
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center">
                <div className="bg-[#1e3a5f] rounded-lg p-2">
                  <Car className="h-6 w-6 text-[#4fd1c5]" />
                </div>
                <div className="ml-2">
                  <span className="text-2xl font-bold text-[#1e3a5f]">Carvatoo</span>
                  <p className="text-xs text-gray-500 -mt-1">Weil dein Auto zur Familie gehört.</p>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full flex">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  type="text"
                  placeholder="Artikel-Nr. oder Teilenamen eingeben"
                  className="pl-10 pr-4 py-2.5 rounded-l-lg border-r-0 focus:ring-[#4fd1c5] focus:border-[#4fd1c5]"
                />
                <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white rounded-l-none px-6">
                  Suchen
                </Button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Free Shipping Badge */}
              <div className="hidden lg:flex items-center gap-2 border border-[#4fd1c5] rounded-lg px-3 py-2">
                <Truck className="h-5 w-5 text-[#4fd1c5]" />
                <div className="text-xs">
                  <span className="font-semibold text-[#1e3a5f]">Gratis Versand</span>
                  <br />
                  <span className="text-gray-500">ab 120 €</span>
                </div>
              </div>

              {/* Cart */}
              <Link to="/warenkorb" className="relative flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:border-[#4fd1c5] transition-colors">
                <ShoppingCart className="h-5 w-5 text-[#1e3a5f]" />
                <div className="text-xs hidden sm:block">
                  <span className="font-semibold text-[#1e3a5f]">Warenkorb</span>
                  <br />
                  <span className="text-gray-500">{cartItems} Artikel</span>
                </div>
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4fd1c5] text-[#1e3a5f] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative w-full flex">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text"
                placeholder="Suchen..."
                className="pl-10 pr-4 py-2.5 rounded-l-lg border-r-0"
              />
              <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white rounded-l-none px-4">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* KBA Selection */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">Fahrzeugauswahl nach KBA-Nr.</h3>
              <div className="flex gap-2">
                <Input placeholder="zu 2.1/zu 2" className="flex-1" />
                <Input placeholder="zu 2.2/zu 3" className="flex-1" />
              </div>
              <Link to="/hilfe" className="text-xs text-[#4fd1c5] hover:underline mt-1 inline-block">
                › Hilfe
              </Link>
            </div>

            {/* Vehicle Type Selection */}
            <div className="lg:col-span-6">
              <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">Fahrzeugauswahl nach Kriterien</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {vehicleTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedVehicleType(type.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedVehicleType === type.id
                          ? 'bg-[#1e3a5f] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {type.name}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="--- Hersteller wählen ---" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((brand) => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="--- Modell wählen ---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model1">Modell A</SelectItem>
                    <SelectItem value="model2">Modell B</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="--- Typ wählen ---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Typ 1</SelectItem>
                    <SelectItem value="type2">Typ 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-3 bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold">
                Fahrzeug auswählen
              </Button>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">Kfz-Profis am Telefon</h3>
              <p className="text-xs text-gray-500 mb-1">Bestellung & Beratung</p>
              <a href="tel:+4319876543" className="text-lg font-bold text-[#1e3a5f] hover:text-[#4fd1c5] transition-colors">
                +43 1 987 65 43
              </a>
              <p className="text-xs text-gray-500 mt-1">Mo.-Fr. 07-20 Uhr | Sa. 09-15 Uhr</p>
              <Link to="/hilfe" className="text-xs text-[#4fd1c5] hover:underline mt-2 inline-block">
                › Hilfecenter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex flex-col gap-2">
              <Link to="/konto" className="flex items-center gap-2 py-2 text-[#1e3a5f] hover:text-[#4fd1c5]">
                <User className="h-5 w-5" /> Mein Kundenkonto
              </Link>
              <Link to="/merkzettel" className="flex items-center gap-2 py-2 text-[#1e3a5f] hover:text-[#4fd1c5]">
                <Heart className="h-5 w-5" /> Merkzettel
              </Link>
              <Link to="/newsletter" className="flex items-center gap-2 py-2 text-[#1e3a5f] hover:text-[#4fd1c5]">
                Newsletter
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
