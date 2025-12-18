'use client';

import { useState } from 'react';

import { CardSearch } from '@/components/cards/card-search';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CARD_CONDITIONS } from '@/constants/conditions';
import { GRADES, GRADING_COMPANIES } from '@/constants/grading';

import type { Card } from '@/lib/api/cards';
import type { NewPortfolioItem } from '@/lib/api/portfolio';
import type { Enums } from '@/types/database';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: NewPortfolioItem) => void;
  isLoading?: boolean;
}

export function AddItemDialog({ open, onOpenChange, onSubmit, isLoading }: AddItemDialogProps) {
  const [itemType, setItemType] = useState<'card' | 'sealed'>('card');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [condition, setCondition] = useState<string>('');
  const [isGraded, setIsGraded] = useState(false);
  const [gradingCompany, setGradingCompany] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [certNumber, setCertNumber] = useState('');
  const [isForSale, setIsForSale] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [notes, setNotes] = useState('');

  function resetForm() {
    setSelectedCard(null);
    setQuantity(1);
    setPurchasePrice('');
    setPurchaseDate('');
    setCondition('');
    setIsGraded(false);
    setGradingCompany('');
    setGrade('');
    setCertNumber('');
    setIsForSale(false);
    setIsWishlist(false);
    setNotes('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (itemType === 'card' && !selectedCard) return;

    const item: NewPortfolioItem = {
      item_type: itemType,
      card_id: itemType === 'card' ? selectedCard?.id : null,
      sealed_product_id: null,
      quantity,
      purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
      purchase_date: purchaseDate || null,
      condition: (condition as Enums<'card_condition'>) || null,
      is_graded: isGraded,
      grading_company: isGraded ? (gradingCompany as Enums<'grading_company'>) : null,
      grade: isGraded && grade ? parseFloat(grade) : null,
      cert_number: isGraded ? certNumber || null : null,
      is_wishlist: isWishlist,
      is_for_sale: isForSale,
      asking_price: null,
      notes: notes || null,
    };

    onSubmit(item);
    resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Portfolio</DialogTitle>
        </DialogHeader>

        <Tabs value={itemType} onValueChange={(v) => setItemType(v as 'card' | 'sealed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="sealed">Sealed Product</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-4">
            <div className="mb-4">
              <Label className="mb-2 block">Search Card</Label>
              <CardSearch onSelect={setSelectedCard} />
              {selectedCard && (
                <div className="bg-muted mt-2 rounded-md p-2 text-sm">
                  Selected: <strong>{selectedCard.name}</strong> ({selectedCard.card_number})
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sealed" className="mt-4">
            <p className="text-muted-foreground text-sm">Sealed product selection coming soon.</p>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="price">Purchase Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Purchase Date</Label>
            <Input id="date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </div>

          {itemType === 'card' && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox id="graded" checked={isGraded} onCheckedChange={(v) => setIsGraded(v === true)} />
                <Label htmlFor="graded">This is a graded slab</Label>
              </div>

              {isGraded ? (
                <div className="space-y-4 rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Grading Company</Label>
                      <Select value={gradingCompany} onValueChange={setGradingCompany}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADING_COMPANIES.map((company) => (
                            <SelectItem key={company.value} value={company.value}>
                              {company.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((g) => (
                            <SelectItem key={g} value={g.toString()}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cert">Certification Number</Label>
                    <Input
                      id="cert"
                      placeholder="e.g., 12345678"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARD_CONDITIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox id="forSale" checked={isForSale} onCheckedChange={(v) => setIsForSale(v === true)} />
              <Label htmlFor="forSale">For Sale</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="wishlist" checked={isWishlist} onCheckedChange={(v) => setIsWishlist(v === true)} />
              <Label htmlFor="wishlist">Wishlist</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (itemType === 'card' && !selectedCard)}>
              {isLoading ? 'Adding...' : 'Add to Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
