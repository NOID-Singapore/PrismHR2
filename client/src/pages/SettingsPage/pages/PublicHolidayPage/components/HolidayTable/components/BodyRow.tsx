import React, { FC, useState, Fragment } from 'react';
import { TableRow, makeStyles, Theme, Typography, IconButton, Tooltip } from '@material-ui/core';
import { format } from 'date-fns';
import { green } from '@material-ui/core/colors';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import NewIcon from '@material-ui/icons/FiberNew';
import Skeleton from 'react-loading-skeleton';
import { StandardConfirmationDialog } from 'components/AppDialog';

import axios from 'axios';
import { GET_DELETE_HOLIDAY_URL } from 'constants/url';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  holiday: HolidaysModels;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  onEditHoliday: React.MouseEventHandler;
  index: number;
  deleteIndividualHoliday: (holidayIndex: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  wrapper: {
    position: 'relative'
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
    isLoadingData,
    holiday,
    onEditHoliday,
    index,
    deleteIndividualHoliday,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError
  } = props;
  const { id, holidayDate, descriptions, new: isNew } = holiday;

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isProcessing, setProcessing] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const actionWrapper = async (action: () => Promise<void>, actionStatus: string) => {
    setProcessing(true);

    try {
      await action();
      handleSetMessageSuccess(`Successfully ${actionStatus} holiday data`);
      setSnackbarVarient('success');
      setOpenSnackbar(true);
    } catch (err) {
      handleSetMessageError(`Failed to ${actionStatus} holiday data`);
      setSnackbarVarient('error');
      setOpenSnackbar(true);
    }

    setProcessing(false);
  };

  const deleteHoliday: React.MouseEventHandler<HTMLButtonElement> = async event => {
    await actionWrapper(async () => {
      await axios.delete(GET_DELETE_HOLIDAY_URL(id));
    }, 'delete');
    deleteIndividualHoliday(index);
  };

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='30%' isComponent={true}>
          <div className={classes.tableCellInner}>
            <Typography variant='body1'>{format(new Date(holidayDate), 'dd/MM/yyyy').toString() || <Skeleton width={100} />}</Typography>
            {isNew && (
              <div>
                <NewIcon fontSize='large' className={classes.newIcon} />
              </div>
            )}
          </div>
        </BodyCell>
        <BodyCell cellWidth='100%' isComponent={true}>
          {descriptions || <Skeleton width={100} height={25} />}
        </BodyCell>
        <BodyCell cellWidth='15%' isComponent={true}>
          {isLoadingData ? null : (
            <Fragment>
              <Tooltip title={'Edit'} placement='top'>
                <IconButton size='small' onClick={onEditHoliday} disabled={isProcessing}>
                  <EditIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title={'Delete'} placement='top'>
                <IconButton size='small' onClick={event => setOpenDialog(true)} disabled={isProcessing}>
                  <DeleteIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
            </Fragment>
          )}
        </BodyCell>
      </TableRow>
      <StandardConfirmationDialog
        variant={'warning'}
        message={'Are you sure you want to delete this?'}
        open={openDialog}
        handleClose={handleCloseDialog}
        onConfirm={deleteHoliday}
      />
    </Fragment>
  );
};

export default BodyRow;
