# One Piece TCG Portfolio Tracker - PRD & Implementation Plan

## Product Requirements Document (PRD)

### Vision

A web application for One Piece TCG collectors to track their card and sealed product portfolios, monitor market values, analyze set performance, and connect with other collectors.

### Target Users

- **Collectors**: Track what they own, monitor portfolio value over time
- **Sellers**: Flag items for sale, showcase inventory publicly
- **Buyers**: Find undervalued sets, discover what collectors are selling
- **Casual browsers**: Explore card data, set information, price trends

### Core Value Propositions

1. **Portfolio Management**: Track raw cards, graded slabs, and sealed products in one place
2. **Price Intelligence**: Manual price entry now, eBay integration later for market prices
3. **Set Analytics**: Calculate total set values, identify undervalued sets
4. **Social Discovery**: Public profiles, wishlist/for-sale visibility

---

## Feature Requirements

### Authentication & Users

- [ ] Magic link + social login (Google, Discord) via Supabase Auth
- [ ] User profiles with username, avatar, bio
- [ ] Privacy toggle (public/private portfolio)
- [ ] Profile settings management

### Portfolio Management

- [ ] Add cards to portfolio (search from OPTCG API database)
- [ ] Add sealed products to portfolio (from curated list)
- [ ] Track quantity, purchase price, purchase date
- [ ] Condition tracking for raw cards (NM, LP, MP, HP, DMG)
- [ ] Full grading info for slabs:
  - Grading company (PSA, CGC, BGS, ARS, other)
  - Grade (10, 9.5, 9, 8.5, etc.)
  - Certification number (user-entered)
- [ ] Wishlist flag (cards/products user wants)
- [ ] For-sale flag (cards/products user is selling)
- [ ] Notes field for personal tracking

### Card & Product Database

