import { type FC } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  variant?: 'default' | 'shop' | 'service';
}

/**
 * Globaler Footer für OpenCarBox & Carvantooo
 */
export const Footer: FC<FooterProps> = ({ variant = 'default' }) => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 overflow-hidden relative">
      <div className="container-content relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className={cn(
                "text-2xl font-display font-bold tracking-tighter",
                variant === 'shop' ? "text-carvantooo-500" : "text-opencarbox-500"
              )}>
                {variant === 'shop' ? 'CARVANTOOO' : 'OPENCARBOX'}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Ihr Partner für professionellen KFZ-Service, erstklassigen Autohandel
              und Premium-Ersatzteile. Weil Qualität keine Kompromisse duldet.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-carvantooo-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-carvantooo-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-carvantooo-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/werkstatt" className="text-slate-400 hover:text-white transition-colors text-sm">Inspektion & Wartung</Link>
              </li>
              <li>
                <Link href="/werkstatt" className="text-slate-400 hover:text-white transition-colors text-sm">Reparatur & Instandsetzung</Link>
              </li>
              <li>
                <Link href="/werkstatt" className="text-slate-400 hover:text-white transition-colors text-sm">Reifenservice</Link>
              </li>
              <li>
                <Link href="/fahrzeuge" className="text-slate-400 hover:text-white transition-colors text-sm">Gebrauchtwagenkauf</Link>
              </li>
              <li>
                <Link href="/shop" className="text-slate-400 hover:text-white transition-colors text-sm">Ersatzteile-Shop</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/uber-uns" className="text-slate-400 hover:text-white transition-colors text-sm">Über uns</Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-slate-400 hover:text-white transition-colors text-sm">Kontakt</Link>
              </li>
              <li>
                <Link href="/karriere" className="text-slate-400 hover:text-white transition-colors text-sm">Karriere</Link>
              </li>
              <li>
                <Link href="/impressum" className="text-slate-400 hover:text-white transition-colors text-sm">Impressum</Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-slate-400 hover:text-white transition-colors text-sm">Datenschutz</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-carvantooo-500 shrink-0" />
                <span className="text-slate-400 text-sm">Rennweg 76, 1030 Wien,<br />Österreich</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-carvantooo-500 shrink-0" />
                <a href="tel:+43179813410" className="text-slate-400 hover:text-white transition-colors text-sm">+43 1 798 134 10</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-carvantooo-500 shrink-0" />
                <a href="mailto:office@opencarbox.at" className="text-slate-400 hover:text-white transition-colors text-sm">office@opencarbox.at</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} OpenCarBox GmbH. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-slate-600 text-[10px] font-mono">FN 534799 w</span>
            <span className="text-slate-600 text-[10px] font-mono">ATU75630015</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-carvantooo-500/10 rounded-full blur-3xl pointer-events-none" />
    </footer>
  );
