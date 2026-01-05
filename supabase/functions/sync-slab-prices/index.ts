import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  card_ids?: number[];
  set_code?: string;
  limit?: number;
}

interface SyncResult {
  success: boolean;
  message: string;
  cards_processed: number;
  prices_found: number;
  prices_saved: number;
  errors: string[];
}

interface PriceChartingProduct {
  id: string;
  'product-name': string;
  'console-name': string;
  'loose-price'?: number;
  'graded-price'?: number;
  'psa-10-price'?: number;
  'bgs-10-price'?: number;
}

interface CardInfo {
  id: number;
  name: string;
  card_number: string;
  set_code: string;
}

const PRICECHARTING_API = 'https://www.pricecharting.com/api';

async function searchPriceCharting(
  apiKey: string,
  cardName: string,
  cardNumber: string
): Promise<PriceChartingProduct | null> {
  const query = `One Piece ${cardNumber} ${cardName}`;
  const url = `${PRICECHARTING_API}/products?t=${apiKey}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`PriceCharting API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.status === 'error') {
      console.error(`PriceCharting error: ${data['error-message']}`);
      return null;
    }

    const products = data.products || [];
    const match = products.find((p: PriceChartingProduct) => p['console-name']?.toLowerCase().includes('one piece'));

    return match || null;
  } catch (error) {
    console.error(`PriceCharting fetch error: ${error}`);
    return null;
  }
}

async function getProductPrices(
  apiKey: string,
  productId: string
): Promise<{ psa10?: number; bgs10?: number; graded?: number } | null> {
  const url = `${PRICECHARTING_API}/product?t=${apiKey}&id=${productId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status === 'error') return null;

    return {
      psa10: data['psa-10-price'] ? parseFloat(data['psa-10-price']) / 100 : undefined,
      bgs10: data['bgs-10-price'] ? parseFloat(data['bgs-10-price']) / 100 : undefined,
      graded: data['graded-price'] ? parseFloat(data['graded-price']) / 100 : undefined,
    };
  } catch {
    return null;
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const priceChartingKey = Deno.env.get('PRICECHARTING_API_KEY');

    if (!priceChartingKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PRICECHARTING_API_KEY not configured. Get an API key from pricecharting.com/api-documentation',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const { card_ids, set_code, limit = 20 }: SyncRequest = body;

    let query = supabase
      .from('cards')
      .select(
        `
        id,
        name,
        card_number,
        sets!inner(code)
      `
      )
      .eq('approved', true)
      .in('rarity', ['L', 'SEC', 'SP', 'SR']);

    if (card_ids?.length) {
      query = query.in('id', card_ids);
    } else if (set_code) {
      query = query.eq('sets.code', set_code);
    }

    query = query.limit(limit);

    const { data: cardsData, error: cardsError } = await query;

    if (cardsError) throw cardsError;
    if (!cardsData?.length) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No cards found to process',
          cards_processed: 0,
          prices_found: 0,
          prices_saved: 0,
          errors: [],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const cards: CardInfo[] = cardsData.map((c: Record<string, unknown>) => ({
      id: c.id as number,
      name: c.name as string,
      card_number: c.card_number as string,
      set_code: (c.sets as { code: string }).code,
    }));

    console.log(`Processing ${cards.length} cards for slab prices via PriceCharting...`);

    let totalPricesFound = 0;
    let totalPricesSaved = 0;
    const errors: string[] = [];

    for (const card of cards) {
      try {
        console.log(`Searching PriceCharting for ${card.card_number} ${card.name}...`);

        const product = await searchPriceCharting(priceChartingKey, card.name, card.card_number);

        if (!product) {
          console.log(`No match found for ${card.card_number}`);
          await delay(500);
          continue;
        }

        const prices = await getProductPrices(priceChartingKey, product.id);

        if (!prices) {
          console.log(`No prices found for ${card.card_number}`);
          await delay(500);
          continue;
        }

        if (prices.psa10 && prices.psa10 > 0) {
          totalPricesFound++;
          const { error: insertError } = await supabase.from('price_history').insert({
            item_type: 'card',
            card_id: card.id,
            price: prices.psa10,
            source: 'tcgplayer',
            is_graded: true,
            grading_company: 'PSA',
            grade: 10,
          });

          if (insertError) {
            errors.push(`Error saving PSA 10 price for ${card.card_number}: ${insertError.message}`);
          } else {
            totalPricesSaved++;
            console.log(`Saved PSA 10: $${prices.psa10} for ${card.card_number}`);
          }
        }

        if (prices.bgs10 && prices.bgs10 > 0) {
          totalPricesFound++;
          const { error: insertError } = await supabase.from('price_history').insert({
            item_type: 'card',
            card_id: card.id,
            price: prices.bgs10,
            source: 'tcgplayer',
            is_graded: true,
            grading_company: 'BGS',
            grade: 10,
          });

          if (insertError) {
            errors.push(`Error saving BGS 10 price for ${card.card_number}: ${insertError.message}`);
          } else {
            totalPricesSaved++;
            console.log(`Saved BGS 10: $${prices.bgs10} for ${card.card_number}`);
          }
        }

        await delay(500);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        errors.push(`Error processing ${card.card_number}: ${error}`);
      }
    }

    const result: SyncResult = {
      success: errors.length === 0,
      message: `Processed ${cards.length} cards, found ${totalPricesFound} graded prices, saved ${totalPricesSaved}`,
      cards_processed: cards.length,
      prices_found: totalPricesFound,
      prices_saved: totalPricesSaved,
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
