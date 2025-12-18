'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioSummaryProps {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  itemCount: number;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function PortfolioSummary({ totalValue, totalCost, totalGainLoss, itemCount }: PortfolioSummaryProps) {
  const gainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(1) : '0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-muted-foreground text-xs">Current market value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
          <p className="text-muted-foreground text-xs">Amount invested</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}
            {formatCurrency(totalGainLoss)}
          </div>
          <p className="text-muted-foreground text-xs">
            {totalGainLoss >= 0 ? '+' : ''}
            {gainLossPercent}% return
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{itemCount}</div>
          <p className="text-muted-foreground text-xs">Cards and sealed products</p>
        </CardContent>
      </Card>
    </div>
  );
}
