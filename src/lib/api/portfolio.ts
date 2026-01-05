import { createClient } from '@/lib/supabase/client';

import type { Database, Enums, Tables } from '@/types/database';

export type PortfolioItem = Tables<'portfolio_items'>;

export type PortfolioItemWithDetails = PortfolioItem & {
  cards: Tables<'cards'> | null;
  sealed_products: Tables<'sealed_products'> | null;
};

export interface NewPortfolioItem {
  item_type: Enums<'portfolio_item_type'>;
  card_id?: number | null;
  sealed_product_id?: number | null;
  quantity?: number;
  purchase_price?: number | null;
  purchase_date?: string | null;
  condition?: Enums<'card_condition'> | null;
  is_graded?: boolean;
  grading_company?: Enums<'grading_company'> | null;
  grade?: number | null;
  cert_number?: string | null;
  is_wishlist?: boolean;
  is_for_sale?: boolean;
  asking_price?: number | null;
  notes?: string | null;
}

export async function getPortfolio(userId: string): Promise<PortfolioItemWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*, cards(*), sealed_products(*)')
    .eq('user_id', userId)
    .eq('is_wishlist', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PortfolioItemWithDetails[]) ?? [];
}

export async function getWishlist(userId: string): Promise<PortfolioItemWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*, cards(*), sealed_products(*)')
    .eq('user_id', userId)
    .eq('is_wishlist', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PortfolioItemWithDetails[]) ?? [];
}

export async function getForSaleItems(userId?: string): Promise<PortfolioItemWithDetails[]> {
  const supabase = createClient();

  let query = supabase.from('portfolio_items').select('*, cards(*), sealed_products(*)').eq('is_for_sale', true);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PortfolioItemWithDetails[]) ?? [];
}

export async function addPortfolioItem(userId: string, item: NewPortfolioItem): Promise<PortfolioItem> {
  const supabase = createClient();

  const insertData = {
    user_id: userId,
    item_type: item.item_type,
    card_id: item.card_id ?? null,
    sealed_product_id: item.sealed_product_id ?? null,
    quantity: item.quantity ?? 1,
    purchase_price: item.purchase_price ?? null,
    purchase_date: item.purchase_date ?? null,
    condition: item.condition ?? null,
    is_graded: item.is_graded ?? false,
    grading_company: item.grading_company ?? null,
    grade: item.grade ?? null,
    cert_number: item.cert_number ?? null,
    is_wishlist: item.is_wishlist ?? false,
    is_for_sale: item.is_for_sale ?? false,
    asking_price: item.asking_price ?? null,
    notes: item.notes ?? null,
  };

  const { data, error } = await supabase.from('portfolio_items').insert(insertData).select().single();

  if (error) throw error;
  return data as unknown as PortfolioItem;
}

export async function updatePortfolioItem(id: number, updates: Partial<NewPortfolioItem>): Promise<PortfolioItem> {
  const supabase = createClient();

  const { data, error } = await supabase.from('portfolio_items').update(updates).eq('id', id).select().single();

  if (error) throw error;
  return data as unknown as PortfolioItem;
}

export async function deletePortfolioItem(id: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from('portfolio_items').delete().eq('id', id);

  if (error) throw error;
}

type PortfolioValueResult = Database['public']['Functions']['get_portfolio_value']['Returns'][number];

export async function getPortfolioValue(userId: string): Promise<PortfolioValueResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_portfolio_value' as never, { p_user_id: userId } as never);

  if (error) throw error;
  const result = (data as unknown as PortfolioValueResult[])?.[0];
  return result ?? { total_value: 0, total_cost: 0, total_gain_loss: 0, item_count: 0 };
}

type SetCompletionResult = Database['public']['Functions']['get_set_completion']['Returns'][number];

export async function getSetCompletion(userId: string, setId: number): Promise<SetCompletionResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    'get_set_completion' as never,
    { p_user_id: userId, p_set_id: setId } as never
  );

  if (error) throw error;
  const result = (data as unknown as SetCompletionResult[])?.[0];
  return result ?? { total_cards: 0, owned_cards: 0, completion_percentage: 0 };
}
