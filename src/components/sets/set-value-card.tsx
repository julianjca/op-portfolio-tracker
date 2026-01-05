import { DollarSign, Package, TrendingUp, Trophy } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SetValueCardProps {
  rawValue: number | null;
  psa10Value: number | null;
  sealedValue: number | null;
  cardsPriced: number | null;
  totalCards: number | null;
  valueUpdatedAt: string | null;
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

function formatDate(date: string | null): string {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SetValueCard({
  rawValue,
  psa10Value,
  sealedValue,
  cardsPriced,
  totalCards,
  valueUpdatedAt,
}: SetValueCardProps) {
  const pricedPercentage = totalCards && totalCards > 0 ? ((cardsPriced ?? 0) / totalCards) * 100 : 0;
  const hasValues = (rawValue ?? 0) > 0 || (psa10Value ?? 0) > 0 || (sealedValue ?? 0) > 0;

  if (!hasValues && !cardsPriced) {
    return null;
  }

  return (
    <Card className="border-sea-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-sea-800">
          <TrendingUp className="h-5 w-5" />
          Set Market Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-sea-500">
              <DollarSign className="h-3.5 w-3.5" />
              Raw Cards
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(rawValue)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-sea-500">
              <Trophy className="h-3.5 w-3.5" />
              PSA 10 Total
            </div>
            <p className="text-2xl font-bold text-violet-600">{formatCurrency(psa10Value)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-sea-500">
              <Package className="h-3.5 w-3.5" />
              Sealed Products
            </div>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(sealedValue)}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-sea-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-sea-600">Cards with prices</span>
            <span className="font-medium text-sea-800">
              {cardsPriced ?? 0} of {totalCards ?? 0} ({pricedPercentage.toFixed(0)}%)
            </span>
          </div>
          <Progress
            value={pricedPercentage}
            className="h-2"
            indicatorClassName={
              pricedPercentage >= 90 ? 'bg-emerald-500' : pricedPercentage >= 70 ? 'bg-amber-500' : 'bg-luffy-500'
            }
          />
          <p className="text-xs text-sea-400">Last updated: {formatDate(valueUpdatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
