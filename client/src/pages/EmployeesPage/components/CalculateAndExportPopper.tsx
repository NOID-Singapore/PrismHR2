import React, { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import Popper, { PopperPlacementType } from '@material-ui/core/Popper';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { Button, Fade, Grid, makeStyles, Paper, Theme, withStyles } from '@material-ui/core';

interface Props {
  popperType: 'calculate' | 'export';
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placement: PopperPlacementType;
  selectedMonth: Date | null;
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>;
  handleDoneAction: (selectedMonth: Date | null) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  popper: {
    width: 200,
    zIndex: 99
  },
  paper: {
    borderRadius: '5px',
    padding: theme.spacing(1)
  },
  clearButton: {
    color: '#89BED3',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#53A0BE'
    },
    padding: theme.spacing(0)
  },
  textFieldFont: {
    fontSize: '12px',
    height: 18
  }
}));

const ClearButton = withStyles({
  label: {
    textTransform: 'capitalize',
    marginRight: 25
  }
})(Button);

const CloseButton = withStyles({
  label: {
    textTransform: 'capitalize',
    marginLeft: 25
  }
})(Button);

const CalculateAndExportPopper: FC<Props> = props => {
  const classes = useStyles(props);
  const { popperType, anchorEl, open, setOpen, placement, selectedMonth, setSelectedMonth, handleDoneAction } = props;

  const handleMonthChange = (date: Date | null) => {
    setSelectedMonth(date);
  };

  const handleClickClearButton = () => {
    setSelectedMonth(new Date());
  };

  const handleCloseCalendarPopper = () => {
    setOpen(false);
  };

  const renderPopper = () => {
    if (popperType === 'calculate') {
      return (
        <Popper open={open} anchorEl={anchorEl} placement={placement} className={classes.popper} transition disablePortal>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={classes.paper}>
                <Grid container direction='row' justify='space-between' alignItems='flex-start'>
                  <ClearButton size='small' className={classes.clearButton} onClick={handleClickClearButton} disableRipple>
                    Clear
                  </ClearButton>
                  <CloseButton size='small' className={classes.clearButton} onClick={handleCloseCalendarPopper} disableRipple>
                    Close
                  </CloseButton>
                </Grid>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        fullWidth
                        autoOk
                        allowKeyboardControl
                        margin='dense'
                        id='startDate'
                        value={selectedMonth}
                        variant='inline'
                        inputVariant='outlined'
                        format='MMMM yyyy'
                        openTo='month'
                        views={['year', 'month']}
                        onChange={handleMonthChange}
                        InputProps={{
                          classes: {
                            input: classes.textFieldFont
                          }
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant='contained' color='primary' onClick={event => handleDoneAction(selectedMonth)}>
                      Done
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}
        </Popper>
      );
    } else {
      return (
        <Popper open={open} anchorEl={anchorEl} placement={placement} className={classes.popper} transition disablePortal>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={classes.paper}>
                <Grid container direction='row' justify='space-between' alignItems='flex-start'>
                  <ClearButton size='small' className={classes.clearButton} onClick={handleClickClearButton} disableRipple>
                    Clear
                  </ClearButton>
                  <CloseButton size='small' className={classes.clearButton} onClick={handleCloseCalendarPopper} disableRipple>
                    Close
                  </CloseButton>
                </Grid>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        fullWidth
                        autoOk
                        allowKeyboardControl
                        margin='dense'
                        id='startDate'
                        value={selectedMonth}
                        variant='inline'
                        inputVariant='outlined'
                        format='MMMM yyyy'
                        openTo='month'
                        views={['year', 'month']}
                        onChange={handleMonthChange}
                        InputProps={{
                          classes: {
                            input: classes.textFieldFont
                          }
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant='contained' color='primary' onClick={event => handleDoneAction(selectedMonth)}>
                      Done
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}
        </Popper>
      );
    }
  };

  return renderPopper();
};

export default CalculateAndExportPopper;
