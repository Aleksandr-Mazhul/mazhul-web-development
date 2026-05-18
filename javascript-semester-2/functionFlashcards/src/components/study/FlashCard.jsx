import {memo} from 'react';

import arrowLeft from '../../assets/icons/arrow-left.svg';
import arrowRight from '../../assets/icons/arrow-right.svg';
import flipIcon from '../../assets/icons/flip.svg';
import shuffleIcon from '../../assets/icons/shuffle.svg';
import learnedIcon from '../../assets/icons/learned.svg';

function Controls({
                    onPrev, onNext, onFlip, onShuffle, onMark,
                  }) {

  return (

    <div className="controls-wrapper">

      <div className="controls">

        <button
          onClick={onPrev}
          className="control-btn"
          data-tooltip="Previous"
        >
          <img
            src={arrowLeft}
            className="icon"
            alt=""
          />
        </button>

        <button
          onClick={onFlip}
          className="control-btn"
          data-tooltip="Flip"
        >
          <img
            src={flipIcon}
            className="icon"
            alt=""
          />
        </button>

        <button
          onClick={onNext}
          className="control-btn"
          data-tooltip="Next"
        >
          <img
            src={arrowRight}
            className="icon"
            alt=""
          />
        </button>

        <button
          onClick={onShuffle}
          className="control-btn"
          data-tooltip="Shuffle"
        >
          <img
            src={shuffleIcon}
            className="icon"
            alt=""
          />
        </button>

        <button
          onClick={onMark}
          className="control-btn"
          data-tooltip="Learned"
        >
          <img
            src={learnedIcon}
            className="icon"
            alt=""
          />
        </button>

      </div>

    </div>

  );

}

export default memo(Controls);
