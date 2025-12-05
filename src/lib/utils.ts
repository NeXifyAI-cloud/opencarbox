/**
 * Utility-Funktionen für OpenCarBox & Carvantooo
 * 
 * Zentrale Sammlung von Hilfsfunktionen, die im gesamten Projekt
 * wiederverwendet werden.
 * 
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Kombiniert CSS-Klassen mit Tailwind-Merge für konfliktfreie Klassennamen.
 * 
 * @param inputs - Beliebige Anzahl von CSS-Klassenwerten
 * @returns Bereinigte und zusammengeführte Klassenstring
 * 
 * @example
 * ```tsx
 * cn('px-4 py-2', condition && 'bg-red-500', 'px-6')
 * // Gibt 'py-2 px-6 bg-red-500' zurück (px-4 wird von px-6 überschrieben)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatiert einen Preis im deutschen/österreichischen Format.
 * 
 * @param price - Der Preis als Zahl
 * @param currency - Die Währung (Standard: EUR)
 * @returns Formatierter Preisstring
 * 
 * @example
 * ```ts
 * formatPrice(1234.56) // "1.234,56 €"
 * ```
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Formatiert ein Datum im deutschen Format.
 * 
 * @param date - Das Datum als Date-Objekt oder ISO-String
 * @param options - Zusätzliche Formatierungsoptionen
 * @returns Formatierter Datumsstring
 * 
 * @example
 * ```ts
 * formatDate(new Date()) // "5. Dezember 2024"
 * formatDate(new Date(), { short: true }) // "05.12.2024"
 * ```
 */
export function formatDate(
  date: Date | string,
  options?: { short?: boolean; withTime?: boolean }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (options?.short) {
    return new Intl.DateTimeFormat('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  }
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  
  if (options?.withTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('de-AT', formatOptions).format(dateObj);
}

/**
 * Generiert einen URL-freundlichen Slug aus einem String.
 * 
 * @param text - Der zu konvertierende Text
 * @returns URL-freundlicher Slug
 * 
 * @example
 * ```ts
 * slugify("Bremsbeläge für VW Golf") // "bremsbelaege-fuer-vw-golf"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Umlaute normalisieren
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-') // Nicht-alphanumerische Zeichen durch Bindestrich
    .replace(/^-+|-+$/g, ''); // Führende/nachfolgende Bindestriche entfernen
}

/**
 * Kürzt einen Text auf eine maximale Länge mit Ellipsis.
 * 
 * @param text - Der zu kürzende Text
 * @param maxLength - Maximale Länge (Standard: 100)
 * @returns Gekürzter Text mit "..." wenn nötig
 * 
 * @example
 * ```ts
 * truncate("Langer Produktname hier...", 20) // "Langer Produktname..."
 * ```
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Wartet eine bestimmte Zeit (für async/await).
 * 
 * @param ms - Millisekunden zum Warten
 * @returns Promise das nach der Zeit resolved
 * 
 * @example
 * ```ts
 * await sleep(1000); // Wartet 1 Sekunde
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Prüft ob ein Wert leer ist (null, undefined, leerer String, leeres Array/Object).
 * 
 * @param value - Der zu prüfende Wert
 * @returns true wenn leer, sonst false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Validiert eine österreichische UID-Nummer.
 * 
 * @param uid - Die zu prüfende UID-Nummer
 * @returns true wenn gültig, sonst false
 * 
 * @example
 * ```ts
 * isValidAustrianUID("ATU12345678") // true
 * ```
 */
export function isValidAustrianUID(uid: string): boolean {
  const pattern = /^ATU\d{8}$/;
  return pattern.test(uid);
}

/**
 * Validiert eine HSN (Herstellerschlüsselnummer) - 4 Zeichen.
 * 
 * @param hsn - Die HSN
 * @returns true wenn gültig
 */
export function isValidHSN(hsn: string): boolean {
  return /^[0-9]{4}$/.test(hsn);
}

/**
 * Validiert eine TSN (Typschlüsselnummer) - 3 Zeichen.
 * 
 * @param tsn - Die TSN
 * @returns true wenn gültig
 */
export function isValidTSN(tsn: string): boolean {
  return /^[A-Z0-9]{3}$/i.test(tsn);
}

/**
 * Generiert eine zufällige ID.
 * 
 * @param length - Länge der ID (Standard: 8)
 * @returns Zufällige alphanumerische ID
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce-Funktion für Performance-Optimierung.
 * 
 * @param func - Die zu debouncende Funktion
 * @param wait - Wartezeit in ms
 * @returns Debounced Funktion
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Formatiert eine Dateigröße in lesbares Format.
 * 
 * @param bytes - Größe in Bytes
 * @returns Formatierte Größe (z.B. "1,5 MB")
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toLocaleString('de-AT', { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
}

/**
 * Gruppiert ein Array nach einem Schlüssel.
 * 
 * @param array - Das zu gruppierende Array
 * @param key - Der Schlüssel zum Gruppieren
 * @returns Objekt mit gruppierten Arrays
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Berechnet den Rabatt-Prozentsatz.
 * 
 * @param originalPrice - Ursprünglicher Preis
 * @param salePrice - Reduzierter Preis
 * @returns Rabatt in Prozent (gerundet)
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

