export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          business_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string
          amenities: string[] | null
          avg_rating: number | null
          category_id: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          images: string[] | null
          is_claimed: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          latitude: number | null
          logo: string | null
          longitude: number | null
          name: string
          neighbourhood_id: string | null
          operating_hours: Json | null
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          price_range: string | null
          review_count: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          short_description: string | null
          slug: string
          status: string | null
          subcategory_id: string | null
          updated_at: string
          views_count: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          avg_rating?: number | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          is_claimed?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo?: string | null
          longitude?: number | null
          name: string
          neighbourhood_id?: string | null
          operating_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_range?: string | null
          review_count?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          status?: string | null
          subcategory_id?: string | null
          updated_at?: string
          views_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          avg_rating?: number | null
          category_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          is_claimed?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo?: string | null
          longitude?: number | null
          name?: string
          neighbourhood_id?: string | null
          operating_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          price_range?: string | null
          review_count?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          status?: string | null
          subcategory_id?: string | null
          updated_at?: string
          views_count?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_neighbourhood_id_fkey"
            columns: ["neighbourhood_id"]
            isOneToOne: false
            referencedRelation: "neighbourhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          business_count: number | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image: string | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          business_count?: number | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          business_count?: number | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
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
      claims: {
        Row: {
          business_id: string
          created_at: string
          id: string
          notes: string | null
          proof_documents: string[] | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          notes?: string | null
          proof_documents?: string[] | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          proof_documents?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      neighbourhoods: {
        Row: {
          business_count: number | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          latitude: number | null
          longitude: number | null
          name: string
          postal_codes: string[] | null
          region: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          business_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          postal_codes?: string[] | null
          region: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          business_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          postal_codes?: string[] | null
          region?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          business_id: string
          content: string
          created_at: string
          helpful_count: number | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          rating: number
          status: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          content: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          rating: number
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          content?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          rating?: number
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "business_owner" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "business_owner", "user"],
    },
  },
} as const
