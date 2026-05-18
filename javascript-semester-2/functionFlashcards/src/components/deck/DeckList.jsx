import React from 'react';
import DeckItem from './DeckItem.jsx';
import deckAdd from '../../assets/icons/deck-add.svg';

class DeckList extends React.Component {
  render() {
    const {
      decks,
      activeDeckId,
      onSelect,
      onDelete,
      onCreate,
    } = this.props;

    return (
      <div id="decks">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            active={deck.id === activeDeckId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}

        <button
          className="deck add"
          onClick={onCreate}
          aria-label="Create deck"
        >
          <img src={deckAdd} className="icon" alt="" />
        </button>
      </div>
    );
  }
}

export default DeckList;
