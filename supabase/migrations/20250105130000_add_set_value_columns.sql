alter table public.sets
add column raw_value numeric default 0,
add column psa10_value numeric default 0,
add column sealed_value numeric default 0,
add column cards_priced integer default 0,
add column value_updated_at timestamptz;

create or replace function public.calculate_set_value(p_set_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_raw_value numeric;
  v_psa10_value numeric;
  v_sealed_value numeric;
  v_cards_priced integer;
  v_total_cards integer;
begin
  select count(*) into v_total_cards
  from public.cards
  where set_id = p_set_id and approved = true;

  select
    coalesce(sum(cp.price), 0),
    count(distinct c.id)
  into v_raw_value, v_cards_priced
  from public.cards c
  left join public.current_prices cp on cp.card_id = c.id
    and cp.is_graded = false
    and cp.item_type = 'card'
  where c.set_id = p_set_id and c.approved = true;

  select coalesce(sum(cp.price), 0) into v_psa10_value
  from public.cards c
  left join public.current_prices cp on cp.card_id = c.id
    and cp.is_graded = true
    and cp.grading_company = 'PSA'
    and cp.grade = 10
    and cp.item_type = 'card'
  where c.set_id = p_set_id and c.approved = true;

  select coalesce(sum(cp.price), 0) into v_sealed_value
  from public.sealed_products sp
  left join public.current_prices cp on cp.sealed_product_id = sp.id
    and cp.is_graded = false
    and cp.item_type = 'sealed'
  where sp.set_id = p_set_id and sp.approved = true;

  update public.sets
  set
    raw_value = v_raw_value,
    psa10_value = v_psa10_value,
    sealed_value = v_sealed_value,
    cards_priced = v_cards_priced,
    value_updated_at = now()
  where id = p_set_id;
end;
$$;

create or replace function public.calculate_all_set_values()
returns table (
  set_id bigint,
  set_code text,
  raw_value numeric,
  psa10_value numeric,
  sealed_value numeric,
  cards_priced integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_set record;
begin
  for v_set in select id, code from public.sets loop
    perform public.calculate_set_value(v_set.id);
  end loop;

  return query
  select s.id, s.code, s.raw_value, s.psa10_value, s.sealed_value, s.cards_priced
  from public.sets s
  order by s.raw_value desc nulls last;
end;
$$;
