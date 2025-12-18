'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { getSet, getSets, getSetWithCards } from '@/lib/api/sets';

export function useSets() {
  return useQuery({
    queryKey: queryKeys.sets.list(),
    queryFn: getSets,
  });
}

export function useSet(code: string) {
  return useQuery({
    queryKey: queryKeys.sets.detail(code),
    queryFn: () => getSet(code),
    enabled: !!code,
  });
}

export function useSetWithCards(code: string) {
  return useQuery({
    queryKey: [...queryKeys.sets.detail(code), 'cards'],
    queryFn: () => getSetWithCards(code),
    enabled: !!code,
  });
}
