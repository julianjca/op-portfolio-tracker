import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetValueResult {
  set_id: number;
  set_code: string;
  raw_value: number;
  psa10_value: number;
  sealed_value: number;
  cards_priced: number;
}

interface CalculateResult {
  success: boolean;
  message: string;
  sets_calculated: number;
  results: SetValueResult[];
  errors: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting set value calculations...');

    const { data, error } = await supabase.rpc('calculate_all_set_values');

    if (error) {
      throw new Error(`Failed to calculate set values: ${error.message}`);
    }

    const results = (data as SetValueResult[]) ?? [];

    const result: CalculateResult = {
      success: true,
      message: `Calculated values for ${results.length} sets`,
      sets_calculated: results.length,
      results: results,
      errors: [],
    };

    console.log('Calculation completed:', {
      sets_calculated: results.length,
      total_raw_value: results.reduce((sum, r) => sum + (r.raw_value || 0), 0),
      total_psa10_value: results.reduce((sum, r) => sum + (r.psa10_value || 0), 0),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Calculation error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
