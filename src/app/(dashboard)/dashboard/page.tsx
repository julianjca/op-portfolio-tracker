'use client';

import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortfolio, usePortfolioValue } from '@/hooks/queries/use-portfolio';
import { createClient } from '@/lib/supabase/client';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const { data: portfolio } = usePortfolio(userId ?? undefined);
  const { data: portfolioValue } = usePortfolioValue(userId ?? undefined);

  const cardCount = (portfolio ?? []).filter((item) => item.item_type === 'card').length;
  const sealedCount = (portfolio ?? []).filter((item) => item.item_type === 'sealed').length;

  const totalValue = portfolioValue?.total_value ?? 0;
  const totalGainLoss = portfolioValue?.total_gain_loss ?? 0;
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-sea-900">Dashboard</h2>
        <p className="text-sea-600">Welcome back, {userEmail}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-sea-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sea-700">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-luffy-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sea-900">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-sea-500">Based on current prices</p>
          </CardContent>
        </Card>

        <Card className="border-sea-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sea-700">Cards Owned</CardTitle>
            <CreditCard className="h-4 w-4 text-luffy-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sea-900">{cardCount}</div>
            <p className="text-xs text-sea-500">Across all sets</p>
          </CardContent>
        </Card>

        <Card className="border-sea-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sea-700">Sealed Products</CardTitle>
            <Package className="h-4 w-4 text-straw-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sea-900">{sealedCount}</div>
            <p className="text-xs text-sea-500">Boxes, cases, and more</p>
          </CardContent>
        </Card>

        <Card className="border-sea-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sea-700">Gain/Loss</CardTitle>
            <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-emerald-500' : 'text-luffy-500'}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`flex items-center gap-1 text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-luffy-600'}`}
            >
              {isPositive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
              {formatCurrency(Math.abs(totalGainLoss))}
            </div>
            <p className="text-xs text-sea-500">Based on purchase price</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-sea-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sea-900">Quick Actions</CardTitle>
            <CardDescription className="text-sea-500">Manage your collection</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 hover:from-luffy-600 hover:to-luffy-700"
            >
              <Link href="/dashboard/cards">Manage Cards</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-sea-300 text-sea-700 hover:border-sea-400 hover:bg-sea-50"
            >
              <Link href="/dashboard/sealed">Manage Sealed</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-sea-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sea-900">Recent Activity</CardTitle>
            <CardDescription className="text-sea-500">Your portfolio activity</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio && portfolio.length > 0 ? (
              <ul className="space-y-2">
                {portfolio.slice(0, 5).map((item) => (
                  <li key={item.id} className="text-sm text-sea-700">
                    Added {item.cards?.name ?? item.sealed_products?.name ?? 'Unknown item'}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-sea-200 bg-sea-50 py-6 text-center">
                <p className="text-sea-600">No activity yet. Start by adding cards to your portfolio.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
