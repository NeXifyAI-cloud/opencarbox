import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { workshopServices } from '../data/mockData';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  Wrench, ClipboardList, Droplet, Disc, Circle, Wind, ShieldCheck, Loader, Star, MessageCircle, Zap
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
        serviceId: selectedService?.id || 'general',
        serviceName: selectedService?.name || 'Allgemeine Anfrage'
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
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-20">
             <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1974" alt="Workshop" className="w-full h-full object-cover" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#4fd1c5]/20 text-[#4fd1c5] px-3 py-1 rounded-full text-sm font-bold mb-4 border border-[#4fd1c5]/30">
              <Star className="h-4 w-4 fill-current" /> Zertifizierte Fachwerkstatt
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display leading-tight">
              KFZ-Service der <br/>
              <span className="text-[#4fd1c5]">nächsten Generation</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
              Modernste Werkstatt-Technologie trifft auf jahrelange Expertise. 
              Bei OpenCarBox in Wien 1030.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> Qualitätsgarantie</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> Express-Service</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> 1000+ Kunden</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-14 px-8 text-lg shadow-lg shadow-[#4fd1c5]/20"
                onClick={() => {
                    setSelectedService({name: 'Allgemeine Anfrage'});
                    setIsBookingOpen(true);
                }}
              >
                Sofort Termin buchen
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold h-14 px-8 text-lg backdrop-blur-sm"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              >
                Services ansehen
              </Button>
            </div>
          </div>
        </section>

        {/* DPF Special Offer */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4fd1c5] opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <div className="text-[#4fd1c5] font-bold mb-2 tracking-wider text-sm uppercase">DPF Service • Festpreis</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Professionelle DPF-Reinigung</h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    Reinigung ohne Zerlegung - bis zu 100% Reinigung zum transparenten Festpreis.
                    Umweltschonend & effizient.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span>Diagnose & Analyse</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span>Reinigung ohne Zerlegung</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span>Prüfung & Übergabe</span>
                    </li>
                  </ul>
                  <Button 
                    className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-12 px-8"
                    onClick={() => {
                        setSelectedService({id: 'dpf', name: 'DPF-Reinigung Spezial'});
                        setIsBookingOpen(true);
                    }}
                  >
                    Jetzt Termin buchen
                  </Button>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
                  <div className="text-sm uppercase tracking-wide text-gray-300 mb-2">Aktionspreis</div>
                  <div className="text-6xl font-bold text-white mb-2">299€</div>
                  <div className="text-[#4fd1c5] font-bold">Festpreis</div>
                  <div className="mt-6 text-sm text-gray-400">Keine versteckten Kosten.<br/>Sofort verfügbar.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Unsere KFZ-Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Von der klassischen Reparatur bis zur kompletten Fahrzeugpflege - 
              OpenCarBox bietet Ihnen alle Automotive-Dienstleistungen unter einem Dach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshopServices.map((service) => {
              const Icon = iconMap[service.icon] || Wrench;
              
              return (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden group hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-[#e6fffa] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors duration-300">
                      <Icon className="h-7 w-7 text-[#1e3a5f] group-hover:text-[#4fd1c5] transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-[#1e3a5f] text-xl font-bold">{service.name}</CardTitle>
                    <CardDescription className="mt-3 text-base leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-end pt-6 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
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
                  <CardFooter className="bg-gray-50/50 pt-6">
                    <Button 
                      className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold h-12 text-base shadow-md hover:shadow-lg transition-all"
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

        {/* Why Us */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Warum OpenCarBox?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ihre Vorteile bei der zertifizierten Fachwerkstatt in Wien.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">WhatsApp Support</h3>
                <p className="text-gray-600">Schnelle Kommunikation für Termine und Rückfragen. Immer für Sie erreichbar.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Express-Service</h3>
                <p className="text-gray-600">Schnelle Bearbeitung bei Eilaufträgen. Viele Reparaturen noch am selben Tag möglich.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Transparente Preise</h3>
                <p className="text-gray-600">Keine versteckten Kosten. Sie wissen immer genau, wofür Sie bezahlen.</p>
              </div>
            </div>
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
                  {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Kostenlos anfragen"}
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
