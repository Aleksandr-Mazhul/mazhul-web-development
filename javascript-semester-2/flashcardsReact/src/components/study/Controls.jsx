import React from 'react';

class Controls extends React.Component {
  render() {
    const {
      onPrev,
      onNext,
      onFlip,
      onShuffle,
      onMark,
    } = this.props;

    return (
      <div className="controls-wrapper">
        <div className="controls">
          <button onClick={onPrev}>
            ◀
          </button>

          <button onClick={onFlip}>
            Flip
          </button>

          <button onClick={onNext}>
            ▶
          </button>

          <button onClick={onShuffle}>
            Shuffle
          </button>

          <button
            id="mark"
            onClick={onMark}
          >
            ✓
          </button>
        </div>
      </div>
    );
  }
}

export default Controls;
