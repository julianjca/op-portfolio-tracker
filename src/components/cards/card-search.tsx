'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { useSearchCards } from '@/hooks/queries/use-cards';

import type { Card } from '@/lib/api/cards';

interface CardSearchProps {
  onSelect: (card: Card) => void;
  placeholder?: string;
}

export function CardSearch({ onSelect, placeholder = 'Search cards...' }: CardSearchProps) {
  const [query, setQuery] = useState('');
  const { data: cards, isLoading } = useSearchCards(query);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      {query.length >= 2 && (
        <div className="bg-popover absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-lg">
          {isLoading ? (
            <div className="text-muted-foreground p-3 text-sm">Searching...</div>
          ) : cards && cards.length > 0 ? (
            cards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left text-sm"
                onClick={() => {
                  onSelect(card);
                  setQuery('');
                }}
              >
                <span className="text-muted-foreground">{card.card_number}</span>
                <span className="font-medium">{card.name}</span>
                {card.rarity && <span className="text-muted-foreground text-xs">({card.rarity})</span>}
              </button>
            ))
          ) : (
            <div className="text-muted-foreground p-3 text-sm">No cards found</div>
          )}
        </div>
      )}
    </div>
  );
}
