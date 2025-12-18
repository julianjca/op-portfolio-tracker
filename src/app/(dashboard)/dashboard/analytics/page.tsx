'use client';

import { BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CategoryBreakdown } from '@/components/analytics/category-breakdown';
import { PortfolioSummary } from '@/components/analytics/portfolio-summary';
import { SetCompletion } from '@/components/analytics/set-completion';
import { ValueChart } from '@/components/analytics/value-chart';
import { usePortfolio, usePortfolioValue } from '@/hooks/queries/use-portfolio';
import { useSets } from '@/hooks/queries/use-sets';
import { createClient } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: portfolioValue, isLoading: valueLoading } = usePortfolioValue(userId ?? undefined);
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio(userId ?? undefined);
  const { data: sets } = useSets();

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luffy-500 border-t-transparent" />
      </div>
    );
  }

  const isLoading = valueLoading || portfolioLoading;

  const cardItems = (portfolio ?? []).filter((item) => item.item_type === 'card');
  const sealedItems = (portfolio ?? []).filter((item) => item.item_type === 'sealed');
  const gradedItems = cardItems.filter((item) => item.is_graded);
  const rawItems = cardItems.filter((item) => !item.is_graded);

  const categoryData = [
    {
      name: 'Raw Cards',
      value: rawItems.reduce((sum, item) => sum + (item.purchase_price ?? 0), 0),
      count: rawItems.length,
    },
    {
      name: 'Graded Cards',
      value: gradedItems.reduce((sum, item) => sum + (item.purchase_price ?? 0), 0),
      count: gradedItems.length,
    },
    {
      name: 'Sealed',
      value: sealedItems.reduce((sum, item) => sum + (item.purchase_price ?? 0), 0),
      count: sealedItems.length,
    },
  ].filter((item) => item.count > 0);

  const setCompletionData = (sets ?? [])
    .map((set) => {
      const cardsInSet = cardItems.filter((item) => item.cards?.set_id === set.id);
      const uniqueCards = new Set(cardsInSet.map((item) => item.card_id)).size;
      const totalCards = set.card_count || 0;
      return {
        setCode: set.code,
        setName: set.name,
        ownedCards: uniqueCards,
        totalCards,
        completionPercentage: totalCards > 0 ? (uniqueCards / totalCards) * 100 : 0,
      };
    })
    .filter((set) => set.ownedCards > 0)
    .sort((a, b) => b.completionPercentage - a.completionPercentage);

  const mockValueHistory = [
    { date: 'Jan', value: (portfolioValue?.total_cost ?? 0) * 0.9 },
    { date: 'Feb', value: (portfolioValue?.total_cost ?? 0) * 0.95 },
    { date: 'Mar', value: (portfolioValue?.total_cost ?? 0) * 0.92 },
    { date: 'Apr', value: (portfolioValue?.total_cost ?? 0) * 1.0 },
    { date: 'May', value: (portfolioValue?.total_cost ?? 0) * 1.05 },
    { date: 'Jun', value: portfolioValue?.total_value ?? 0 },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sea-900">
          <BarChart3 className="h-8 w-8 text-luffy-500" />
          Analytics
        </h1>
        <p className="text-sea-600">Track your portfolio performance and insights</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-luffy-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <PortfolioSummary
            totalValue={portfolioValue?.total_value ?? 0}
            totalCost={portfolioValue?.total_cost ?? 0}
            totalGainLoss={portfolioValue?.total_gain_loss ?? 0}
            itemCount={portfolioValue?.item_count ?? 0}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ValueChart data={mockValueHistory} />
            <CategoryBreakdown data={categoryData} />
          </div>

          <SetCompletion sets={setCompletionData} />
        </>
      )}
    </div>
  );
}
