import React, { FC, useState, useEffect, useCallback, Fragment } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Grid, IconButton, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import { PopperPlacementType } from '@material-ui/core/Popper';
import { format } from 'date-fns';

import useRouter from 'hooks/useRouter';
import useDebounce from 'hooks/useDebounce';

import CalendarIcon from '@material-ui/icons/EventNote';

import PositionedPopper from 'components/PositionedPopper';
import SearchInput from 'components/SearchInput';
import PayHistoryTable from './components/PayHistoryTable';

import { PAY_BASE_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
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
  }
}));
const PayHistoryContent: FC = () => {
  const classes = useStyles();
  const { match } = useRouter();
  const employeeId = match.params.id;

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [isSearchingPayHistory, setSearchingPayHistory] = useState<boolean>(false);
  const [isSearchingPayHistoryError, setSearchPayHistoryError] = useState<boolean>(false);
  const [payHistories, setPayHistories] = useState<PaysModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCalendarPopper, setOpenCalendarPopper] = useState(false);
  const [anchorElCalendarPopper, setAnchorElCalendarPopper] = useState<HTMLElement | null>(null);
  const [placementCalendarPopper, setPlacementCalendarPopper] = useState<PopperPlacementType>();

  const [filterBy, setFilterBy] = useState<string>('');
  const [startMonth, setStartMonth] = useState<Date | null>(new Date());
  const [endMonth, setEndMonth] = useState<Date | null>(new Date());

  // Search Employee whenever rowsPerPage, currentPage
  const fetchData = useCallback(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();

      if (employeeId) {
        params.append('eid', employeeId.toString());
      }

      if (queryString) {
        params.append('q', queryString);
      }

      if (filterBy) {
        if (startMonth || endMonth) {
          params.append('fb', filterBy.toString());
          params.append('sd', startMonth !== null ? format(new Date(startMonth), 'yyyy-MM-dd').toString() : '');
          params.append('ed', endMonth !== null ? format(new Date(endMonth), 'yyyy-MM-dd').toString() : '');
        }
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchPayHistory = async () => {
      setSearchingPayHistory(true);
      setSearchPayHistoryError(false);

      try {
        const url = `${PAY_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setPayHistories(data.payHistories);
      } catch (err) {
        setSearchPayHistoryError(true);
      }

      setSearchingPayHistory(false);
    };

    searchPayHistory();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, employeeId, queryString, filterBy, startMonth, endMonth]);

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

  const handleCalendarFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenCalendarPopper(!openCalendarPopper);
    setAnchorElCalendarPopper(event.currentTarget);
    setPlacementCalendarPopper('bottom-end');
  };

  const renderDetailHeaderLabel = () => {
    if (filterBy) {
      if (filterBy === 'monthYear' && startMonth && endMonth) {
        return (
          <Typography variant='h6' color='primary'>
            (by Month {format(new Date(startMonth), 'MM/yyyy')} - {format(new Date(endMonth), 'MM/yyyy')})
          </Typography>
        );
      }
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container direction='row' justify='flex-start' alignItems='center' className={classes.leftHeader}>
            <div className={classes.headerFlex}>
              <div className={classes.otherTextCell}>
                <Typography variant='h5' color='primary'>
                  All Pay
                </Typography>
                {renderDetailHeaderLabel()}
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
              placeHolder='Search Pay...'
              iconColor='#989898'
              tableSearchValue={query}
              setTableSearchValue={setQuery}
            />
            <PositionedPopper
              openPopper={openCalendarPopper}
              setOpenPopper={setOpenCalendarPopper}
              anchorEl={anchorElCalendarPopper}
              placement={placementCalendarPopper}
              containerWidth={200}
              fadeTransition={350}
              popperComponent='monthRangePicker'
              options={[{ key: 'monthYear', label: 'Month' }]}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              startDate={startMonth}
              setStartDate={setStartMonth}
              endDate={endMonth}
              setEndDate={setEndMonth}
            />
            <Tooltip title='Calendar filter' placement='top'>
              <IconButton size='small' onClick={event => handleCalendarFilterClick(event)}>
                <CalendarIcon className={classes.icon} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <PayHistoryTable
        isLoadingData={isSearchingPayHistory}
        payHistories={payHistories}
        count={count}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
      />
    </Fragment>
  );
};

export default PayHistoryContent;
