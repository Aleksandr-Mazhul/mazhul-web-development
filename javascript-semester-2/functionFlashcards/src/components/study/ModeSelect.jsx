import React from 'react';

class ModeSelect extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return (
      <select
        value={value}
        onChange={onChange}
      >
        <option value="all">
          All
        </option>

        <option value="unlearned">
          Unlearned
        </option>
      </select>
    );
  }
}

export default ModeSelect;
