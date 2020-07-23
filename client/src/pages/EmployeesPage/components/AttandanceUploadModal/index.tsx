import React, { FC, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';

import { Button, Grid, IconButton, makeStyles, Modal, Paper, Theme, Typography } from '@material-ui/core';
import { ATTENDANCE_BASE_URL } from 'constants/url';

import CloseIcon from '@material-ui/icons/Close';
import CsvDropZone from './components/CsvDropZone';

interface Props {
  open: boolean;
  handleCancel: () => void;
  attendancesToImport: AttendancesModel[];
  setAttendancesToImport: React.Dispatch<React.SetStateAction<AttendancesModel[]>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  attendancesToImportError: string;
  setAttendancesToImportError: React.Dispatch<React.SetStateAction<string>>;
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
  }
}));

const AttandanceUploadModal: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    open,
    handleCancel,
    attendancesToImport,
    setAttendancesToImport,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError
  } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [attendanceType, setAttendanceType] = useState<string>('DESKERA');

  // This is to ensure that the form value and erors are reset/cleared when user canceled the editing
  const handleOnClose = () => {
    handleCancel();
    setAttendanceType('DESKERA');
    setAttendancesToImport([]);
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      await axios.post(
        `${ATTENDANCE_BASE_URL}`,
        {
          attendancesToImport
        },
        { cancelToken: cancelTokenSource.token }
      );
      handleSetMessageSuccess(`Successfully upload attandance(s)`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      handleCancel();
      setAttendanceType('DESKERA');
    } catch (err) {
      console.log(err);
      handleSetMessageError(`Failed to upload attandance(s)`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
      setAttendanceType('DESKERA');
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
                    Upload Attandance
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
              <CsvDropZone
                label='Attandance(s) CSV File'
                setDataToImport={setAttendancesToImport}
                delimeter=','
                attendanceType={attendanceType}
                setLoading={setLoading}
                setOpenSnackbar={setOpenSnackbar}
                setSnackbarVarient={setSnackbarVarient}
                handleSetMessageSuccess={handleSetMessageSuccess}
                handleSetMessageError={handleSetMessageError}
              />
            </Grid>
            <Grid container item justify='flex-end'>
              <Button variant='contained' className={classes.cancelButton} onClick={handleOnClose}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='secondary' disabled={isLoading}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};

export default AttandanceUploadModal;
