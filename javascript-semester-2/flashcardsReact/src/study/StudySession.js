import {Deck} from '../models/Deck.js';

export class StudySession {
  #deck;
  #order;
  #currentIndex;
  #isFlipped;
  #mode;

  constructor(deck, mode = 'all') {
    if (!(deck instanceof Deck)) {
      throw new Error('Only Deck instance can be allowed');
    }

    if (mode !== 'all' && mode !== 'unlearned') {
      throw new Error('Invalid mode');
    }

    this.#deck = deck;
    this.#order = [];
    this.#currentIndex = 0;
    this.#isFlipped = false;
    this.#mode = mode;

    this.reset();
  }

  getCount() {
    return this.#order.length;
  }

  getCurrentIndex() {
    return this.#currentIndex;
  }

  getCurrentCard() {
    if (this.#order.length === 0) {
      return null;
    }

    const id = this.#order[this.#currentIndex];

    return this.#deck.getCardById(id);
  }

  isFlipped() {
    return this.#isFlipped;
  }

  getMode() {
    return this.#mode;
  }

  prev() {
    if (this.#order.length === 0) {
      return;
    }

    this.#currentIndex =
      (this.#currentIndex - 1 + this.#order.length) % this.#order.length;

    this.#isFlipped = false;
  }

  next() {
    if (this.#order.length === 0) {
      return;
    }

    this.#currentIndex =
      (this.#currentIndex + 1) % this.#order.length;

    this.#isFlipped = false;
  }

  flip() {
    this.#isFlipped = !this.#isFlipped;
  }

  shuffle() {
    this.reset();

    for (let i = this.#order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));

      [this.#order[i], this.#order[j]] =
        [this.#order[j], this.#order[i]];
    }

    this.#currentIndex = 0;
    this.#isFlipped = false;
  }

  setMode(mode) {
    if (this.#mode === mode) {
      return;
    }

    if (mode !== 'all' && mode !== 'unlearned') {
      throw new Error('Invalid mode');
    }

    this.#mode = mode;

    this.reset();
  }

  reset() {
    const cards = this.#deck.getCards();

    if (this.#mode === 'all') {
      this.#order = cards.map((card) => card.id);
    } else {
      this.#order = cards
        .filter((card) => !card.learned)
        .map((card) => card.id);
    }

    this.#currentIndex = 0;
    this.#isFlipped = false;
  }
}
