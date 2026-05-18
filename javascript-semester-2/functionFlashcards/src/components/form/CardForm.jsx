import React from 'react';

class CardForm extends React.Component {
  render() {
    const {
      frontInput,
      backInput,
      onFrontChange,
      onBackChange,
      onSubmit,
      isEditing,
    } = this.props;

    return (
      <div id="form">
        <input
          placeholder="Front"
          value={frontInput}
          onChange={onFrontChange}
        />

        <input
          placeholder="Back"
          value={backInput}
          onChange={onBackChange}
        />

        <button onClick={onSubmit}>
          {isEditing ? 'Update' : 'Add'}
        </button>
      </div>
    );
  }
}

export default CardForm;
