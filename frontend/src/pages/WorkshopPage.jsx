import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { workshopServices } from '../data/mockData';
import { 
  Calendar, Clock, MapPin, CheckCircle2, 
  Wrench, ClipboardList, Droplet, Disc, Circle, Wind, ShieldCheck 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';

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

  const handleBook = (e) => {
    e.preventDefault();
    setIsBookingOpen(false);
    toast({
      title: "Terminanfrage gesendet",
      description: "Wir werden uns in Kürze bei Ihnen melden.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-[#1e3a5f] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              OpenCarBox Werkstatt
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8">
              Ihr Meisterbetrieb für professionellen Service, Reparaturen und Wartung. 
              Kompetent, zuverlässig und fair.
            </p>
            <Button 
              size="lg" 
              className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold"
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
            >
              Services entdecken
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3a5f]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1e3a5f]">Meisterqualität</h3>
                <p className="text-gray-600">Erfahrene KFZ-Meister und modernste Diagnosegeräte.</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3a5f]">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1e3a5f]">Zentral gelegen</h3>
                <p className="text-gray-600">Einfach zu erreichen im Herzen von Wien.</p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3a5f]">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1e3a5f]">Schnelle Termine</h3>
                <p className="text-gray-600">Online buchen und Wartezeiten vermeiden.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-16 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-10 text-center">Unsere Leistungen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopServices.map((service) => {
              const Icon = iconMap[service.icon] || Wrench;
              
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow border-gray-200">
                  <CardHeader>
                    <div className="w-10 h-10 bg-[#e6fffa] rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#1e3a5f]" />
                    </div>
                    <CardTitle className="text-[#1e3a5f]">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {service.duration}
                      </span>
                      <span className="font-bold text-[#1e3a5f] text-lg">
                        ab {service.priceFrom.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f]"
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Termin anfragen</DialogTitle>
              <DialogDescription>
                Für: <span className="font-semibold text-[#1e3a5f]">{selectedService?.name}</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBook} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max Mustermann" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" placeholder="max@beispiel.at" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" placeholder="+43 664 ..." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Wunschtermin</Label>
                <Input id="date" type="date" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Fahrzeug (Marke/Modell)</Label>
                <Input id="vehicle" placeholder="z.B. VW Golf VII" required />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold">
                  Anfrage senden
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
