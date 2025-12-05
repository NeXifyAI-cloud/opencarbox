/**
 * Automatisch generierte Supabase Datenbank-Typen
 * 
 * Diese Datei wird mit `mcp_supabase_generate_typescript_types` generiert.
 * NICHT manuell bearbeiten!
 * 
 * @generated
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          duration_minutes: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          scheduled_at: string
          service_id: string | null
          status: string
          updated_at: string
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          duration_minutes?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          scheduled_at: string
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          duration_minutes?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          scheduled_at?: string
          service_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          assigned_to: string | null
          channel: string | null
          created_at: string
          id: string
          session_id: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          session_id: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          session_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_gross: number
          price_net: number
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          total_gross: number
          total_net: number
          vat_rate: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_gross: number
          price_net: number
          product_id: string
          product_name: string
          product_sku: string
          quantity: number
          total_gross: number
          total_net: number
          vat_rate: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_gross?: number
          price_net?: number
          product_id?: string
          product_name?: string
          product_sku?: string
          quantity?: number
          total_gross?: number
          total_net?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          created_at: string
          currency: string | null
          customer_email: string
          customer_phone: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string
          shipping_address: Json
          shipping_cost: number | null
          status: string
          stripe_payment_intent_id: string | null
          subtotal_gross: number
          subtotal_net: number
          total_gross: number
          total_net: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address: Json
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string
          shipping_address: Json
          shipping_cost?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal_gross: number
          subtotal_net: number
          total_gross: number
          total_net: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json
          shipping_cost?: number | null
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal_gross?: number
          subtotal_net?: number
          total_gross?: number
          total_net?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_vehicle_compatibility: {
        Row: {
          created_at: string
          hsn: string
          id: string
          make: string
          model: string
          notes: string | null
          product_id: string
          tsn: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          created_at?: string
          hsn: string
          id?: string
          make: string
          model: string
          notes?: string | null
          product_id: string
          tsn: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          created_at?: string
          hsn?: string
          id?: string
          make?: string
          model?: string
          notes?: string | null
          product_id?: string
          tsn?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_vehicle_compatibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          dimensions: Json | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price_gross: number
          price_net: number
          short_description: string | null
          sku: string
          slug: string
          stock_quantity: number | null
          updated_at: string
          vat_rate: number | null
          weight_kg: number | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price_gross: number
          price_net: number
          short_description?: string | null
          sku: string
          slug: string
          stock_quantity?: number | null
          updated_at?: string
          vat_rate?: number | null
          weight_kg?: number | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price_gross?: number
          price_net?: number
          short_description?: string | null
          sku?: string
          slug?: string
          stock_quantity?: number | null
          updated_at?: string
          vat_rate?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price_from: number | null
          price_to: number | null
          short_description: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          hsn: string | null
          id: string
          is_primary: boolean | null
          license_plate: string | null
          make: string
          model: string
          nickname: string | null
          tsn: string | null
          updated_at: string
          user_id: string
          vin: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          hsn?: string | null
          id?: string
          is_primary?: boolean | null
          license_plate?: string | null
          make: string
          model: string
          nickname?: string | null
          tsn?: string | null
          updated_at?: string
          user_id: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          hsn?: string | null
          id?: string
          is_primary?: boolean | null
          license_plate?: string | null
          make?: string
          model?: string
          nickname?: string | null
          tsn?: string | null
          updated_at?: string
          user_id?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      vehicles_for_sale: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          features: string[] | null
          first_registration: string | null
          fuel_type: string
          hsn: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          make: string
          mileage_km: number
          model: string
          power_kw: number | null
          power_ps: number | null
          price: number
          price_type: string | null
          slug: string
          status: string | null
          title: string
          transmission: string
          tsn: string | null
          tuev_until: string | null
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          first_registration?: string | null
          fuel_type: string
          hsn?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          make: string
          mileage_km: number
          model: string
          power_kw?: number | null
          power_ps?: number | null
          price: number
          price_type?: string | null
          slug: string
          status?: string | null
          title: string
          transmission: string
          tsn?: string | null
          tuev_until?: string | null
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          first_registration?: string | null
          fuel_type?: string
          hsn?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          make?: string
          mileage_km?: number
          model?: string
          power_kw?: number | null
          power_ps?: number | null
          price?: number
          price_type?: string | null
          slug?: string
          status?: string | null
          title?: string
          transmission?: string
          tsn?: string | null
          tuev_until?: string | null
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: Record<PropertyKey, never>; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ===========================================
// HELPER TYPES
// ===========================================

type DefaultSchema = Database[Extract<keyof Database, "public">]

/** Extrahiert den Row-Type einer Tabelle */
export type Tables<
  TableName extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[TableName] extends {
  Row: infer R
}
  ? R
  : never

/** Extrahiert den Insert-Type einer Tabelle */
export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName] extends {
  Insert: infer I
}
  ? I
  : never

/** Extrahiert den Update-Type einer Tabelle */
export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName] extends {
  Update: infer U
}
  ? U
  : never

// ===========================================
// CONVENIENCE EXPORTS
// ===========================================

export type Profile = Tables<"profiles">
export type Vehicle = Tables<"vehicles">
export type Category = Tables<"categories">
export type Product = Tables<"products">
export type ProductVehicleCompatibility = Tables<"product_vehicle_compatibility">
export type Order = Tables<"orders">
export type OrderItem = Tables<"order_items">
export type Service = Tables<"services">
export type Appointment = Tables<"appointments">
export type VehicleForSale = Tables<"vehicles_for_sale">
export type ChatConversation = Tables<"chat_conversations">
export type ChatMessage = Tables<"chat_messages">

// Insert Types
export type ProfileInsert = TablesInsert<"profiles">
export type VehicleInsert = TablesInsert<"vehicles">
export type CategoryInsert = TablesInsert<"categories">
export type ProductInsert = TablesInsert<"products">
export type OrderInsert = TablesInsert<"orders">
export type OrderItemInsert = TablesInsert<"order_items">
export type ServiceInsert = TablesInsert<"services">
export type AppointmentInsert = TablesInsert<"appointments">
export type VehicleForSaleInsert = TablesInsert<"vehicles_for_sale">

// Update Types
export type ProfileUpdate = TablesUpdate<"profiles">
export type VehicleUpdate = TablesUpdate<"vehicles">
export type ProductUpdate = TablesUpdate<"products">
export type OrderUpdate = TablesUpdate<"orders">

