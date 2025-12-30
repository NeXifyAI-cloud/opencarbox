import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { companyConfig } from '../config/company';

const KontaktPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Nachricht gesendet",
      description: "Vielen Dank! Wir werden uns schnellstmöglich bei Ihnen melden.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#4fd1c5]">Startseite</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1e3a5f]">Kontakt</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Kontakt</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-6">Schreiben Sie uns</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Ihr Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="ihre@email.at" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Betreff</Label>
                <Input id="subject" placeholder="Worum geht es?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Nachricht</Label>
                <Textarea id="message" placeholder="Ihre Nachricht an uns..." className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-bold">
                Nachricht senden
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-[#1e3a5f] mb-6">Kontaktdaten</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-full h-fit text-[#1e3a5f]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Telefon</h3>
                    <p className="text-gray-600"><a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`} className="hover:text-[#4fd1c5]">{companyConfig.contact.phone}</a></p>
                    <p className="text-sm text-gray-500 mt-1">Mo-Fr: 08:00 - 18:00 Uhr</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-full h-fit text-[#1e3a5f]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">E-Mail</h3>
                    <p className="text-gray-600"><a href={`mailto:${companyConfig.contact.email}`} className="hover:text-[#4fd1c5]">{companyConfig.contact.email}</a></p>
                    <p className="text-sm text-gray-500 mt-1">Wir antworten i.d.R. innerhalb von 24h</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-full h-fit text-[#1e3a5f]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Anschrift</h3>
                    <p className="text-gray-600">{companyConfig.legalName}</p>
                    <p className="text-gray-600">{companyConfig.address.street}</p>
                    <p className="text-gray-600">{companyConfig.address.zip} {companyConfig.address.city}, {companyConfig.address.country}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#1e3a5f] rounded-lg shadow-sm p-8 text-white">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Öffnungszeiten Shop & Werkstatt
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Montag - Freitag</span>
                  <span className="font-bold">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Samstag</span>
                  <span className="font-bold">09:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KontaktPage;
