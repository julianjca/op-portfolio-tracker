import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPTCG_API_BASE = 'https://optcgapi.com/api';

interface OPTCGCard {
  card_name: string;
  set_id: string;
  card_set_id: string;
  card_image_id: string;
  card_image: string;
  card_text: string;
  rarity: string;
  card_type: string;
  card_color: string;
  card_cost: string;
  card_power: string;
  counter_amount: number;
  attribute: string;
  market_price: number;
}

interface SyncRequest {
  set_code?: string;
  sync_prices?: boolean;
}

interface SyncResult {
  success: boolean;
  message: string;
  sets_processed: number;
  cards_synced: number;
  cards_created: number;
  cards_updated: number;
  prices_synced: number;
  errors: string[];
}

function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === 'NULL' || value === '') {
    return null;
  }
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(num) ? null : num;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { set_code, sync_prices = true }: SyncRequest = body;

    const { data: setsToSync, error: setsError } = set_code
      ? await supabase.from('sets').select('id, code').eq('code', set_code)
      : await supabase.from('sets').select('id, code');

    if (setsError) throw setsError;
    if (!setsToSync?.length) {
      return new Response(JSON.stringify({ success: false, message: 'No sets found to sync' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Syncing cards for ${setsToSync.length} sets...`);

    let totalCardsCreated = 0;
    let totalCardsUpdated = 0;
    let totalCardsSynced = 0;
    let totalPricesSynced = 0;
    const errors: string[] = [];

    for (const set of setsToSync) {
      try {
        console.log(`Fetching cards for set ${set.code}...`);

        const response = await fetch(`${OPTCG_API_BASE}/sets/${set.code}/`, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          errors.push(`Failed to fetch ${set.code}: ${response.status}`);
          continue;
        }

        const cards: OPTCGCard[] = await response.json();
        console.log(`Fetched ${cards.length} cards for ${set.code}`);

        const { data: existingCards } = await supabase.from('cards').select('external_id').eq('set_id', set.id);

        const existingIds = new Set(existingCards?.map((c) => c.external_id) || []);

        for (const card of cards) {
          const cardData = {
            external_id: card.card_image_id,
            set_id: set.id,
            card_number: card.card_image_id,
            name: card.card_name,
            rarity: card.rarity || null,
            card_type: card.card_type || null,
            color: card.card_color || null,
            cost: parseNumber(card.card_cost),
            power: parseNumber(card.card_power),
            counter: card.counter_amount || null,
            attribute: card.attribute || null,
            effect: card.card_text || null,
            image_url: card.card_image || null,
            updated_at: new Date().toISOString(),
          };

          const { data: upsertedCard, error } = await supabase
            .from('cards')
            .upsert(cardData, { onConflict: 'external_id' })
            .select('id')
            .single();

          if (error || !upsertedCard) {
            errors.push(`Error upserting card ${card.card_set_id}: ${error?.message ?? 'No data returned'}`);
            continue;
          }

          totalCardsSynced++;
          if (existingIds.has(card.card_image_id)) {
            totalCardsUpdated++;
          } else {
            totalCardsCreated++;
          }

          if (sync_prices && card.market_price && card.market_price > 0) {
            const { error: priceError } = await supabase.from('price_history').insert({
              item_type: 'card',
              card_id: upsertedCard.id,
              price: card.market_price,
              source: 'tcgplayer',
              condition: 'near_mint',
              is_graded: false,
            });

            if (!priceError) {
              totalPricesSynced++;
            }
          }
        }

        await supabase.from('sets').update({ total_cards: cards.length }).eq('id', set.id);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        errors.push(`Error processing set ${set.code}: ${error}`);
      }
    }

    const result: SyncResult = {
      success: errors.length === 0,
      message: `Synced ${totalCardsSynced} cards and ${totalPricesSynced} prices across ${setsToSync.length} sets`,
      sets_processed: setsToSync.length,
      cards_synced: totalCardsSynced,
      cards_created: totalCardsCreated,
      cards_updated: totalCardsUpdated,
      prices_synced: totalPricesSynced,
      errors: errors.slice(0, 10),
    };

    console.log('Sync completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
