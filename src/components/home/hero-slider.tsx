'use client';

import { Button } from '@/components/ui/button';
import { bannerSlides } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlight Angebote"
    >
      {/* Slides */}
      <div className="relative h-[300px] md:h-[400px]">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} von ${bannerSlides.length}`}
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 via-[#1e3a5f]/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 max-w-lg">
                <span className="text-[#4fd1c5] text-sm font-semibold uppercase tracking-wider">
                  Angebot
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-2">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-6">
                  {slide.subtitle}
                </p>
                <Link href="/angebote">
                  <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] font-semibold px-6 py-3">
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Vorheriges Banner"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#4fd1c5] outline-none"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Nächstes Banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#4fd1c5] outline-none"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Gehe zu Banner ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[#4fd1c5] outline-none ${
              index === currentSlide
                ? 'bg-[#4fd1c5] w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
