import type { Enums } from '@/types/database';

export const CARD_CONDITIONS: { value: Enums<'card_condition'>; label: string; shortLabel: string }[] = [
  { value: 'mint', label: 'Mint', shortLabel: 'M' },
  { value: 'near_mint', label: 'Near Mint', shortLabel: 'NM' },
  { value: 'lightly_played', label: 'Lightly Played', shortLabel: 'LP' },
  { value: 'moderately_played', label: 'Moderately Played', shortLabel: 'MP' },
  { value: 'heavily_played', label: 'Heavily Played', shortLabel: 'HP' },
  { value: 'damaged', label: 'Damaged', shortLabel: 'DMG' },
];

export const CONDITION_LABELS: Record<Enums<'card_condition'>, string> = {
  mint: 'Mint',
  near_mint: 'Near Mint',
  lightly_played: 'Lightly Played',
  moderately_played: 'Moderately Played',
  heavily_played: 'Heavily Played',
  damaged: 'Damaged',
};
