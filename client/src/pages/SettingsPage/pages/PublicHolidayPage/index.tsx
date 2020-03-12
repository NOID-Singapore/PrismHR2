import React, { FC, Fragment, useState, useEffect, useCallback } from 'react';
import { Button, Grid, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import axios, { CancelTokenSource } from 'axios';

import SearchInput from 'components/SearchInput';
import useDebounce from 'hooks/useDebounce';
import HolidayTable from './components/HolidayTable';
import ActionSnackBar from 'components/ActionSnackBar';

import { HOLIDAY_BASE_URL } from 'constants/url';
import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));

const PublicHolidayPage: FC = () => {
  useCurrentPageTitleUpdater('Public Holiday');

  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [isSearchingHoliday, setSearchingHoliday] = useState<boolean>(false);
  const [isSearchHolidayError, setSearchHolidayError] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<HolidaysModels[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCreateHoliday, setOpenCreateHoliday] = useState<boolean>(false);
  const [openEditHoliday, setOpenEditHoliday] = useState<boolean>(false);
  const [currentEditingHolidayIndex, setCurrentEditingHolidayIndex] = useState<number>(0);

  // Search Holiday whenever rowsPerPage, currentPage, queryString changes
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

    const searchUser = async () => {
      setSearchingHoliday(true);
      setSearchHolidayError(false);

      try {
        const url = `${HOLIDAY_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setHolidays(data.holidays);
      } catch (err) {
        setSearchHolidayError(true);
      }

      setSearchingHoliday(false);
    };

    searchUser();

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
  // Load user data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  const handleOpenCreateHoliday = () => {
    setOpenCreateHoliday(true);
    setOpenEditHoliday(false);
  };

  const handleCancelCreateHoliday = () => {
    setOpenCreateHoliday(false);
  };

  const handleOpenEditHoliday = (holidayIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingHolidayIndex(holidayIndex);
    setOpenCreateHoliday(false);
    setOpenEditHoliday(true);
  };

  const handleCancelEditHoliday = () => {
    setOpenEditHoliday(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };

  const addNewHoliday = (holiday: HolidaysModels) => {
    holiday.new = true;
    holidays.unshift(holiday);
    setHolidays([...holidays].slice(0, rowsPerPage));
    setCount(c => c + 1);
  };

  const updateIndividualHoliday = (updatedHolidayProperties: Partial<HolidaysModels>, holidayIndex?: number) => {
    let currentEditingIndex: number;
    if (holidayIndex === undefined) {
      currentEditingIndex = currentEditingHolidayIndex;
    } else {
      currentEditingIndex = holidayIndex;
    }
    setHolidays(
      holidays!.map((holiday, index) => {
        if (index !== currentEditingIndex) {
          return holiday;
        }
        return Object.assign({}, holiday, updatedHolidayProperties);
      })
    );
  };

  const deleteIndividualHoliday = (holidayIndex: number) => {
    holidays.splice(holidayIndex, 1);
    setHolidays([...holidays]);
    setCount(c => c - 1);
  };

  return (
    <Fragment>
      <Grid container justify='space-between'>
        <SearchInput
          withBorder
          withTransition={false}
          width={150}
          placeHolder='Search Public Holiday...'
          iconColor='#989898'
          tableSearchValue={query}
          setTableSearchValue={setQuery}
        />
        <Button
          color='primary'
          size='medium'
          variant='outlined'
          className={classes.addButton}
          onClick={() => {
            handleOpenCreateHoliday();
          }}
        >
          <AddIcon className={classes.extendedIcon} />
          New Public Holiday
        </Button>
      </Grid>
      <ActionSnackBar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? messageSuccess : messageError}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
      <HolidayTable
        isLoadingData={isSearchingHoliday}
        holidays={holidays}
        count={count}
        updateIndividualHoliday={updateIndividualHoliday}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleSetMessageSuccess={handleSetMessageSuccess}
        handleSetMessageError={handleSetMessageError}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        openCreateHoliday={openCreateHoliday}
        handleCancelCreateHoliday={handleCancelCreateHoliday}
        addNewHoliday={addNewHoliday}
        openEditHoliday={openEditHoliday}
        holiday={holidays[currentEditingHolidayIndex]}
        currentEditingHolidayIndex={currentEditingHolidayIndex}
        handleOpenEditHoliday={handleOpenEditHoliday}
        handleCancelEditHoliday={handleCancelEditHoliday}
        deleteIndividualHoliday={deleteIndividualHoliday}
      />
    </Fragment>
  );
};

export default PublicHolidayPage;
