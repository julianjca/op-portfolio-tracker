export const queryKeys = {
  cards: {
    all: ['cards'] as const,
    list: (filters?: CardFilters) => ['cards', 'list', filters] as const,
    detail: (id: number) => ['cards', 'detail', id] as const,
    search: (query: string) => ['cards', 'search', query] as const,
  },
  sets: {
    all: ['sets'] as const,
    list: () => ['sets', 'list'] as const,
    detail: (code: string) => ['sets', 'detail', code] as const,
  },
  portfolio: {
    all: ['portfolio'] as const,
    list: (userId: string) => ['portfolio', 'list', userId] as const,
    value: (userId: string) => ['portfolio', 'value', userId] as const,
    setCompletion: (userId: string, setId: number) => ['portfolio', 'setCompletion', userId, setId] as const,
  },
  prices: {
    card: (cardId: number) => ['prices', 'card', cardId] as const,
    sealed: (productId: number) => ['prices', 'sealed', productId] as const,
    current: (itemType: 'card' | 'sealed', itemId: number) => ['prices', 'current', itemType, itemId] as const,
  },
  profiles: {
    me: ['profiles', 'me'] as const,
    detail: (username: string) => ['profiles', 'detail', username] as const,
  },
  sealedProducts: {
    all: ['sealed-products'] as const,
    list: (filters?: SealedProductFilters) => ['sealed-products', 'list', filters] as const,
    detail: (id: number) => ['sealed-products', 'detail', id] as const,
  },
};

export interface CardFilters {
  setId?: number;
  rarity?: string;
  color?: string;
  cardType?: string;
  search?: string;
}

export interface SealedProductFilters {
  setId?: number;
  productType?: 'booster_box' | 'booster_pack' | 'case' | 'starter_deck' | 'promo' | 'collection_box' | 'other';
}
