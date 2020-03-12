import React, { FC, Fragment } from 'react';
import NumberFormat from 'react-number-format';

import { Avatar, IconButton, makeStyles, TableRow, Theme, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import ViewIcon from '@material-ui/icons/VisibilityTwoTone';
import NewIcon from '@material-ui/icons/FiberNewOutlined';
import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  employee: EmployeeDetailsModel;
  index: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  newIcon: {
    color: green[500],
    fontSize: 30
  },
  actionIcon: {
    fontSize: 20
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  nameTextCell: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2)
  },
  icon: {
    fontSize: 20
  },
  wrapper: {
    position: 'relative'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, employee } = props;
  const {
    name,
    id,
    totalRegularHours,
    totalExtraDays,
    totalOtHours,
    totalRegularPay,
    totalExtraDaysPay,
    totalOtPay,
    totalPay,
    new: isNew
  } = employee;

  const handleViewActionClick = () => {
    window.open(`/employees/${id}`, '_blank');
  };

  let initialName: any = [];
  if (name) {
    const splitedNames = name.split(' ');
    splitedNames.map((splitedName, index) => {
      if (index === 0 || index === splitedNames.length - 1) {
        if (splitedName[0]) {
          initialName.push(splitedName[0].toUpperCase());
        } else {
          initialName.push(splitedNames[index - 1][0] ? splitedNames[index - 1][0].toUpperCase() : '');
        }
      }
      return initialName;
    });
  }

  return (
    <Fragment>
      <TableRow className={classes.tableRow}>
        <BodyCell cellWidth='15%' pL='10px' pR='10px' isComponent={true}>
          <div className={classes.tableCellInner}>
            <div className={classes.wrapper}>
              {isLoadingData ? <Skeleton circle={true} height={36} width={36} /> : <Avatar className={classes.avatar}>{initialName.join('')}</Avatar>}
            </div>
            <div className={classes.nameTextCell}>
              <Typography variant='body1'>{isLoadingData ? <Skeleton width={280} /> : name}</Typography>
            </div>
            {isNew && (
              <div>
                <NewIcon className={classes.newIcon} />
              </div>
            )}
          </div>
        </BodyCell>
        <BodyCell cellWidth='10%' pR='10px' isComponent={true}>
          <Typography variant='body1'>{isLoadingData ? <Skeleton width={150} /> : id}</Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{totalRegularHours ? `${totalRegularHours}` : '0'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{totalExtraDays ? `${totalExtraDays}` : '0'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>{totalOtHours ? `${totalOtHours}` : '0'}</Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={150} />
            ) : totalRegularPay ? (
              <NumberFormat value={totalRegularPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$ -'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={150} />
            ) : totalExtraDaysPay ? (
              <NumberFormat value={totalExtraDaysPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$ -'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={150} />
            ) : totalOtPay ? (
              <NumberFormat value={totalOtPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$ -'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='10%' pL='10px' pR='10px' isComponent={true}>
          <Typography variant='body1'>
            {isLoadingData ? (
              <Skeleton width={150} />
            ) : totalPay ? (
              <NumberFormat value={totalPay} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            ) : (
              '$ -'
            )}
          </Typography>
        </BodyCell>
        <BodyCell cellWidth='5%' pL='25px' isComponent={true}>
          {isLoadingData ? (
            <Skeleton width={20} />
          ) : (
            <div>
              <IconButton size='small' onClick={event => handleViewActionClick()}>
                <ViewIcon className={classes.icon} />
              </IconButton>
            </div>
          )}
        </BodyCell>
      </TableRow>
    </Fragment>
  );
};

export default BodyRow;
