import React, { FC, useState } from 'react';
import {
  TableRow,
  makeStyles,
  Theme,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel,
  withStyles
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/EditOutlined';
import NewIcon from '@material-ui/icons/FiberNew';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';

import { GET_DEACTIVATE_USER_URL, GET_ACTIVATE_USER_URL } from 'constants/url';
import BodyCell from 'components/BodyCell';

interface Props {
  currentUserIndex: number;
  isLoadingData: boolean;
  user: UserDetailsModel;
  updateUser: (updatedUserProperties: Partial<UserDetailsModel>, userIndex?: number) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  onEditUser: React.MouseEventHandler;
}

const GreenSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: green[500]
    },
    '&$checked + $track': {
      backgroundColor: green[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  circle: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: '50%',
    display: 'inline-block',
    backgroundColor: green[500],
    marginRight: theme.spacing(1),
    content: "''"
  },
  wrapper: {
    position: 'relative'
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    zIndex: 1,
    top: -4,
    left: -4
  },
  newIcon: {
    color: green[500]
  },
  actionIcon: {
    fontSize: 20
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const {
    currentUserIndex,
    isLoadingData,
    user,
    updateUser,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    onEditUser
  } = props;
  const { id, displayName, email, active, new: isNew } = user;

  const [isProcessing, setProcessing] = useState<boolean>(false);

  const actionWrapper = async (action: () => Promise<void>) => {
    setProcessing(true);

    try {
      await action();
      setOpenSnackbar(true);
      handleSetMessageSuccess(active ? 'Successfully deactived user' : 'Successfully actived user');
      setSnackbarVarient('success');
    } catch (err) {
      setOpenSnackbar(true);
      handleSetMessageError('Failed to operation');
      setSnackbarVarient('error');
    }

    setProcessing(false);
  };

  const deactivateUser: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DEACTIVATE_USER_URL(id));
      updateUser({ active: false }, currentUserIndex);
    });
  };

  const activateUser: React.ChangeEventHandler<HTMLInputElement> = async event => {
    await actionWrapper(async () => {
      await axios.post(GET_ACTIVATE_USER_URL(id));
      updateUser({ active: true }, currentUserIndex);
    });
  };

  return (
    <TableRow className={classes.tableRow}>
      <BodyCell cellWidth='30%' isComponent={true}>
        <div className={classes.tableCellInner}>
          <div className={classes.wrapper}>
            {isProcessing && <CircularProgress size={44} thickness={4} className={classes.fabProgress} />}
            {isLoadingData ? (
              <Skeleton circle={true} height={50} width={50} />
            ) : (
              <Avatar className={classes.avatar}>{displayName[0].toUpperCase()}</Avatar>
            )}
          </div>
          <div className={classes.nameTextCell}>
            <Typography variant='body1'>{displayName || <Skeleton width={100} />}</Typography>
          </div>
          {isNew && (
            <div>
              <NewIcon fontSize='large' className={classes.newIcon} />
            </div>
          )}
        </div>
      </BodyCell>
      <BodyCell cellWidth='30%' isComponent={true}>
        {email || <Skeleton width={100} height={25} />}
      </BodyCell>
      <BodyCell cellWidth='20%' isComponent={true}>
        <div className={classes.tableCellInner}>
          {isLoadingData ? (
            <Skeleton width={100} height={25} />
          ) : (
            <React.Fragment>
              <FormControlLabel
                control={
                  <GreenSwitch checked={active ? true : false} onChange={active ? deactivateUser : activateUser} value='checkedB' color='primary' />
                }
                label={active ? 'Active' : 'Inactive'}
              />
            </React.Fragment>
          )}
        </div>
      </BodyCell>
      <BodyCell cellWidth='100%' isComponent={true}>
        {isLoadingData ? null : (
          <Tooltip title={'Edit'} placement='top'>
            <IconButton size='small' onClick={onEditUser} disabled={isProcessing}>
              <EditIcon className={classes.actionIcon} />
            </IconButton>
          </Tooltip>
        )}
      </BodyCell>
    </TableRow>
  );
};

export default BodyRow;
