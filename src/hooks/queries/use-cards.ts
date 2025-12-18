'use client';

import { useQuery } from '@tanstack/react-query';

import { getCard, getCards, getCardsBySet, searchCards } from '@/lib/api/cards';
import { queryKeys } from '@/lib/api/query-keys';

import type { CardFilters } from '@/lib/api/query-keys';

export function useCards(filters?: CardFilters) {
  return useQuery({
    queryKey: queryKeys.cards.list(filters),
    queryFn: () => getCards(filters),
  });
}

export function useCard(id: number) {
  return useQuery({
    queryKey: queryKeys.cards.detail(id),
    queryFn: () => getCard(id),
    enabled: !!id,
  });
}

export function useCardsBySet(setId: number) {
  return useQuery({
    queryKey: queryKeys.cards.list({ setId }),
    queryFn: () => getCardsBySet(setId),
    enabled: !!setId,
  });
}

export function useSearchCards(query: string) {
  return useQuery({
    queryKey: queryKeys.cards.search(query),
    queryFn: () => searchCards(query),
    enabled: query.length >= 2,
  });
}
