# Roadmap & Future Features

This document outlines planned features, improvements, and ideas for the One Piece TCG Portfolio Tracker.

## Phase 1: Core Improvements (High Priority)

### Data Sync & Automation

- [ ] **OPTCG Card Sync Edge Function** - Automated daily sync from optcgapi.com
- [ ] **GemRate Population Scraping** - Implement headless browser scraping via Browserless or Puppeteer Cloud
- [ ] **PSA/CGC API Integration** - Partner API access for official population data
- [ ] **Price History Automation** - Scheduled price updates from community sources

### Portfolio Enhancements

- [ ] **Edit Portfolio Item Dialog** - Full edit capability (currently only add/delete)
- [ ] **Bulk Import** - CSV/Excel import for existing collections
- [ ] **Bulk Actions** - Select multiple items for batch updates/delete
- [ ] **Portfolio Filtering** - Filter by set, rarity, grading company, condition
- [ ] **Portfolio Sorting** - Sort by value, date added, name, set

### Analytics Improvements

- [ ] **Set Market Analysis** - Total set values, average card prices
- [ ] **Undervalued Set Detection** - Price vs historical average comparison
- [ ] **Price Trend Alerts** - Notifications for significant price changes
- [ ] **Portfolio Performance** - Daily/weekly/monthly gain/loss tracking

## Phase 2: Meta & Competitive Features

### Deck Meta Integration (Limitless TCG)

- [ ] **Meta Dashboard** - Current tier list with win rates
- [ ] **Deck Popularity Charts** - Trending decks over time
- [ ] **Matchup Data** - Win rates between deck archetypes
- [ ] **Tournament Results** - Recent tournament placings
- [ ] **Leader Card Linking** - Link portfolio cards to meta leaders

Data Source: [Limitless TCG API](https://docs.limitlesstcg.com/developer.html)

- Requires API access key (free, approval needed)
- Endpoints: `/tournaments`, `/games`
- Webhook support for real-time updates

### Card Valuation Insights

- [ ] **Meta Impact Pricing** - Cards that spike due to meta relevance
- [ ] **Staple Cards Tracker** - Universal staples across decks
- [ ] **Investment Recommendations** - Based on meta trends and population

## Phase 3: Social Features

### Community

- [ ] **Follow Collectors** - Follow other users to see their activity
- [ ] **Activity Feed** - Recent additions, sales, purchases from followed users
- [ ] **Comments on Cards** - Community discussion per card
- [ ] **Trading Post** - Connect buyers and sellers directly

### Marketplace Integration

- [ ] **eBay Price Fetching** - Automated market price from eBay sold listings
- [ ] **TCGPlayer Integration** - Price comparison and links
- [ ] **Listing Export** - Generate listings for marketplace platforms

## Phase 4: Advanced Features

### Collection Tools

- [ ] **Set Completion Goals** - Track progress toward complete sets
- [ ] **Missing Cards View** - Cards needed to complete sets
- [ ] **Parallel Art Tracking** - Track different art variants separately
- [ ] **PSA/CGC Label Verification** - Verify cert numbers against grading company databases

### Mobile & PWA

- [ ] **Progressive Web App** - Installable app experience
- [ ] **Offline Support** - View portfolio offline
- [ ] **Barcode Scanner** - Scan card barcodes to add to portfolio
- [ ] **Camera Integration** - Photo upload for card images

### Integrations

- [ ] **Discord Bot** - Price checks, portfolio summary in Discord
- [ ] **Export Options** - PDF reports, spreadsheet exports
- [ ] **Webhooks** - Notify external services on portfolio changes

## Technical Debt & Improvements

### Code Quality

- [ ] **Type Safety** - Remove `as unknown` and `as never` casts from Supabase queries
- [ ] **Error Boundaries** - Graceful error handling in UI
- [ ] **Loading States** - Skeleton loaders for better UX
- [ ] **Form Validation** - Consistent zod validation across forms

### Performance

- [ ] **Image Optimization** - Next.js Image component for card images
- [ ] **Pagination** - Server-side pagination for large collections
- [ ] **Caching Strategy** - Optimize React Query cache times
- [ ] **Database Indexes** - Review and optimize query performance

### Testing

- [ ] **Unit Tests** - Core business logic
- [ ] **E2E Tests** - Critical user flows with Playwright
- [ ] **API Tests** - Supabase RPC function testing

### DevOps

- [ ] **Staging Environment** - Preview deployments
- [ ] **Database Migrations CI** - Automated migration testing
- [ ] **Monitoring** - Error tracking with Sentry
- [ ] **Analytics** - PostHog for user behavior insights

## Data Sources Reference

| Source                                         | Data Type               | Status          | Notes              |
| ---------------------------------------------- | ----------------------- | --------------- | ------------------ |
| [OPTCG API](https://optcgapi.com)              | Cards, Sets, Prices     | ✅ Client Ready | Free, no auth      |
| [GemRate](https://gemrate.com)                 | PSA/CGC/BGS Population  | 🔄 Schema Ready | Requires scraping  |
| [Limitless TCG](https://play.limitlesstcg.com) | Meta, Tournaments       | 📋 Planned      | API key required   |
| PSA                                            | Population, Cert Verify | 📋 Planned      | Partner API needed |
| CGC                                            | Population              | 📋 Planned      | Partner API needed |
| eBay                                           | Market Prices           | 📋 Planned      | API access needed  |
| TCGPlayer                                      | Prices                  | 📋 Planned      | Affiliate program  |

## Contributing Ideas

Have a feature idea? Consider:

1. How does it help collectors?
2. What data sources are needed?
3. Is it technically feasible?
4. Does it align with the app's focus on One Piece TCG?

---

_Last updated: December 2025_
