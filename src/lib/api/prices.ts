import { createClient } from '@/lib/supabase/client';

import type { Database, Enums, Tables } from '@/types/database';

export type PriceHistory = Tables<'price_history'>;

export interface NewPrice {
  item_type: Enums<'portfolio_item_type'>;
  card_id?: number | null;
  sealed_product_id?: number | null;
  price: number;
  source?: Enums<'price_source'>;
  condition?: Enums<'card_condition'> | null;
  is_graded?: boolean;
  grade?: number | null;
}

export async function getPriceHistory(
  itemType: 'card' | 'sealed',
  itemId: number,
  limit = 30
): Promise<PriceHistory[]> {
  const supabase = createClient();

  const column = itemType === 'card' ? 'card_id' : 'sealed_product_id';

  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq(column, itemId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as PriceHistory[]) ?? [];
}

export async function getCurrentPrice(
  itemType: 'card' | 'sealed',
  itemId: number,
  options?: {
    condition?: Enums<'card_condition'>;
    isGraded?: boolean;
    grade?: number;
  }
) {
  const supabase = createClient();

  const column = itemType === 'card' ? 'card_id' : 'sealed_product_id';

  let query = supabase.from('current_prices').select('*').eq(column, itemId);

  if (options?.condition) {
    query = query.eq('condition', options.condition);
  }
  if (options?.isGraded !== undefined) {
    query = query.eq('is_graded', options.isGraded);
  }
  if (options?.grade) {
    query = query.eq('grade', options.grade);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) throw error;
  return data as unknown as Database['public']['Views']['current_prices']['Row'] | null;
}

export async function addPrice(userId: string, price: NewPrice): Promise<PriceHistory> {
  const supabase = createClient();

  const insertData = {
    item_type: price.item_type,
    card_id: price.card_id ?? null,
    sealed_product_id: price.sealed_product_id ?? null,
    price: price.price,
    source: price.source ?? 'manual',
    condition: price.condition ?? null,
    is_graded: price.is_graded ?? false,
    grade: price.grade ?? null,
    recorded_by: userId,
  };

  const { data, error } = await (supabase.from('price_history') as ReturnType<typeof supabase.from>)
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as PriceHistory;
}
