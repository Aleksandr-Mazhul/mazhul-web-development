import React from 'react';
import CardRow from './CardRow.jsx';

class CardList extends React.Component {
  render() {
    const {
      cards,
      visible,
      onEdit,
      onDelete,
    } = this.props;

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
}

export default CardList;
