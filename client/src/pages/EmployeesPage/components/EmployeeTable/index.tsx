import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Table, TableBody, TableHead } from '@material-ui/core';

import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';

interface Props {
  isLoadingData: boolean;
  employees: EmployeeDetailsModel[];
  count: number;
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

const useStyles = makeStyles(() => ({
  tableWrapper: {
    overflowX: 'auto'
  }
}));

const EmployeeTable: FC<Props> = props => {
  const classes = useStyles();

  const { isLoadingData, employees, count, currentPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  const dummyEmployee: EmployeeDetailsModel = {
    name: '',
    id: '',
    position: '',
    basicSalary: 0,
    hourPayRate: 0,
    otherDaysPayRate: 0,
    otPayRate: 0,
    totalLunchHours: 0,
    regularWorkHour: 0,
    totalRegularDays: 0,
    totalExtraDays: 0,
    totalPhDays: 0,
    totalOtHours: 0,
    totalExtraDaysOt: 0,
    totalPhDaysOt: 0,
    totalRegularPay: 0,
    totalExtraDaysPay: 0,
    totalPhDaysPay: 0,
    totalToolboxPay: 0,
    totalTravelPay: 0,
    totalLunchPay: 0,
    totalOtPay: 0,
    totalExtraDaysOtPay: 0,
    totalPhDaysOtPay: 0,
    totalPay: 0
  };

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoadingData) {
      timeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);
    }

    setShowSkeleton(false);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoadingData]);

  // headerNameWithPaddings['headerName:pL:pR:pT:pB' 'verticalAlign:top|mid|bottom']
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Name', pR: '10px', verticalAlign: 'top' },
              { label: 'Id', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Reg. Days', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Sundays', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Ph Days', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Reg. OT. Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Lunch Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Sunday OT. Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total PH. OT. Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Sundays Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Ph Days Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Toolbox Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Travel Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Lunch Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Reg. OT. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Sunday OT. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total PH. OT. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Action', pL: '10px', pR: '10px', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => <BodyRow key={index} index={index} employee={dummyEmployee} isLoadingData={isLoadingData} />)
            : employees.map((employee, index) => <BodyRow key={employee.id} index={index} employee={employee} isLoadingData={isLoadingData} />)}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[10, 30, 50]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Table>
    </div>
  );
};

export default EmployeeTable;
