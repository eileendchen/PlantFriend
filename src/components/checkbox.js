import React from 'react';

const Checkbox = ({checked}) => (
  <div>
      <input type="checkbox" checked={checked} />
      Check
  </div>
);

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;