import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Lade .env.local explizit
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Fehler: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

  for (const cat of kfzteileCategories) {
    const { data: category, error: catError } = await supabase
      .from('categories')
      .upsert({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        is_active: true
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (catError) {
      console.error(`❌ Fehler bei Kategorie ${cat.name}:`, catError.message);
      continue;
    }
    console.log(`✅ Kategorie erstellt: ${cat.name}`);

    if (category) {
      const { error: prodError } = await supabase
        .from('products')
        .upsert([
          {
            sku: `KFZ-${cat.slug.toUpperCase()}-001`,
            name: `${cat.name} Premium Set`,
            slug: `${cat.slug}-premium-set`,
            description: `Hochwertige Ersatzteile für Ihre ${cat.name}. Erstausrüsterqualität.`,
            price_net: 82.50,
            price_gross: 99.00,
            category_id: category.id,
            brand: 'Carvantooo Premium',
            stock_quantity: 50,
            is_active: true,
            images: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800']
          }
        ], { onConflict: 'sku' });

      if (prodError) console.error(`❌ Fehler bei Produkten für ${cat.name}:`, prodError.message);
    }
  }

  console.log('✅ Seed erfolgreich abgeschlossen.');
}

seed();
