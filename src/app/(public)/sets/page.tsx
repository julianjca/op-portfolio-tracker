import { Calendar, DollarSign, Layers, Trophy } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';

type SetRow = Tables<'sets'>;
type SetWithCount = SetRow & { cards: { count: number }[] };

type SortOption = 'release' | 'raw_value' | 'psa10_value';

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

function formatCurrency(value: number | null): string {
  if (value === null || value === 0) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function SetsPage({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  const sortBy = (['release', 'raw_value', 'psa10_value'].includes(sort ?? '') ? sort : 'release') as SortOption;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sets')
    .select('*, cards(count)')
    .order('release_date', { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="rounded-lg border border-luffy-200 bg-luffy-50 p-4 text-luffy-700">
          Failed to load sets. Please try again later.
        </div>
      </div>
    );
  }

  const sets = (data as unknown as SetWithCount[]) ?? [];
  let setsWithCount = sets.map((set) => ({
    ...set,
    card_count: set.cards?.[0]?.count ?? 0,
  }));

  if (sortBy === 'raw_value') {
    setsWithCount = setsWithCount.sort((a, b) => (b.raw_value ?? 0) - (a.raw_value ?? 0));
  } else if (sortBy === 'psa10_value') {
    setsWithCount = setsWithCount.sort((a, b) => (b.psa10_value ?? 0) - (a.psa10_value ?? 0));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-sea-900">Card Sets</h1>
          <p className="mt-2 text-sea-600">Browse all One Piece TCG sets and their market values.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sets?sort=release"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === 'release' ? 'bg-sea-600 text-white' : 'bg-sea-100 text-sea-700 hover:bg-sea-200'
            }`}
          >
            By Date
          </Link>
          <Link
            href="/sets?sort=raw_value"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === 'raw_value'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            By Raw Value
          </Link>
          <Link
            href="/sets?sort=psa10_value"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === 'psa10_value' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
            }`}
          >
            By PSA 10
          </Link>
        </div>
      </div>

      {setsWithCount.length === 0 ? (
        <div className="rounded-lg border border-sea-200 bg-white p-8 text-center">
          <Layers className="mx-auto mb-4 h-12 w-12 text-sea-400" />
          <p className="text-sea-600">No sets available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {setsWithCount.map((set) => {
            const hasValues = (set.raw_value ?? 0) > 0 || (set.psa10_value ?? 0) > 0;

            return (
              <Link key={set.id} href={`/sets/${set.code}`}>
                <Card className="group h-full border-sea-200 bg-white transition-all duration-300 hover:border-luffy-300 hover:shadow-lg hover:shadow-luffy-100">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-sea-100 font-semibold text-sea-700 hover:bg-sea-200">{set.code}</Badge>
                      <span className="text-xs text-sea-500">{set.card_count} cards</span>
                    </div>
                    <CardTitle className="line-clamp-1 text-base text-sea-900 transition-colors group-hover:text-luffy-600">
                      {set.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-1.5 text-sm text-sea-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {set.release_date
                        ? new Date(set.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })
                        : 'Release date TBD'}
                    </div>

                    {hasValues && (
                      <div className="flex items-center justify-between border-t border-sea-100 pt-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600">
                            {formatCurrency(set.raw_value)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-violet-500" />
                          <span className="text-sm font-semibold text-violet-600">
                            {formatCurrency(set.psa10_value)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
