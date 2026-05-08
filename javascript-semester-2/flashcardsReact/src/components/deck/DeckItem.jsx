import React from 'react';

class DeckItem extends React.Component {
  handleSelect = () => {
    this.props.onSelect(this.props.deck.id);
  };

  handleDelete = (event) => {
    event.stopPropagation();
    this.props.onDelete(this.props.deck.id);
  };

  render() {
    const { deck, active } = this.props;

    const className = active
      ? 'deck active'
      : 'deck';

    return (
      <button
        className={className}
        onClick={this.handleSelect}
      >
        {deck.name}

        <span
          className="delete-deck"
          onClick={this.handleDelete}
        >
          ×
        </span>
      </button>
    );
  }
}

export default DeckItem;
