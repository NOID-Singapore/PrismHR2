import React, { FC, Fragment, useCallback, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import axios, { CancelTokenSource } from 'axios';
import { format, getDaysInMonth } from 'date-fns';

import useDebounce from 'hooks/useDebounce';
import SearchInput from 'components/SearchInput';
import EmployeeTable from './components/EmployeeTable';
import ActionSnackBar from 'components/ActionSnackBar';
import EmployeeUploadModal from './components/EmployeeUploadModal';
import AttandanceUploadModal from './components/AttandanceUploadModal';
import AttendanceLunchHourModal from './components/AttendanceLunchHourModal';
import CalculateAndExportPopper from './components/CalculateAndExportPopper';
import DialogPaper from './components/DialogPaper';
import imageLoader from 'images/imageLoader.gif';
import HeaderForExportDeskeraEmployeePay from 'typings/enum/HeaderForExportDeskeraEmployeePay';

import UploadIcon from '@material-ui/icons/PersonAdd';
import UploadDocIcon from '@material-ui/icons/InsertDriveFile';
import AddLunchHourIcon from '@material-ui/icons/Alarm';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { CurrentPageContext } from 'contexts/CurrentPageContext';
import {
  Backdrop,
  Button,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core';
import { PopperPlacementType } from '@material-ui/core/Popper';

import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import { EMPLOYEE_BASE_URL, PAY_BASE_URL, GET_PAY_TO_EXPORT_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(4)
  },
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  divider: {
    marginBottom: theme.spacing(4)
  },
  paper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: 'auto'
  },
  headerFlex: {
    display: 'flex'
  },
  otherTextCell: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1.5)
  },
  leftHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  rightHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(1.5)
  },
  icon: {
    fontSize: 20
  },
  toolbarButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    width: '3%',
    marginLeft: theme.spacing(-1.5)
  }
}));

