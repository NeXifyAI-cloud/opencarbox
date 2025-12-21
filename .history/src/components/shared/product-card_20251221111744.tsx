import { type FC } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props für die ProductCard Komponente
 */
interface ProductCardProps {
  id: string | number;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  className?: string;
  onAddToCart?: (id: string | number) => void;
}

/**
 * Premium Produktkarte für den Carvantooo Shop.
 * Implementiert das Design-System für Automotive E-Commerce.
 */
export const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  slug,
  brand,
  price,
  image,
  rating = 0,
  reviews = 0,
  className,
  onAddToCart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "card-premium group flex flex-col h-full overflow-hidden bg-white border border-slate-200 rounded-2xl transition-all hover:shadow-2xl hover:shadow-carvantooo-500/10 hover:border-carvantooo-200",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Quick Add Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(id);
          }}
          aria-label="In den Warenkorb"
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 hover:bg-carvantooo-500 hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-[10px] font-bold uppercase tracking-widest text-carvantooo-500 mb-2">
          {brand}
        </div>

        <Link href={`/shop/produkte/${slug}`} className="block group/title">
          <h3 className="font-display font-bold text-slate-900 mb-2 group-hover/title:text-carvantooo-600 transition-colors line-clamp-2 min-h-[3rem]">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5 fill-current",
                  i >= Math.floor(rating) && "text-slate-200 fill-none"
                )}
              />
            ))}
          </div>
          {reviews > 0 && (
            <span className="text-xs text-slate-400 font-medium">({reviews})</span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preis</span>
            <div className="text-xl font-display font-bold text-slate-900">
              € {price.toFixed(2)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="p-0 text-carvantooo-600 font-bold hover:bg-transparent hover:gap-2 transition-all"
          >
            <Link href={`/shop/produkte/${slug}`}>
              Details <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
