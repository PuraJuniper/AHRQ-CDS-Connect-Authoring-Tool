import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const NumberModifier = ({ handleUpdateModifier, name, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleOnChange = newValue => {
    const needsLeadingZero = newValue.startsWith('.') || newValue.startsWith('-.');
    handleUpdateModifier({ value: needsLeadingZero ? newValue.replace('.', '0.') : newValue });
  };

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>{name}:</div>

      <TextField
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXs)}
        fullWidth
        label="Value"
        type="number"
        onChange={event => handleOnChange(event.target.value)}
        value={value || value === 0 ? value : ''}
      />
    </div>
  );
};

NumberModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default NumberModifier;
