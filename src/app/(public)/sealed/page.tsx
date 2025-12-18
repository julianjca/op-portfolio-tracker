import { Calendar, Package } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';

type SealedProductRow = Tables<'sealed_products'>;
type SetRow = Tables<'sets'>;
type SealedProductWithSet = SealedProductRow & { sets: SetRow | null };

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  booster_box: 'Booster Box',
  booster_pack: 'Booster Pack',
  case: 'Case',
  starter_deck: 'Starter Deck',
  promo: 'Promo',
  collection_box: 'Collection Box',
  other: 'Other',
};

export default async function SealedProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sealed_products')
    .select('*, sets(code, name)')
    .eq('approved', true)
    .order('release_date', { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="rounded-lg border border-luffy-200 bg-luffy-50 p-4 text-luffy-700">
          Failed to load products. Please try again later.
        </div>
      </div>
    );
  }

  const products = (data as unknown as SealedProductWithSet[]) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-sea-900">Sealed Products</h1>
        <p className="mt-2 text-sea-600">Browse booster boxes, cases, starter decks, and more.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-sea-200 bg-white p-8 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-sea-400" />
          <p className="text-sea-600">No sealed products available yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="h-full border-sea-200 bg-white transition-all duration-300 hover:border-luffy-300 hover:shadow-lg hover:shadow-luffy-100"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-straw-100 font-medium text-straw-700 hover:bg-straw-200">
                    {PRODUCT_TYPE_LABELS[product.product_type] ?? product.product_type}
                  </Badge>
                  {product.sets && <span className="text-xs font-medium text-sea-500">{product.sets.code}</span>}
                </div>
                <CardTitle className="line-clamp-2 text-base text-sea-900">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {product.description && <p className="mb-3 line-clamp-2 text-sm text-sea-600">{product.description}</p>}
                <div className="flex items-center gap-1.5 text-sm text-sea-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {product.release_date
                    ? new Date(product.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })
                    : 'Release date TBD'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-sea-200 bg-gradient-to-br from-sea-900 to-sea-950 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-white">Want to track your sealed products?</h2>
        <p className="mb-6 text-sea-200">Sign in to add items to your portfolio and track their value over time.</p>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-luffy-500 to-luffy-600 px-6 font-semibold text-white shadow-md shadow-luffy-500/30 transition-all hover:from-luffy-600 hover:to-luffy-700"
        >
          Sign in to get started
        </Link>
      </div>
    </div>
  );
}
