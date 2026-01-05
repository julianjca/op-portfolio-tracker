import { ArrowLeft, Calendar, CreditCard, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CardFilters } from '@/components/cards/card-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';

type SetRow = Tables<'sets'>;
type CardRow = Tables<'cards'>;

type SortOption = 'number' | 'rarity' | 'name';

const RARITY_ORDER: Record<string, number> = {
  L: 1,
  SEC: 2,
  SP: 3,
  SR: 4,
  R: 5,
  UC: 6,
  C: 7,
};

interface Filters {
  rarity?: string;
  color?: string;
  type?: string;
}

function filterCards(cards: CardRow[], filters: Filters): CardRow[] {
  return cards.filter((card) => {
    if (filters.rarity && card.rarity !== filters.rarity) return false;
    if (filters.color && card.color !== filters.color) return false;
    if (filters.type && card.card_type !== filters.type) return false;
    return true;
  });
}

function sortCards(cards: CardRow[], sortBy: SortOption): CardRow[] {
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'rarity': {
        const rarityA = RARITY_ORDER[a.rarity ?? ''] ?? 99;
        const rarityB = RARITY_ORDER[b.rarity ?? ''] ?? 99;
        if (rarityA !== rarityB) return rarityA - rarityB;
        return (a.card_number ?? '').localeCompare(b.card_number ?? '');
      }
      case 'name':
        return (a.name ?? '').localeCompare(b.name ?? '');
      case 'number':
      default:
        return (a.card_number ?? '').localeCompare(b.card_number ?? '');
    }
  });
}

const RARITY_CONFIG: Record<string, { bg: string; text: string; border: string; glow: string; icon?: boolean }> = {
  C: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', glow: '' },
  UC: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', glow: '' },
  R: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300', glow: 'shadow-sky-200/50' },
  SR: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-300',
    glow: 'shadow-violet-200/50',
    icon: true,
  },
  SEC: {
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    glow: 'shadow-amber-200/60',
    icon: true,
  },
  L: {
    bg: 'bg-gradient-to-r from-luffy-50 to-rose-50',
    text: 'text-luffy-700',
    border: 'border-luffy-300',
    glow: 'shadow-luffy-200/60',
    icon: true,
  },
  SP: {
    bg: 'bg-gradient-to-r from-fuchsia-50 to-pink-50',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-300',
    glow: 'shadow-fuchsia-200/60',
    icon: true,
  },
};

const DEFAULT_RARITY = { bg: 'bg-sea-50', text: 'text-sea-600', border: 'border-sea-200', glow: '', icon: false };

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ sort?: string; rarity?: string; color?: string; type?: string }>;
}

export default async function SetDetailPage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { sort, rarity, color, type } = await searchParams;
  const sortBy = (['number', 'rarity', 'name'].includes(sort ?? '') ? sort : 'number') as SortOption;
  const filters: Filters = { rarity, color, type };
  const hasFilters = rarity || color || type;

  const supabase = await createClient();

  const { data: setData, error: setError } = await supabase.from('sets').select('*').eq('code', code).single();

  if (setError || !setData) {
    notFound();
  }

  const set = setData as unknown as SetRow;

  const { data: cardsData } = await supabase
    .from('cards')
    .select('*')
    .eq('set_id', set.id)
    .eq('approved', true)
    .order('card_number');

  const allCards = (cardsData as unknown as CardRow[]) ?? [];
  const cardIds = allCards.map((c) => c.id);

  const { data: pricesData } = await supabase
    .from('current_prices')
    .select('card_id, price, is_graded, grading_company, grade')
    .eq('item_type', 'card')
    .in('card_id', cardIds);

  const rawPriceMap = new Map<number, number>();
  const psa10PriceMap = new Map<number, number>();

  (
    pricesData as
      | { card_id: number; price: number; is_graded: boolean; grading_company: string | null; grade: number | null }[]
      | null
  )?.forEach((p) => {
    if (p.card_id && p.price) {
      if (!p.is_graded) {
        rawPriceMap.set(p.card_id, Number(p.price));
      } else if (p.grading_company === 'PSA' && p.grade === 10) {
        psa10PriceMap.set(p.card_id, Number(p.price));
      }
    }
  });

  const filteredCards = filterCards(allCards, filters);
  const cards = sortCards(filteredCards, sortBy);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 text-sea-600 hover:bg-sea-100 hover:text-sea-800">
          <Link href="/sets">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Sets
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Badge className="bg-sea-100 px-3 py-1 text-base font-semibold text-sea-700">{set.code}</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-sea-900">{set.name}</h1>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sea-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {set.release_date
              ? new Date(set.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Release date TBD'}
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4" />
            {hasFilters ? `${cards.length} of ${allCards.length} cards` : `${allCards.length} cards`}
          </span>
        </div>

        <div className="mt-4">
          <CardFilters setCode={code} sort={sort} rarity={rarity} color={color} type={type} />
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-sea-200 bg-gradient-to-b from-white to-sea-50/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sea-100">
            <CreditCard className="h-8 w-8 text-sea-400" />
          </div>
          <p className="text-lg font-medium text-sea-700">No cards in this set yet</p>
          <p className="mt-1 text-sm text-sea-500">Check back soon for updates</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cards.map((card) => {
            const rarity = RARITY_CONFIG[card.rarity ?? ''] ?? DEFAULT_RARITY;
            const isSpecial = rarity.icon;
            const price = rawPriceMap.get(card.id);
            const psa10Price = psa10PriceMap.get(card.id);

            return (
              <Link key={card.id} href={`/cards/${card.id}`} className="group block">
                <article
                  className={`relative overflow-hidden rounded-xl border-2 ${rarity.border} bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${rarity.glow ? `hover:shadow-lg ${rarity.glow}` : 'hover:shadow-sea-200/50'}`}
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[63/88] w-full overflow-hidden bg-gradient-to-br from-sea-100 to-sea-50">
                    {card.image_url ? (
                      <>
                        <Image
                          src={card.image_url}
                          alt={card.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        {/* Shine overlay on hover */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:via-white/20 group-hover:to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <CreditCard className="h-10 w-10 text-sea-300" />
                        <span className="text-xs text-sea-400">No image</span>
                      </div>
                    )}

                    {/* Card Number Badge - Top Left */}
                    <div className="absolute left-2 top-2">
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
                        {card.card_number}
                      </span>
                    </div>

                    {/* Rarity Badge - Top Right */}
                    {card.rarity && (
                      <div className="absolute right-2 top-2">
                        <Badge
                          className={`${rarity.bg} ${rarity.text} border ${rarity.border} px-2 py-0.5 text-xs font-bold shadow-sm`}
                        >
                          {isSpecial && <Sparkles className="mr-1 h-3 w-3" />}
                          {card.rarity}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold text-sea-900 transition-colors group-hover:text-luffy-600">
                        {card.name}
                      </h3>
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        {price !== undefined && (
                          <span className="text-sm font-bold text-emerald-600">${price.toFixed(2)}</span>
                        )}
                        {psa10Price !== undefined && (
                          <span className="text-[10px] font-medium text-violet-600">
                            PSA 10: ${psa10Price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {card.color && (
                        <span className="rounded-full bg-sea-100 px-2 py-0.5 text-[10px] font-medium text-sea-600">
                          {card.color}
                        </span>
                      )}
                      {card.card_type && <span className="text-[10px] font-medium text-sea-400">{card.card_type}</span>}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
