import { createClient } from '@/lib/supabase/client';

import type { Tables } from '@/types/database';

export type Set = Tables<'sets'>;

export type SetWithCardCount = Set & {
  card_count: number;
};

type SetWithCardsAgg = Set & {
  cards: { count: number }[];
};

export async function getSets(): Promise<SetWithCardCount[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('sets')
    .select('*, cards(count)')
    .order('release_date', { ascending: false });

  if (error) throw error;

  return ((data as SetWithCardsAgg[]) ?? []).map((set) => ({
    id: set.id,
    code: set.code,
    name: set.name,
    release_date: set.release_date,
    total_cards: set.total_cards,
    image_url: set.image_url,
    created_at: set.created_at,
    card_count: set.cards?.[0]?.count ?? 0,
  }));
}

export async function getSet(code: string): Promise<Set | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('sets').select('*').eq('code', code).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Set;
}

export async function getSetWithCards(code: string) {
  const supabase = createClient();

  const { data: set, error: setError } = await supabase.from('sets').select('*').eq('code', code).single();

  if (setError) {
    if (setError.code === 'PGRST116') return null;
    throw setError;
  }

  const typedSet = set as Set;

  const { data: cards, error: cardsError } = await supabase
    .from('cards')
    .select('*')
    .eq('set_id', typedSet.id)
    .eq('approved', true)
    .order('card_number');

  if (cardsError) throw cardsError;

  return { ...typedSet, cards: (cards as Tables<'cards'>[]) ?? [] };
}
