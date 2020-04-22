import React, { FC, useState, useEffect } from 'react';
import { makeStyles, Table, TableBody, TableHead } from '@material-ui/core';

import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';

interface Props {
  isLoadingData: boolean;
  payHistories: PaysModel[];
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

const PayHistoryTable: FC<Props> = props => {
  const classes = useStyles();

  const { isLoadingData, payHistories, count, currentPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  const dummyPayHistory: PaysModel = {
    monthYear: '',
    hourPayRate: 0,
    otPayRate: 0,
    totalRegularDays: 0,
    totalExtraDays: 0,
    totalPhDays: 0,
    totalToolbox: 0,
    totalTravel: 0,
    totalLunchHours: 0,
    totalOtHours: 0,
    totalHours: 0,
    totalRegularPay: 0,
    totalExtraDaysPay: 0,
    totalPhDaysPay: 0,
    totalOtPay: 0,
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

  // headerNameWithPaddings['headerName:pL:pR:pT:pB']
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Month', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Reg. Days', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Extra Days', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total PH. Days', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Toolbox', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Travel', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Lunch Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total OT. Hours', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Reg. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Extra Days Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total OT. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total PH. Pay', pL: '10px', pR: '10px', verticalAlign: 'top' },
              { label: 'Total Pay', pL: '10px', pR: '10px', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => <BodyRow key={index} payHistory={dummyPayHistory} isLoadingData={isLoadingData} />)
            : payHistories.map((payHistory, index) => <BodyRow key={index} payHistory={payHistory} isLoadingData={isLoadingData} />)}
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

export default PayHistoryTable;
