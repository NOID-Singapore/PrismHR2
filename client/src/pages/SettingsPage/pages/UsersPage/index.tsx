import React, { FC, Fragment, useState, useEffect, useCallback } from 'react';
import { Button, Grid, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import axios, { CancelTokenSource } from 'axios';

import SearchInput from 'components/SearchInput';
import useDebounce from 'hooks/useDebounce';
import UserTable from './components/UserTable';
import ActionSnackBar from 'components/ActionSnackBar';
import { USER_BASE_URL } from 'constants/url';

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

const UsersPage: FC = () => {
  useCurrentPageTitleUpdater('Users');

  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isSearchingUser, setSearchingUser] = useState<boolean>(false);
  const [isSearchUserError, setSearchUserError] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetailsModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [openEditUser, setOpenEditUser] = useState<boolean>(false);
  const [currentEditingUserIndex, setCurrentEditingUserIndex] = useState<number>(0);

  // Search User whenever rowsPerPage, currentPage, queryString changes
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
      setSearchingUser(true);
      setSearchUserError(false);

      try {
        const url = `${USER_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setUsers(data.users);
      } catch (err) {
        setSearchUserError(true);
      }

      setSearchingUser(false);
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

  const handleOpenCreateUser = () => {
    setOpenCreateUser(true);
    setOpenEditUser(false);
  };

  const handleCancelCreateUser = () => {
    setOpenCreateUser(false);
  };

  const handleOpenEditUser = (userIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingUserIndex(userIndex);
    setOpenCreateUser(false);
    setOpenEditUser(true);
  };

  const handleCancelEditUser = () => {
    setOpenEditUser(false);
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

  const addNewUser = (user: UserDetailsModel) => {
    user.new = true;
    users.unshift(user);
    setUsers([...users].slice(0, rowsPerPage));
    setCount(c => c + 1);
  };

  const updateIndividualUser = (updatedUserProperties: Partial<UserDetailsModel>, userIndex?: number) => {
    let currentEditingIndex: number;
    if (userIndex === undefined) {
      currentEditingIndex = currentEditingUserIndex;
    } else {
      currentEditingIndex = userIndex;
    }
    setUsers(
      users!.map((user, index) => {
        if (index !== currentEditingIndex) {
          return user;
        }

        return Object.assign({}, user, updatedUserProperties);
      })
    );
  };

  return (
    <Fragment>
      <Grid container justify='space-between'>
        <SearchInput
          withBorder
          withTransition={false}
          width={150}
          placeHolder='Search User...'
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
            handleOpenCreateUser();
          }}
        >
          <AddIcon className={classes.extendedIcon} />
          New User
        </Button>
      </Grid>
      <ActionSnackBar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? messageSuccess : messageError}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
      <UserTable
        isLoadingData={isSearchingUser}
        users={users}
        count={count}
        updateIndividualUser={updateIndividualUser}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleSetMessageSuccess={handleSetMessageSuccess}
        handleSetMessageError={handleSetMessageError}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        openCreateUser={openCreateUser}
        handleCancelCreateUser={handleCancelCreateUser}
        addNewUser={addNewUser}
        openEditUser={openEditUser}
        user={users[currentEditingUserIndex]}
        currentEditingUserIndex={currentEditingUserIndex}
        handleOpenEditUser={handleOpenEditUser}
        handleCancelEditUser={handleCancelEditUser}
      />
    </Fragment>
  );
};

export default UsersPage;
