import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Table, TableBody, TableHead } from '@material-ui/core';

import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';

interface Props {
  isLoadingData: boolean;
  attendanceHistories: AttendancesModel[];
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

const EmploymentHistoryTable: FC<Props> = props => {
  const classes = useStyles();

  const { isLoadingData, attendanceHistories, count, currentPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  const dummyAttendanceHistory: AttendancesModel = {
    shiftDate: new Date(),
    attendanceType: '',
    shiftStartTime: new Date(),
    shiftEndTime: new Date(),
    totalHour: 0,
    location: '',
    createdAt: new Date(),
    updatedAt: new Date()
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

  // headerNameWithPaddings['headerName:pL:pR:pT:pB']
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Shift Date', pR: '10px', verticalAlign: 'top' },
              { label: 'Attendance Type', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Shift Start Time', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Shift End Time', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Hour', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Location', pL: '10px', pR: '10px', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => <BodyRow key={index} attendanceHistory={dummyAttendanceHistory} isLoadingData={isLoadingData} />)
            : attendanceHistories.map((attendanceHistory, index) => (
                <BodyRow key={index} attendanceHistory={attendanceHistory} isLoadingData={isLoadingData} />
              ))}
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

export default EmploymentHistoryTable;
