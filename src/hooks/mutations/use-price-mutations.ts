'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addPrice } from '@/lib/api/prices';
import { queryKeys } from '@/lib/api/query-keys';

import type { NewPrice } from '@/lib/api/prices';

export function useAddPrice(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (price: NewPrice) => addPrice(userId, price),
    onSuccess: (_, variables) => {
      if (variables.card_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.prices.card(variables.card_id) });
      }
      if (variables.sealed_product_id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.prices.sealed(variables.sealed_product_id) });
      }
    },
  });
}
