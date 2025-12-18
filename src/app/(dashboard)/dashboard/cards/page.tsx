'use client';

import { CreditCard, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AddItemDialog } from '@/components/portfolio/add-item-dialog';
import { PortfolioTable } from '@/components/portfolio/portfolio-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddPortfolioItem, useDeletePortfolioItem } from '@/hooks/mutations/use-portfolio-mutations';
import { usePortfolio } from '@/hooks/queries/use-portfolio';
import { createClient } from '@/lib/supabase/client';

import type { PortfolioItemWithDetails } from '@/lib/api/portfolio';

export default function CardsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: portfolio, isLoading } = usePortfolio(userId ?? undefined);
  const addMutation = useAddPortfolioItem(userId ?? '');
  const deleteMutation = useDeletePortfolioItem(userId ?? '');

  const cardItems = (portfolio ?? []).filter((item) => item.item_type === 'card');

  function handleEdit(item: PortfolioItemWithDetails) {
    console.log('Edit item:', item);
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-luffy-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sea-900">
            <CreditCard className="h-8 w-8 text-luffy-500" />
            My Cards
          </h1>
          <p className="text-sea-600">Manage your card collection</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md shadow-luffy-200 hover:from-luffy-600 hover:to-luffy-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Card
        </Button>
      </div>

      <Card className="border-sea-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sea-900">Card Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-luffy-500 border-t-transparent" />
            </div>
          ) : cardItems.length === 0 ? (
            <div className="rounded-lg border border-sea-200 bg-sea-50 py-12 text-center">
              <CreditCard className="mx-auto mb-4 h-12 w-12 text-sea-400" />
              <p className="text-sea-600">No cards in your collection yet.</p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="mt-4 bg-gradient-to-r from-luffy-500 to-luffy-600 font-semibold text-white shadow-md hover:from-luffy-600 hover:to-luffy-700"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add your first card
              </Button>
            </div>
          ) : (
            <PortfolioTable items={cardItems} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <AddItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(item) => {
          addMutation.mutate(item, {
            onSuccess: () => setDialogOpen(false),
          });
        }}
        isLoading={addMutation.isPending}
      />
    </div>
  );
}
