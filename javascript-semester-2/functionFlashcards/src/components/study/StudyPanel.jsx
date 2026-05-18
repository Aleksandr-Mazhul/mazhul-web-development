import {memo} from 'react';

import FlashCard from './FlashCard.jsx';
import ModeSelect from './ModeSelect.jsx';
import Controls from './Controls.jsx';

function StudyPanel({
                      card,
                      isFlipped,
                      position,
                      total,
                      onFlip,
                      onPrev,
                      onNext,
                      onShuffle,
                      onMark,
                      onModeChange,
                      onToggleList,
                      showList,
                      mode,
                    }) {

  return (

    <div id="study">

      <div className="study-header">

        <div id="position">

          {
            total === 0
              ? '0 / 0'
              : `${position} / ${total}`
          }

        </div>

        <ModeSelect
          value={mode}
          onChange={onModeChange}
        />

      </div>

      <FlashCard
        card={card}
        isFlipped={isFlipped}
        onFlip={onFlip}
        onToggleLearned={onMark}
      />

      <Controls
        onPrev={onPrev}
        onNext={onNext}
        onFlip={onFlip}
        onShuffle={onShuffle}
        onMark={onMark}
      />

      <button
        id="toggleList"
        onClick={onToggleList}
      >

        ☰ {
        showList
          ? 'Hide Cards'
          : 'Show Cards'
      }

      </button>

    </div>

  );

}

export default memo(StudyPanel);
