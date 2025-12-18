import { createClient } from '@/lib/supabase/client';

import type { Tables } from '@/types/database';
import type { CardFilters } from './query-keys';

export type Card = Tables<'cards'>;

export type CardWithSet = Card & {
  sets: Tables<'sets'> | null;
};

export async function getCards(filters?: CardFilters): Promise<Card[]> {
  const supabase = createClient();

  let query = supabase.from('cards').select('*').eq('approved', true);

  if (filters?.setId) {
    query = query.eq('set_id', filters.setId);
  }
  if (filters?.rarity) {
    query = query.eq('rarity', filters.rarity);
  }
  if (filters?.color) {
    query = query.eq('color', filters.color);
  }
  if (filters?.cardType) {
    query = query.eq('card_type', filters.cardType);
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query.order('card_number');

  if (error) throw error;
  return (data as Card[]) ?? [];
}

export async function getCard(id: number): Promise<CardWithSet | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('cards').select('*, sets(*)').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as CardWithSet;
}

export async function searchCards(query: string): Promise<Card[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('approved', true)
    .ilike('name', `%${query}%`)
    .limit(20);

  if (error) throw error;
  return (data as Card[]) ?? [];
}

export async function getCardsBySet(setId: number): Promise<Card[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('set_id', setId)
    .eq('approved', true)
    .order('card_number');

  if (error) throw error;
  return (data as Card[]) ?? [];
}
