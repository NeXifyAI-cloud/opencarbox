import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

/**
 * Hook zum Laden von Produkten aus Supabase
 * @param categorySlug - Optionaler Filter nach Kategorie
 * @returns Query-Resultat mit Produkten
 */
export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true);

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook zum Laden eines einzelnen Produkts per Slug
 * @param slug - Der URL-Slug des Produkts
 * @returns Query-Resultat mit Produktdaten
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
