import React from 'react';
import DeckItem from './DeckItem.jsx';

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
        >
          +
        </button>
      </div>
    );
  }
}

export default DeckList;
