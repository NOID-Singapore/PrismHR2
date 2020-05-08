import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
  withStyles
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';

import EmployeeAttendanceTable from './components/EmployeeAttendanceTable';
import CloseIcon from '@material-ui/icons/Close';

import { GET_EDIT_ATTENDANCE_LUNCH_HOURS_URL, GET_ATTENDANCE_BY_SHIFT_DATE } from 'constants/url';

interface Props {
  open: boolean;
  handleCancel: () => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
}

const SaveButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: '#EF965A',
    '&:hover': {
      backgroundColor: orange[700]
    }
  }
}))(Button);

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
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  gridHeader: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  subHeader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column'
  },
  textFieldFont: {
    fontSize: '13px',
    height: 18
  },
  nextButton: {
    color: '#FFFFFF'
  },
  cancelButton: {
    marginRight: theme.spacing(3)
  },
  controlDiv: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2)
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

const AttendanceLunchHourModal: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const { open, handleCancel, setOpenSnackbar, setSnackbarVarient, handleSetMessageSuccess, handleSetMessageError } = props;
  const [isLoading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(100);
  const [isSearchingEmployee, setSearchingEmployee] = useState<boolean>(false);
  const [isSearchEmployeeError, setSearchEmployeeError] = useState<boolean>(false);
  const [attendances, setAttendances] = useState<EmployeeAttendancesModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [lunchHourDate, setLunchHourDate] = useState<Date | null>(new Date());

  // Search Employee whenever rowsPerPage, currentPage, queryString changes
  const fetchData = useCallback(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const searchEmployee = async () => {
      setSearchingEmployee(true);
      setSearchEmployeeError(false);

      try {
        const { data } = await axios.post(`${GET_ATTENDANCE_BY_SHIFT_DATE}`, { shiftDate: lunchHourDate });
        setCount(data.AttendanceShiftDate.length);
        setAttendances(data.AttendanceShiftDate);
      } catch (err) {
        setSearchEmployeeError(true);
      }

      setSearchingEmployee(false);
    };

    searchEmployee();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  const handleOnClose = () => {
    handleCancel();
    fetchData();
    setLunchHourDate(new Date());
  };

  const handleDateChange = async (date: Date | null) => {
    setLunchHourDate(date);
    try {
      const { data } = await axios.post(`${GET_ATTENDANCE_BY_SHIFT_DATE}`, { shiftDate: date });
      setCount(data.AttendanceShiftDate.length);
      setAttendances(data.AttendanceShiftDate);
    } catch (err) {
      setSearchEmployeeError(true);
    }
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();

      attendances.map(async value => {
        await axios.put(
          `${GET_EDIT_ATTENDANCE_LUNCH_HOURS_URL(value.EmployeeId)}`,
          {
            shiftDate: lunchHourDate,
            lunchHours: value.lunchHours
          },
          {
            cancelToken: cancelTokenSource.token
          }
        );
      });
      setOpenSnackbar(true);
      setSnackbarVarient('success');
      handleSetMessageSuccess('Lunch hour successfully added');
      handleOnClose();
    } catch (err) {
      console.log(err);
      setOpenSnackbar(true);
      setSnackbarVarient('error');
      handleSetMessageError('Lunch hour failed added');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} scroll='body' fullWidth={true} maxWidth='md'>
      <DialogTitle>
        <Typography variant='h4' color='primary'>
          Employee Lunch Hour
        </Typography>
        <IconButton size='small' className={classes.closeButton} onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Grid container>
          <Grid item xs={5} className={classes.gridHeader}>
            <Typography variant='h5' color='primary' className={classes.subHeader}>
              Please select date to add employee(s) lunch hour
            </Typography>
          </Grid>
          <Grid item xs={3} className={classes.gridHeader}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin='dense'
                required
                fullWidth
                id='lunchHour'
                label='Lunch Hour Date'
                value={lunchHourDate}
                variant='dialog'
                inputVariant='outlined'
                format='dd/MM/yyyy'
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                InputProps={{
                  classes: {
                    input: classes.textFieldFont
                  }
                }}
                InputLabelProps={{
                  className: classes.textFieldFont
                }}
                InputAdornmentProps={{ position: 'start' }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <EmployeeAttendanceTable
          isLoadingData={isSearchingEmployee}
          attendances={attendances}
          setAttendances={setAttendances}
          count={count}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          handleChangePage={(event, page) => setCurrentPage(page)}
          handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Grid container item justify='center' xs={12} sm={12} md={12} lg={12} xl={12} className={classes.controlDiv}>
          <Button variant='contained' className={classes.cancelButton} onClick={handleOnClose}>
            Cancel
          </Button>
          <SaveButton variant='contained' className={classes.nextButton} onClick={handleOnSubmit} disabled={isLoading}>
            Save
          </SaveButton>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AttendanceLunchHourModal;
