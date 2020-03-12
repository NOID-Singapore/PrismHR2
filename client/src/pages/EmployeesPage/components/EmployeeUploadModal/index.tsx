import React, { FC, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';

import { Button, CircularProgress, Grid, IconButton, makeStyles, Modal, Paper, Theme, Typography } from '@material-ui/core';
import { EMPLOYEE_BASE_URL } from 'constants/url';

import CloseIcon from '@material-ui/icons/Close';
import EmployeeCsvDropZone from './components/EmployeeCsvDropZone';

interface Props {
  open: boolean;
  handleCancel: () => void;
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeDetailsModel[]>>;
  employeesToImport: EmployeeDetailsModel[];
  setEmployeesToImport: React.Dispatch<React.SetStateAction<EmployeeDetailsModel[]>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  addNewEmployee(employee: EmployeeDetailsModel[], count: number): void;
  employeesToImportError: string;
  setEmployeesToImportError: React.Dispatch<React.SetStateAction<string>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 4,
    width: 400
  },
  headerFlex: {
    display: 'flex'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  textFieldFont: {
    fontSize: '13px',
    height: 18
  },
  cancelButton: {
    marginRight: theme.spacing(1)
  },
  addButton: {
    color: '#FFFFFF'
  },
  closeButton: {
    marginRight: theme.spacing(-1)
  },
  icon: {
    fontSize: 20
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

const EmployeeUploadModal: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    open,
    handleCancel,
    setEmployees,
    employeesToImport,
    setEmployeesToImport,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    addNewEmployee,
    employeesToImportError,
    setEmployeesToImportError
  } = props;
  const [isLoading, setLoading] = useState<boolean>(false);

  // This is to ensure that the form value and erors are reset/cleared when user canceled the editing
  const handleOnClose = () => {
    handleCancel();
    setEmployeesToImport([]);
  };

  const clearFormErrors = () => {
    setEmployeesToImportError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (employeesToImport.length === 0) {
      setEmployeesToImportError('Please choose your employee csv file');
      ret = false;
    }

    return ret;
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      const result = await axios.post(
        `${EMPLOYEE_BASE_URL}`,
        {
          employeesToImport
        },
        { cancelToken: cancelTokenSource.token }
      );
      setEmployees([]);
      addNewEmployee(result.data.newEmployee, result.data.count);
      handleSetMessageSuccess(`Successfully upload new employee(s)`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      handleCancel();
    } catch (err) {
      console.log(err);
      handleSetMessageError(`Failed to upload new employee(s)`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setLoading(false);
  };

  return (
    <Modal aria-labelledby='modal-title' open={open} disableBackdropClick={true}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-start' alignItems='center'>
              <div className={classes.headerFlex}>
                <div className={classes.otherTextCell}>
                  <Typography variant='h5' color='primary'>
                    Upload Employee
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-end' alignItems='center'>
              <IconButton size='small' onClick={handleOnClose} className={classes.closeButton}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <form noValidate onSubmit={handleOnSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EmployeeCsvDropZone
                label='Employee CSV File'
                setDataToImport={setEmployeesToImport}
                delimeter=','
                validationTitle={employeesToImportError}
              />
            </Grid>
            <Grid container item justify='flex-end'>
              <Button variant='contained' className={classes.cancelButton} onClick={handleOnClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='secondary' disabled={isLoading}>
                Upload
                {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};

export default EmployeeUploadModal;
