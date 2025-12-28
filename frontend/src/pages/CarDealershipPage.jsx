import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { 
  Fuel, Gauge, Calendar, Cog, Filter, ChevronRight, Phone, Loader, AlertCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from '../components/ui/checkbox';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CarDealershipPage = () => {
  const [filterBrand, setFilterBrand] = useState('all');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, [filterBrand]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterBrand !== 'all') params.brand = filterBrand;
      
      const response = await axios.get(`${API}/vehicles`, { params });
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      // Fallback if backend is empty (for demo purposes) or fails
      // We don't want to break the page for the user if the backend is fresh
      setCars([]); 
      setError("Momentan sind keine Fahrzeuge verfügbar.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique brands for filter (if we had a list endpoint, we'd use that)
  // For now, we hardcode common brands or extract from cars if available
  const brands = ['all', 'Volkswagen', 'Audi', 'BMW', 'Mercedes-Benz', 'Tesla', 'Porsche'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f] font-medium">Fahrzeugmarkt</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-[#1e3a5f] rounded-xl p-8 mb-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-display">OpenCarBox Autohandel</h1>
            <p className="text-gray-300 text-lg max-w-xl">Geprüfte Gebrauchtwagen und Neuwagen mit umfassender Garantie und Finanzierung.</p>
          </div>
          <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-12 px-8 relative z-10 whitespace-nowrap">
            Fahrzeug verkaufen
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-[#1e3a5f] mb-6 flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" /> Filter
              </h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Marke</h4>
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Marke wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b} value={b}>{b === 'all' ? 'Alle Marken' : b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Preis bis</h4>
                <input type="range" min="5000" max="150000" className="w-full accent-[#1e3a5f]" />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span>5.000€</span>
                  <span>150.000€</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Kraftstoff</h4>
                <div className="space-y-3">
                  {['Benzin', 'Diesel', 'Elektro', 'Hybrid'].map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <Checkbox id={f} className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                      <label htmlFor={f} className="text-sm text-gray-600 cursor-pointer">{f}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#1e3a5f]">
                Filter zurücksetzen
              </Button>
            </div>
          </div>

          {/* Car Listing */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader className="h-10 w-10 animate-spin text-[#1e3a5f]" />
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Keine Fahrzeuge gefunden</h3>
                <p className="text-gray-500">Bitte passen Sie Ihre Filter an oder schauen Sie später wieder vorbei.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={car.image || 'https://via.placeholder.com/800x600?text=Kein+Bild'} 
                        alt={`${car.brand} ${car.model}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <Badge className={`absolute top-4 right-4 ${car.is_new ? 'bg-[#1e3a5f]' : 'bg-gray-700'} text-white font-bold px-3 py-1`}>
                        {car.is_new ? 'Neuwagen' : 'Gebraucht'}
                      </Badge>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-bold text-[#1e3a5f] text-xl leading-tight">{car.brand} {car.model}</h2>
                          <p className="text-sm text-gray-500 mt-1">{car.variant}</p>
                        </div>
                        <span className="text-2xl font-bold text-[#1e3a5f] whitespace-nowrap">
                          {car.price.toLocaleString('de-DE')} €
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#4fd1c5]" />
                          <span>EZ {car.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-[#4fd1c5]" />
                          <span>{car.mileage?.toLocaleString('de-DE')} km</span>
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

                      <div className="mt-auto flex gap-3">
                        <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#2d4a6f] font-bold h-11">
                          Details ansehen
                        </Button>
                        <Button variant="outline" className="px-4 border-gray-200 text-[#1e3a5f] hover:bg-gray-50 h-11 w-14 flex items-center justify-center">
                          <Phone className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDealershipPage;
