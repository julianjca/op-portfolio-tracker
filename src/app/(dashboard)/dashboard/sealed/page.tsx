'use client';

import { Package, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AddItemDialog } from '@/components/portfolio/add-item-dialog';
import { PortfolioTable } from '@/components/portfolio/portfolio-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddPortfolioItem, useDeletePortfolioItem } from '@/hooks/mutations/use-portfolio-mutations';
import { usePortfolio } from '@/hooks/queries/use-portfolio';
import { createClient } from '@/lib/supabase/client';

import type { PortfolioItemWithDetails } from '@/lib/api/portfolio';

export default function SealedPage() {
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

  const sealedItems = (portfolio ?? []).filter((item) => item.item_type === 'sealed');

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-straw-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-sea-900">
            <Package className="h-8 w-8 text-straw-500" />
            My Sealed Products
          </h1>
          <p className="text-sea-600">Manage your sealed collection</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-straw-500 to-straw-600 font-semibold text-white shadow-md shadow-straw-200 hover:from-straw-600 hover:to-straw-700"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Sealed Product
        </Button>
      </div>

      <Card className="border-sea-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sea-900">Sealed Collection</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-straw-500 border-t-transparent" />
            </div>
          ) : sealedItems.length === 0 ? (
            <div className="rounded-lg border border-sea-200 bg-sea-50 py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-sea-400" />
              <p className="text-sea-600">No sealed products in your collection yet.</p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="mt-4 bg-gradient-to-r from-straw-500 to-straw-600 font-semibold text-white shadow-md hover:from-straw-600 hover:to-straw-700"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add your first sealed product
              </Button>
            </div>
          ) : (
            <PortfolioTable items={sealedItems} onEdit={handleEdit} onDelete={handleDelete} />
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
