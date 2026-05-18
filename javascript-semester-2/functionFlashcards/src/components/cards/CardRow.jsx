import {memo, useCallback} from 'react';

import editIcon from '../../assets/icons/edit.svg';
import trashIcon from '../../assets/icons/trash.svg';

function CardRow({
                   card, onEdit, onDelete,
                 }) {

  const handleEdit = useCallback(() => {

    onEdit(card);

  }, [card, onEdit,]);

  const handleDelete = useCallback(() => {

    onDelete(card.id);

  }, [card.id, onDelete,]);

  return (

    <div className="card-row">

      <span>
        {card.front}
      </span>

      <div className="actions">

        <button
          onClick={handleEdit}
          aria-label="Edit card"
          className="icon-btn"
        >

          <img
            src={editIcon}
            className="icon"
            alt=""
          />

        </button>

        <button
          onClick={handleDelete}
          aria-label="Delete card"
          className="icon-btn"
        >

          <img
            src={trashIcon}
            className="icon"
            alt=""
          />

        </button>

      </div>

    </div>

  );

}

export default memo(CardRow);
