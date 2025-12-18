create table public.grading_population (
  id bigint generated always as identity primary key,
  card_id bigint references public.cards(id) on delete cascade,
  grading_company public.grading_company not null,
  grade numeric(3,1) not null,
  population integer not null default 0,
  population_higher integer default 0,
  recorded_at timestamptz default now(),
  source text default 'gemrate',
  unique(card_id, grading_company, grade)
);

create index idx_population_card_id on public.grading_population(card_id);
create index idx_population_company on public.grading_population(grading_company);
create index idx_population_grade on public.grading_population(grade);

alter table public.grading_population enable row level security;

create table public.population_sync_log (
  id bigint generated always as identity primary key,
  sync_type text not null,
  cards_updated integer default 0,
  status text not null,
  error_message text,
  started_at timestamptz default now(),
  completed_at timestamptz
);

create policy "Population data is viewable by everyone"
  on public.grading_population for select
  to authenticated, anon
  using (true);

create policy "Only service role can modify population"
  on public.grading_population for all
  to service_role
  using (true);

create policy "Sync logs viewable by authenticated"
  on public.population_sync_log for select
  to authenticated
  using (true);

create or replace function public.get_card_population(p_card_id bigint)
returns table (
  grading_company public.grading_company,
  grade numeric,
  population integer,
  population_higher integer,
  recorded_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select
    gp.grading_company,
    gp.grade,
    gp.population,
    gp.population_higher,
    gp.recorded_at
  from public.grading_population gp
  where gp.card_id = p_card_id
  order by gp.grading_company, gp.grade desc;
end;
$$;

create or replace function public.get_total_population(p_card_id bigint)
returns table (
  grading_company public.grading_company,
  total_graded bigint,
  gem_mint_count bigint,
  mint_count bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select
    gp.grading_company,
    sum(gp.population)::bigint as total_graded,
    sum(case when gp.grade = 10 then gp.population else 0 end)::bigint as gem_mint_count,
    sum(case when gp.grade >= 9 then gp.population else 0 end)::bigint as mint_count
  from public.grading_population gp
  where gp.card_id = p_card_id
  group by gp.grading_company
  order by gp.grading_company;
end;
$$;

-- pg_cron job for daily population sync (requires pg_cron extension enabled in Supabase dashboard)
-- Run: select cron.schedule('sync-population-daily', '0 6 * * *', $$
--   select net.http_post(
--     url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-population',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
--       'Content-Type', 'application/json'
--     ),
--     body := '{"action": "sync_gemrate"}'::jsonb
--   );
-- $$);
