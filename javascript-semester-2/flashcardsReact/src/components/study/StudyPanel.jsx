import React from 'react';

import FlashCard from './FlashCard.jsx';
import ModeSelect from './ModeSelect.jsx';
import Controls from './Controls.jsx';

class StudyPanel extends React.Component {
  render() {
    const {
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
    } = this.props;

    return (
      <div id="study">
        <div className="study-header">
          <div id="position">
            {total === 0
              ? '0 / 0'
              : `${position} / ${total}`}
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

        <button
          id="toggleList"
          onClick={onToggleList}
        >
          {showList ? 'Hide Cards' : 'Show Cards'}
        </button>

        <Controls
          onPrev={onPrev}
          onNext={onNext}
          onFlip={onFlip}
          onShuffle={onShuffle}
          onMark={onMark}
        />
      </div>
    );
  }
}

export default StudyPanel;