- [ ] Sync cards from OPTCG API (https://optcgapi.com)
- [ ] User submission for missing cards (admin approval queue)
- [ ] Curated sealed products list (booster boxes, cases, starter decks, promos)
- [ ] Set metadata (release date, total cards, set code)

### Public Browsing (No Auth Required)

- [ ] Browse all sets with card counts and market data
- [ ] View set detail with all cards
- [ ] View card detail with image, stats, price history
- [ ] Browse sealed products catalog
- [ ] Search cards by name, set, rarity, color
- [ ] View public user profiles and their collections

### Analytics & Insights

- [ ] Portfolio total value (sum of all items × current price)
- [ ] Portfolio value over time chart
- [ ] Gain/loss calculation (current value vs purchase price)
- [ ] Set completion percentage (cards owned / total cards in set)
- [ ] Set market analysis:
  - Total set value (sum of all card prices)
  - Average card price per set
  - Set price trend over time
- [ ] "Undervalued" set detection (price vs historical average)
- [ ] Price trends per card/product

### Social Features (Phased)

- [ ] Phase 1: Public profiles
- [ ] Phase 2: Wishlist/for-sale visibility, filter by selling users
- [ ] Phase 3: Follow collectors, activity feed
- [ ] Phase 4: Comments/discussions on cards

---

## Technical Architecture

### Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Framework       | Next.js 15 (App Router, Turbopack)                   |
| Styling         | Tailwind CSS v4 + shadcn/ui                          |
| Data Fetching   | TanStack Query (React Query) for ALL data operations |
| Auth            | Supabase Auth                                        |
| Database        | Supabase (Postgres)                                  |
| Security        | Supabase RLS (Row Level Security)                    |
| Background Jobs | Supabase Edge Functions + pg_cron                    |
| Charts          | Recharts                                             |
| Forms           | react-hook-form + zod                                |

### Data Fetching Pattern

All data fetching uses React Query. No direct Supabase calls from components.

```
src/lib/api/          → API functions (thin wrappers around Supabase)
src/hooks/queries/    → React Query hooks (useCards, usePortfolio, etc.)
src/hooks/mutations/  → React Query mutations (useAddToPortfolio, etc.)
```

Example pattern:

```typescript
// src/lib/api/cards.ts
export async function getCards(filters: CardFilters) {
  const { data, error } = await supabase.from('cards').select('*').match(filters);
  if (error) throw error;
  return data;
}

// src/hooks/queries/useCards.ts
export function useCards(filters: CardFilters) {
  return useQuery({
    queryKey: ['cards', filters],
    queryFn: () => getCards(filters),
  });
}
```

---

## Database Schema

All schemas go in `supabase/schemas/` using declarative schema approach.

### File: `supabase/schemas/001-auth-users.sql`

```sql
-- Extends Supabase auth.users with public profile
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.profiles is 'Public user profiles extending Supabase auth';

-- Enable RLS
alter table public.profiles enable row level security;
```

### File: `supabase/schemas/002-cards.sql`

```sql
-- Card sets (OP-01, OP-02, etc.)
create table public.sets (
  id bigint generated always as identity primary key,
  code text unique not null,
  name text not null,
  release_date date,
  total_cards integer,
  image_url text,
  created_at timestamptz default now()
);

comment on table public.sets is 'One Piece TCG card sets';

-- Individual cards
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

comment on table public.cards is 'One Piece TCG cards synced from OPTCG API';

-- Indexes for common queries
create index idx_cards_set_id on public.cards(set_id);
create index idx_cards_name on public.cards using gin(to_tsvector('english', name));
create index idx_cards_rarity on public.cards(rarity);

-- Enable RLS
alter table public.sets enable row level security;
alter table public.cards enable row level security;
```

### File: `supabase/schemas/003-sealed-products.sql`

```sql
-- Sealed product types
create type public.sealed_product_type as enum (
  'booster_box',
  'booster_pack',
  'case',
  'starter_deck',
  'promo',
  'collection_box',
  'other'
);

-- Sealed products
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

comment on table public.sealed_products is 'Sealed One Piece TCG products (boxes, cases, etc.)';

-- Enable RLS
alter table public.sealed_products enable row level security;
```

### File: `supabase/schemas/004-grading.sql`

```sql
-- Grading companies
create type public.grading_company as enum (
  'PSA',
  'CGC',
  'BGS',
  'ARS',
  'other'
);

-- Card conditions for raw cards
create type public.card_condition as enum (
  'mint',
  'near_mint',
  'lightly_played',
  'moderately_played',
  'heavily_played',
  'damaged'
);
```

### File: `supabase/schemas/005-portfolio.sql`

```sql
-- Portfolio item types
create type public.portfolio_item_type as enum ('card', 'sealed');

-- Main portfolio items table
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
  -- Grading info (for slabs)
  is_graded boolean default false,
  grading_company public.grading_company,
  grade numeric(3,1),
  cert_number text,
  -- Flags
  is_wishlist boolean default false,
  is_for_sale boolean default false,
  asking_price numeric(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Ensure either card_id or sealed_product_id is set
  constraint valid_item_reference check (
    (item_type = 'card' and card_id is not null and sealed_product_id is null) or
    (item_type = 'sealed' and sealed_product_id is not null and card_id is null)
  ),
  -- Grading only for cards
  constraint grading_only_for_cards check (
    is_graded = false or item_type = 'card'
  )
);

comment on table public.portfolio_items is 'User portfolio items (cards and sealed products)';

-- Indexes
create index idx_portfolio_user_id on public.portfolio_items(user_id);
create index idx_portfolio_card_id on public.portfolio_items(card_id);
create index idx_portfolio_sealed_id on public.portfolio_items(sealed_product_id);
create index idx_portfolio_wishlist on public.portfolio_items(user_id, is_wishlist) where is_wishlist = true;
create index idx_portfolio_for_sale on public.portfolio_items(is_for_sale) where is_for_sale = true;

-- Enable RLS
alter table public.portfolio_items enable row level security;
```

### File: `supabase/schemas/006-prices.sql`

```sql
-- Price source
create type public.price_source as enum ('manual', 'ebay', 'tcgplayer', 'community');

-- Price history for analytics
create table public.price_history (
  id bigint generated always as identity primary key,
  item_type public.portfolio_item_type not null,
  card_id bigint references public.cards(id),
  sealed_product_id bigint references public.sealed_products(id),
  price numeric(10,2) not null,
  source public.price_source not null default 'manual',
  condition public.card_condition,
  is_graded boolean default false,
  grade numeric(3,1),
  recorded_at timestamptz default now(),
  recorded_by uuid references public.profiles(id),
  -- Ensure either card_id or sealed_product_id is set
  constraint valid_price_item check (
    (item_type = 'card' and card_id is not null and sealed_product_id is null) or
    (item_type = 'sealed' and sealed_product_id is not null and card_id is null)
  )
);

comment on table public.price_history is 'Historical price data for cards and sealed products';

-- Indexes for time-series queries
create index idx_price_history_card on public.price_history(card_id, recorded_at desc);
create index idx_price_history_sealed on public.price_history(sealed_product_id, recorded_at desc);
create index idx_price_history_date on public.price_history(recorded_at desc);

-- Current prices view (latest price per item)
create view public.current_prices as
select distinct on (item_type, card_id, sealed_product_id, condition, is_graded, grade)
  id,
  item_type,
  card_id,
  sealed_product_id,
  price,
  source,
  condition,
  is_graded,
  grade,
  recorded_at
from public.price_history
order by item_type, card_id, sealed_product_id, condition, is_graded, grade, recorded_at desc;

-- Enable RLS
alter table public.price_history enable row level security;
```

### File: `supabase/schemas/007-rls-policies.sql`

```sql
-- Profiles: public read, own write
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  to authenticated, anon
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Sets & Cards: public read
create policy "Sets are viewable by everyone"
  on public.sets for select
  to authenticated, anon
  using (true);

create policy "Cards are viewable by everyone"
  on public.cards for select
  to authenticated, anon
  using (true);

-- Sealed products: public read
create policy "Sealed products are viewable by everyone"
  on public.sealed_products for select
  to authenticated, anon
  using (true);

-- Portfolio items: own read/write, public read if profile is public
create policy "Users can manage own portfolio"
  on public.portfolio_items for all
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Public portfolios are viewable"
  on public.portfolio_items for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = portfolio_items.user_id
      and profiles.is_public = true
    )
  );

-- Price history: public read, authenticated write
create policy "Price history is viewable by everyone"
  on public.price_history for select
  to authenticated, anon
  using (true);

create policy "Authenticated users can add prices"
  on public.price_history for insert
  to authenticated
  with check (true);
```

### File: `supabase/schemas/008-functions.sql`

```sql
-- Function to get portfolio value for a user
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
          (select price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select price from public.current_prices cp
           where (cp.card_id = pi.card_id or cp.sealed_product_id = pi.sealed_product_id)
           and cp.condition = pi.condition
           limit 1)
      end * pi.quantity
    ), 0) as total_value,
    coalesce(sum(pi.purchase_price * pi.quantity), 0) as total_cost,
    coalesce(sum(
      case
        when pi.is_graded then
          (select price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select price from public.current_prices cp
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

-- Function to get set completion for a user
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
    (select count(*) from public.cards where set_id = p_set_id) as total_cards,
    count(distinct pi.card_id) as owned_cards,
    round(
      count(distinct pi.card_id)::numeric /
      nullif((select count(*) from public.cards where set_id = p_set_id), 0) * 100,
      2
    ) as completion_percentage
  from public.portfolio_items pi
  join public.cards c on c.id = pi.card_id
  where pi.user_id = p_user_id
  and c.set_id = p_set_id
  and pi.is_wishlist = false;
end;
$$;

-- Trigger to update updated_at
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

create trigger on_portfolio_item_updated
  before update on public.portfolio_items
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
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
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/                 # Public routes (no auth required)
│   │   ├── page.tsx              # Landing page
│   │   ├── sets/
│   │   │   ├── page.tsx          # All sets list
│   │   │   └── [code]/
│   │   │       └── page.tsx      # Set detail
│   │   ├── cards/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Card detail
│   │   ├── sealed/
│   │   │   └── page.tsx          # Sealed products catalog
│   │   └── u/
│   │       └── [username]/
│   │           └── page.tsx      # Public profile
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts          # OAuth callback
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Portfolio overview
│   │   │   ├── cards/
│   │   │   │   └── page.tsx      # Manage cards
│   │   │   ├── sealed/
│   │   │   │   └── page.tsx      # Manage sealed
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx      # Charts & insights
│   │   │   └── settings/
│   │   │       └── page.tsx      # Profile settings
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn components
│   ├── cards/                    # Card-related components
│   │   ├── card-grid.tsx
│   │   ├── card-item.tsx
│   │   ├── card-search.tsx
│   │   └── card-detail.tsx
│   ├── portfolio/                # Portfolio components
│   │   ├── portfolio-table.tsx
│   │   ├── add-item-dialog.tsx
│   │   ├── edit-item-dialog.tsx
│   │   └── grading-form.tsx
│   ├── analytics/                # Analytics components
│   │   ├── value-chart.tsx
│   │   ├── set-completion.tsx
│   │   └── portfolio-summary.tsx
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── auth/                     # Auth components
│       ├── login-form.tsx
│       └── user-menu.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   ├── api/                      # API functions
│   │   ├── cards.ts
│   │   ├── sets.ts
│   │   ├── portfolio.ts
│   │   ├── prices.ts
│   │   └── profiles.ts
│   ├── optcg/                    # OPTCG API integration
│   │   └── client.ts
│   └── utils/
│       ├── format.ts             # Price/date formatting
│       └── cn.ts                 # Class name utility
├── hooks/
│   ├── queries/                  # React Query queries
│   │   ├── use-cards.ts
│   │   ├── use-sets.ts
│   │   ├── use-portfolio.ts
│   │   ├── use-prices.ts
│   │   └── use-profile.ts
│   └── mutations/                # React Query mutations
│       ├── use-add-portfolio-item.ts
│       ├── use-update-portfolio-item.ts
│       ├── use-delete-portfolio-item.ts
│       └── use-update-profile.ts
├── providers/
│   ├── query-provider.tsx        # React Query provider
│   └── auth-provider.tsx         # Auth context
├── types/
│   ├── database.ts               # Generated Supabase types
│   ├── cards.ts
│   ├── portfolio.ts
│   └── api.ts
└── constants/
    ├── grading.ts                # Grading companies, grades
    └── conditions.ts             # Card conditions

supabase/
├── schemas/                      # Declarative schemas
│   ├── 001-auth-users.sql
│   ├── 002-cards.sql
│   ├── 003-sealed-products.sql
│   ├── 004-grading.sql
│   ├── 005-portfolio.sql
│   ├── 006-prices.sql
│   ├── 007-rls-policies.sql
│   └── 008-functions.sql
├── functions/                    # Edge functions
│   ├── sync-optcg/               # Sync cards from OPTCG API
│   │   └── index.ts
│   └── _shared/
│       └── cors.ts
└── migrations/                   # Generated migrations (don't edit directly)
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Basic infrastructure and auth

1. **Supabase Setup**
   - [ ] Initialize Supabase project locally (`supabase init`)
   - [ ] Create all schema files in `supabase/schemas/`
   - [ ] Generate migration: `supabase db diff -f initial-schema`
   - [ ] Apply migration and generate types: `pnpm db:gen-types`

2. **Project Setup**
   - [ ] Install dependencies: `pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query react-hook-form zod @hookform/resolvers recharts`
   - [ ] Install shadcn: `pnpm dlx shadcn@latest init`
   - [ ] Add shadcn components: button, input, dialog, table, card, dropdown-menu, avatar, tabs, form, select, checkbox, badge
   - [ ] Set up Supabase clients (browser + server)
   - [ ] Set up React Query provider
   - [ ] Create auth middleware

3. **Auth Flow**
   - [ ] Login page with magic link
   - [ ] OAuth setup (Google, Discord)
   - [ ] Auth callback handler
   - [ ] User menu component
   - [ ] Protected route layout

### Phase 2: Card Database (Week 2)

**Goal**: OPTCG API integration and card browsing

1. **OPTCG API Integration**
   - [ ] Create OPTCG API client in `src/lib/optcg/client.ts`
   - [ ] Edge function to sync cards: `supabase/functions/sync-optcg/`
   - [ ] Manual trigger for initial sync
   - [ ] (Future) Cron job for periodic sync

2. **Public Card Browsing**
   - [ ] Sets list page with card counts
   - [ ] Set detail page with card grid
   - [ ] Card detail page with full info
   - [ ] Search and filter components
   - [ ] React Query hooks for cards/sets

### Phase 3: Portfolio Core (Week 3)

**Goal**: Portfolio CRUD operations

1. **Portfolio Management**
   - [ ] Add card to portfolio dialog
   - [ ] Add sealed product dialog
   - [ ] Grading form component (company, grade, cert number)
   - [ ] Condition selector for raw cards
   - [ ] Portfolio table with sorting/filtering
   - [ ] Edit/delete portfolio items
   - [ ] Wishlist and for-sale toggles

2. **React Query Hooks**
   - [ ] `usePortfolio` - fetch user portfolio
   - [ ] `useAddPortfolioItem` - add item mutation
   - [ ] `useUpdatePortfolioItem` - update mutation
   - [ ] `useDeletePortfolioItem` - delete mutation

### Phase 4: Analytics (Week 4)

**Goal**: Portfolio insights and charts

1. **Portfolio Summary**
   - [ ] Total value calculation
   - [ ] Gain/loss display
   - [ ] Item counts by category

2. **Charts & Trends**
   - [ ] Portfolio value over time (line chart)
   - [ ] Value by category (pie chart)
   - [ ] Set completion progress bars

3. **Set Analysis**
   - [ ] Set value calculations
   - [ ] Set comparison table
   - [ ] "Undervalued" indicator (when price < historical avg)

### Phase 5: Social & Public Profiles (Week 5)

**Goal**: Public profiles and social features

1. **Public Profiles**
   - [ ] Profile page at `/u/[username]`
   - [ ] Portfolio display for public users
   - [ ] Privacy toggle in settings

2. **Social Features**
   - [ ] Wishlist view (what users want)
   - [ ] For-sale view (what users are selling)
   - [ ] Filter/search by selling users
   - [ ] Profile settings page

---

## API Reference

### React Query Keys

```typescript
// Query keys for cache management
export const queryKeys = {
  cards: {
    all: ['cards'] as const,
    list: (filters: CardFilters) => ['cards', 'list', filters] as const,
    detail: (id: number) => ['cards', 'detail', id] as const,
  },
  sets: {
    all: ['sets'] as const,
    list: () => ['sets', 'list'] as const,
    detail: (code: string) => ['sets', 'detail', code] as const,
  },
  portfolio: {
    all: ['portfolio'] as const,
    list: (userId: string) => ['portfolio', 'list', userId] as const,
    value: (userId: string) => ['portfolio', 'value', userId] as const,
  },
  prices: {
    card: (cardId: number) => ['prices', 'card', cardId] as const,
    sealed: (productId: number) => ['prices', 'sealed', productId] as const,
  },
  profiles: {
    me: ['profiles', 'me'] as const,
    detail: (username: string) => ['profiles', 'detail', username] as const,
  },
};
```

### Key API Functions

```typescript
// src/lib/api/portfolio.ts
export async function getPortfolio(userId: string): Promise<PortfolioItem[]>;
export async function addPortfolioItem(item: NewPortfolioItem): Promise<PortfolioItem>;
export async function updatePortfolioItem(id: number, updates: Partial<PortfolioItem>): Promise<PortfolioItem>;
export async function deletePortfolioItem(id: number): Promise<void>;

// src/lib/api/cards.ts
export async function getCards(filters?: CardFilters): Promise<Card[]>;
export async function getCard(id: number): Promise<Card>;
export async function searchCards(query: string): Promise<Card[]>;

// src/lib/api/sets.ts
export async function getSets(): Promise<Set[]>;
export async function getSet(code: string): Promise<SetWithCards>;

// src/lib/api/prices.ts
export async function getPriceHistory(itemType: 'card' | 'sealed', itemId: number): Promise<PriceHistory[]>;
export async function addPrice(price: NewPrice): Promise<PriceHistory>;
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OPTCG API (if needed)
OPTCG_API_URL=https://optcgapi.com/api/v1
```

---

## Commands Reference

```bash
# Development
pnpm dev                          # Start dev server
pnpm build                        # Production build
pnpm lint                         # ESLint + Prettier

# Supabase
supabase start                    # Start local Supabase
supabase stop                     # Stop local Supabase
supabase db diff -f <name>        # Generate migration from schema changes
supabase db reset                 # Reset local DB
pnpm db:gen-types                 # Regenerate TypeScript types

# shadcn
pnpm dlx shadcn@latest add <component>  # Add component
```

---

## Success Metrics (Future)

- Users can track 100+ items without performance issues
- Price data updates within 24 hours of manual entry
- Set completion calculations are accurate
- Public profiles load in < 2 seconds
