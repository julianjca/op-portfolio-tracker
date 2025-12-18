create type public.portfolio_item_type as enum ('card', 'sealed');

create table public.portfolio_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type public.portfolio_item_type not null,
  card_id bigint references public.cards(id),
  sealed_product_id bigint references public.sealed_products(id),
  quantity integer not null default 1,
  purchase_price numeric(10,2),
  purchase_date date,
  condition public.card_condition,
  is_graded boolean default false,
  grading_company public.grading_company,
  grade numeric(3,1),
  cert_number text,
  is_wishlist boolean default false,
  is_for_sale boolean default false,
  asking_price numeric(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_item_reference check (
    (item_type = 'card' and card_id is not null and sealed_product_id is null) or
    (item_type = 'sealed' and sealed_product_id is not null and card_id is null)
  ),
  constraint grading_only_for_cards check (
    is_graded = false or item_type = 'card'
  )
);

comment on table public.portfolio_items is 'User portfolio items tracking cards and sealed products with purchase info, condition, grading, and sale flags.';

create index idx_portfolio_user_id on public.portfolio_items(user_id);
create index idx_portfolio_card_id on public.portfolio_items(card_id);
create index idx_portfolio_sealed_id on public.portfolio_items(sealed_product_id);
create index idx_portfolio_wishlist on public.portfolio_items(user_id, is_wishlist) where is_wishlist = true;
create index idx_portfolio_for_sale on public.portfolio_items(is_for_sale) where is_for_sale = true;

alter table public.portfolio_items enable row level security;
