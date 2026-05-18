import React from 'react';
import editIcon from '../../assets/icons/edit.svg';
import trashIcon from '../../assets/icons/trash.svg';

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
          <button onClick={this.handleEdit} aria-label="Edit card" className="icon-btn">
            <img src={editIcon} className="icon" alt="" />
          </button>

          <button onClick={this.handleDelete} aria-label="Delete card" className="icon-btn">
            <img src={trashIcon} className="icon" alt="" />
          </button>
        </div>
      </div>);
  }
}

export default CardRow;
