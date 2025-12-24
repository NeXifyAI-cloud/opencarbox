import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import { Button } from '../ui/button';

const AppBanner = () => {
  return (
    <section className="mt-10">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-8">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="bg-white/10 rounded-2xl p-4">
              <Smartphone className="h-12 w-12 text-[#4fd1c5]" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                Spare auch in unserer App
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                Exklusive Angebote und schneller Zugriff auf alle Teile
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="bg-white text-[#1e3a5f] hover:bg-gray-100 flex items-center gap-2">
              <Download className="h-5 w-5" />
              iOS App
            </Button>
            <Button className="bg-[#4fd1c5] text-[#1e3a5f] hover:bg-[#38b2ac] flex items-center gap-2">
              <Download className="h-5 w-5" />
              Android App
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppBanner;
