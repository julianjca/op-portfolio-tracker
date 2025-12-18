'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CONDITION_LABELS } from '@/constants/conditions';
import { GRADE_LABELS } from '@/constants/grading';

import type { PortfolioItemWithDetails } from '@/lib/api/portfolio';

interface PortfolioTableProps {
  items: PortfolioItemWithDetails[];
  onEdit: (item: PortfolioItemWithDetails) => void;
  onDelete: (id: number) => void;
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return `$${value.toFixed(2)}`;
}

export function PortfolioTable({ items, onEdit, onDelete }: PortfolioTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No items in your portfolio yet. Start by adding some cards or sealed products!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Condition/Grade</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Cost</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const name = item.cards?.name ?? item.sealed_products?.name ?? 'Unknown';
          const cardNumber = item.cards?.card_number;

          return (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <span className="font-medium">{name}</span>
                  {cardNumber && <span className="text-muted-foreground ml-2 text-xs">{cardNumber}</span>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.item_type === 'card' ? 'Card' : 'Sealed'}</Badge>
              </TableCell>
              <TableCell>
                {item.is_graded ? (
                  <span>
                    {item.grading_company} {item.grade}{' '}
                    {GRADE_LABELS[item.grade ?? 0] ? `(${GRADE_LABELS[item.grade ?? 0]})` : ''}
                  </span>
                ) : item.condition ? (
                  <span>{CONDITION_LABELS[item.condition]}</span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.purchase_price)}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {item.is_for_sale && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      For Sale
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
