import {Card} from './Card.js';

export class Deck {
  #cards;
  #id;
  #name;

  constructor(cards = [], id = Date.now(), name = "New Deck") {
    this.#name = name;
    this.#cards = [];
    this.#id = id;
    cards.forEach(card => this.addCard(card));
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }


  #findIndexById(id) {
    return this.#cards.findIndex((card) => card.id === id);
  }

  #findCardById(id) {
    return this.#cards.find(card => card.id === id) || null;
  }

  
  addCard(card) {
    if (!(card instanceof Card)) {
      throw new Error('Only Card instance can be allowed');
    }

    if (this.#findCardById(card.id)) {
      throw new Error("Card with id already exists");
    }
    this.#cards.push(card);
  }

  removeCard(id) {
    const index = this.#findIndexById(id);
    if (index === -1) return;
    this.#cards.splice(index, 1);
  }
  
  updateCard(id, front, back) {
    const card = this.#findCardById(id);
    if (!card) return;

    card.update(front, back);
  }
  
  getCardById(id) {
    return this.#findCardById(id);
  }
  
  getCards() {
    return [...this.#cards]
  }

  toggleLearned(id) {
    const card = this.#findCardById(id);
    if (!card) return;

    card.toggleLearned();
  }

  
  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      cards: this.#cards.map(card => card.toJSON()),
    }
  }

  static fromJSON(json) {
    if (!json) {
      return new Deck();
    }

    const cards = (json.cards || []).map(data => Card.fromJSON(data));
    const id = json.id ?? Date.now();
    const name = json.name ?? "New Deck";

    return new Deck(cards, id, name);
  }
}
