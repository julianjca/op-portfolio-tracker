'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentPrice, getPriceHistory } from '@/lib/api/prices';
import { queryKeys } from '@/lib/api/query-keys';

import type { Enums } from '@/types/database';

export function usePriceHistory(itemType: 'card' | 'sealed', itemId: number) {
  const queryKey = itemType === 'card' ? queryKeys.prices.card(itemId) : queryKeys.prices.sealed(itemId);

  return useQuery({
    queryKey,
    queryFn: () => getPriceHistory(itemType, itemId),
    enabled: !!itemId,
  });
}

export function useCurrentPrice(
  itemType: 'card' | 'sealed',
  itemId: number,
  options?: {
    condition?: Enums<'card_condition'>;
    isGraded?: boolean;
    grade?: number;
  }
) {
  return useQuery({
    queryKey: [...queryKeys.prices.current(itemType, itemId), options],
    queryFn: () => getCurrentPrice(itemType, itemId, options),
    enabled: !!itemId,
  });
}
