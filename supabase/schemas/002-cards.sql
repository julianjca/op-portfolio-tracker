create table public.sets (
  id bigint generated always as identity primary key,
  code text unique not null,
  name text not null,
  release_date date,
  total_cards integer,
  image_url text,
  created_at timestamptz default now(),
  -- Cached set value columns (updated daily via cron)
  raw_value numeric default 0,
  psa10_value numeric default 0,
  sealed_value numeric default 0,
  cards_priced integer default 0,
  value_updated_at timestamptz
);

comment on table public.sets is 'One Piece TCG card sets (OP-01, OP-02, etc.) with metadata like release date and card counts.';

create table public.cards (
  id bigint generated always as identity primary key,
  external_id text unique,
  set_id bigint references public.sets(id),
  card_number text not null,
  name text not null,
  rarity text,
  card_type text,
  color text,
  cost integer,
  power integer,
  counter integer,
  attribute text,
  effect text,
  image_url text,
  is_user_submitted boolean default false,
  submitted_by uuid references public.profiles(id),
  approved boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(set_id, card_number)
);

comment on table public.cards is 'One Piece TCG cards synced from OPTCG API. Contains card stats, effects, and images.';

create index idx_cards_set_id on public.cards(set_id);
create index idx_cards_name on public.cards using gin(to_tsvector('english', name));
create index idx_cards_rarity on public.cards(rarity);

alter table public.sets enable row level security;
alter table public.cards enable row level security;
