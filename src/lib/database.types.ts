export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          salvation_score: number;
          total_spent: number;
          created_at: string;
          display_name: string | null;
          favorite_chambers: string[];
          chamber_order: string[];
          default_accent: string;
          notification_prefs: {
            weeklyDigest: boolean;
            sinReminders: boolean;
            smiteAlerts: boolean;
          };
          starter_pack_id: string | null;
          onboarding_completed_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          salvation_score?: number;
          total_spent?: number;
          created_at?: string;
          display_name?: string | null;
          favorite_chambers?: string[];
          chamber_order?: string[];
          default_accent?: string;
          notification_prefs?: {
            weeklyDigest: boolean;
            sinReminders: boolean;
            smiteAlerts: boolean;
          };
          starter_pack_id?: string | null;
          onboarding_completed_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          salvation_score?: number;
          total_spent?: number;
          created_at?: string;
          display_name?: string | null;
          favorite_chambers?: string[];
          chamber_order?: string[];
          default_accent?: string;
          notification_prefs?: {
            weeklyDigest: boolean;
            sinReminders: boolean;
            smiteAlerts: boolean;
          };
          starter_pack_id?: string | null;
          onboarding_completed_at?: string | null;
        };
        Relationships: [];
      };
      sin_log_items: {
        Row: {
          id: string;
          user_id: string;
          sin_id: string | null;
          petty: string;
          translation: string;
          source: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sin_id?: string | null;
          petty: string;
          translation: string;
          source: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sin_id?: string | null;
          petty?: string;
          translation?: string;
          source?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      sin_community_items: {
        Row: {
          id: string;
          user_id: string;
          petty: string;
          translation: string;
          category: string;
          difficulty: string;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          petty: string;
          translation: string;
          category: string;
          difficulty: string;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          petty?: string;
          translation?: string;
          category?: string;
          difficulty?: string;
          submitted_at?: string;
        };
        Relationships: [];
      };
      sin_daily_done: {
        Row: {
          id: string;
          user_id: string;
          date_key: string;
          sin_ids: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          date_key: string;
          sin_ids?: string[];
        };
        Update: {
          id?: string;
          user_id?: string;
          date_key?: string;
          sin_ids?: string[];
        };
        Relationships: [];
      };
      indulgence_purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          product_name: string;
          certificate_id: string;
          price_paid: number;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          product_name: string;
          certificate_id: string;
          price_paid: number;
          purchased_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          product_name?: string;
          certificate_id?: string;
          price_paid?: number;
          purchased_at?: string;
        };
        Relationships: [];
      };
      confessions: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      confession_votes: {
        Row: {
          id: string;
          confession_id: string;
          user_id: string;
          vote: "absolve" | "condemn";
          created_at: string;
        };
        Insert: {
          id?: string;
          confession_id: string;
          user_id: string;
          vote: "absolve" | "condemn";
          created_at?: string;
        };
        Update: {
          id?: string;
          confession_id?: string;
          user_id?: string;
          vote?: "absolve" | "condemn";
          created_at?: string;
        };
        Relationships: [];
      };
      oracle_readings: {
        Row: {
          id: string;
          user_id: string;
          date_key: string;
          cards: Json;
          doom_score: number;
          summary: string;
          revealed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          date_key: string;
          cards: Json;
          doom_score: number;
          summary: string;
          revealed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          date_key?: string;
          cards?: Json;
          doom_score?: number;
          summary?: string;
          revealed?: boolean;
        };
        Relationships: [];
      };
      smite_history: {
        Row: {
          id: string;
          user_id: string;
          target: string;
          target_label: string;
          custom_name: string | null;
          plague: string;
          tier: string;
          result: string;
          visual_description: string | null;
          smote_at: string;
          price_paid: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          target: string;
          target_label: string;
          custom_name?: string | null;
          plague: string;
          tier: string;
          result: string;
          visual_description?: string | null;
          smote_at?: string;
          price_paid?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          target?: string;
          target_label?: string;
          custom_name?: string | null;
          plague?: string;
          tier?: string;
          result?: string;
          visual_description?: string | null;
          smote_at?: string;
          price_paid?: number;
        };
        Relationships: [];
      };
      smite_daily_counts: {
        Row: {
          id: string;
          user_id: string;
          date_key: string;
          count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date_key: string;
          count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date_key?: string;
          count?: number;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          chamber: "god" | "lucifer" | "support";
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chamber: "god" | "lucifer" | "support";
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chamber?: "god" | "lucifer" | "support";
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          ticket_number: string;
          subject: string;
          category: string;
          priority: string;
          description: string;
          status: string;
          response: string | null;
          submitted_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          ticket_number: string;
          subject: string;
          category: string;
          priority: string;
          description: string;
          status?: string;
          response?: string | null;
          submitted_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          ticket_number?: string;
          subject?: string;
          category?: string;
          priority?: string;
          description?: string;
          status?: string;
          response?: string | null;
          submitted_at?: string;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      vote_type: "absolve" | "condemn";
      chat_chamber: "god" | "lucifer" | "support";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
