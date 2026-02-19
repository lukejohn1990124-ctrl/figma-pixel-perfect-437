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
      bed_types: {
        Row: {
          bed_type: string
          cost: number | null
          created_at: string
          hotel_id: string
          id: string
        }
        Insert: {
          bed_type: string
          cost?: number | null
          created_at?: string
          hotel_id: string
          id?: string
        }
        Update: {
          bed_type?: string
          cost?: number | null
          created_at?: string
          hotel_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bed_types_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotel_options"
            referencedColumns: ["id"]
          },
        ]
      }
      email_provider_config: {
        Row: {
          api_key: string | null
          created_at: string
          from_email: string | null
          from_name: string | null
          id: string
          is_configured: boolean
          provider: string
          smtp_host: string | null
          smtp_pass: string | null
          smtp_port: number | null
          smtp_user: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_configured?: boolean
          provider: string
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          is_configured?: boolean
          provider?: string
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          custom_html: string
          id: string
          name: string
          subject: string
          type: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          body?: string
          created_at?: string
          custom_html?: string
          id?: string
          name: string
          subject?: string
          type?: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string
          custom_html?: string
          id?: string
          name?: string
          subject?: string
          type?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      hotel_options: {
        Row: {
          address: string
          amenities: string[] | null
          brand: string | null
          city: string | null
          country: string | null
          created_at: string
          hotel_name: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          main_photo_url: string | null
          rating_score: number | null
          rating_word: string | null
          view_style: string | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          brand?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          hotel_name: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          main_photo_url?: string | null
          rating_score?: number | null
          rating_word?: string | null
          view_style?: string | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          brand?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          hotel_name?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          main_photo_url?: string | null
          rating_score?: number | null
          rating_word?: string | null
          view_style?: string | null
        }
        Relationships: []
      }
      hotel_reviews: {
        Row: {
          cleanliness: number
          comfort: number
          created_at: string | null
          facilities: number
          food_quality: number
          friendly_staff: number
          hotel_id: string
          id: string
          location: number
          provider_name: string
          room_quality: number
          value_for_money: number
        }
        Insert: {
          cleanliness: number
          comfort: number
          created_at?: string | null
          facilities: number
          food_quality: number
          friendly_staff: number
          hotel_id: string
          id?: string
          location: number
          provider_name: string
          room_quality: number
          value_for_money: number
        }
        Update: {
          cleanliness?: number
          comfort?: number
          created_at?: string | null
          facilities?: number
          food_quality?: number
          friendly_staff?: number
          hotel_id?: string
          id?: string
          location?: number
          provider_name?: string
          room_quality?: number
          value_for_money?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotel_reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotel_options"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_connected: boolean
          last_synced_at: string | null
          provider: string
          refresh_token: string | null
          updated_at: string
          user_id: string
          user_identifier: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean
          last_synced_at?: string | null
          provider: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
          user_identifier?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
          user_identifier?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_email: string | null
          client_name: string
          created_at: string
          due_date: string | null
          external_id: string | null
          id: string
          invoice_number: string
          last_reminder_sent: string | null
          payment_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          client_email?: string | null
          client_name: string
          created_at?: string
          due_date?: string | null
          external_id?: string | null
          id?: string
          invoice_number: string
          last_reminder_sent?: string | null
          payment_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_email?: string | null
          client_name?: string
          created_at?: string
          due_date?: string | null
          external_id?: string | null
          id?: string
          invoice_number?: string
          last_reminder_sent?: string | null
          payment_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_prices: {
        Row: {
          booking_url: string | null
          cashback_percentage: number | null
          currency: string | null
          hotel_id: string
          id: string
          last_updated: string
          price_per_night: number
          provider_logo_url: string | null
          provider_name: string
        }
        Insert: {
          booking_url?: string | null
          cashback_percentage?: number | null
          currency?: string | null
          hotel_id: string
          id?: string
          last_updated?: string
          price_per_night: number
          provider_logo_url?: string | null
          provider_name: string
        }
        Update: {
          booking_url?: string | null
          cashback_percentage?: number | null
          currency?: string | null
          hotel_id?: string
          id?: string
          last_updated?: string
          price_per_night?: number
          provider_logo_url?: string | null
          provider_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_prices_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotel_options"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_queue: {
        Row: {
          amount: number
          bulk_group_id: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          created_at: string
          days_overdue: number
          id: string
          invoice_id: string | null
          invoice_number: string
          recipient_emails: string[] | null
          schedule_type: string
          scheduled_date: string
          template_name: string
          user_id: string
        }
        Insert: {
          amount?: number
          bulk_group_id?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          created_at?: string
          days_overdue?: number
          id?: string
          invoice_id?: string | null
          invoice_number: string
          recipient_emails?: string[] | null
          schedule_type?: string
          scheduled_date: string
          template_name?: string
          user_id: string
        }
        Update: {
          amount?: number
          bulk_group_id?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          created_at?: string
          days_overdue?: number
          id?: string
          invoice_id?: string | null
          invoice_number?: string
          recipient_emails?: string[] | null
          schedule_type?: string
          scheduled_date?: string
          template_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_queue_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      email_provider_config_safe: {
        Row: {
          created_at: string | null
          from_email: string | null
          from_name: string | null
          id: string | null
          is_configured: boolean | null
          provider: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string | null
          is_configured?: boolean | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string | null
          is_configured?: boolean | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hotel_rating_summary: {
        Row: {
          hotel_id: string | null
          rating_score: number | null
          rating_word: string | null
          total_reviews: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_reviews_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotel_options"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations_safe: {
        Row: {
          created_at: string | null
          id: string | null
          is_connected: boolean | null
          last_synced_at: string | null
          provider: string | null
          updated_at: string | null
          user_id: string | null
          user_identifier: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          is_connected?: boolean | null
          last_synced_at?: string | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_identifier?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          is_connected?: boolean | null
          last_synced_at?: string | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          user_identifier?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
