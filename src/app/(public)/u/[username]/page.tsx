import { Calendar, CreditCard, Package, User } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

import type { Tables } from '@/types/database';
import type { Metadata } from 'next';

type ProfileRow = Tables<'profiles'>;
type PortfolioItemRow = Tables<'portfolio_items'>;
type CardRow = Tables<'cards'>;
type SealedProductRow = Tables<'sealed_products'>;

type PortfolioItemWithCard = PortfolioItemRow & {
  cards: CardRow | null;
};

type PortfolioItemWithSealed = PortfolioItemRow & {
  sealed_products: SealedProductRow | null;
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s Profile | OPTracker`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profileData) {
    notFound();
  }

  const profile = profileData as unknown as ProfileRow;

  if (!profile.is_public) {
    notFound();
  }

  const { data: cardItemsData } = await supabase
    .from('portfolio_items')
    .select('*, cards(*)')
    .eq('user_id', profile.id)
    .eq('item_type', 'card')
    .eq('is_wishlist', false);

  const { data: sealedItemsData } = await supabase
    .from('portfolio_items')
    .select('*, sealed_products(*)')
    .eq('user_id', profile.id)
    .eq('item_type', 'sealed')
    .eq('is_wishlist', false);

  const cardItems = (cardItemsData as unknown as PortfolioItemWithCard[]) ?? [];
  const sealedItems = (sealedItemsData as unknown as PortfolioItemWithSealed[]) ?? [];

  const totalItems = cardItems.length + sealedItems.length;
  const totalQuantity =
    cardItems.reduce((sum, item) => sum + item.quantity, 0) + sealedItems.reduce((sum, item) => sum + item.quantity, 0);

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Card className="mb-8 border-sea-200 bg-white">
        <CardHeader>
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name ?? profile.username}
                width={64}
                height={64}
                className="rounded-full object-cover ring-2 ring-sea-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-luffy-500 to-luffy-600">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl text-sea-900">{profile.display_name ?? profile.username}</CardTitle>
              <p className="text-sea-500">@{profile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {profile.bio && <p className="mb-4 text-sea-700">{profile.bio}</p>}
          <div className="flex items-center gap-1.5 text-sm text-sea-500">
            <Calendar className="h-4 w-4" />
            Member since {memberSince}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-sea-200 bg-white">
          <CardContent className="pt-6">
            <p className="text-sm text-sea-500">Total Items</p>
            <p className="text-2xl font-bold text-sea-900">{totalQuantity}</p>
          </CardContent>
        </Card>
        <Card className="border-sea-200 bg-white">
          <CardContent className="flex items-center gap-3 pt-6">
            <CreditCard className="h-5 w-5 text-luffy-500" />
            <div>
              <p className="text-sm text-sea-500">Cards</p>
              <p className="text-2xl font-bold text-sea-900">
                {cardItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sea-200 bg-white">
          <CardContent className="flex items-center gap-3 pt-6">
            <Package className="h-5 w-5 text-straw-500" />
            <div>
              <p className="text-sm text-sea-500">Sealed Products</p>
              <p className="text-2xl font-bold text-sea-900">
                {sealedItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalItems === 0 ? (
        <div className="rounded-lg border border-sea-200 bg-white p-8 text-center">
          <p className="text-sea-600">This user has no public portfolio items.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {cardItems.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-sea-900">
                <CreditCard className="h-5 w-5 text-luffy-500" />
                Cards
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {cardItems.map((item) => (
                  <Card
                    key={item.id}
                    className="border-sea-200 bg-white transition-all hover:border-luffy-300 hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-sea-900">{item.cards?.name ?? 'Unknown Card'}</span>
                        <Badge className="bg-sea-100 text-sea-700">x{item.quantity}</Badge>
                      </div>
                      <div className="flex gap-2 text-sm text-sea-500">
                        {item.cards?.card_number && <span>{item.cards.card_number}</span>}
                        {item.cards?.rarity && <span>· {item.cards.rarity}</span>}
                      </div>
                      {item.is_graded && item.grading_company && item.grade && (
                        <Badge className="mt-2 bg-purple-100 text-purple-700">
                          {item.grading_company} {item.grade}
                        </Badge>
                      )}
                      {item.is_for_sale && (
                        <Badge className="mt-2 bg-gradient-to-r from-luffy-500 to-luffy-600 text-white">For Sale</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {sealedItems.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-sea-900">
                <Package className="h-5 w-5 text-straw-500" />
                Sealed Products
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {sealedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="border-sea-200 bg-white transition-all hover:border-straw-300 hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-sea-900">
                          {item.sealed_products?.name ?? 'Unknown Product'}
                        </span>
                        <Badge className="bg-straw-100 text-straw-700">x{item.quantity}</Badge>
                      </div>
                      <div className="text-sm text-sea-500">
                        {item.sealed_products?.product_type && (
                          <span>{item.sealed_products.product_type.replace('_', ' ')}</span>
                        )}
                      </div>
                      {item.is_for_sale && (
                        <Badge className="mt-2 bg-gradient-to-r from-luffy-500 to-luffy-600 text-white">For Sale</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
