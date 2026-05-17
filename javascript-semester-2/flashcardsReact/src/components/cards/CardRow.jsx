import React from 'react';

class CardRow extends React.Component {
  handleEdit = () => {
    const {card, onEdit} = this.props;

    onEdit(card);
  };

  handleDelete = () => {
    const {card, onDelete} = this.props;

    onDelete(card.id);
  };

  render() {
    const {card} = this.props;

    return (<div className="card-row">
        <span>{card.front}</span>

        <div className="actions">
          <button onClick={this.handleEdit}>
            ✏️
          </button>

          <button onClick={this.handleDelete}>
            🗑
          </button>
        </div>
      </div>);
  }
}

export default CardRow;
