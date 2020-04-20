import React, { FC, Fragment } from 'react';
import { makeStyles, TableRow, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { ucWords } from 'utils';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  attendanceHistory: AttendancesModel;
}

const useStyles = makeStyles(() => ({
  tableRow: {
    height: 64
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, attendanceHistory } = props;
  const { shiftDate, attendanceType, shiftStartTime, shiftEndTime, totalOtHour, location } = attendanceHistory;

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='17%' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={70} /> : format(new Date(shiftDate), 'dd/MM/yyyy').toString()}</Typography>
        </BodyCell>
        <BodyCell cellWidth='17%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : ucWords(attendanceType)}</Typography>
        </BodyCell>
        <BodyCell cellWidth='17%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={60} /> : shiftStartTime}</Typography>
        </BodyCell>
        <BodyCell cellWidth='17%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={60} /> : shiftEndTime}</Typography>
        </BodyCell>
        <BodyCell cellWidth='15%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalOtHour}</Typography>
        </BodyCell>
        <BodyCell cellWidth='17%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={100} /> : location}</Typography>
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default BodyRow;
