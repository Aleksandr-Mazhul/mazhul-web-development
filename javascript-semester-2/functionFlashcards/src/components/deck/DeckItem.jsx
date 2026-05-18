import {memo, useCallback} from 'react';

function DeckItem({
                    deck,
                    active,
                    onSelect,
                    onDelete,
                  }) {

  const handleSelect = useCallback(() => {
    onSelect(deck.id);
  }, [deck.id, onSelect]);

  const handleDelete = useCallback((event) => {

    event.stopPropagation();

    onDelete(deck.id);

  }, [deck.id, onDelete]);

  return (

    <button
      className={
        active
          ? 'deck active'
          : 'deck'
      }
      onClick={handleSelect}
    >

      {deck.name}

      <span
        className="delete-deck"
        onClick={handleDelete}
      >
        ×
      </span>

    </button>

  );

}

export default memo(DeckItem);
