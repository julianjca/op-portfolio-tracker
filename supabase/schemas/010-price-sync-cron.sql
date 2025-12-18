create or replace function private.sync_card_prices()
returns void
language plpgsql
security definer
as $$
declare
  edge_function_url text;
  service_role_key text;
begin
  edge_function_url := current_setting('app.settings.edge_function_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  if edge_function_url is null or service_role_key is null then
    raise notice 'Edge function URL or service role key not configured';
    return;
  end if;

  perform net.http_post(
    url := edge_function_url || '/sync-cards',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := '{"sync_prices": true}'::jsonb,
    timeout_milliseconds := 300000
  );
end;
$$;

comment on function private.sync_card_prices() is 'Triggers card and price sync via edge function. Called daily by pg_cron.';

do $outer$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'daily-price-sync',
      '0 6 * * *',
      'select private.sync_card_prices()'
    );
  end if;
exception when others then
  raise notice 'pg_cron not available, skipping cron job setup';
end;
$outer$;
