import {memo, useCallback} from 'react';

import learnedIcon from '../../assets/icons/learned.svg';

function FlashCard({
                     card,
                     isFlipped,
                     onFlip,
                     onToggleLearned,
                   }) {

  const handleToggleLearned =
    useCallback((event) => {

      event.stopPropagation();

      onToggleLearned();

    }, [onToggleLearned]);

  if (!card) {

    return (

      <div id="card">

        <div className="note">
          No cards
        </div>

      </div>

    );

  }

  let className = 'note';

  if (isFlipped) {
    className += ' flipped';
  }

  if (card.learned) {
    className += ' learned';
  }

  return (

    <div
      id="card"
      onClick={onFlip}
    >

      <div className={className}>

        <div
          className={`badge ${
            card.learned
              ? 'visible'
              : ''
          }`}
          onClick={handleToggleLearned}
        >

          <img
            src={learnedIcon}
            className="icon"
            alt=""
          />

        </div>

        {
          isFlipped
            ? card.back
            : card.front
        }

      </div>

    </div>

  );

}

export default memo(FlashCard);
