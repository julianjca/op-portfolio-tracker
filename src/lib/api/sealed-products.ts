import { createClient } from '@/lib/supabase/client';

import type { Tables } from '@/types/database';
import type { SealedProductFilters } from './query-keys';

export type SealedProduct = Tables<'sealed_products'>;

export type SealedProductWithSet = SealedProduct & {
  sets: Tables<'sets'> | null;
};

export async function getSealedProducts(filters?: SealedProductFilters): Promise<SealedProduct[]> {
  const supabase = createClient();

  let query = supabase.from('sealed_products').select('*').eq('approved', true);

  if (filters?.setId) {
    query = query.eq('set_id', filters.setId);
  }
  if (filters?.productType) {
    query = query.eq('product_type', filters.productType);
  }

  const { data, error } = await query.order('release_date', { ascending: false });

  if (error) throw error;
  return (data as SealedProduct[]) ?? [];
}

export async function getSealedProduct(id: number): Promise<SealedProductWithSet | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('sealed_products').select('*, sets(*)').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as SealedProductWithSet;
}