const EmployeesPage: FC = () => {
  useCurrentPageTitleUpdater('Employees');

  const classes = useStyles();
  const { currentPageTitle } = useContext(CurrentPageContext);

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isSearchingEmployee, setSearchingEmployee] = useState<boolean>(false);
  const [isSearchEmployeeError, setSearchEmployeeError] = useState<boolean>(false);
  const [employees, setEmployees] = useState<EmployeeDetailsModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openUploadForm, setOpenUploadForm] = useState<boolean>(false);
  const [employeesToImport, setEmployeesToImport] = useState<EmployeeDetailsModel[]>([]);
  const [employeesToImportError, setEmployeesToImportError] = useState<string>('');

  const [openUploadAttandanceForm, setOpenUploadAttandanceForm] = useState<boolean>(false);
  const [attendancesToImport, setAttendancesToImport] = useState<AttendancesModel[]>([]);
  const [attendancesToImportError, setAttendancesToImportError] = useState<string>('');

  const [openAttandanceLunchHourForm, setOpenAttandanceLunchHourForm] = useState<boolean>(false);

  const [anchorElCalculate, setAnchorElCalculate] = useState<HTMLButtonElement | null>(null);
  const [openCalculatePopper, setOpenCalculatePopper] = useState<boolean>(false);
  const [placementCalculatePopper, setPlacementCalculatePopper] = useState<PopperPlacementType>('bottom-end');

  const [selectedMonthForCalculate, setSelectedMonthForCalculate] = useState<Date | null>(new Date());

  const [anchorElExport, setAnchorElExport] = useState<HTMLButtonElement | null>(null);
  const [openExportPopper, setOpenExportPopper] = useState<boolean>(false);
  const [placementExportPopper, setPlacementExportPopper] = useState<PopperPlacementType>('bottom-end');

  const [selectedMonthForExport, setSelectedMonthForExport] = useState<Date | null>(new Date());

  const [isProcess, setProcess] = useState<boolean>(false);
  const [isLoadingPage, setLoadingPage] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<'calculate' | 'export'>('calculate');

  const [deskeraHeaders, setDeskeraHeaders] = useState<CsvHeaderModel[]>([]);
  const [deskeraEmployeePay, setDeskeraEmployeePay] = useState<ExportDeskeraEmployeePay[]>([]);

  const [defaultHeaders, setDefaultHeaders] = useState<CsvHeaderModel[]>([]);
  const [defaultEmployeePay, setDefaultEmployeePay] = useState<any[]>([]);

  // Search Employee whenever rowsPerPage, currentPage, queryString changes
  const fetchData = useCallback(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchEmployee = async () => {
      setSearchingEmployee(true);
      setSearchEmployeeError(false);

      try {
        const url = `${EMPLOYEE_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setEmployees(data.employees);
      } catch (err) {
        setSearchEmployeeError(true);
      }

      setSearchingEmployee(false);
    };

    searchEmployee();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  const handleSearch = useCallback((searchQuery: string) => {
    performActionAndRevertPage(setQueryString, searchQuery);
  }, []);

  const debouncedSearchTerm = useDebounce(query, 500);
  // Load client data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };

  const handleOpenUploadForm = () => {
    setSelectedMonthForExport(new Date());
    setOpenExportPopper(false);
    setSelectedMonthForCalculate(new Date());
    setOpenCalculatePopper(false);
    setOpenUploadForm(true);
  };

  const handleCancelOpenUploadForm = () => {
    setOpenUploadForm(false);
  };

  const addNewEmployee = (newEmployees: EmployeeDetailsModel[], count: number) => {
    setCount(count);
    return newEmployees.map(newEmployee => {
      newEmployee.new = true;
      setEmployees([...newEmployees]);
      return newEmployees;
    });
  };

  const handleOpenUploadAttandanceForm = () => {
    setSelectedMonthForExport(new Date());
    setOpenExportPopper(false);
    setSelectedMonthForCalculate(new Date());
    setOpenCalculatePopper(false);
    setOpenUploadAttandanceForm(true);
  };

  const handleCancelOpenAttandanceUploadForm = () => {
    setOpenUploadAttandanceForm(false);
  };

  const handleOpenAttendanceLunchHourForm = () => {
    setOpenAttandanceLunchHourForm(true);
  };

  const handleCancelOpenAttandanceLunchHourForm = () => {
    setOpenAttandanceLunchHourForm(false);
  };

  const handleOpenCalculatePopper = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCalculate(event.currentTarget);
    setOpenCalculatePopper(prev => placementCalculatePopper !== newPlacement || !prev);
    setPlacementCalculatePopper(newPlacement);
    setSelectedMonthForExport(new Date());
    setOpenExportPopper(false);
  };

  const handleOpenExportPopper = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElExport(event.currentTarget);
    setOpenExportPopper(prev => placementExportPopper !== newPlacement || !prev);
    setPlacementExportPopper(newPlacement);
    setSelectedMonthForCalculate(new Date());
    setOpenCalculatePopper(false);
  };

  const handleCalculatePay = async (selectedMonth: Date | null) => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    setOpenCalculatePopper(false);
    setProcess(true);
    setLoadingPage(true);
    try {
      const result = await axios.post(`${PAY_BASE_URL}`, { selectedMonth }, { cancelToken: cancelTokenSource.token });
      const thisMonth = format(new Date(), 'MM/yyyy');
      const selectedMonthByUser = selectedMonth && format(new Date(selectedMonth), 'MM/yyyy');
      if (thisMonth === selectedMonthByUser) {
        addNewEmployee(result.data.employeePay.slice(0, rowsPerPage - 1), result.data.employeePay.length);
      }
      setDialogType('export');

      const deskeraCsvHeader = Object.entries(HeaderForExportDeskeraEmployeePay);
      let deskeraCsvHeaders: CsvHeaderModel[] = [];
      for (const [key, label] of deskeraCsvHeader) {
        deskeraCsvHeaders.push({ label: label.toString(), key: key.toString() });
      }

      let deskeraCsvData: ExportDeskeraEmployeePay[] = [];
      for (const data of result.data.employeePay) {
        deskeraCsvData.push({
          userId: data.id,
          basicPay: data.totalRegularPay,
          totalExtraDaysPay: data.totalExtraDaysPay,
          totalPhDaysPay: data.totalPhDaysPay,
          totalToolboxPay: data.totalToolboxPay,
          totalTravelPay: data.totalTravelPay,
          totalLunchPay: data.totalLunchPay,
          totalOtPay: data.totalOtPay,
          totalExtraDaysOt: data.totalExtraDaysOtPay,
          totalPhDaysOt: data.totalPhDaysOtPay
        });
      }

      setDeskeraHeaders(deskeraCsvHeaders);
      setDeskeraEmployeePay(deskeraCsvData);

      const numberOfDaysInMonth: number = selectedMonth === null ? 0 : getDaysInMonth(selectedMonth);
      let defaultCsvHeaders: CsvHeaderModel[] = [
        { label: 'Month', key: 'monthYear' },
        { label: 'Employee name', key: 'name' },
        { label: 'Employee ID', key: 'id' }
      ];
      for (let i = 1; i <= numberOfDaysInMonth; i++) {
        defaultCsvHeaders.push({
          label: `Location = No. of hours (${selectedMonth && format(new Date(`${format(selectedMonth, 'yyyy-MM')}-${i}`), 'dd MMM yyyy')})`,
          key: `locationAndTotalHourForDate-${i}`
        });
      }
      defaultCsvHeaders.push(
        { label: 'Total Regular Days', key: 'totalRegularDays' },
        { label: 'Total Extra Days', key: 'totalExtraDays' },
        { label: 'Total PH. Days', key: 'totalPhDays' },
        { label: 'Total OT hours', key: 'totalOtHours' },
        { label: 'Total Sunday OT hours', key: 'totalExtraDaysOt' },
        { label: 'Total PH. OT hours', key: 'totalPhDaysOt' },
        { label: 'Total Regular Pay', key: 'totalRegularPay' },
        { label: 'Total Extra Day Pay', key: 'totalExtraDaysPay' },
        { label: 'Total PH. Day Pay', key: 'totalPhDaysPay' },
        { label: 'Total Toolbox Pay', key: 'totalToolboxPay' },
        { label: 'Total Travel Pay', key: 'totalTravelPay' },
        { label: 'Total Lunch Pay', key: 'totalLunchPay' },
        { label: 'Total Reg. OT Pay', key: 'totalOtPay' },
        { label: 'Total Sunday OT Pay', key: 'totalExtraDaysOtPay' },
        { label: 'Total PH. OT Pay', key: 'totalPhDaysOtPay' },
        { label: 'Total Pay', key: 'totalPay' }
      );
      let defaultCsvData: any[] = [];
      let attendanceDataByDate: any[] = [];
      result.data.employeePay.map((payData: any, index: number) => {
        defaultCsvData.push({
          monthYear: payData.monthYear,
          name: payData.name,
          id: payData.id,
          totalRegularDays: payData.totalRegularDays,
          totalExtraDays: payData.totalExtraDays,
          totalPhDays: payData.totalPhDays,
          totalOtHours: payData.totalOtHours,
          totalExtraDaysOt: payData.totalExtraDaysOt,
          totalPhDaysOt: payData.totalPhDaysOt,
          totalRegularPay: payData.totalRegularPay,
          totalExtraDaysPay: payData.totalExtraDaysPay,
          totalPhDaysPay: payData.totalPhDaysPay,
          totalToolboxPay: payData.totalToolboxPay,
          totalTravelPay: payData.totalTravelPay,
          totalLunchPay: payData.totalLunchPay,
          totalOtPay: payData.totalOtPay,
          totalExtraDaysOtPay: payData.totalExtraDaysOtPay,
          totalPhDaysOtPay: payData.totalPhDaysOtPay,
          totalPay: payData.totalPay
        });
        for (let i = 1; i <= numberOfDaysInMonth; i++) {
          const shiftDate = selectedMonth && format(new Date(`${format(selectedMonth, 'yyyy-MM')}-${i}`), 'yyyy-MM-dd');
          const indexOfAttendance = result.data.employeeAttendance.findIndex(
            (element: any) => element.shiftDate === `${shiftDate}` && element.EmployeeId === `${payData.id}`
          );
          if (indexOfAttendance !== -1) {
            let resDataLocation = result.data.employeeAttendance[indexOfAttendance].location.split(',');
            let resDataTotalHour = result.data.employeeAttendance[indexOfAttendance].totalHour.split(',');
            let resLength = result.data.employeeAttendance[indexOfAttendance].location.split(',').length;
            attendanceDataByDate[i] = [];
            for (let j = 0; j < resLength; j++) {
              attendanceDataByDate[i].push(`${resDataLocation[j]} = ${resDataTotalHour[j]} Hr(s)`);
            }
            defaultCsvData[index][`locationAndTotalHourForDate-${i}`] = `${attendanceDataByDate[i].join(', ')}`;
          } else {
            defaultCsvData[index][`locationAndTotalHourForDate-${i}`] = '';
          }
        }
        return defaultCsvData;
      });
      setDefaultHeaders(defaultCsvHeaders);
      setDefaultEmployeePay(defaultCsvData);
      fetchData();
    } catch (err) {
      console.log(err);
    }
    setLoadingPage(false);
  };

  const handleExportPay = async (selectedMonth: Date | null) => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    setSelectedMonthForCalculate(selectedMonth);
    setOpenExportPopper(false);
    setProcess(true);
    setLoadingPage(true);
    try {
      const result = await axios.post(`${GET_PAY_TO_EXPORT_URL}`, { selectedMonth }, { cancelToken: cancelTokenSource.token });
      setDialogType('export');

      const deskeraCsvHeader = Object.entries(HeaderForExportDeskeraEmployeePay);
      let deskeraCsvHeaders: CsvHeaderModel[] = [];
      for (const [key, label] of deskeraCsvHeader) {
        deskeraCsvHeaders.push({ label: label.toString(), key: key.toString() });
      }

      let deskeraCsvData: ExportDeskeraEmployeePay[] = [];
      for (const data of result.data.employeePay) {
        deskeraCsvData.push({
          userId: data.id,
          basicPay: data.totalRegularPay,
          totalExtraDaysPay: data.totalExtraDaysPay,
          totalPhDaysPay: data.totalPhDaysPay,
          totalToolboxPay: data.totalToolboxPay,
          totalTravelPay: data.totalTravelPay,
          totalLunchPay: data.totalLunchPay,
          totalOtPay: data.totalOtPay,
          totalExtraDaysOt: data.totalExtraDaysOtPay,
          totalPhDaysOt: data.totalPhDaysOtPay
        });
      }

      setDeskeraHeaders(deskeraCsvHeaders);
      setDeskeraEmployeePay(deskeraCsvData);

      const numberOfDaysInMonth: number = selectedMonth === null ? 0 : getDaysInMonth(selectedMonth);
      let defaultCsvHeaders: CsvHeaderModel[] = [
        { label: 'Month', key: 'monthYear' },
        { label: 'Employee name', key: 'name' },
        { label: 'Employee ID', key: 'id' }
      ];
      for (let i = 1; i <= numberOfDaysInMonth; i++) {
        defaultCsvHeaders.push({
          label: `Location = No. of hours (${selectedMonth && format(new Date(`${format(selectedMonth, 'yyyy-MM')}-${i}`), 'dd MMM yyyy')})`,
          key: `locationAndTotalHourForDate-${i}`
        });
      }
      defaultCsvHeaders.push(
        { label: 'Total Regular Days', key: 'totalRegularDays' },
        { label: 'Total Extra Days', key: 'totalExtraDays' },
        { label: 'Total PH. Days', key: 'totalPhDays' },
        { label: 'Total OT hours', key: 'totalOtHours' },
        { label: 'Total Sunday OT hours', key: 'totalExtraDaysOt' },
        { label: 'Total PH. OT hours', key: 'totalPhDaysOt' },
        { label: 'Total Regular Pay', key: 'totalRegularPay' },
        { label: 'Total Extra Day Pay', key: 'totalExtraDaysPay' },
        { label: 'Total PH. Day Pay', key: 'totalPhDaysPay' },
        { label: 'Total Toolbox Pay', key: 'totalToolboxPay' },
        { label: 'Total Travel Pay', key: 'totalTravelPay' },
        { label: 'Total Lunch Pay', key: 'totalLunchPay' },
        { label: 'Total Reg. OT Pay', key: 'totalOtPay' },
        { label: 'Total Sunday OT Pay', key: 'totalExtraDaysOtPay' },
        { label: 'Total PH. OT Pay', key: 'totalPhDaysOtPay' },
        { label: 'Total Pay', key: 'totalPay' }
      );
      let defaultCsvData: any[] = [];
      let attendanceDataByDate: any[] = [];
      result.data.employeePay.map((payData: any, index: number) => {
        defaultCsvData.push({
          monthYear: payData.monthYear,
          name: payData.name,
          id: payData.id,
          totalRegularDays: payData.totalRegularDays,
          totalExtraDays: payData.totalExtraDays,
          totalPhDays: payData.totalPhDays,
          totalOtHours: payData.totalOtHours,
          totalExtraDaysOt: payData.totalExtraDaysOt,
          totalPhDaysOt: payData.totalPhDaysOt,
          totalRegularPay: payData.totalRegularPay,
          totalExtraDaysPay: payData.totalExtraDaysPay,
          totalPhDaysPay: payData.totalPhDaysPay,
          totalToolboxPay: payData.totalToolboxPay,
          totalTravelPay: payData.totalTravelPay,
          totalLunchPay: payData.totalLunchPay,
          totalOtPay: payData.totalOtPay,
          totalExtraDaysOtPay: payData.totalExtraDaysOtPay,
          totalPhDaysOtPay: payData.totalPhDaysOtPay,
          totalPay: payData.totalPay
        });
        for (let i = 1; i <= numberOfDaysInMonth; i++) {
          const shiftDate = selectedMonth && format(new Date(`${format(selectedMonth, 'yyyy-MM')}-${i}`), 'yyyy-MM-dd');
          const indexOfAttendance = result.data.employeeAttendance.findIndex(
            (element: any) => element.shiftDate === `${shiftDate}` && element.EmployeeId === `${payData.id}`
          );
          if (indexOfAttendance !== -1) {
            let resDataLocation = result.data.employeeAttendance[indexOfAttendance].location.split(',');
            let resDataTotalHour = result.data.employeeAttendance[indexOfAttendance].totalOtHour.split(',');
            let resLength = result.data.employeeAttendance[indexOfAttendance].location.split(',').length;
            attendanceDataByDate[i] = [];
            for (let j = 0; j < resLength; j++) {
              attendanceDataByDate[i].push(`${resDataLocation[j]} = ${resDataTotalHour[j]} Hr(s)`);
            }
            defaultCsvData[index][`locationAndTotalHourForDate-${i}`] = `${attendanceDataByDate[i].join(', ')}`;
          } else {
            defaultCsvData[index][`locationAndTotalHourForDate-${i}`] = '';
          }
        }
        return defaultCsvData;
      });
      setDefaultHeaders(defaultCsvHeaders);
      setDefaultEmployeePay(defaultCsvData);
    } catch (err) {
      console.log(err);
      setDialogType('calculate');
    }
    setLoadingPage(false);
  };

  const renderContentLoader = () => {
    if (isLoadingPage) {
      return <img src={imageLoader} alt='imageLoader' className={classes.loader} />;
    } else {
      if (isProcess) {
        return (
          <DialogPaper
            type={dialogType}
            selectedMonth={dialogType === 'export' ? selectedMonthForCalculate : selectedMonthForExport}
            handleResetCalculateAndExportAction={handleResetCalculateAndExportAction}
            handleCalculatePay={handleCalculatePay}
            deskeraHeaders={deskeraHeaders}
            deskeraEmployeePay={deskeraEmployeePay}
            defaultHeaders={defaultHeaders}
            defaultEmployeePay={defaultEmployeePay}
          />
        );
      } else {
        return <Fragment />;
      }
    }
  };

  const handleResetCalculateAndExportAction = () => {
    let timeout: NodeJS.Timeout;
    setLoadingPage(true);
    const promises1 = setAnchorElCalculate(null);
    const promises2 = setOpenCalculatePopper(false);
    const promises3 = setSelectedMonthForCalculate(new Date());
    const promises4 = setAnchorElExport(null);
    const promises5 = setOpenExportPopper(false);
    const promises6 = setSelectedMonthForExport(new Date());
    const promises7 = setDeskeraHeaders([]);
    const promises8 = setDeskeraEmployeePay([]);
    Promise.all([promises1, promises2, promises3, promises4, promises5, promises6, promises7, promises8]).then(() => {
      timeout = setTimeout(() => {
        setProcess(false);
        setLoadingPage(false);
      }, 500);
    });

    return () => {
      clearTimeout(timeout);
    };
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
      <Typography variant='h4' color='primary' gutterBottom>
        {currentPageTitle}
      </Typography>
      <Divider className={classes.divider} />
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-start' alignItems='center' className={classes.leftHeader}>
              <div className={classes.headerFlex}>
                <div className={classes.otherTextCell}>
                  <Typography variant='h5' color='primary'>
                    Employee List Overview
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction='row' justify='flex-end' alignItems='center' className={classes.rightHeader}>
              <SearchInput
                withBorder
                withTransition={false}
                width={150}
                placeHolder='Search Employee...'
                iconColor='#989898'
                tableSearchValue={query}
                setTableSearchValue={setQuery}
              />
              <Tooltip title='Upload Employee' placement='top'>
                <IconButton size='small' onClick={handleOpenUploadForm}>
                  <UploadIcon className={classes.icon} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Upload Attandance' placement='top'>
                <IconButton size='small' onClick={handleOpenUploadAttandanceForm}>
                  <UploadDocIcon className={classes.icon} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Add Lunch Hours' placement='top'>
                <IconButton size='small' onClick={handleOpenAttendanceLunchHourForm}>
                  <AddLunchHourIcon className={classes.icon} />
                </IconButton>
              </Tooltip>
              <CalculateAndExportPopper
                popperType='calculate'
                anchorEl={anchorElCalculate}
                open={openCalculatePopper}
                setOpen={setOpenCalculatePopper}
                placement={placementCalculatePopper}
                selectedMonth={selectedMonthForCalculate}
                setSelectedMonth={setSelectedMonthForCalculate}
                handleDoneAction={handleCalculatePay}
              />
              <Button
                color='primary'
                size='medium'
                variant='outlined'
                className={classes.toolbarButton}
                onClick={handleOpenCalculatePopper('bottom-end')}
              >
                Calculate Pay
              </Button>
              <CalculateAndExportPopper
                popperType='export'
                anchorEl={anchorElExport}
                open={openExportPopper}
                setOpen={setOpenExportPopper}
                placement={placementExportPopper}
                selectedMonth={selectedMonthForExport}
                setSelectedMonth={setSelectedMonthForExport}
                handleDoneAction={handleExportPay}
              />
              <Button
                color='primary'
                size='medium'
                variant='outlined'
                className={classes.toolbarButton}
                onClick={handleOpenExportPopper('bottom-end')}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <EmployeeTable
          isLoadingData={isSearchingEmployee}
          employees={employees}
          count={count}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          handleChangePage={(event, page) => setCurrentPage(page)}
          handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        />
        <EmployeeUploadModal
          open={openUploadForm}
          handleCancel={handleCancelOpenUploadForm}
          setEmployees={setEmployees}
          employeesToImport={employeesToImport}
          setEmployeesToImport={setEmployeesToImport}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleSetMessageSuccess={handleSetMessageSuccess}
          handleSetMessageError={handleSetMessageError}
          addNewEmployee={addNewEmployee}
          employeesToImportError={employeesToImportError}
          setEmployeesToImportError={setEmployeesToImportError}
        />
        <AttandanceUploadModal
          open={openUploadAttandanceForm}
          handleCancel={handleCancelOpenAttandanceUploadForm}
          attendancesToImport={attendancesToImport}
          setAttendancesToImport={setAttendancesToImport}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleSetMessageSuccess={handleSetMessageSuccess}
          handleSetMessageError={handleSetMessageError}
          attendancesToImportError={attendancesToImportError}
          setAttendancesToImportError={setAttendancesToImportError}
        />
        <AttendanceLunchHourModal
          open={openAttandanceLunchHourForm}
          handleCancel={handleCancelOpenAttandanceLunchHourForm}
          setOpenSnackbar={setOpenSnackbar}
          setSnackbarVarient={setSnackbarVarient}
          handleSetMessageSuccess={handleSetMessageSuccess}
          handleSetMessageError={handleSetMessageError}
        />
        <Modal
          aria-labelledby='spring-modal-title'
          aria-describedby='spring-modal-description'
          className={classes.modal}
          open={isProcess}
          disableBackdropClick
          disableAutoFocus
          disableEnforceFocus
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={isProcess}>{renderContentLoader()}</Fade>
        </Modal>
        <ActionSnackBar
          variant={snackbarVarient}
          message={snackbarVarient === 'success' ? messageSuccess : messageError}
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
        />
      </Paper>
    </Container>
  );
};

export default EmployeesPage;
