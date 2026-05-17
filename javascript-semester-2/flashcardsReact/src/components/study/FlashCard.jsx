import React from 'react';

class FlashCard extends React.Component {
  handleToggleLearned = (event) => {
    const {onToggleLearned} = this.props;

    event.stopPropagation();

    onToggleLearned();
  };

  render() {
    const {
      card,
      isFlipped,
      onFlip,
    } = this.props;

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
          {card.learned  && (
            <div
              className="badge"
              onClick={this.handleToggleLearned}
            >
              ✓
            </div>
          )}

          {isFlipped
            ? card.back
            : card.front}
        </div>
      </div>
    );
  }
}

export default FlashCard;
