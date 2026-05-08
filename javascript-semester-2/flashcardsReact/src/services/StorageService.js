import { Deck } from '../models/Deck.js';

export class StorageService {
  static STORAGE_KEY = 'flashcards-deck';

  static load() {
    const raw = localStorage.getItem(StorageService.STORAGE_KEY);

    if (!raw) {
      return {
        decks: [new Deck()],
        activeDeckId: null,
      };
    }

    try {
      const data = JSON.parse(raw);

      const rawDecks = Array.isArray(data.decks) ? data.decks : [];
      const decks = rawDecks
        .map((deck) => Deck.fromJSON(deck))
        .filter(Boolean);

      return {
        decks,
        activeDeckId: data.activeDeckId ?? null,
      };
    } catch {
      return {
        decks: [new Deck()],
        activeDeckId: null,
      };
    }
  }

  static save(decks, activeDeckId) {
    const data = {
      decks: decks.map((deck) => deck.toJSON()),
      activeDeckId,
    };

    localStorage.setItem(
      StorageService.STORAGE_KEY,
      JSON.stringify(data),
    );
  }
}
