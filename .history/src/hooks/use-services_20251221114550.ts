import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Service = Database['public']['Tables']['services']['Row'];

/**
 * Hook zum Laden von Services aus Supabase
 * @returns Query-Resultat mit Services
 */
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook zum Laden eines einzelnen Services per Slug
 * @param slug - Der URL-Slug des Services
 * @returns Query-Resultat mit Servicedaten
 */
export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
