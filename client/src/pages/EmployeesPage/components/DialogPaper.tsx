import React, { FC } from 'react';
import SuccessIcon from '@material-ui/icons/CheckCircleOutlined';
import WarningIcon from '@material-ui/icons/ReportProblemOutlined';
import { format } from 'date-fns';
import { Button, Grid, makeStyles, Paper, Theme, Typography, withStyles } from '@material-ui/core';
import { green, orange } from '@material-ui/core/colors';
import { CSVLink } from 'react-csv';

interface Props {
  type: 'calculate' | 'export';
  selectedMonth: Date | null;
  handleCalculatePay: (selectedMonth: Date | null) => void;
  handleResetCalculateAndExportAction: () => void;
  deskeraHeaders: CsvHeaderModel[];
  deskeraEmployeePay: ExportDeskeraEmployeePay[];
  defaultHeaders: CsvHeaderModel[];
  defaultEmployeePay: ExportDeskeraEmployeePay[];
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    borderRadius: '5px',
    padding: theme.spacing(4)
  },
  successAvatarIcon: {
    fontSize: 80,
    color: green[500]
  },
  warningAvatarIcon: {
    fontSize: 80,
    color: orange[500]
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  exportToCsvButton: {
    textDecoration: 'none'
  }
}));

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#DE014E',
    '&:hover': {
      backgroundColor: '#AF013E'
    },
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: 200
  }
}))(Button);

const DialogPaper: FC<Props> = props => {
  const classes = useStyles();
  const {
    type,
    selectedMonth,
    handleResetCalculateAndExportAction,
    handleCalculatePay,
    deskeraHeaders,
    deskeraEmployeePay,
    defaultHeaders,
    defaultEmployeePay
  } = props;

  const renderDialog = () => {
    if (type === 'calculate') {
      return (
        <Paper className={classes.paper}>
          <Grid container justify='center' alignItems='center'>
            <WarningIcon className={classes.warningAvatarIcon} />
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='h5' color='primary'>
              {selectedMonth && format(new Date(selectedMonth), 'MMMM yyyy')} Pay
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='h5' color='primary'>
              not yet calculated!
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='body1' color='textPrimary'>
              Please calculate {selectedMonth && format(new Date(selectedMonth), 'MMMM yyyy')}
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='body1' color='textPrimary'>
              pay first before exporting
            </Typography>
          </Grid>
          <Grid container direction='column' justify='center' alignContent='center'>
            <Grid item container justify='center' alignItems='center'>
              <Button
                variant='contained'
                color='primary'
                size='small'
                className={classes.button}
                onClick={event => handleCalculatePay(selectedMonth)}
              >
                Calculate Now
              </Button>
            </Grid>
            <Grid item container justify='center' alignItems='center'>
              <Button variant='contained' size='small' className={classes.button} onClick={event => handleResetCalculateAndExportAction()}>
                Later
              </Button>
            </Grid>
          </Grid>
        </Paper>
      );
    } else {
      return (
        <Paper className={classes.paper}>
          <Grid container justify='center' alignItems='center'>
            <SuccessIcon className={classes.successAvatarIcon} />
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='h5' color='primary'>
              You have successfully calculated
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='h5' color='primary'>
              {selectedMonth && format(new Date(selectedMonth), 'MMMM yyyy')} Pay!
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='body1' color='textPrimary'>
              Do you want to export?
            </Typography>
          </Grid>
          <Grid container direction='row' justify='center' alignContent='center' spacing={2}>
            <Grid item xs={12} sm={6} container justify='center' alignItems='center'>
              <CSVLink
                data={defaultEmployeePay}
                headers={defaultHeaders}
                separator={','}
                filename={`SALARY ${selectedMonth && format(new Date(selectedMonth), 'MMMM yyyy').toUpperCase()} - FOREIGN WORKER.csv`}
                className={classes.exportToCsvButton}
              >
                <Button variant='contained' color='primary' size='small' className={classes.button}>
                  Export (default)
                </Button>
              </CSVLink>
            </Grid>
            <Grid item xs={12} sm={6} container justify='center' alignItems='center'>
              <CSVLink
                data={deskeraEmployeePay}
                headers={deskeraHeaders}
                separator={','}
                filename={`ManageComponentAmount ${selectedMonth && format(new Date(selectedMonth), 'MMMM yyyy')}.csv`}
                className={classes.exportToCsvButton}
              >
                <ColorButton variant='contained' color='primary' size='small'>
                  Export for Deskera
                </ColorButton>
              </CSVLink>
            </Grid>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='body1' color='textSecondary'>
              You still can export the file later on
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Typography variant='body1' color='textPrimary'>
              <span style={{ fontWeight: 500 }}>Employee List Overview</span> page
            </Typography>
          </Grid>
          <Grid container justify='center' alignItems='center'>
            <Button variant='contained' size='small' className={classes.button} onClick={event => handleResetCalculateAndExportAction()}>
              Done
            </Button>
          </Grid>
        </Paper>
      );
    }
  };
  return renderDialog();
};

export default DialogPaper;
