import { Calendar, Layers } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';

type SetRow = Tables<'sets'>;
type SetWithCount = SetRow & { cards: { count: number }[] };

export default async function SetsPage() {
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
  const setsWithCount = sets.map((set) => ({
    ...set,
    card_count: set.cards?.[0]?.count ?? 0,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-sea-900">Card Sets</h1>
        <p className="mt-2 text-sea-600">Browse all One Piece TCG sets and their cards.</p>
      </div>

      {setsWithCount.length === 0 ? (
        <div className="rounded-lg border border-sea-200 bg-white p-8 text-center">
          <Layers className="mx-auto mb-4 h-12 w-12 text-sea-400" />
          <p className="text-sea-600">No sets available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {setsWithCount.map((set) => (
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
                <CardContent>
                  <div className="flex items-center gap-1.5 text-sm text-sea-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {set.release_date
                      ? new Date(set.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Release date TBD'}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
