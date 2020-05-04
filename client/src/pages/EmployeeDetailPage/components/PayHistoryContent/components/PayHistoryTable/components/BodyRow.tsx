import React, { FC, Fragment } from 'react';
import NumberFormat from 'react-number-format';
import { makeStyles, TableRow, Typography } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  payHistory: PaysModel;
}

const useStyles = makeStyles(() => ({
  tableRow: {
    height: 64
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, payHistory } = props;
  const {
    monthYear,
    totalRegularDays,
    totalExtraDays,
    totalPhDays,
    totalToolbox,
    totalTravel,
    totalLunchHours,
    totalOtHours,
    totalExtraDaysOt,
    totalPhDaysOt,
    totalExtraDaysPay,
    totalPhDaysPay,
    totalToolboxPay,
    totalTravelPay,
    totalLunchPay,
    totalOtPay,
    totalExtraDaysOtPay,
    totalPhDaysOtPay,
    totalPay
  } = payHistory;

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='9.1%' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : monthYear}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalRegularDays}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalExtraDays ? totalExtraDays : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalPhDays ? totalPhDays : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalToolbox ? totalToolbox : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalTravel ? totalTravel : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalLunchHours ? totalLunchHours : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalOtHours ? totalOtHours : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalExtraDaysOt ? totalExtraDaysOt : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalPhDaysOt ? totalPhDaysOt : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalExtraDaysPay ? (
              <NumberFormat value={totalExtraDaysPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalPhDaysPay ? (
              <NumberFormat value={totalPhDaysPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalToolboxPay ? (
              <NumberFormat value={totalToolboxPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalTravelPay ? (
              <NumberFormat value={totalTravelPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalLunchPay ? (
              <NumberFormat value={totalLunchPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalOtPay ? (
              <NumberFormat value={totalOtPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalExtraDaysOtPay ? (
              <NumberFormat value={totalExtraDaysOtPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : totalPhDaysOtPay ? (
              <NumberFormat value={totalPhDaysOtPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$-'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? <Skeleton width={50} /> : <NumberFormat value={totalPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />}
          </Typography>
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default BodyRow;
