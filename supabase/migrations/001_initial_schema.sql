-- ===========================================
-- OpenCarBox & Carvantooo - Initiales Datenbank-Schema
-- Supabase PostgreSQL Migration
-- ===========================================
-- Projekt: nbdgamjagmptwphzqkpe
-- Erstellt: 2024-12-05
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- BENUTZER & PROFILE
-- ===========================================

-- Erweiterte Benutzerprofile (verknüpft mit auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS für profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihr eigenes Profil lesen" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Benutzer können ihr eigenes Profil aktualisieren" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins können alle Profile lesen" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger für Profil-Erstellung bei User-Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- FAHRZEUGE (MEINE GARAGE)
-- ===========================================

CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hsn TEXT,
  tsn TEXT,
  license_plate TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vin TEXT,
  nickname TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnelle HSN/TSN-Suche
CREATE INDEX idx_vehicles_hsn_tsn ON public.vehicles(hsn, tsn);
CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);

-- RLS für vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Fahrzeuge verwalten" ON public.vehicles
  FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- E-COMMERCE: KATEGORIEN
-- ===========================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);

-- RLS für categories (öffentlich lesbar)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kategorien sind öffentlich lesbar" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins können Kategorien verwalten" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- E-COMMERCE: PRODUKTE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price_net DECIMAL(10,2) NOT NULL,
  price_gross DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) DEFAULT 20.00, -- 20% MwSt. für Österreich
  currency TEXT DEFAULT 'EUR',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  weight_kg DECIMAL(8,3),
  dimensions JSONB, -- { length, width, height }
  images TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;

-- Volltext-Suche für Produkte
CREATE INDEX idx_products_search ON public.products 
  USING GIN (to_tsvector('german', name || ' ' || COALESCE(description, '')));

-- RLS für products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aktive Produkte sind öffentlich lesbar" ON public.products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins können Produkte verwalten" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- E-COMMERCE: FAHRZEUG-KOMPATIBILITÄT
-- ===========================================

CREATE TABLE IF NOT EXISTS public.product_vehicle_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  hsn TEXT NOT NULL,
  tsn TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year_from INTEGER,
  year_to INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compatibility_product ON public.product_vehicle_compatibility(product_id);
CREATE INDEX idx_compatibility_hsn_tsn ON public.product_vehicle_compatibility(hsn, tsn);

-- RLS
ALTER TABLE public.product_vehicle_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kompatibilitätsdaten sind öffentlich lesbar" ON public.product_vehicle_compatibility
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins können Kompatibilitätsdaten verwalten" ON public.product_vehicle_compatibility
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- E-COMMERCE: BESTELLUNGEN
-- ===========================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  subtotal_net DECIMAL(10,2) NOT NULL,
  subtotal_gross DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_net DECIMAL(10,2) NOT NULL,
  total_gross DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_address JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- RLS für orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Bestellungen sehen" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins können alle Bestellungen verwalten" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- ===========================================
-- E-COMMERCE: BESTELLPOSITIONEN
-- ===========================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_net DECIMAL(10,2) NOT NULL,
  price_gross DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) NOT NULL,
  total_net DECIMAL(10,2) NOT NULL,
  total_gross DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- RLS für order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Bestellpositionen sehen" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins können alle Bestellpositionen verwalten" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- ===========================================
-- WERKSTATT: SERVICES
-- ===========================================

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  duration_minutes INTEGER,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_category ON public.services(category);

-- RLS für services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aktive Services sind öffentlich lesbar" ON public.services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins können Services verwalten" ON public.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- WERKSTATT: TERMINE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- RLS für appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Termine sehen" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können Termine erstellen" ON public.appointments
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins können alle Termine verwalten" ON public.appointments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

-- ===========================================
-- AUTOHANDEL: FAHRZEUGE ZUM VERKAUF
-- ===========================================

CREATE TABLE IF NOT EXISTS public.vehicles_for_sale (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage_km INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'negotiable', 'on_request')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'lpg')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  power_kw INTEGER,
  power_ps INTEGER,
  color TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  hsn TEXT,
  tsn TEXT,
  vin TEXT,
  first_registration DATE,
  tuev_until DATE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_for_sale_slug ON public.vehicles_for_sale(slug);
CREATE INDEX idx_vehicles_for_sale_make_model ON public.vehicles_for_sale(make, model);
CREATE INDEX idx_vehicles_for_sale_status ON public.vehicles_for_sale(status);
CREATE INDEX idx_vehicles_for_sale_price ON public.vehicles_for_sale(price);

-- RLS für vehicles_for_sale
ALTER TABLE public.vehicles_for_sale ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verfügbare Fahrzeuge sind öffentlich lesbar" ON public.vehicles_for_sale
  FOR SELECT USING (status != 'sold');

CREATE POLICY "Admins können Fahrzeuge verwalten" ON public.vehicles_for_sale
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- CHAT: KONVERSATIONEN
-- ===========================================

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  channel TEXT DEFAULT 'web' CHECK (channel IN ('web', 'whatsapp')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_session ON public.chat_conversations(session_id);

-- RLS für chat_conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihre eigenen Chats sehen" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Benutzer können Chats erstellen" ON public.chat_conversations
  FOR INSERT WITH CHECK (TRUE);

-- ===========================================
-- CHAT: NACHRICHTEN
-- ===========================================

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot', 'agent')),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created ON public.chat_messages(created_at);

-- RLS für chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können Nachrichten ihrer Chats sehen" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE chat_conversations.id = chat_messages.conversation_id 
      AND (chat_conversations.user_id = auth.uid() OR chat_conversations.user_id IS NULL)
    )
  );

CREATE POLICY "Benutzer können Nachrichten erstellen" ON public.chat_messages
  FOR INSERT WITH CHECK (TRUE);

-- ===========================================
-- HILFSFUNKTIONEN
-- ===========================================

-- Funktion zum Generieren einer Bestellnummer
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'OCB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Funktion zum Aktualisieren von updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für alle Tabellen mit updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_for_sale_updated_at BEFORE UPDATE ON public.vehicles_for_sale
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FERTIG!
-- ===========================================
COMMENT ON SCHEMA public IS 'OpenCarBox & Carvantooo - E-Commerce & Services Platform';

