import {useCallback, useEffect, useMemo, useState} from 'react';

import {Deck} from '../models/Deck.js';
import {Card} from '../models/Card.js';
import {StorageService} from '../services/StorageService.js';

import DeckList from '../components/deck/DeckList.jsx';
import StudyPanel from '../components/study/StudyPanel.jsx';
import CardForm from '../components/form/CardForm.jsx';
import CardList from '../components/cards/CardList.jsx';

function FlashcardsApp() {

  const storageData = useMemo(() => StorageService.load(), [],);

  const [decks, setDecks] = useState(() => {
    return storageData.decks?.length ? storageData.decks : [new Deck()];
  });

  const [activeDeckId, setActiveDeckId] = useState(() => storageData.activeDeckId ?? storageData.decks[0]?.id ?? decks[0].id,);

  const [editingCardId, setEditingCardId] = useState(null);

  const [showList, setShowList] = useState(false);

  const [frontInput, setFrontInput] = useState('');

  const [backInput, setBackInput] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isFlipped, setIsFlipped] = useState(false);

  const [mode, setMode] = useState('all');

  const activeDeck = useMemo(() => {
    return decks.find(deck => deck.id === activeDeckId,);
  }, [decks, activeDeckId]);

  const visibleCards = useMemo(() => {

    if (!activeDeck) {
      return [];
    }

    const cards = activeDeck.getCards();

    return mode === 'all' ? cards : cards.filter(card => !card.learned,);

  }, [activeDeck, mode]);

  const total = visibleCards.length;

  const currentCard = total > 0 ? visibleCards[currentIndex] : null;

  const position = total > 0 ? currentIndex + 1 : 0;

  useEffect(() => {

    StorageService.save(decks, activeDeckId,);

  }, [decks, activeDeckId,]);

  useEffect(() => {

    if (currentIndex >= total) {
      setCurrentIndex(0);
    }

  }, [total, currentIndex,]);

  const resetStudy = useCallback(() => {

    setCurrentIndex(0);

    setIsFlipped(false);

  }, []);

  const createDeck = useCallback(() => {

    const name = window.prompt('Deck name:',);

    if (name === null) {
      return;
    }

    const deck = new Deck([], Date.now(), name.trim() || 'New Deck',);

    setDecks(prev => [...prev, deck,],);

    setActiveDeckId(deck.id,);

    resetStudy();

  }, [resetStudy,]);

  const deleteDeck = useCallback((id) => {

    setDecks(prev => {

      let newDecks = prev.filter(deck => deck.id !== id,);

      if (newDecks.length === 0) {
        newDecks = [new Deck(),];
      }

      if (activeDeckId === id) {
        setActiveDeckId(newDecks[0].id,);
      }

      return newDecks;

    });

    resetStudy();

  }, [activeDeckId, resetStudy,]);

  const selectDeck = useCallback((id) => {

    setActiveDeckId(id);

    resetStudy();

  }, [resetStudy,]);

  const addCard = useCallback(() => {

    const front = frontInput.trim();

    const back = backInput.trim();

    if (!front || !back) {
      return;
    }

    if (editingCardId !== null) {

      activeDeck.updateCard(editingCardId, front, back,);

    } else {

      activeDeck.addCard(new Card(Date.now(), front, back,),);

    }

    setDecks([...decks,]);

    setEditingCardId(null,);

    setFrontInput('');

    setBackInput('');

    resetStudy();

  }, [activeDeck, frontInput, backInput, editingCardId, decks, resetStudy,]);

  const deleteCard = useCallback((id) => {

    activeDeck.removeCard(id,);

    setDecks([...decks,]);

    resetStudy();

  }, [activeDeck, decks, resetStudy,]);

  const editCard = useCallback((card) => {

    setEditingCardId(card.id,);

    setFrontInput(card.front,);

    setBackInput(card.back,);

  }, []);

  const toggleLearned = useCallback(() => {

    if (!currentCard) {
      return;
    }

    activeDeck.toggleLearned(currentCard.id,);

    setDecks([...decks,]);

  }, [activeDeck, currentCard, decks,]);

  const nextCard = useCallback(() => {

    setCurrentIndex(prev => (prev + 1) % total,);

    setIsFlipped(false,);

  }, [total]);

  const prevCard = useCallback(() => {

    setCurrentIndex(prev => (prev - 1 + total) % total,);

    setIsFlipped(false,);

  }, [total]);

  const flipCard = useCallback(() => {

    setIsFlipped(prev => !prev,);

  }, []);

  const shuffleCards = useCallback(() => {

    const shuffled = [...visibleCards]
      .sort(() => Math.random() - 0.5,);

    setCurrentIndex(0,);

    setIsFlipped(false,);

  }, [visibleCards,]);

  return (

    <div
      id="app"
      className="glass"
    >

      <DeckList
        decks={decks}
        activeDeckId={activeDeckId}
        onSelect={selectDeck}
        onDelete={deleteDeck}
        onCreate={createDeck}
      />

      <StudyPanel
        card={currentCard}
        isFlipped={isFlipped}
        position={position}
        total={total}
        onFlip={flipCard}
        onPrev={prevCard}
        onNext={nextCard}
        onShuffle={shuffleCards}
        onMark={toggleLearned}
        onModeChange={e => setMode(e.target.value,)}
        onToggleList={() => setShowList(prev => !prev,)}
        showList={showList}
        mode={mode}
      />

      <CardForm
        frontInput={frontInput}
        backInput={backInput}
        onFrontChange={e => setFrontInput(e.target.value,)}
        onBackChange={e => setBackInput(e.target.value,)}
        onSubmit={addCard}
        isEditing={editingCardId !== null}
      />

      <CardList
        cards={visibleCards}
        visible={showList}
        onEdit={editCard}
        onDelete={deleteCard}
      />

    </div>

  );
}

export default FlashcardsApp;
