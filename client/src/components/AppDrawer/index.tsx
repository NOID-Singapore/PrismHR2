import { Divider, Drawer, IconButton, List, Theme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import EmployeesIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FC } from 'react';
import logo from '../../images/logo-2.png';
import DrawerItem from './components/DrawerItem';

interface Props {
  openDrawer: boolean;
  handleDrawerClose(): void;
}

const { REACT_APP_DRAWER_WIDTH = '240' } = process.env;

const useStyles = makeStyles((theme: Theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: +REACT_APP_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  logoContainer: {
    textAlign: 'center'
  },
  logo: {
    width: '35%',
    margin: `0px ${theme.spacing(8)}px`
  }
}));

const AppDrawer: FC<Props> = props => {
  const classes = useStyles();
  const { openDrawer, handleDrawerClose } = props;

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: clsx(classes.drawerPaper, !openDrawer && classes.drawerPaperClose)
      }}
      open={openDrawer}
    >
      <div className={classes.toolbarIcon}>
        <div className={classes.logoContainer}>
          <img src={logo} alt='' className={classes.logo} />
        </div>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <DrawerItem Icon={EmployeesIcon} path='/employees' label='Employees' />
        <Divider />
        <DrawerItem Icon={SettingsIcon} path='/settings' label='Settings' />
      </List>
    </Drawer>
  );
};

export default AppDrawer;
