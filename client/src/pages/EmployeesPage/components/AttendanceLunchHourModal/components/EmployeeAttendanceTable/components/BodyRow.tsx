import React, { FC, Fragment } from 'react';

import { Avatar, makeStyles, TableRow, TextField, Theme, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import Skeleton from 'react-loading-skeleton';

import BodyCell from 'components/BodyCell';

interface Props {
  isLoadingData: boolean;
  employee: EmployeeDetailsModel[];
  setEmployee: React.Dispatch<React.SetStateAction<EmployeeDetailsModel[]>>;
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
  },
  textFieldFont: {
    height: 18,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2.5)
  }
}));

const BodyRow: FC<Props> = props => {
  const classes = useStyles();
  const { isLoadingData, employee, setEmployee } = props;

  const handleLunchHourChange = (luncHour: string, index: number) => {
    const currentEmployee = [...employee];
    currentEmployee[index].lunchHours = luncHour;
    setEmployee(currentEmployee);
  };

  const renderTable = () => {
    return employee.map((value, index) => {
      let initialName: any = [];

      if (value.name) {
        const splitedNames = value.name.split(' ');
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
        <TableRow className={classes.tableRow}>
          <BodyCell cellWidth='10%' pR='10px' isComponent={true}>
            <Typography variant='body1'>{isLoadingData ? <Skeleton width={150} /> : value.id}</Typography>
          </BodyCell>
          <BodyCell cellWidth='75%' pL='10px' pR='10px' isComponent={true}>
            <div className={classes.tableCellInner}>
              <div className={classes.wrapper}>
                {isLoadingData ? (
                  <Skeleton circle={true} height={36} width={36} />
                ) : (
                  <Avatar className={classes.avatar}>{initialName.join('')}</Avatar>
                )}
              </div>
              <div className={classes.nameTextCell}>
                <Typography variant='body1'>{isLoadingData ? <Skeleton width={280} /> : value.name}</Typography>
              </div>
            </div>
          </BodyCell>
          <BodyCell cellWidth='25%' pL='10px' pR='10px' isComponent={true}>
            <TextField
              margin='dense'
              fullWidth
              id='lunchHours'
              label='Lunch Hour'
              value={value.lunchHours === null ? 0 : value.lunchHours}
              onChange={event => handleLunchHourChange(event.target.value, index)}
              variant='outlined'
              autoComplete='off'
            />
          </BodyCell>
        </TableRow>
      );
    });
  };
  return <Fragment>{renderTable()}</Fragment>;
};

export default BodyRow;
