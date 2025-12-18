create type public.sealed_product_type as enum (
  'booster_box',
  'booster_pack',
  'case',
  'starter_deck',
  'promo',
  'collection_box',
  'other'
);

create table public.sealed_products (
  id bigint generated always as identity primary key,
  name text not null,
  set_id bigint references public.sets(id),
  product_type public.sealed_product_type not null,
  description text,
  image_url text,
  release_date date,
  is_user_submitted boolean default false,
  submitted_by uuid references public.profiles(id),
  approved boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.sealed_products is 'Sealed One Piece TCG products including booster boxes, cases, starter decks, and promos.';

alter table public.sealed_products enable row level security;
