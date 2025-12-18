'use client';

import { useQuery } from '@tanstack/react-query';

import { getForSaleItems, getPortfolio, getPortfolioValue, getSetCompletion, getWishlist } from '@/lib/api/portfolio';
import { queryKeys } from '@/lib/api/query-keys';

export function usePortfolio(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portfolio.list(userId ?? ''),
    queryFn: () => getPortfolio(userId as string),
    enabled: !!userId,
  });
}

export function useWishlist(userId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.portfolio.list(userId ?? ''), 'wishlist'],
    queryFn: () => getWishlist(userId as string),
    enabled: !!userId,
  });
}

export function useForSaleItems(userId?: string) {
  return useQuery({
    queryKey: [...queryKeys.portfolio.all, 'for-sale', userId],
    queryFn: () => getForSaleItems(userId),
  });
}

export function usePortfolioValue(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portfolio.value(userId ?? ''),
    queryFn: () => getPortfolioValue(userId as string),
    enabled: !!userId,
  });
}

export function useSetCompletion(userId: string | undefined, setId: number) {
  return useQuery({
    queryKey: queryKeys.portfolio.setCompletion(userId ?? '', setId),
    queryFn: () => getSetCompletion(userId as string, setId),
    enabled: !!userId && !!setId,
  });
}
