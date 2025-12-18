import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PopulationData {
  card_external_id: string;
  grading_company: 'PSA' | 'CGC' | 'BGS' | 'SGC' | 'ARS' | 'other';
  grade: number;
  population: number;
  population_higher?: number;
}

interface SyncRequest {
  action: 'import' | 'sync_gemrate' | 'sync_psa';
  data?: PopulationData[];
  set_code?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, data, set_code }: SyncRequest = await req.json();

    const logId = await createSyncLog(supabase, action);

    let result: { success: boolean; message: string; cards_updated: number };

    switch (action) {
      case 'import':
        result = await importPopulationData(supabase, data || []);
        break;
      case 'sync_gemrate':
        result = await syncFromGemRate(set_code);
        break;
      case 'sync_psa':
        result = await syncFromPSA(set_code);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    await completeSyncLog(supabase, logId, result.cards_updated, 'completed');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createSyncLog(supabase: ReturnType<typeof createClient>, syncType: string): Promise<number> {
  const { data, error } = await supabase
    .from('population_sync_log')
    .insert({ sync_type: syncType, status: 'running' })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

async function completeSyncLog(
  supabase: ReturnType<typeof createClient>,
  logId: number,
  cardsUpdated: number,
  status: string,
  errorMessage?: string
): Promise<void> {
  await supabase
    .from('population_sync_log')
    .update({
      cards_updated: cardsUpdated,
      status,
      error_message: errorMessage,
      completed_at: new Date().toISOString(),
    })
    .eq('id', logId);
}

async function importPopulationData(
  supabase: ReturnType<typeof createClient>,
  data: PopulationData[]
): Promise<{ success: boolean; message: string; cards_updated: number }> {
  if (!data.length) {
    return { success: true, message: 'No data to import', cards_updated: 0 };
  }

  let cardsUpdated = 0;

  for (const item of data) {
    const { data: card } = await supabase.from('cards').select('id').eq('external_id', item.card_external_id).single();

    if (!card) {
      console.warn(`Card not found: ${item.card_external_id}`);
      continue;
    }

    const { error } = await supabase.from('grading_population').upsert(
      {
        card_id: card.id,
        grading_company: item.grading_company,
        grade: item.grade,
        population: item.population,
        population_higher: item.population_higher || 0,
        recorded_at: new Date().toISOString(),
        source: 'manual_import',
      },
      { onConflict: 'card_id,grading_company,grade' }
    );

    if (!error) cardsUpdated++;
  }

  return {
    success: true,
    message: `Imported population data for ${cardsUpdated} cards`,
    cards_updated: cardsUpdated,
  };
}

// TODO: Implement with headless browser service (Browserless/Puppeteer Cloud)
async function syncFromGemRate(
  setCode?: string
): Promise<{ success: boolean; message: string; cards_updated: number }> {
  console.log(`GemRate sync requested for set: ${setCode || 'all'}`);

  return {
    success: false,
    message: 'GemRate sync requires headless browser. Use manual import or API partnership.',
    cards_updated: 0,
  };
}

// TODO: Implement via PSA API partnership or third-party provider
async function syncFromPSA(setCode?: string): Promise<{ success: boolean; message: string; cards_updated: number }> {
  console.log(`PSA sync requested for set: ${setCode || 'all'}`);

  return {
    success: false,
    message: 'PSA blocks direct scraping. Use API partnership or third-party provider.',
    cards_updated: 0,
  };
}
