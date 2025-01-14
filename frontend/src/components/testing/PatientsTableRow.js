import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import { Button, Checkbox, TableRow, TableCell } from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import PatientCard from './PatientCard';
import PatientDetailsModal from './modals/PatientDetailsModal';
import { DeleteConfirmationModal } from 'components/modals';
import { Tooltip } from 'components/elements';
import { deletePatient } from 'queries/testing';
import { renderDate } from 'utils/dates';
import { getPatientBirthDate, getPatientGender, getPatientFullName, getPatientVersion } from 'utils/patients';
import { useTableStyles } from 'styles/hooks';

const PatientsTableRow = ({ isDisabled, isSelected, patient, togglePatient }) => {
  const [showConfirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: asyncDeletePatient } = useMutation(deletePatient, {
    onSuccess: () => queryClient.invalidateQueries('patients')
  });
  const tableStyles = useTableStyles();
  const patientName = getPatientFullName(patient);

  return (
    <TableRow>
      <TableCell>
        <Tooltip
          enabled={isDisabled}
          placement="top"
          title="To select this patient, first deselect all patients of other FHIR versions."
        >
          <Checkbox
            checked={isSelected}
            color="primary"
            disabled={isDisabled}
            inputProps={{ 'aria-label': patientName }}
            onChange={togglePatient}
          />
        </Tooltip>
      </TableCell>

      <TableCell>{patientName}</TableCell>
      <TableCell>{getPatientBirthDate(patient)}</TableCell>
      <TableCell>{getPatientGender(patient)}</TableCell>
      <TableCell>{getPatientVersion(patient)}</TableCell>
      <TableCell>{renderDate(patient.updatedAt)}</TableCell>

      <TableCell align="right" className={tableStyles.buttonsCell}>
        <Button
          color="primary"
          onClick={() => setShowPatientDetailsModal(true)}
          startIcon={<VisibilityIcon />}
          variant="contained"
        >
          View
        </Button>

        <Tooltip enabled={isSelected} placement="top" title="To delete this patient, first deselect it.">
          <Button
            color="secondary"
            disabled={isSelected}
            onClick={() => setConfirmDeleteModal(true)}
            startIcon={<DeleteIcon />}
            variant="contained"
          >
            Delete
          </Button>
        </Tooltip>

        {showPatientDetailsModal && (
          <PatientDetailsModal handleCloseModal={() => setShowPatientDetailsModal(false)} patient={patient} />
        )}

        {showConfirmDeleteModal && (
          <DeleteConfirmationModal
            deleteType="patient"
            handleCloseModal={() => setConfirmDeleteModal(false)}
            handleDelete={() => asyncDeletePatient({ patient })}
          >
            <PatientCard patient={patient} />
          </DeleteConfirmationModal>
        )}
      </TableCell>
    </TableRow>
  );
};

PatientsTableRow.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  patient: PropTypes.object.isRequired,
  togglePatient: PropTypes.func.isRequired
};

export default PatientsTableRow;
