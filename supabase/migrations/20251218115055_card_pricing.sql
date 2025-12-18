create schema if not exists "private";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.sync_card_prices()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;


