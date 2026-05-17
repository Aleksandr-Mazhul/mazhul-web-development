import {Deck} from '../models/Deck.js';
import {StudySession} from "../study/StudySession.js";
import {Card} from "../models/Card.js";
import {renderCard, renderDeckList, renderListCards, renderPosition} from "../ui/render.js";

export class App {
  #decks;
  #activeDeckId
  #session;
  #editingCardId = null;
  #showList = false;

  constructor() {
    this.#decks = [];
    this.#activeDeckId = null;
    this.#session = null;
  }

  getActiveDeck() {
    return this.#decks.find(d => d.id === this.#activeDeckId);
  }

  createDeck() {
    const name = prompt("Deck name:") || "New Deck";
    const deck = new Deck([], Date.now(), name);

    this.#decks.push(deck);
    this.#activeDeckId = deck.id;

    this.#session = new StudySession(this.getActiveDeck());

    this.save();
    this.render();
  }

  deleteDeck(id) {
    this.#decks = this.#decks.filter(d => d.id !== id);

    if (this.#activeDeckId === id) {
      const first = this.#decks[0];

      if (first) {
        this.#activeDeckId = first.id;
        this.#session = new StudySession(first);
      } else {
        const deck = new Deck();
        this.#decks = [deck];
        this.#activeDeckId = deck.id;
        this.#session = new StudySession(deck);
      }
    }

    this.save();
    this.render();
  }

  setActiveDeck(id) {
    this.#activeDeckId = id;

    this.#session = new StudySession(this.getActiveDeck());

    this.save();
    this.render();
  }

  init() {
    this.setupState();
    this.setupEventListeners();
    this.render();
  }


  addCard(front, back) {
    const card = new Card(Date.now(), front, back);
    this.getActiveDeck().addCard(card);
    this.#session.reset();
    this.save();
    this.render();
  }

  deleteCard(id) {
    this.getActiveDeck().removeCard(id);
    this.#session.reset();
    this.save();
    this.render();
  }

  updateCard(id, front, back) {
    this.getActiveDeck().updateCard(id, front, back);
    this.#session.reset();
    this.save();
    this.render();
  }

  toggleLearned(id) {
    this.getActiveDeck().toggleLearned(id);
    this.save();
    this.render();
  }

  nextCard() {
    this.#session.next();
    this.render();
  }

  prevCard() {
    this.#session.prev();
    this.render();
  }

  flipCard() {
    this.#session.flip();
    this.render();
  }


  setMode(mode) {
    this.#session.setMode(mode);
    this.render();
  }

  shuffle() {
    this.#session.shuffle();
    this.render();
  }

  setupState() {
    const raw = localStorage.getItem("flashcards-deck");

    if (raw) {
      const data = JSON.parse(raw);
      this.#decks = data.decks.map(d => Deck.fromJSON(d));
      this.#activeDeckId = data.activeDeckId;
    } else {
      const deck = new Deck();
      this.#decks = [deck];
      this.#activeDeckId = deck.id;
    }

    if (!this.getActiveDeck()) {
      this.#activeDeckId = this.#decks[0]?.id;
    }

    if (!this.#activeDeckId) {
      const deck = new Deck();
      this.#decks = [deck];
      this.#activeDeckId = deck.id;
    }

    this.#session = new StudySession(this.getActiveDeck());
  }

  setupEventListeners() {


    const cardEl = document.getElementById('card');
    cardEl.addEventListener('click', () => {
      this.flipCard();
    });

    const prevBTN = document.getElementById('prev');
    prevBTN.addEventListener('click', () => {
      this.prevCard();
    })


    const nextBTN = document.getElementById('next');
    nextBTN.addEventListener('click', () => {
      this.nextCard();
    })


    const flipBTN = document.getElementById('flip');
    flipBTN.addEventListener('click', () => {
      this.flipCard();
    })


    const shuffleBTN = document.getElementById('shuffle');
    shuffleBTN.addEventListener('click', () => {
      this.shuffle();
    })


    const markBtn = document.getElementById('mark');
    markBtn.addEventListener('click', () => {
      const card = this.#session.getCurrentCard();
      if (!card) return;
      this.toggleLearned(card.id);
    });


    const modeSelect = document.getElementById('mode');
    modeSelect.addEventListener('change', (e) => {
      this.setMode(e.target.value);
    })


    const frontInput = document.getElementById('frontInput');
    const backInput = document.getElementById('backInput');

    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', () => {
      const front = frontInput.value;
      const back = backInput.value;
      if (!front || !back) return;

      if (this.#editingCardId !== null) {
        this.updateCard(this.#editingCardId, front, back);
        this.#editingCardId = null;
      } else {
        this.addCard(front, back);
      }

      frontInput.value = '';
      backInput.value = '';
    });


    const toggle = document.getElementById('toggleList');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.#showList = !this.#showList;
        this.render();
      });
    }
  }


  save() {
    const data = {
      decks: this.#decks.map(d => d.toJSON()),
      activeDeckId: this.#activeDeckId
    }
    localStorage.setItem('flashcards-deck', JSON.stringify(data));
  }

  render() {
    const activeCard = this.#session.getCurrentCard();
    const isFlipped = this.#session.isFlipped();
    const pos = this.#session.getCurrentIndex() + 1;
    const total = this.#session.getCount();
    const deck = this.getActiveDeck();
    if (!deck) {
      renderCard(null, false);
      renderPosition(0, 0);
      return;
    }
    const cards = deck.getCards();


    renderCard(activeCard, isFlipped);


    renderPosition(pos, total);

    if (this.#showList) {
      renderListCards(cards, {
        onDelete: (id) => this.deleteCard(id),
        onEdit: (card) => {
          const frontInput = document.getElementById("frontInput");
          const backInput = document.getElementById("backInput");

          frontInput.value = card.front;
          backInput.value = card.back;

          this.#editingCardId = card.id;
        }
      });
    } else {
      const listEl = document.getElementById("list");
      if (listEl) listEl.innerHTML = "";
    }

    renderDeckList(this.#decks, this.#activeDeckId, {
      onSelect: (id) => this.setActiveDeck(id),
      onCreate: () => this.createDeck(),
      onDelete: (id) => this.deleteDeck(id)
    });

  }
}
