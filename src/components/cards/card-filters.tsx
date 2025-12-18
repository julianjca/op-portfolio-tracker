'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RARITIES = ['L', 'SEC', 'SP', 'SR', 'R', 'UC', 'C'] as const;
const COLORS = ['Red', 'Blue', 'Green', 'Purple', 'Black', 'Yellow'] as const;
const CARD_TYPES = ['Leader', 'Character', 'Event', 'Stage'] as const;
const SORT_OPTIONS = [
  { value: 'number', label: 'Number' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'name', label: 'Name' },
] as const;

interface CardFiltersProps {
  setCode: string;
  sort?: string;
  rarity?: string;
  color?: string;
  type?: string;
}

function buildUrl(code: string, params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const queryString = searchParams.toString();
  return `/sets/${code}${queryString ? `?${queryString}` : ''}`;
}

export function CardFilters({ setCode, sort = 'number', rarity, color, type }: CardFiltersProps) {
  const router = useRouter();
  const hasFilters = rarity || color || type;

  const navigate = (newParams: Partial<Record<string, string | undefined>>) => {
    const url = buildUrl(setCode, { sort, rarity, color, type, ...newParams });
    router.push(url);
  };

  const clearFilters = () => {
    router.push(buildUrl(setCode, { sort }));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={sort} onValueChange={(value) => navigate({ sort: value })}>
        <SelectTrigger size="sm" className="w-[110px] border-sea-200 bg-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-4 w-px bg-sea-200" />

      <Select
        value={rarity ?? 'all'}
        onValueChange={(value) => navigate({ rarity: value === 'all' ? undefined : value })}
      >
        <SelectTrigger size="sm" className="w-[100px] border-sea-200 bg-white">
          <SelectValue placeholder="Rarity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Rarities</SelectItem>
          {RARITIES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={color ?? 'all'}
        onValueChange={(value) => navigate({ color: value === 'all' ? undefined : value })}
      >
        <SelectTrigger size="sm" className="w-[110px] border-sea-200 bg-white">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Colors</SelectItem>
          {COLORS.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type ?? 'all'} onValueChange={(value) => navigate({ type: value === 'all' ? undefined : value })}>
        <SelectTrigger size="sm" className="w-[120px] border-sea-200 bg-white">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {CARD_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-luffy-600 hover:bg-luffy-50 hover:text-luffy-700"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
