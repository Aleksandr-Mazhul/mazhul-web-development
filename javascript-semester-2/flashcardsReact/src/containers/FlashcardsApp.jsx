import React from 'react';

import {Deck} from '../models/Deck.js';
import {Card} from '../models/Card.js';
import {StudySession} from '../study/StudySession.js';
import {StorageService} from '../services/StorageService.js';
import DeckList from '../components/deck/DeckList.jsx';
import StudyPanel from '../components/study/StudyPanel.jsx';
import CardForm from '../components/form/CardForm.jsx';
import CardList from '../components/cards/CardList.jsx';

class FlashcardsApp extends React.Component {
  constructor(props) {
    super(props);

    const data = StorageService.load();

    const decks = Array.isArray(data.decks) ? data.decks : [];

    let activeDeckId = data.activeDeckId ?? null;

    if (!activeDeckId && decks.length > 0) {
      activeDeckId = decks[0].id;
    }

    if (!activeDeckId) {
      const deck = new Deck();
      decks.push(deck);
      activeDeckId = deck.id;
    }

    let activeDeck = decks.find((deck) => deck.id === activeDeckId) || decks[0];

    if (!activeDeck) {
      const deck = new Deck();
      decks.push(deck);
      activeDeckId = deck.id;
      activeDeck = deck;
    }

    if (activeDeckId !== activeDeck.id) {
      activeDeckId = activeDeck.id;
    }

    this.state = {
      decks,
      activeDeckId,
      session: new StudySession(activeDeck),
      editingCardId: null,
      showList: false,
      frontInput: '',
      backInput: '',
    };
  }

  buildSession = (deck) => {
    const mode = this.state?.session ? this.state.session.getMode() : 'all';

    return new StudySession(deck, mode);
  };

  componentDidUpdate() {
    StorageService.save(this.state.decks, this.state.activeDeckId,);
  }

  getActiveDeck = () => {
    return this.state.decks.find((deck) => deck.id === this.state.activeDeckId,);
  };

  createDeck = () => {
    const name = window.prompt('Deck name:');

    if (name === null) {
      return;
    }

    const deck = new Deck([], Date.now(), name.trim() || 'New Deck',);

    const decks = [...this.state.decks, deck,];

    this.setState({
      decks,
      activeDeckId: deck.id,
      session: this.buildSession(deck),
      editingCardId: null,
      frontInput: '',
      backInput: '',
    });
  };

  deleteDeck = (id) => {
    let decks = this.state.decks.filter((deck) => deck.id !== id);

    let activeDeckId = this.state.activeDeckId;

    if (activeDeckId === id) {
      if (decks.length === 0) {
        const deck = new Deck();
        decks = [deck];
        activeDeckId = deck.id;
      } else {
        activeDeckId = decks[0].id;
      }
    }

    const activeDeck = decks.find((deck) => deck.id === activeDeckId);

    this.setState({
      decks, activeDeckId, session: this.buildSession(activeDeck), editingCardId: null, frontInput: '', backInput: '',
    });
  };

  setActiveDeck = (id) => {
    const deck = this.state.decks.find((item) => item.id === id);

    this.setState({
      activeDeckId: id, session: this.buildSession(deck), editingCardId: null, frontInput: '', backInput: '',
    });
  };

  addCard = () => {
    const front = this.state.frontInput.trim();
    const back = this.state.backInput.trim();

    if (!front || !back) {
      return;
    }

    const deck = this.getActiveDeck();

    if (this.state.editingCardId !== null) {
      deck.updateCard(this.state.editingCardId, front, back,);
    } else {
      deck.addCard(new Card(Date.now(), front, back),);
    }

    const session = this.state.session;
    session.reset();

    this.setState({
      decks: [...this.state.decks], session, editingCardId: null, frontInput: '', backInput: '',
    });
  };

  deleteCard = (id) => {
    const deck = this.getActiveDeck();

    deck.removeCard(id);

    const session = this.state.session;
    session.reset();

    this.setState({
      decks: [...this.state.decks], session,
    });
  };

  editCard = (card) => {
    this.setState({
      editingCardId: card.id, frontInput: card.front, backInput: card.back,
    });
  };

  toggleLearned = () => {
    const card = this.state.session.getCurrentCard();

    if (!card) {
      return;
    }

    const deck = this.getActiveDeck();

    deck.toggleLearned(card.id);

    const session = this.state.session;

    if (session.getMode() === 'unlearned') {
      session.reset();
    }

    this.setState({
      decks: [...this.state.decks], session,
    });
  };

  prevCard = () => {
    const session = this.state.session;

    session.prev();

    this.setState({session});
  };

  nextCard = () => {
    const session = this.state.session;

    session.next();

    this.setState({session});
  };

  flipCard = () => {
    const session = this.state.session;

    session.flip();

    this.setState({session});
  };

  shuffleCards = () => {
    const session = this.state.session;

    session.shuffle();

    this.setState({session});
  };

  setMode = (event) => {
    const session = this.state.session;

    session.setMode(event.target.value);

    this.setState({session});
  };

  handleFrontChange = (event) => {
    this.setState({
      frontInput: event.target.value,
    });
  };

  handleBackChange = (event) => {
    this.setState({
      backInput: event.target.value,
    });
  };

  toggleList = () => {
    this.setState({
      showList: !this.state.showList,
    });
  };

  render() {
    const card = this.state.session.getCurrentCard();

    const isFlipped = this.state.session.isFlipped();

    const pos = this.state.session.getCurrentIndex() + 1;

    const total = this.state.session.getCount();

    const deck = this.getActiveDeck();
    const cards = deck
      ? deck.getCards()
      : [];

    return (<div id="app">
      <DeckList
        decks={this.state.decks}
        activeDeckId={this.state.activeDeckId}
        onSelect={this.setActiveDeck}
        onDelete={this.deleteDeck}
        onCreate={this.createDeck}
      />

      <StudyPanel
        card={card}
        isFlipped={isFlipped}
        position={pos}
        total={total}
        onFlip={this.flipCard}
        onPrev={this.prevCard}
        onNext={this.nextCard}
        onShuffle={this.shuffleCards}
        onMark={this.toggleLearned}
        onModeChange={this.setMode}
        onToggleList={this.toggleList}
        showList={this.state.showList}
        mode={this.state.session.getMode()}
      />

      <CardForm
        frontInput={this.state.frontInput}
        backInput={this.state.backInput}
        onFrontChange={this.handleFrontChange}
        onBackChange={this.handleBackChange}
        onSubmit={this.addCard}
        isEditing={this.state.editingCardId !== null}
      />

      <CardList
        cards={cards}
        visible={this.state.showList}
        onEdit={this.editCard}
        onDelete={this.deleteCard}
      />
    </div>);
  }
}

export default FlashcardsApp;
