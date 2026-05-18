import {memo} from 'react';

import CardRow from './CardRow.jsx';

function CardList({cards, visible, onEdit, onDelete,}) {

  if (!visible) {
    return null;
  }

  return (

    <div id="list">

      {cards.map((card) => (

        <CardRow
          key={card.id}
          card={card}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      ))}

    </div>

  );

}

export default memo(CardList);
