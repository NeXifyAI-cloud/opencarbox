/**
 * Hero Component - OpenCarBox & Carvantooo
 *
 * Premium Hero-Section für Landing Pages mit Brand-Varianten.
 * Unterstützt verschiedene Layouts und Animationen.
 *
 * @module components/shared/hero
 */

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

/**
 * Hero Props Interface
 */
interface HeroProps {
  /**
   * Hauptüberschrift
   */
  title: string;
  /**
   * Hervorgehobener Teil des Titels
   */
  titleHighlight?: string;
  /**
   * Untertitel / Beschreibung
   */
  subtitle?: string;
  /**
   * Brand-Variante für Farben
   */
  variant?: 'carvantooo' | 'opencarbox';
  /**
   * Primärer CTA Button
   */
  primaryCta?: {
    label: string;
    href: string;
  };
  /**
   * Sekundärer CTA Button
   */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /**
   * Hintergrundbild URL
   */
  backgroundImage?: string;
  /**
   * Overlay-Stärke (0-100)
   */
  overlayOpacity?: number;
  /**
   * Layout-Variante
   */
  layout?: 'centered' | 'left' | 'split';
  /**
   * Zusätzliche CSS-Klassen
   */
  className?: string;
  /**
   * Children für custom content
   */
  children?: React.ReactNode;
}

/**
 * Hero Component
 */
export function Hero({
  title,
  titleHighlight,
  subtitle,
  variant = 'opencarbox',
  primaryCta,
  secondaryCta,
  backgroundImage,
  overlayOpacity = 60,
  layout = 'centered',
  className,
  children,
}: HeroProps) {
  const isCarvantooo = variant === 'carvantooo';

  return (
    <section
      className={cn(
        'relative min-h-[600px] flex items-center overflow-hidden',
        layout === 'centered' && 'justify-center text-center',
        layout === 'left' && 'justify-start',
        className
      )}
    >
      {/* Background */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 bg-slate-900"
            style={{ opacity: overlayOpacity / 100 }}
          />
        </>
      ) : (
        <div
          className={cn(
            'absolute inset-0',
            isCarvantooo
              ? 'bg-gradient-to-br from-carvantooo-600 via-carvantooo-500 to-carvantooo-700'
              : 'bg-gradient-to-br from-opencarbox-600 via-opencarbox-500 to-opencarbox-700'
          )}
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-20',
            isCarvantooo ? 'bg-carvantooo-400' : 'bg-opencarbox-400'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-10',
            isCarvantooo ? 'bg-carvantooo-300' : 'bg-opencarbox-300'
          )}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          'relative z-10 container mx-auto px-4 py-20',
          layout === 'centered' && 'max-w-4xl',
          layout === 'left' && 'max-w-3xl'
        )}
      >
        <h1
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6',
            'leading-tight'
          )}
        >
          {title}
          {titleHighlight && (
            <>
              <br />
              <span
                className={cn(
                  'bg-clip-text text-transparent',
                  isCarvantooo
                    ? 'bg-gradient-to-r from-carvantooo-200 to-white'
                    : 'bg-gradient-to-r from-opencarbox-200 to-white'
                )}
              >
                {titleHighlight}
              </span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              'flex flex-wrap gap-4',
              layout === 'centered' && 'justify-center'
            )}
          >
            {primaryCta && (
              <Button
                asChild
                variant={isCarvantooo ? 'primary-red' : 'primary-blue'}
                size="lg"
                className="group"
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
            {secondaryCta && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        )}

        {/* Custom Children */}
        {children}
      </div>
    </section>
  );
}

export default Hero;
