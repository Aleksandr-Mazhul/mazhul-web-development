import {Deck} from '../models/Deck.js';

export class StudySession {
  #deck;
  #order;
  #currentIndex;
  #isFlipped;
  #mode;

  constructor(deck) {
    if (!(deck instanceof Deck)) {
      throw new Error('Only Deck instance can be allowed');
    }
    this.#deck = deck;
    this.#mode = "all";
    this.#isFlipped = false;
    this.#currentIndex = 0;
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


  prev() {
    if (this.#order.length === 0) return;
    this.#currentIndex = (this.#currentIndex - 1 + this.#order.length) % this.#order.length;
    this.#isFlipped = false;
  }
  
  next() {
    if (this.#order.length === 0) return;
    this.#currentIndex = (this.#currentIndex + 1) % this.#order.length;
    this.#isFlipped = false;
  }
  
  flip() {
    this.#isFlipped = !this.#isFlipped;
  }

  shuffle() {
    this.reset(); 

    for (let i = this.#order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#order[i], this.#order[j]] = [this.#order[j], this.#order[i]];
    }

    this.#currentIndex = 0;
    this.#isFlipped = false;
  }

  
  setMode(mode) {
    if (this.#mode === mode) return;
    if (mode !== "all" && mode !== "unlearned") {
      throw new Error('Invalid mode');
    }
    this.#mode = mode;
    this.reset();
  }

  
  reset() {
    const cards = this.#deck.getCards();

    if (this.#mode === "all") {
      this.#order = cards.map(card => card.id);
    } else if (this.#mode === "unlearned") {
      this.#order = cards
        .filter(card => !card.learned)
        .map(card => card.id);
    } else {
      this.#order = [];
    }

    this.#currentIndex = 0;
    this.#isFlipped = false;
  }
}
