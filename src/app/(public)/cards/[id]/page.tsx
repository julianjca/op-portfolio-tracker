import { ArrowLeft, ImageOff, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';

type CardRow = Tables<'cards'>;
type SetRow = Tables<'sets'>;
type CardWithSet = CardRow & { sets: SetRow | null };

const RARITY_COLORS: Record<string, string> = {
  C: 'bg-sea-100 text-sea-700',
  UC: 'bg-emerald-100 text-emerald-700',
  R: 'bg-blue-100 text-blue-700',
  SR: 'bg-purple-100 text-purple-700',
  SEC: 'bg-straw-100 text-straw-700',
  L: 'bg-luffy-100 text-luffy-700',
};

export default async function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cardId = parseInt(id, 10);

  if (isNaN(cardId)) {
    notFound();
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from('cards').select('*, sets(*)').eq('id', cardId).single();

  if (error || !data) {
    notFound();
  }

  const card = data as unknown as CardWithSet;
  const set = card.sets;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 text-sea-600 hover:bg-sea-100 hover:text-sea-800">
        <Link href={set ? `/sets/${set.code}` : '/sets'}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to {set?.name ?? 'Sets'}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex justify-center lg:justify-start">
          {card.image_url ? (
            <div className="relative aspect-[2.5/3.5] w-full max-w-md overflow-hidden rounded-2xl border border-sea-200 bg-white shadow-xl">
              <Image
                src={card.image_url}
                alt={card.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          ) : (
            <div className="flex aspect-[2.5/3.5] w-full max-w-md items-center justify-center rounded-2xl border border-sea-200 bg-sea-50">
              <div className="text-center">
                <ImageOff className="mx-auto mb-2 h-12 w-12 text-sea-400" />
                <span className="text-sea-500">No image available</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {set && (
                <Badge className="bg-sea-100 font-medium text-sea-700">
                  {set.code} - {card.card_number}
                </Badge>
              )}
              {card.rarity && (
                <Badge className={`${RARITY_COLORS[card.rarity] ?? 'bg-sea-100 text-sea-700'} font-medium`}>
                  {card.rarity}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-sea-900">{card.name}</h1>
          </div>

          <Card className="border-sea-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-sea-800">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {card.card_type && (
                <div>
                  <p className="text-sm text-sea-500">Type</p>
                  <p className="font-medium text-sea-800">{card.card_type}</p>
                </div>
              )}
              {card.color && (
                <div>
                  <p className="text-sm text-sea-500">Color</p>
                  <p className="font-medium text-sea-800">{card.color}</p>
                </div>
              )}
              {card.cost !== null && (
                <div>
                  <p className="text-sm text-sea-500">Cost</p>
                  <p className="font-medium text-sea-800">{card.cost}</p>
                </div>
              )}
              {card.power !== null && (
                <div>
                  <p className="text-sm text-sea-500">Power</p>
                  <p className="font-medium text-sea-800">{card.power}</p>
                </div>
              )}
              {card.counter !== null && (
                <div>
                  <p className="text-sm text-sea-500">Counter</p>
                  <p className="font-medium text-sea-800">{card.counter}</p>
                </div>
              )}
              {card.attribute && (
                <div>
                  <p className="text-sm text-sea-500">Attribute</p>
                  <p className="font-medium text-sea-800">{card.attribute}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {card.effect && (
            <Card className="border-sea-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-sea-800">Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-sea-700">{card.effect}</p>
              </CardContent>
            </Card>
          )}

          <Button
            asChild
            className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 transition-all hover:from-luffy-600 hover:to-luffy-700 hover:shadow-luffy-300"
          >
            <Link href="/login">
              <Plus className="mr-1.5 h-4 w-4" />
              Add to Portfolio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
