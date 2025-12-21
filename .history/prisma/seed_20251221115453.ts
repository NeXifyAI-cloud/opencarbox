import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const kfzteileCategories = [
  { name: 'Bremsanlage', slug: 'bremsanlage', description: 'Bremsscheiben, Beläge, Schläuche...' },
  { name: 'Filter', slug: 'filter', description: 'Ölfilter, Luftfilter, Innenraumfilter...' },
  { name: 'Motor', slug: 'motor', description: 'Dichtungen, Riemen, Schmierung...' },
  { name: 'Fahrwerk', slug: 'fahrwerk', description: 'Stoßdämpfer, Federn, Lenkung...' },
  { name: 'Abgasanlage', slug: 'abgasanlage', description: 'Auspuff, Katalysator, Sensoren...' },
  { name: 'Elektrik', slug: 'elektrik', description: 'Beleuchtung, Batterien, Anlasser...' },
  { name: 'Karosserie', slug: 'karosserie', description: 'Spiegel, Stoßstangen, Kotflügel...' },
  { name: 'Kühlung', slug: 'kuehlung', description: 'Kühler, Thermostate, Wasserpumpen...' },
];

async function seed() {
  console.log('🌱 Starte kfzteile24 Seed...');

  // 1. Kategorien einfugen
  for (const cat of kfzteileCategories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Fehler bei Kategorie ${cat.name}:`, error.message);
      continue;
    }
    console.log(`✅ Kategorie erstellt: ${cat.name}`);

    // 2. Beispiel-Produkte pro Kategorie
    if (data) {
      const { error: prodError } = await supabase
        .from('products')
        .upsert([
          {
            sku: `KFZ-${data.slug.toUpperCase()}-001`,
            name: `${cat.name} Premium Set`,
            slug: `${data.slug}-premium-set`,
            description: `Hochwertige Ersatzteile für Ihre ${cat.name}. Erstausrüsterqualität.`,
            price_net: 82.50,
            price_gross: 99.00,
            category_id: data.id,
            brand: 'Carvantooo Premium',
            stock_quantity: 50,
            is_active: true,
            images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800']
          }
        ]);

      if (prodError) console.error(`❌ Fehler bei Produkten fur ${cat.name}:`, prodError.message);
    }
  }

  console.log('✅ Seed erfolgreich abgeschlossen.');
}

seed();
