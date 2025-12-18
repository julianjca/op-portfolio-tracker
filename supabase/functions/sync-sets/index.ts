import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPTCG_API_BASE = 'https://optcgapi.com/api';

interface SetMetadata {
  release_date: string | null;
  image_url: string | null;
}

const SET_METADATA: Record<string, SetMetadata> = {
  'OP-01': {
    release_date: '2022-12-02',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op01/img_item.png',
  },
  'OP-02': {
    release_date: '2023-03-10',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op02/img_item.png',
  },
  'OP-03': {
    release_date: '2023-06-30',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op03/img_item.png',
  },
  'OP-04': {
    release_date: '2023-09-22',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op04/img_item.png',
  },
  'OP-05': {
    release_date: '2023-12-08',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op05/img_item.png',
  },
  'OP-06': {
    release_date: '2024-03-08',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op06/img_item.png',
  },
  'OP-07': {
    release_date: '2024-06-28',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op07/img_item.png',
  },
  'OP-08': {
    release_date: '2024-09-27',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op08/img_item.png',
  },
  'OP-09': {
    release_date: '2024-12-06',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op09/img_item.png',
  },
  'OP-10': {
    release_date: '2025-03-14',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/op10/img_item.png',
  },
  'OP-11': {
    release_date: '2025-06-27',
    image_url: null,
  },
  'OP-12': {
    release_date: '2025-09-26',
    image_url: null,
  },
  'OP-13': {
    release_date: null,
    image_url: null,
  },
  'EB-01': {
    release_date: '2024-10-25',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/eb01/img_item.png',
  },
  'EB-02': {
    release_date: '2025-01-24',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/eb02/img_item.png',
  },
  'PRB-01': {
    release_date: '2024-05-31',
    image_url: 'https://en.onepiece-cardgame.com/images/products/booster/prb01/img_item.png',
  },
  'PRB-02': {
    release_date: '2025-10-31',
    image_url: null,
  },
  'ST-01': {
    release_date: '2022-12-02',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st01/img_item.png',
  },
  'ST-02': {
    release_date: '2022-12-02',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st02/img_item.png',
  },
  'ST-03': {
    release_date: '2022-12-02',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st03/img_item.png',
  },
  'ST-04': {
    release_date: '2022-12-02',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st04/img_item.png',
  },
  'ST-05': {
    release_date: '2023-03-10',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st05/img_item.png',
  },
  'ST-06': {
    release_date: '2023-03-10',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st06/img_item.png',
  },
  'ST-07': {
    release_date: '2023-06-30',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st07/img_item.png',
  },
  'ST-08': {
    release_date: '2023-06-30',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st08/img_item.png',
  },
  'ST-09': {
    release_date: '2023-09-22',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st09/img_item.png',
  },
  'ST-10': {
    release_date: '2023-09-22',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st10/img_item.png',
  },
  'ST-11': {
    release_date: '2024-01-26',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st11/img_item.png',
  },
  'ST-12': {
    release_date: '2024-03-08',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st12/img_item.png',
  },
  'ST-13': {
    release_date: '2024-03-08',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st13/img_item.png',
  },
  'ST-14': {
    release_date: '2024-09-27',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st14/img_item.png',
  },
  'ST-15': {
    release_date: '2024-09-27',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st15/img_item.png',
  },
  'ST-16': {
    release_date: '2024-09-27',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st16/img_item.png',
  },
  'ST-17': {
    release_date: '2024-12-06',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st17/img_item.png',
  },
  'ST-18': {
    release_date: '2025-03-14',
    image_url: 'https://en.onepiece-cardgame.com/images/products/starterdeck/st18/img_item.png',
  },
  'ST-19': {
    release_date: '2025-03-14',
    image_url: null,
  },
  'ST-20': {
    release_date: '2025-06-27',
    image_url: null,
  },
};

interface OPTCGSet {
  set_name: string;
  set_id: string;
}

interface OPTCGStarterDeck {
  deck_name: string;
  deck_id: string;
}

interface SyncRequest {
  include_starter_decks?: boolean;
}

interface SyncResult {
  success: boolean;
  message: string;
  sets_synced: number;
  sets_created: number;
  sets_updated: number;
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
    const { include_starter_decks = true }: SyncRequest = body;

    console.log('Starting sets sync from OPTCG API...');

    const setsResponse = await fetch(`${OPTCG_API_BASE}/allSets/`, {
      headers: { Accept: 'application/json' },
    });

    if (!setsResponse.ok) {
      throw new Error(`OPTCG API error: ${setsResponse.status} ${setsResponse.statusText}`);
    }

    const sets: OPTCGSet[] = await setsResponse.json();
    console.log(`Fetched ${sets.length} sets from OPTCG API`);

    let starterDecks: OPTCGStarterDeck[] = [];
    if (include_starter_decks) {
      const decksResponse = await fetch(`${OPTCG_API_BASE}/allDecks/`, {
        headers: { Accept: 'application/json' },
      });

      if (decksResponse.ok) {
        starterDecks = await decksResponse.json();
        console.log(`Fetched ${starterDecks.length} starter decks from OPTCG API`);
      }
    }

    const allSets = [
      ...sets.map((s) => ({ code: s.set_id, name: s.set_name })),
      ...starterDecks.map((d) => ({ code: d.deck_id, name: d.deck_name })),
    ];

    const { data: existingSets } = await supabase.from('sets').select('code');
    const existingCodes = new Set(existingSets?.map((s) => s.code) || []);

    let setsCreated = 0;
    let setsUpdated = 0;

    for (const set of allSets) {
      const metadata = SET_METADATA[set.code] || { release_date: null, image_url: null };

      const { error } = await supabase.from('sets').upsert(
        {
          code: set.code,
          name: set.name,
          release_date: metadata.release_date,
          image_url: metadata.image_url,
        },
        { onConflict: 'code' }
      );

      if (error) {
        console.error(`Error upserting set ${set.code}:`, error.message);
        continue;
      }

      if (existingCodes.has(set.code)) {
        setsUpdated++;
      } else {
        setsCreated++;
      }
    }

    const result: SyncResult = {
      success: true,
      message: `Synced ${allSets.length} sets from OPTCG API`,
      sets_synced: allSets.length,
      sets_created: setsCreated,
      sets_updated: setsUpdated,
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
