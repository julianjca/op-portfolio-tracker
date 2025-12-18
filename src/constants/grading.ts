import type { Enums } from '@/types/database';

export const GRADING_COMPANIES: { value: Enums<'grading_company'>; label: string }[] = [
  { value: 'PSA', label: 'PSA' },
  { value: 'CGC', label: 'CGC' },
  { value: 'BGS', label: 'BGS (Beckett)' },
  { value: 'ARS', label: 'ARS' },
  { value: 'other', label: 'Other' },
];

export const GRADES = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1] as const;

export const GRADE_LABELS: Record<number, string> = {
  10: 'Gem Mint',
  9.5: 'Mint+',
  9: 'Mint',
  8.5: 'NM-Mint+',
  8: 'NM-Mint',
  7.5: 'Near Mint+',
  7: 'Near Mint',
  6.5: 'EX-Mint+',
  6: 'EX-Mint',
  5.5: 'Excellent+',
  5: 'Excellent',
  4.5: 'VG-EX+',
  4: 'VG-EX',
  3.5: 'Very Good+',
  3: 'Very Good',
  2.5: 'Good+',
  2: 'Good',
  1.5: 'Fair',
  1: 'Poor',
};
