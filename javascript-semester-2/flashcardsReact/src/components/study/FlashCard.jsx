import React from 'react';

class FlashCard extends React.Component {
  handleToggleLearned = (event) => {
    event.stopPropagation();
    this.props.onToggleLearned();
  };

  render() {
    const {
      card,
      isFlipped,
      onFlip,
      onToggleLearned,
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
          {card.learned && onToggleLearned && (
            <div
              className="badge"
              onClick={this.handleToggleLearned}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  this.handleToggleLearned(event);
                }
              }}
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
