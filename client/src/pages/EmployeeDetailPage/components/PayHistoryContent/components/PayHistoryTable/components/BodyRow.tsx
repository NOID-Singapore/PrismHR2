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
    totalRegularHours,
    totalExtraDays,
    toolbox,
    travel,
    lunchHours,
    totalOtHours,
    totalHours,
    totalRegularPay,
    totalExtraDaysPay,
    totalOtPay,
    totalPay
  } = payHistory;

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='9.1%' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : monthYear}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalRegularHours}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : toolbox ? toolbox : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : travel ? travel : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : lunchHours ? lunchHours : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalOtHours ? totalOtHours : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalHours}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalExtraDays ? totalExtraDays : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={50} /> : totalExtraDays ? totalExtraDays : '-'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='9.1%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : (
              <NumberFormat value={totalRegularPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            )}
          </Typography>
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
            ) : totalOtPay ? (
              <NumberFormat value={totalOtPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
