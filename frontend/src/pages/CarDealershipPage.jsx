import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { carsForSale } from '../data/mockData';
import { 
  Fuel, Gauge, Calendar, Cog, Filter, ChevronRight, Phone 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from '../components/ui/checkbox';

const CarDealershipPage = () => {
  const [filterBrand, setFilterBrand] = useState('all');

  const filteredCars = filterBrand === 'all' 
    ? carsForSale 
    : carsForSale.filter(car => car.brand === filterBrand);

  const brands = ['all', ...new Set(carsForSale.map(car => car.brand))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium">Fahrzeugmarkt</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-[#1e3a5f] rounded-lg p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">OpenCarBox Autohandel</h1>
            <p className="text-gray-300">Geprüfte Gebrauchtwagen und Neuwagen mit Garantie.</p>
          </div>
          <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold">
            Fahrzeug verkaufen
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-6">
              <h3 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Marke</h4>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Marke wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Marken</SelectItem>
                    {brands.filter(b => b !== 'all').map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preis bis</h4>
                <input type="range" min="5000" max="150000" className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5.000€</span>
                  <span>150.000€</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Kraftstoff</h4>
                <div className="space-y-2">
                  {['Benzin', 'Diesel', 'Elektro', 'Hybrid'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Checkbox id={f} />
                      <label htmlFor={f} className="text-sm text-gray-600">{f}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Car Listing */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-[#1e3a5f] text-white">
                      {car.isNew ? 'Neuwagen' : 'Gebraucht'}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="font-bold text-[#1e3a5f] text-lg">{car.brand} {car.model}</h2>
                        <p className="text-sm text-gray-500">{car.variant}</p>
                      </div>
                      <span className="text-xl font-bold text-[#1e3a5f]">
                        {car.price.toLocaleString('de-DE')} €
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 my-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#4fd1c5]" />
                        <span>EZ {car.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-[#4fd1c5]" />
                        <span>{car.mileage.toLocaleString('de-DE')} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-[#4fd1c5]" />
                        <span>{car.fuel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cog className="h-4 w-4 text-[#4fd1c5]" />
                        <span>{car.transmission}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#2d4a6f]">
                        Details
                      </Button>
                      <Button variant="outline" className="px-3 border-[#1e3a5f] text-[#1e3a5f] hover:bg-gray-50">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDealershipPage;
