# One Piece TCG Portfolio Tracker

A web application for One Piece TCG collectors to track their card and sealed product portfolios, monitor market values, analyze set performance, and connect with other collectors.

## Features

### Portfolio Management

- Track raw cards, graded slabs, and sealed products in one place
- Record purchase price, date, and quantity
- Condition tracking for raw cards (Mint, Near Mint, Lightly Played, etc.)
- Full grading info for slabs (PSA, CGC, BGS, ARS) with grade and cert number
- Wishlist and for-sale flags for items

### Price Tracking

- Manual price entry with history
- Price trends per card/product
- Current prices view with condition/grade variants

### Analytics Dashboard

- Portfolio total value and gain/loss calculations
- Portfolio value over time charts
- Category breakdown (cards vs sealed, raw vs graded)
- Set completion percentage tracking

### Public Browsing

- Browse all sets with card counts
- View card details with images and stats
- Sealed products catalog
- Search cards by name, set, rarity, color

### Social Features

- Public user profiles at `/u/[username]`
- Wishlist and for-sale visibility
- Privacy toggle for portfolios

### Population Data

- Grading population tracking from PSA, CGC, BGS, SGC
- Population sync via edge functions

## Tech Stack

| Layer           | Technology                        |
| --------------- | --------------------------------- |
| Framework       | Next.js 15 (App Router)           |
| UI              | React 19                          |
| Language        | TypeScript                        |
| Database        | Supabase (Postgres)               |
| Auth            | Supabase Auth                     |
| Security        | Supabase RLS (Row Level Security) |
| Data Fetching   | TanStack Query (React Query)      |
| Styling         | Tailwind CSS v4                   |
| Components      | shadcn/ui                         |
| Charts          | Recharts                          |
| Forms           | react-hook-form + zod             |
| Background Jobs | Supabase Edge Functions           |

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public routes (no auth required)
│   │   ├── page.tsx        # Landing page
│   │   ├── sets/           # Set browsing
│   │   ├── cards/          # Card details
│   │   ├── sealed/         # Sealed products catalog
│   │   └── u/[username]/   # Public profiles
│   ├── (auth)/             # Auth routes
│   │   ├── login/          # Login page
│   │   └── callback/       # OAuth callback
│   └── (dashboard)/        # Protected routes
│       └── dashboard/
│           ├── page.tsx    # Portfolio overview
│           ├── cards/      # Manage cards
│           ├── sealed/     # Manage sealed products
│           ├── analytics/  # Charts & insights
│           └── settings/   # Profile settings
├── components/
│   ├── ui/                 # shadcn components
│   ├── cards/              # Card-related components
│   ├── portfolio/          # Portfolio management
│   └── analytics/          # Charts and summaries
├── lib/
│   ├── api/                # API functions (Supabase wrappers)
│   ├── supabase/           # Supabase clients (browser/server)
│   └── optcg/              # OPTCG API integration
├── hooks/
│   ├── queries/            # React Query hooks
│   └── mutations/          # React Query mutations
└── types/
    └── database.ts         # Generated Supabase types

supabase/
├── schemas/                # Declarative SQL schemas
│   ├── 001-auth-users.sql  # Profiles table
│   ├── 002-cards.sql       # Sets and cards
│   ├── 003-sealed-products.sql
│   ├── 004-grading.sql     # Grading enums
│   ├── 005-portfolio.sql   # Portfolio items
│   ├── 006-prices.sql      # Price history
│   ├── 007-rls-policies.sql
│   ├── 008-functions.sql   # DB functions
│   └── 009-population.sql  # Grading population
└── functions/              # Edge functions
    └── sync-population/    # Population data sync
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 9+
- Supabase CLI

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd op-portfolio-tracker

# Install dependencies
pnpm install

# Start local Supabase
supabase start

# Apply migrations and generate types
supabase db reset
pnpm db:gen-types
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

| Table                | Description                             |
| -------------------- | --------------------------------------- |
| `profiles`           | User profiles extending Supabase auth   |
| `sets`               | Card sets (OP-01, OP-02, etc.)          |
| `cards`              | Individual cards with stats and images  |
| `sealed_products`    | Booster boxes, cases, starter decks     |
| `portfolio_items`    | User portfolio entries (cards + sealed) |
| `price_history`      | Historical price data                   |
| `grading_population` | Population data from grading companies  |

## External APIs

| API                                            | Purpose              | Status  |
| ---------------------------------------------- | -------------------- | ------- |
| [OPTCG API](https://optcgapi.com)              | Card data sync       | Planned |
| [GemRate](https://gemrate.com)                 | Population data      | Planned |
| [Limitless TCG](https://play.limitlesstcg.com) | Meta/tournament data | Planned |

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint + Prettier
pnpm type-check       # TypeScript validation
supabase start        # Start local Supabase
supabase db reset     # Reset local database
```

## License

MIT
