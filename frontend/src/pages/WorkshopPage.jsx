import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { workshopServices } from '../data/mockData';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  Wrench, ClipboardList, Droplet, Disc, Circle, Wind, ShieldCheck, Loader
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const iconMap = {
  ClipboardList,
  Droplet,
  Disc,
  Circle,
  Wind,
  ShieldCheck,
  Wrench
};

const WorkshopPage = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    vehicle: ''
  });

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/workshop/appointments`, {
        ...formData,
        serviceId: selectedService.id,
        serviceName: selectedService.name
      });
      setIsBookingOpen(false);
      toast({
        title: "Terminanfrage gesendet",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });
      setFormData({ name: '', email: '', phone: '', date: '', vehicle: '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Konnte Anfrage nicht senden. Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#1e3a5f] text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              OpenCarBox Werkstatt
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
              Ihr Meisterbetrieb für professionellen Service, Reparaturen und Wartung. 
              Kompetent, zuverlässig und fair.
            </p>
            <Button 
              size="lg" 
              className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-12 px-8 text-lg"
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            >
              Services entdecken
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mb-6 text-[#1e3a5f]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1e3a5f]">Meisterqualität</h3>
                <p className="text-gray-600 max-w-xs">Erfahrene KFZ-Meister und modernste Diagnosegeräte garantieren besten Service.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mb-6 text-[#1e3a5f]">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1e3a5f]">Zentral gelegen</h3>
                <p className="text-gray-600 max-w-xs">Einfach zu erreichen im Herzen von Wien mit perfekter Anbindung.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mb-6 text-[#1e3a5f]">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-[#1e3a5f]">Schnelle Termine</h3>
                <p className="text-gray-600 max-w-xs">Online buchen, Termin sofort erhalten und Wartezeiten vermeiden.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-12 text-center">Unsere Leistungen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshopServices.map((service) => {
              const Icon = iconMap[service.icon] || Wrench;
              
              return (
                <Card key={service.id} className="hover:shadow-xl transition-shadow border-gray-200 overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-[#e6fffa] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors duration-300">
                      <Icon className="h-6 w-6 text-[#1e3a5f] group-hover:text-[#4fd1c5] transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-[#1e3a5f] text-xl">{service.name}</CardTitle>
                    <CardDescription className="mt-2 text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <Clock className="h-4 w-4" /> {service.duration}
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block mb-0.5">ab</span>
                        <span className="font-bold text-[#1e3a5f] text-2xl">
                          {service.priceFrom.toFixed(2).replace('.', ',')} €
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50/50">
                    <Button 
                      className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold h-11"
                      onClick={() => {
                        setSelectedService(service);
                        setIsBookingOpen(true);
                      }}
                    >
                      Termin vereinbaren
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1e3a5f]">Termin anfragen</DialogTitle>
              <DialogDescription>
                Für: <span className="font-semibold text-[#1e3a5f]">{selectedService?.name}</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBook} className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max Mustermann" value={formData.name} onChange={handleInputChange} required className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="max@mail.com" value={formData.email} onChange={handleInputChange} required className="h-11" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" placeholder="+43 ..." value={formData.phone} onChange={handleInputChange} required className="h-11" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Wunschtermin</Label>
                <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Fahrzeug (Marke/Modell)</Label>
                <Input id="vehicle" placeholder="z.B. VW Golf VII" value={formData.vehicle} onChange={handleInputChange} required className="h-11" />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="w-full bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-12 text-lg" disabled={loading}>
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Kostenpflichtig anfragen"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default WorkshopPage;
