'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addPortfolioItem, deletePortfolioItem, updatePortfolioItem } from '@/lib/api/portfolio';
import { queryKeys } from '@/lib/api/query-keys';

import type { NewPortfolioItem } from '@/lib/api/portfolio';

export function useAddPortfolioItem(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: NewPortfolioItem) => addPortfolioItem(userId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.list(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.value(userId) });
    },
  });
}

export function useUpdatePortfolioItem(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<NewPortfolioItem> }) =>
      updatePortfolioItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.list(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.value(userId) });
    },
  });
}

export function useDeletePortfolioItem(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.list(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.value(userId) });
    },
  });
}
