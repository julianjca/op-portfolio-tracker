create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_card_updated
  before update on public.cards
  for each row execute function public.handle_updated_at();

create trigger on_sealed_product_updated
  before update on public.sealed_products
  for each row execute function public.handle_updated_at();

create trigger on_portfolio_item_updated
  before update on public.portfolio_items
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.get_portfolio_value(p_user_id uuid)
returns table (
  total_value numeric,
  total_cost numeric,
  total_gain_loss numeric,
  item_count bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select
    coalesce(sum(
      case
        when pi.is_graded then
          (select cp.price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select cp.price from public.current_prices cp
           where (cp.card_id = pi.card_id or cp.sealed_product_id = pi.sealed_product_id)
           and cp.condition = pi.condition
           limit 1)
      end * pi.quantity
    ), 0) as total_value,
    coalesce(sum(pi.purchase_price * pi.quantity), 0) as total_cost,
    coalesce(sum(
      case
        when pi.is_graded then
          (select cp.price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select cp.price from public.current_prices cp
           where (cp.card_id = pi.card_id or cp.sealed_product_id = pi.sealed_product_id)
           and cp.condition = pi.condition
           limit 1)
      end * pi.quantity
    ), 0) - coalesce(sum(pi.purchase_price * pi.quantity), 0) as total_gain_loss,
    count(*) as item_count
  from public.portfolio_items pi
  where pi.user_id = p_user_id
  and pi.is_wishlist = false;
end;
$$;

create or replace function public.get_set_completion(p_user_id uuid, p_set_id bigint)
returns table (
  total_cards bigint,
  owned_cards bigint,
  completion_percentage numeric
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select
    (select count(*) from public.cards where public.cards.set_id = p_set_id) as total_cards,
    count(distinct pi.card_id) as owned_cards,
    round(
      count(distinct pi.card_id)::numeric /
      nullif((select count(*) from public.cards where public.cards.set_id = p_set_id), 0) * 100,
      2
    ) as completion_percentage
  from public.portfolio_items pi
  join public.cards c on c.id = pi.card_id
  where pi.user_id = p_user_id
  and c.set_id = p_set_id
  and pi.is_wishlist = false;
end;
$$;

create or replace function public.search_cards(search_query text)
returns setof public.cards
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select *
  from public.cards
  where
    public.cards.approved = true
    and (
      public.cards.name ilike '%' || search_query || '%'
      or public.cards.card_number ilike '%' || search_query || '%'
      or to_tsvector('english', public.cards.name) @@ plainto_tsquery('english', search_query)
    )
  order by public.cards.name
  limit 50;
end;
$$;

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
