'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/query-keys';
import { getSealedProduct, getSealedProducts } from '@/lib/api/sealed-products';

import type { SealedProductFilters } from '@/lib/api/query-keys';

export function useSealedProducts(filters?: SealedProductFilters) {
  return useQuery({
    queryKey: queryKeys.sealedProducts.list(filters),
    queryFn: () => getSealedProducts(filters),
  });
}

export function useSealedProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.sealedProducts.detail(id),
    queryFn: () => getSealedProduct(id),
    enabled: !!id,
  });
}
