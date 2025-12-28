import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { workshopServices } from '../data/mockData';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  Wrench, ClipboardList, Droplet, Disc, Circle, Wind, ShieldCheck, Loader, Star, MessageCircle, Zap, ArrowRight, Car
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { companyConfig } from '../config/company';

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

  const testimonials = [
    {
      name: "Maria Schmidt",
      location: "Wien 1030",
      text: "Sehr professioneller Service! Mein Auto wurde schnell und professionell repariert. Das Team ist freundlich und kompetent.",
      verified: true
    },
    {
      name: "Thomas Müller",
      location: "Wien 1020",
      text: "Pickerl-Überprüfung war super schnell erledigt. Keine Wartezeit und sehr transparent. Kann ich nur weiterempfehlen!",
      verified: true
    },
    {
      name: "Sandra Weber",
      location: "Wien 1100",
      text: "Nach einem Unfall hat OpenCarBox mein Auto wie neu gemacht. Karosserie und Lackierung sind perfekt. Vielen Dank!",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#1e3a5f] text-white py-24 overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0 opacity-30">
             <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1974" alt="Workshop" className="w-full h-full object-cover" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="text-center md:text-left md:w-1/2">
                <div className="inline-flex items-center gap-2 bg-[#4fd1c5]/20 text-[#4fd1c5] px-3 py-1 rounded-full text-sm font-bold mb-6 border border-[#4fd1c5]/30">
                  <Star className="h-4 w-4 fill-current" /> Zertifizierte Fachwerkstatt
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display leading-tight">
                  KFZ-Service der <br/>
                  <span className="text-[#4fd1c5]">nächsten Generation</span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  Modernste Werkstatt-Technologie trifft auf jahrelange Expertise. 
                  Bei {companyConfig.legalName} in {companyConfig.address.city} {companyConfig.address.zip}.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                  <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold h-14 px-8 text-lg backdrop-blur-sm"
                    >
                      {companyConfig.contact.phone}
                    </Button>
                  </a>
                </div>
                <p className="mt-6 text-gray-300 text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 text-[#4fd1c5]" /> {companyConfig.address.street}, {companyConfig.address.zip} {companyConfig.address.city} • Mo-Fr 8:00-18:00
                </p>
              </div>
              
              {/* Express Services Quick Links */}
              <div className="md:w-1/2 w-full">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#4fd1c5]" /> Express-Services
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setSelectedService({name: '§57a Pickerl'}); setIsBookingOpen(true); }} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-left transition-colors group">
                      <div className="font-bold group-hover:text-[#4fd1c5]">§57a Pickerl</div>
                      <div className="text-xs text-gray-400 mt-1">Offizielle Überprüfung</div>
                    </button>
                    <button onClick={() => { setSelectedService({name: 'Ölwechsel'}); setIsBookingOpen(true); }} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-left transition-colors group">
                      <div className="font-bold group-hover:text-[#4fd1c5]">Ölwechsel</div>
                      <div className="text-xs text-gray-400 mt-1">Mit Qualitätsöl</div>
                    </button>
                    <button onClick={() => { setSelectedService({name: 'Reifenwechsel'}); setIsBookingOpen(true); }} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-left transition-colors group">
                      <div className="font-bold group-hover:text-[#4fd1c5]">Reifenwechsel</div>
                      <div className="text-xs text-gray-400 mt-1">Schnell & professionell</div>
                    </button>
                    <button onClick={() => { setSelectedService({name: 'Klimaservice'}); setIsBookingOpen(true); }} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-left transition-colors group">
                      <div className="font-bold group-hover:text-[#4fd1c5]">Klimaservice</div>
                      <div className="text-xs text-gray-400 mt-1">Wartung & Reparatur</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DPF Special Offer */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4fd1c5] opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#4fd1c5]/20 rounded-full text-[#4fd1c5] font-bold mb-4 tracking-wider text-xs uppercase border border-[#4fd1c5]/30">
                    DPF Service • Festpreis
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Professionelle DPF-Reinigung</h2>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Reinigung ohne Zerlegung - bis zu 100% Reinigung zum transparenten Festpreis.
                    Umweltschonend & effizient.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span className="text-sm font-medium">Diagnose & Analyse</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span className="text-sm font-medium">Reinigung ohne Zerlegung</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span className="text-sm font-medium">Prüfung & Übergabe</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4fd1c5]/20 p-1.5 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#4fd1c5]" /></div>
                      <span className="text-sm font-medium">25 Jahre Erfahrung</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
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
                </div>
                
                {/* Price Card */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="text-sm uppercase tracking-wide text-gray-300 mb-2 font-medium">Aktionspreis</div>
                    <div className="flex items-start justify-center gap-1 mb-2">
                        <span className="text-6xl font-bold text-white">299</span>
                        <span className="text-2xl font-bold text-white mt-2">€</span>
                    </div>
                    <div className="text-[#4fd1c5] font-bold text-lg mb-6">Festpreis</div>
                    <div className="space-y-2 text-sm text-gray-300 border-t border-white/10 pt-6">
                        <p>Keine versteckten Kosten</p>
                        <p>Sofort verfügbar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">Unsere KFZ-Services in Wien</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Von der klassischen Reparatur bis zur kompletten Fahrzeugpflege - 
              {companyConfig.name} bietet Ihnen alle Automotive-Dienstleistungen unter einem Dach.
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
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Ihre Vorteile bei {companyConfig.name}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Als Ihre KFZ-Fachwerkstatt in Wien bieten wir Ihnen erstklassigen Service mit vielen Zusatzleistungen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-[#e6fffa] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-[#1e3a5f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">WhatsApp Support</h3>
                <p className="text-gray-600">Schnelle Kommunikation für Termine und Rückfragen. Immer erreichbar.</p>
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
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">Transparente Festpreise</h3>
                <p className="text-gray-600">Keine versteckten Kosten - Sie wissen immer, was Sie bezahlen.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Was unsere Kunden sagen</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Über 1000 zufriedene Kunden vertrauen auf unsere Expertise seit 2020.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
                        {t.name[0]}
                    </div>
                    <div>
                        <div className="font-bold text-[#1e3a5f]">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.location}</div>
                    </div>
                  </div>
                  {t.verified && (
                      <div className="absolute top-8 right-8 flex items-center gap-1 text-xs text-green-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Verifiziert
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Used Cars Teaser */}
        <section className="py-20 bg-[#162d47] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1e3a5f] skew-x-12 transform translate-x-20"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Geprüfte Gebrauchtwagen</h2>
                        <p className="text-gray-300 mb-8 text-lg">
                            Entdecken Sie unsere Auswahl an hochwertigen Gebrauchtwagen. Jedes Fahrzeug wird von unseren Experten gründlich geprüft und kommt mit Garantie.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> <span>Umfassende technische Prüfung</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> <span>Transparente Fahrzeughistorie</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-[#4fd1c5]" /> <span>Finanzierungsmöglichkeiten verfügbar</span>
                            </li>
                        </ul>
                        <Link to="/fahrzeuge">
                            <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold h-12 px-8">
                                Fahrzeuge ansehen <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop" alt="Used Cars" className="rounded-2xl shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500" />
                        <div className="absolute -bottom-6 -left-6 bg-white text-[#1e3a5f] p-6 rounded-xl shadow-xl hidden md:block">
                            <div className="flex items-center gap-3">
                                <Car className="h-8 w-8 text-[#4fd1c5]" />
                                <div>
                                    <div className="font-bold text-xl">Top Auswahl</div>
                                    <div className="text-sm text-gray-500">Sofort verfügbar</div>
                                </div>
                            </div>
                        </div>
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
