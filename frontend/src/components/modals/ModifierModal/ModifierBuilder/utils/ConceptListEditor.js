import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { Button, Chip, Tooltip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import clsx from 'clsx';
import { useFieldStyles } from 'styles/hooks';
import useStyles from '../../styles';
import { CodeSelectModal, VSACAuthenticationModal } from 'components/modals';
import { useSelector } from 'react-redux';
import { Lock as LockIcon } from '@material-ui/icons';

const ConceptListEditor = ({ onChange, singular, values }) => {
  const [showVSACAuthModal, setShowVSACAuthModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);

  const [showConceptModal, setShowConceptModal] = useState(false);
  const [editAtIndex, setEditAtIndex] = useState();
  const fieldStyles = useFieldStyles();
  const modalStyles = useStyles();

  const handleAddConcept = value => {
    let newValues = [...values].concat([value]);
    onChange(newValues);
  };

  const handleEditConcept = (index, value) => {
    let newValues = [...values];
    newValues.splice(index, 1, value);
    onChange(newValues);
  };

  const handleDeleteConcept = index => {
    let newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <>
      {Boolean(vsacApiKey) && (
        <>
          <div className={modalStyles.verticalAlign}>
            <Autocomplete
              className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm, modalStyles.noMarginBottom)}
              disableClearable
              disabled
              freeSolo
              multiple
              options={[]}
              onChange={(event, values) => onChange(values)}
              renderInput={params => <TextField {...params} label="Concept(s)" variant="outlined" />}
              renderTags={tags => {
                return tags.map((tag, index) => (
                  <>
                    <Tooltip arrow title={tag.display || tag.code || ''}>
                      <Chip
                        className={modalStyles.conceptChip}
                        label={tag.display || tag.code}
                        onClick={() => {
                          setEditAtIndex(index);
                          setShowConceptModal(true);
                        }}
                        onDelete={() => handleDeleteConcept(index)}
                      ></Chip>
                    </Tooltip>
                  </>
                ));
              }}
              value={values}
            />
            <Tooltip
              arrow
              title={
                singular && values.length === 1
                  ? 'Only one concept is allowed for this resource. Another cannot be added.'
                  : ''
              }
            >
              <Button
                className={modalStyles.compactTextButton}
                onClick={() => {
                  if (!singular || values.length !== 1) {
                    setEditAtIndex(undefined);
                    setShowConceptModal(true);
                  }
                }}
              >
                Add Concept
              </Button>
            </Tooltip>
          </div>

          {showConceptModal && (
            <CodeSelectModal
              handleCloseModal={() => setShowConceptModal(false)}
              handleSelectCode={
                editAtIndex === undefined
                  ? concept => handleAddConcept(concept)
                  : concept => handleEditConcept(editAtIndex, concept)
              }
              isConcept={true}
              initialValue={editAtIndex === undefined ? undefined : values[editAtIndex]}
            ></CodeSelectModal>
          )}
        </>
      )}

      {!Boolean(vsacApiKey) && (
        <>
          <Button
            color="primary"
            onClick={() => setShowVSACAuthModal(true)}
            variant="contained"
            startIcon={<LockIcon />}
          >
            Authenticate VSAC
          </Button>
          {showVSACAuthModal && <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthModal(false)} />}
        </>
      )}
    </>
  );
};

ConceptListEditor.propTypes = {
  onChange: propTypes.func.isRequired,
  values: propTypes.array.isRequired
};
export default ConceptListEditor;
