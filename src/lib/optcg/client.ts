const BASE_URL = 'https://optcgapi.com/api';

export interface OPTCGSet {
  set_name: string;
  set_id: string;
}

export interface OPTCGCard {
  inventory_price: number;
  market_price: number;
  card_name: string;
  set_name: string;
  card_text: string;
  set_id: string;
  rarity: string;
  card_set_id: string;
  card_color: string;
  card_type: string;
  life: string;
  card_cost: string;
  card_power: string;
  sub_types: string;
  counter_amount: number;
  attribute: string;
  date_scraped: string;
  card_image_id: string;
  card_image: string;
}

export interface OPTCGStarterDeck {
  deck_name: string;
  deck_id: string;
}

export interface NormalizedSet {
  code: string;
  name: string;
}

export interface NormalizedCard {
  external_id: string;
  card_number: string;
  set_code: string;
  name: string;
  rarity: string | null;
  card_type: string | null;
  color: string | null;
  cost: number | null;
  power: number | null;
  counter: number | null;
  attribute: string | null;
  effect: string | null;
  image_url: string | null;
  market_price: number | null;
}

class OPTCGClient {
  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OPTCG API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAllSets(): Promise<OPTCGSet[]> {
    return this.fetch<OPTCGSet[]>('/allSets/');
  }

  async getSetCards(setId: string): Promise<OPTCGCard[]> {
    return this.fetch<OPTCGCard[]>(`/sets/${setId}/`);
  }

  async getCard(cardId: string): Promise<OPTCGCard[]> {
    return this.fetch<OPTCGCard[]>(`/sets/card/${cardId}/`);
  }

  async getAllStarterDecks(): Promise<OPTCGStarterDeck[]> {
    return this.fetch<OPTCGStarterDeck[]>('/allDecks/');
  }

  async getStarterDeckCards(deckId: string): Promise<OPTCGCard[]> {
    return this.fetch<OPTCGCard[]>(`/decks/${deckId}/`);
  }

  async getAllPromoCards(): Promise<OPTCGCard[]> {
    return this.fetch<OPTCGCard[]>('/allPromoCards/');
  }

  normalizeSet(set: OPTCGSet): NormalizedSet {
    return {
      code: set.set_id,
      name: set.set_name,
    };
  }

  normalizeCard(card: OPTCGCard): NormalizedCard {
    return {
      // card_image_id includes _p1/_p2 suffix for parallel variants
      external_id: card.card_image_id,
      card_number: card.card_set_id,
      set_code: card.set_id,
      name: card.card_name,
      rarity: card.rarity || null,
      card_type: card.card_type || null,
      color: card.card_color || null,
      // OPTCG API returns "NULL" string for missing numeric values
      cost: this.parseNumber(card.card_cost),
      power: this.parseNumber(card.card_power),
      counter: card.counter_amount || null,
      attribute: card.attribute || null,
      effect: card.card_text || null,
      image_url: card.card_image || null,
      market_price: card.market_price || null,
    };
  }

  private parseNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === 'NULL' || value === '') {
      return null;
    }
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(num) ? null : num;
  }

  async fetchAllSetsNormalized(): Promise<NormalizedSet[]> {
    const sets = await this.getAllSets();
    return sets.map((set) => this.normalizeSet(set));
  }

  async fetchSetCardsNormalized(setId: string): Promise<NormalizedCard[]> {
    const cards = await this.getSetCards(setId);
    return cards.map((card) => this.normalizeCard(card));
  }

  async fetchAllStarterDecksNormalized(): Promise<NormalizedSet[]> {
    const decks = await this.getAllStarterDecks();
    return decks.map((deck) => ({
      code: deck.deck_id,
      name: deck.deck_name,
    }));
  }

  async fetchStarterDeckCardsNormalized(deckId: string): Promise<NormalizedCard[]> {
    const cards = await this.getStarterDeckCards(deckId);
    return cards.map((card) => this.normalizeCard(card));
  }

  async fetchAllPromoCardsNormalized(): Promise<NormalizedCard[]> {
    const cards = await this.getAllPromoCards();
    return cards.map((card) => this.normalizeCard(card));
  }
}

export const optcgClient = new OPTCGClient();

export { OPTCGClient };
