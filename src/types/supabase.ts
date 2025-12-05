/**
 * Supabase Datenbank-Typen
 * 
 * Diese Datei enthält die TypeScript-Typen für die Supabase-Datenbank.
 * Wird automatisch generiert mit: npx supabase gen types typescript
 * 
 * Manuelle Typen für das OpenCarBox/Carvantooo Projekt.
 * Diese werden erweitert, sobald die Datenbank-Tabellen erstellt sind.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Datenbank-Schema für OpenCarBox & Carvantooo
 */
export interface Database {
  public: {
    Tables: {
      // ========================================
      // BENUTZER & AUTHENTIFIZIERUNG
      // ========================================
      
      /** Benutzerprofile (erweitert auth.users) */
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
      }

      // ========================================
      // FAHRZEUGE (HSN/TSN)
      // ========================================
      
      /** Fahrzeuge für "Meine Garage" */
      vehicles: {
        Row: {
          id: string
          user_id: string
          hsn: string | null
          tsn: string | null
          license_plate: string | null
          make: string
          model: string
          year: number | null
          vin: string | null
          nickname: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hsn?: string | null
          tsn?: string | null
          license_plate?: string | null
          make: string
          model: string
          year?: number | null
          vin?: string | null
          nickname?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hsn?: string | null
          tsn?: string | null
          license_plate?: string | null
          make?: string
          model?: string
          year?: number | null
          vin?: string | null
          nickname?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ========================================
      // E-COMMERCE (CARVANTOOO SHOP)
      // ========================================
      
      /** Produktkategorien */
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      /** Produkte */
      products: {
        Row: {
          id: string
          sku: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price_net: number
          price_gross: number
          vat_rate: number
          currency: string
          stock_quantity: number
          is_active: boolean
          is_featured: boolean
          category_id: string | null
          brand: string | null
          weight_kg: number | null
          dimensions: Json | null
          images: string[]
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price_net: number
          price_gross: number
          vat_rate?: number
          currency?: string
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          category_id?: string | null
          brand?: string | null
          weight_kg?: number | null
          dimensions?: Json | null
          images?: string[]
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price_net?: number
          price_gross?: number
          vat_rate?: number
          currency?: string
          stock_quantity?: number
          is_active?: boolean
          is_featured?: boolean
          category_id?: string | null
          brand?: string | null
          weight_kg?: number | null
          dimensions?: Json | null
          images?: string[]
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      /** Produkt-Fahrzeug-Kompatibilität */
      product_vehicle_compatibility: {
        Row: {
          id: string
          product_id: string
          hsn: string
          tsn: string
          make: string
          model: string
          year_from: number | null
          year_to: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          hsn: string
          tsn: string
          make: string
          model: string
          year_from?: number | null
          year_to?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          hsn?: string
          tsn?: string
          make?: string
          model?: string
          year_from?: number | null
          year_to?: number | null
          notes?: string | null
          created_at?: string
        }
      }

      /** Bestellungen */
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          stripe_payment_intent_id: string | null
          subtotal_net: number
          subtotal_gross: number
          shipping_cost: number
          total_net: number
          total_gross: number
          currency: string
          billing_address: Json
          shipping_address: Json
          customer_email: string
          customer_phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_number: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_net: number
          subtotal_gross: number
          shipping_cost?: number
          total_net: number
          total_gross: number
          currency?: string
          billing_address: Json
          shipping_address: Json
          customer_email: string
          customer_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_net?: number
          subtotal_gross?: number
          shipping_cost?: number
          total_net?: number
          total_gross?: number
          currency?: string
          billing_address?: Json
          shipping_address?: Json
          customer_email?: string
          customer_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      /** Bestellpositionen */
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          price_net: number
          price_gross: number
          vat_rate: number
          total_net: number
          total_gross: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          price_net: number
          price_gross: number
          vat_rate: number
          total_net: number
          total_gross: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_sku?: string
          quantity?: number
          price_net?: number
          price_gross?: number
          vat_rate?: number
          total_net?: number
          total_gross?: number
          created_at?: string
        }
      }

      // ========================================
      // WERKSTATT (OPENCARBOX SERVICES)
      // ========================================

      /** Werkstatt-Services */
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price_from: number | null
          price_to: number | null
          duration_minutes: number | null
          category: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price_from?: number | null
          price_to?: number | null
          duration_minutes?: number | null
          category: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price_from?: number | null
          price_to?: number | null
          duration_minutes?: number | null
          category?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }

      /** Werkstatt-Termine */
      appointments: {
        Row: {
          id: string
          user_id: string | null
          vehicle_id: string | null
          service_id: string | null
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at: string
          duration_minutes: number
          customer_name: string
          customer_email: string
          customer_phone: string
          notes: string | null
          internal_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          vehicle_id?: string | null
          service_id?: string | null
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at: string
          duration_minutes?: number
          customer_name: string
          customer_email: string
          customer_phone: string
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          vehicle_id?: string | null
          service_id?: string | null
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_at?: string
          duration_minutes?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          notes?: string | null
          internal_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // ========================================
      // AUTOHANDEL (OPENCARBOX VEHICLES)
      // ========================================

      /** Fahrzeuge zum Verkauf */
      vehicles_for_sale: {
        Row: {
          id: string
          title: string
          slug: string
          make: string
          model: string
          year: number
          mileage_km: number
          price: number
          price_type: 'fixed' | 'negotiable' | 'on_request'
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
          transmission: 'manual' | 'automatic'
          power_kw: number | null
          power_ps: number | null
          color: string | null
          description: string | null
          features: string[]
          images: string[]
          hsn: string | null
          tsn: string | null
          vin: string | null
          first_registration: string | null
          tuev_until: string | null
          status: 'available' | 'reserved' | 'sold'
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          make: string
          model: string
          year: number
          mileage_km: number
          price: number
          price_type?: 'fixed' | 'negotiable' | 'on_request'
          fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
          transmission: 'manual' | 'automatic'
          power_kw?: number | null
          power_ps?: number | null
          color?: string | null
          description?: string | null
          features?: string[]
          images?: string[]
          hsn?: string | null
          tsn?: string | null
          vin?: string | null
          first_registration?: string | null
          tuev_until?: string | null
          status?: 'available' | 'reserved' | 'sold'
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          make?: string
          model?: string
          year?: number
          mileage_km?: number
          price?: number
          price_type?: 'fixed' | 'negotiable' | 'on_request'
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'lpg'
          transmission?: 'manual' | 'automatic'
          power_kw?: number | null
          power_ps?: number | null
          color?: string | null
          description?: string | null
          features?: string[]
          images?: string[]
          hsn?: string | null
          tsn?: string | null
          vin?: string | null
          first_registration?: string | null
          tuev_until?: string | null
          status?: 'available' | 'reserved' | 'sold'
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // ========================================
      // CHAT & KOMMUNIKATION
      // ========================================

      /** Chat-Konversationen */
      chat_conversations: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          channel: 'web' | 'whatsapp'
          status: 'active' | 'closed'
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          channel?: 'web' | 'whatsapp'
          status?: 'active' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          channel?: 'web' | 'whatsapp'
          status?: 'active' | 'closed'
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      /** Chat-Nachrichten */
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: 'user' | 'bot' | 'agent'
          sender_id: string | null
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: 'user' | 'bot' | 'agent'
          sender_id?: string | null
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: 'user' | 'bot' | 'agent'
          sender_id?: string | null
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ========================================
// HELPER TYPES
// ========================================

/** Extrahiert den Row-Type einer Tabelle */
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

/** Extrahiert den Insert-Type einer Tabelle */
export type TablesInsert<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

/** Extrahiert den Update-Type einer Tabelle */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

// Convenience Exports
export type Profile = Tables<'profiles'>
export type Vehicle = Tables<'vehicles'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Service = Tables<'services'>
export type Appointment = Tables<'appointments'>
export type VehicleForSale = Tables<'vehicles_for_sale'>
export type ChatConversation = Tables<'chat_conversations'>
export type ChatMessage = Tables<'chat_messages'>

