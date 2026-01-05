export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      cards: {
        Row: {
          approved: boolean | null;
          attribute: string | null;
          card_number: string;
          card_type: string | null;
          color: string | null;
          cost: number | null;
          counter: number | null;
          created_at: string | null;
          effect: string | null;
          external_id: string | null;
          id: number;
          image_url: string | null;
          is_user_submitted: boolean | null;
          name: string;
          power: number | null;
          rarity: string | null;
          set_id: number | null;
          submitted_by: string | null;
          updated_at: string | null;
        };
        Insert: {
          approved?: boolean | null;
          attribute?: string | null;
          card_number: string;
          card_type?: string | null;
          color?: string | null;
          cost?: number | null;
          counter?: number | null;
          created_at?: string | null;
          effect?: string | null;
          external_id?: string | null;
          id?: never;
          image_url?: string | null;
          is_user_submitted?: boolean | null;
          name: string;
          power?: number | null;
          rarity?: string | null;
          set_id?: number | null;
          submitted_by?: string | null;
          updated_at?: string | null;
        };
        Update: {
          approved?: boolean | null;
          attribute?: string | null;
          card_number?: string;
          card_type?: string | null;
          color?: string | null;
          cost?: number | null;
          counter?: number | null;
          created_at?: string | null;
          effect?: string | null;
          external_id?: string | null;
          id?: never;
          image_url?: string | null;
          is_user_submitted?: boolean | null;
          name?: string;
          power?: number | null;
          rarity?: string | null;
          set_id?: number | null;
          submitted_by?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cards_set_id_fkey';
            columns: ['set_id'];
            isOneToOne: false;
            referencedRelation: 'sets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cards_submitted_by_fkey';
            columns: ['submitted_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      grading_population: {
        Row: {
          card_id: number | null;
          grade: number;
          grading_company: Database['public']['Enums']['grading_company'];
          id: number;
          population: number;
          population_higher: number | null;
          recorded_at: string | null;
          source: string | null;
        };
        Insert: {
          card_id?: number | null;
          grade: number;
          grading_company: Database['public']['Enums']['grading_company'];
          id?: never;
          population?: number;
          population_higher?: number | null;
          recorded_at?: string | null;
          source?: string | null;
        };
        Update: {
          card_id?: number | null;
          grade?: number;
          grading_company?: Database['public']['Enums']['grading_company'];
          id?: never;
          population?: number;
          population_higher?: number | null;
          recorded_at?: string | null;
          source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'grading_population_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
        ];
      };
      population_sync_log: {
        Row: {
          cards_updated: number | null;
          completed_at: string | null;
          error_message: string | null;
          id: number;
          started_at: string | null;
          status: string;
          sync_type: string;
        };
        Insert: {
          cards_updated?: number | null;
          completed_at?: string | null;
          error_message?: string | null;
          id?: never;
          started_at?: string | null;
          status: string;
          sync_type: string;
        };
        Update: {
          cards_updated?: number | null;
          completed_at?: string | null;
          error_message?: string | null;
          id?: never;
          started_at?: string | null;
          status?: string;
          sync_type?: string;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          asking_price: number | null;
          card_id: number | null;
          cert_number: string | null;
          condition: Database['public']['Enums']['card_condition'] | null;
          created_at: string | null;
          grade: number | null;
          grading_company: Database['public']['Enums']['grading_company'] | null;
          id: number;
          is_for_sale: boolean | null;
          is_graded: boolean | null;
          is_wishlist: boolean | null;
          item_type: Database['public']['Enums']['portfolio_item_type'];
          notes: string | null;
          purchase_date: string | null;
          purchase_price: number | null;
          quantity: number;
          sealed_product_id: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          asking_price?: number | null;
          card_id?: number | null;
          cert_number?: string | null;
          condition?: Database['public']['Enums']['card_condition'] | null;
          created_at?: string | null;
          grade?: number | null;
          grading_company?: Database['public']['Enums']['grading_company'] | null;
          id?: never;
          is_for_sale?: boolean | null;
          is_graded?: boolean | null;
          is_wishlist?: boolean | null;
          item_type: Database['public']['Enums']['portfolio_item_type'];
          notes?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          quantity?: number;
          sealed_product_id?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          asking_price?: number | null;
          card_id?: number | null;
          cert_number?: string | null;
          condition?: Database['public']['Enums']['card_condition'] | null;
          created_at?: string | null;
          grade?: number | null;
          grading_company?: Database['public']['Enums']['grading_company'] | null;
          id?: never;
          is_for_sale?: boolean | null;
          is_graded?: boolean | null;
          is_wishlist?: boolean | null;
          item_type?: Database['public']['Enums']['portfolio_item_type'];
          notes?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          quantity?: number;
          sealed_product_id?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolio_items_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'portfolio_items_sealed_product_id_fkey';
            columns: ['sealed_product_id'];
            isOneToOne: false;
            referencedRelation: 'sealed_products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'portfolio_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      price_history: {
        Row: {
          card_id: number | null;
          condition: Database['public']['Enums']['card_condition'] | null;
          grade: number | null;
          grading_company: Database['public']['Enums']['grading_company'] | null;
          id: number;
          is_graded: boolean | null;
          item_type: Database['public']['Enums']['portfolio_item_type'];
          price: number;
          recorded_at: string | null;
          recorded_by: string | null;
          sealed_product_id: number | null;
          source: Database['public']['Enums']['price_source'];
        };
        Insert: {
          card_id?: number | null;
          condition?: Database['public']['Enums']['card_condition'] | null;
          grade?: number | null;
          grading_company?: Database['public']['Enums']['grading_company'] | null;
          id?: never;
          is_graded?: boolean | null;
          item_type: Database['public']['Enums']['portfolio_item_type'];
          price: number;
          recorded_at?: string | null;
          recorded_by?: string | null;
          sealed_product_id?: number | null;
          source?: Database['public']['Enums']['price_source'];
        };
        Update: {
          card_id?: number | null;
          condition?: Database['public']['Enums']['card_condition'] | null;
          grade?: number | null;
          grading_company?: Database['public']['Enums']['grading_company'] | null;
          id?: never;
          is_graded?: boolean | null;
          item_type?: Database['public']['Enums']['portfolio_item_type'];
          price?: number;
          recorded_at?: string | null;
          recorded_by?: string | null;
          sealed_product_id?: number | null;
          source?: Database['public']['Enums']['price_source'];
        };
        Relationships: [
          {
            foreignKeyName: 'price_history_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'price_history_recorded_by_fkey';
            columns: ['recorded_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'price_history_sealed_product_id_fkey';
            columns: ['sealed_product_id'];
            isOneToOne: false;
            referencedRelation: 'sealed_products';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          display_name: string | null;
          id: string;
          is_public: boolean | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id: string;
          is_public?: boolean | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id?: string;
          is_public?: boolean | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      sealed_products: {
        Row: {
          approved: boolean | null;
          created_at: string | null;
          description: string | null;
          id: number;
          image_url: string | null;
          is_user_submitted: boolean | null;
          name: string;
          product_type: Database['public']['Enums']['sealed_product_type'];
          release_date: string | null;
          set_id: number | null;
          submitted_by: string | null;
          updated_at: string | null;
        };
        Insert: {
          approved?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: never;
          image_url?: string | null;
          is_user_submitted?: boolean | null;
          name: string;
          product_type: Database['public']['Enums']['sealed_product_type'];
          release_date?: string | null;
          set_id?: number | null;
          submitted_by?: string | null;
          updated_at?: string | null;
        };
        Update: {
          approved?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: never;
          image_url?: string | null;
          is_user_submitted?: boolean | null;
          name?: string;
          product_type?: Database['public']['Enums']['sealed_product_type'];
          release_date?: string | null;
          set_id?: number | null;
          submitted_by?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sealed_products_set_id_fkey';
            columns: ['set_id'];
            isOneToOne: false;
            referencedRelation: 'sets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sealed_products_submitted_by_fkey';
            columns: ['submitted_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      sets: {
        Row: {
          code: string;
          created_at: string | null;
          id: number;
          image_url: string | null;
          name: string;
          release_date: string | null;
          total_cards: number | null;
          raw_value: number | null;
          psa10_value: number | null;
          sealed_value: number | null;
          cards_priced: number | null;
          value_updated_at: string | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          id?: never;
          image_url?: string | null;
          name: string;
          release_date?: string | null;
          total_cards?: number | null;
          raw_value?: number | null;
          psa10_value?: number | null;
          sealed_value?: number | null;
          cards_priced?: number | null;
          value_updated_at?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          id?: never;
          image_url?: string | null;
          name?: string;
          release_date?: string | null;
          total_cards?: number | null;
          raw_value?: number | null;
          psa10_value?: number | null;
          sealed_value?: number | null;
          cards_priced?: number | null;
          value_updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      current_prices: {
        Row: {
          card_id: number | null;
          condition: Database['public']['Enums']['card_condition'] | null;
          grade: number | null;
          grading_company: Database['public']['Enums']['grading_company'] | null;
          id: number | null;
          is_graded: boolean | null;
          item_type: Database['public']['Enums']['portfolio_item_type'] | null;
          price: number | null;
          recorded_at: string | null;
          sealed_product_id: number | null;
          source: Database['public']['Enums']['price_source'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'price_history_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'price_history_sealed_product_id_fkey';
            columns: ['sealed_product_id'];
            isOneToOne: false;
            referencedRelation: 'sealed_products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      get_card_population: {
        Args: { p_card_id: number };
        Returns: {
          grade: number;
          grading_company: Database['public']['Enums']['grading_company'];
          population: number;
          population_higher: number;
          recorded_at: string;
        }[];
      };
      get_portfolio_value: {
        Args: { p_user_id: string };
        Returns: {
          item_count: number;
          total_cost: number;
          total_gain_loss: number;
          total_value: number;
        }[];
      };
      get_set_completion: {
        Args: { p_set_id: number; p_user_id: string };
        Returns: {
          completion_percentage: number;
          owned_cards: number;
          total_cards: number;
        }[];
      };
      get_total_population: {
        Args: { p_card_id: number };
        Returns: {
          gem_mint_count: number;
          grading_company: Database['public']['Enums']['grading_company'];
          mint_count: number;
          total_graded: number;
        }[];
      };
      search_cards: {
        Args: { search_query: string };
        Returns: {
          approved: boolean | null;
          attribute: string | null;
          card_number: string;
          card_type: string | null;
          color: string | null;
          cost: number | null;
          counter: number | null;
          created_at: string | null;
          effect: string | null;
          external_id: string | null;
          id: number;
          image_url: string | null;
          is_user_submitted: boolean | null;
          name: string;
          power: number | null;
          rarity: string | null;
          set_id: number | null;
          submitted_by: string | null;
          updated_at: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'cards';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      calculate_set_value: {
        Args: { p_set_id: number };
        Returns: undefined;
      };
      calculate_all_set_values: {
        Args: Record<string, never>;
        Returns: {
          set_id: number;
          set_code: string;
          raw_value: number;
          psa10_value: number;
          sealed_value: number;
          cards_priced: number;
        }[];
      };
    };
    Enums: {
      card_condition: 'mint' | 'near_mint' | 'lightly_played' | 'moderately_played' | 'heavily_played' | 'damaged';
      grading_company: 'PSA' | 'CGC' | 'BGS' | 'SGC' | 'ARS' | 'other';
      portfolio_item_type: 'card' | 'sealed';
      price_source: 'manual' | 'ebay' | 'tcgplayer' | 'community';
      sealed_product_type:
        | 'booster_box'
        | 'booster_pack'
        | 'case'
        | 'starter_deck'
        | 'promo'
        | 'collection_box'
        | 'other';
    };
    CompositeTypes: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      card_condition: ['mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged'],
      grading_company: ['PSA', 'CGC', 'BGS', 'SGC', 'ARS', 'other'],
      portfolio_item_type: ['card', 'sealed'],
      price_source: ['manual', 'ebay', 'tcgplayer', 'community'],
      sealed_product_type: ['booster_box', 'booster_pack', 'case', 'starter_deck', 'promo', 'collection_box', 'other'],
    },
  },
} as const;
