import React, { FC } from 'react';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/styles';
import { Fade, Paper, Theme } from '@material-ui/core';
import EmployeeList from './EmployeeList';

interface Props {
  openPopper: boolean;
  setOpenPopper?: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: any;
  placement: any;
  isLoadingData?: boolean;
  query?: string;
  employees?: EmployeeDetailsModel[];
}

const useStyles = makeStyles((theme: Theme) => ({
  popper: {
    marginRight: theme.spacing(1),
    width: 400
  },
  paper: {
    borderRadius: '5px'
  }
}));

const CustomizedPopper: FC<Props> = props => {
  const classes = useStyles(props);
  const { openPopper, setOpenPopper, anchorEl, placement, isLoadingData, employees, query } = props;

  return (
    <Popper open={openPopper} anchorEl={anchorEl} placement={placement} className={classes.popper} transition disablePortal>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={classes.paper}>
            <EmployeeList isLoadingData={isLoadingData} employees={employees} query={query} setOpenPopper={setOpenPopper} />
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default CustomizedPopper;
