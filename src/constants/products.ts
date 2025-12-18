import type { Enums } from '@/types/database';

export const SEALED_PRODUCT_TYPES: { value: Enums<'sealed_product_type'>; label: string }[] = [
  { value: 'booster_box', label: 'Booster Box' },
  { value: 'booster_pack', label: 'Booster Pack' },
  { value: 'case', label: 'Case' },
  { value: 'starter_deck', label: 'Starter Deck' },
  { value: 'promo', label: 'Promo' },
  { value: 'collection_box', label: 'Collection Box' },
  { value: 'other', label: 'Other' },
];

export const PRODUCT_TYPE_LABELS: Record<Enums<'sealed_product_type'>, string> = {
  booster_box: 'Booster Box',
  booster_pack: 'Booster Pack',
  case: 'Case',
  starter_deck: 'Starter Deck',
  promo: 'Promo',
  collection_box: 'Collection Box',
  other: 'Other',
};
