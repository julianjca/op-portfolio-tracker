create type public.price_source as enum ('manual', 'ebay', 'tcgplayer', 'community');

create table public.price_history (
  id bigint generated always as identity primary key,
  item_type public.portfolio_item_type not null,
  card_id bigint references public.cards(id),
  sealed_product_id bigint references public.sealed_products(id),
  price numeric(10,2) not null,
  source public.price_source not null default 'manual',
  condition public.card_condition,
  is_graded boolean default false,
  grading_company public.grading_company,
  grade numeric(3,1),
  recorded_at timestamptz default now(),
  recorded_by uuid references public.profiles(id),
  constraint valid_price_item check (
    (item_type = 'card' and card_id is not null and sealed_product_id is null) or
    (item_type = 'sealed' and sealed_product_id is not null and card_id is null)
  )
);

comment on table public.price_history is 'Historical price data for cards and sealed products. Used for portfolio valuation and trend analysis.';

create index idx_price_history_card on public.price_history(card_id, recorded_at desc);
create index idx_price_history_sealed on public.price_history(sealed_product_id, recorded_at desc);
create index idx_price_history_date on public.price_history(recorded_at desc);

create view public.current_prices as
select distinct on (item_type, card_id, sealed_product_id, condition, is_graded, grading_company, grade)
  id,
  item_type,
  card_id,
  sealed_product_id,
  price,
  source,
  condition,
  is_graded,
  grading_company,
  grade,
  recorded_at
from public.price_history
order by item_type, card_id, sealed_product_id, condition, is_graded, grading_company, grade, recorded_at desc;

alter table public.price_history enable row level security;
