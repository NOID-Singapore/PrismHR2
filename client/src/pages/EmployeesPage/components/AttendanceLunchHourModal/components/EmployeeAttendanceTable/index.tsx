import React, { FC, useState, useEffect, useCallback } from 'react';
import { makeStyles, Table, TableBody, TableHead } from '@material-ui/core';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';

interface Props {
  isLoadingData: boolean;
  attendances: EmployeeAttendancesModel[];
  setAttendances: React.Dispatch<React.SetStateAction<EmployeeAttendancesModel[]>>;
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

const EmployeeAttendanceTable: FC<Props> = props => {
  const classes = useStyles();

  const { isLoadingData, attendances, setAttendances, count, currentPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

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

  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'ID', pR: '10px', verticalAlign: 'top' },
              { label: 'Name', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Lunch Hour', pL: '10px', pR: '10px', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          <BodyRow attendance={attendances} setAttendance={setAttendances} isLoadingData={isLoadingData} />
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[100, 200, 500]}
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
export default EmployeeAttendanceTable;
