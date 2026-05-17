import React from 'react';

class DeckItem extends React.Component {
  handleSelect = () => {
    const {deck, onSelect} = this.props;

    onSelect(deck.id);
  };

  handleDelete = (event) => {
    const {deck, onDelete} = this.props;

    event.stopPropagation();

    onDelete(deck.id);
  };

  render() {
    const {deck, active} = this.props;

    const className = active
      ? 'deck active'
      : 'deck';

    return (<button
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
      </button>);
  }
}

export default DeckItem;
