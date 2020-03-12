import React, { FC, useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Table, TableBody, TableHead } from '@material-ui/core';
import axios, { CancelTokenSource } from 'axios';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';
import { USER_BASE_URL, GET_EDIT_USER_URL } from 'constants/url';
import CreateEditUserForm from './components/CreateEditUserForm';

interface Props {
  isLoadingData: boolean;
  users: UserDetailsModel[];
  count: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  openCreateUser: boolean;
  handleCancelCreateUser(): void;
  openEditUser: boolean;
  user?: UserDetailsModel;
  currentEditingUserIndex: number;
  handleOpenEditUser: (userIndex: number) => React.MouseEventHandler;
  handleCancelEditUser(): void;
  addNewUser(user: UserDetailsModel): void;
  updateIndividualUser: (updatedUserProperties: Partial<UserDetailsModel>, userIndex?: number) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      overflowX: 'auto'
    }
  })
);

const UserTable: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    isLoadingData,
    users,
    count,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    openCreateUser,
    handleCancelCreateUser,
    openEditUser,
    user,
    currentEditingUserIndex,
    handleOpenEditUser,
    handleCancelEditUser,
    addNewUser,
    updateIndividualUser
  } = props;

  const dummyUser: UserDetailsModel = {
    id: 0,
    loginName: '',
    displayName: '',
    email: '',
    active: false
  };

  const [isLoading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const resetInputFormValues = () => {
    setName('');
    setEmail('');
  };

  const resetEditFormValues = useCallback(() => {
    if (!user) {
      return;
    }

    const { displayName, email } = user;

    setName(displayName);
    setEmail(email);
  }, [user]);

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  useEffect(() => {
    if (!openEditUser) {
      let timeout: NodeJS.Timeout;

      if (isLoadingData) {
        timeout = setTimeout(() => {
          setShowSkeleton(true);
        }, 500);
      }

      setShowSkeleton(false);
      resetInputFormValues();
      clearFormErrors();

      return () => {
        clearTimeout(timeout);
      };
    } else {
      resetEditFormValues();
      clearFormErrors();
    }
  }, [openEditUser, isLoadingData, resetEditFormValues]);

  const handleCloseCreateUser = () => {
    handleCancelCreateUser();
    resetInputFormValues();
    clearFormErrors();
  };

  const handleCloseEditUser = () => {
    handleCancelEditUser();
    resetInputFormValues();
    clearFormErrors();
  };

  const clearFormErrors = () => {
    setNameError('');
    setEmailError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!name || !name.trim()) {
      setNameError('Please enter name');
      ret = false;
    }
    if (!email || !email.trim()) {
      setEmailError('Please enter email name');
      ret = false;
    }
    return ret;
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();

      if (!openEditUser) {
        const response = await axios.post(
          `${USER_BASE_URL}`,
          {
            displayName: name,
            email
          },
          { cancelToken: cancelTokenSource.token }
        );
        addNewUser(response.data);
        handleSetMessageSuccess('Successfully added new user');
      } else {
        const response = await axios.put(
          `${GET_EDIT_USER_URL(user!.id)}`,
          {
            displayName: name,
            email
          },
          { cancelToken: cancelTokenSource.token }
        );
        updateIndividualUser(response.data);
        handleSetMessageSuccess('Successfully edited user data');
      }
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      !openEditUser ? handleCloseCreateUser() : handleCloseEditUser();
    } catch (err) {
      if (!openEditUser) {
        handleSetMessageError('Failed to add new user');
      } else {
        handleSetMessageError('Failed to edit user');
      }
      setSnackbarVarient('error');
      setOpenSnackbar(true);
      console.log(`err:${err}`);
    }
    setLoading(false);
  };
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Name', verticalAlign: 'top' },
              { label: 'Email', verticalAlign: 'top' },
              { label: 'Status', verticalAlign: 'top' },
              { label: 'Action', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {openCreateUser && (
            <CreateEditUserForm
              name={name}
              setName={setName}
              nameError={nameError}
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              isSubmitting={isLoading}
              onSubmit={handleOnSubmit}
              onCancel={handleCloseCreateUser}
              primaryButtonLabel={'Save'}
            />
          )}
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => (
                <BodyRow
                  currentUserIndex={index}
                  key={index}
                  user={dummyUser}
                  updateUser={updateIndividualUser}
                  setOpenSnackbar={setOpenSnackbar}
                  setSnackbarVarient={setSnackbarVarient}
                  handleSetMessageSuccess={handleSetMessageSuccess}
                  handleSetMessageError={handleSetMessageError}
                  onEditUser={handleOpenEditUser(index)}
                  isLoadingData={isLoadingData}
                />
              ))
            : users.map((user, index) =>
                openEditUser && currentEditingUserIndex === index ? (
                  <CreateEditUserForm
                    key={user.id}
                    name={name}
                    setName={setName}
                    nameError={nameError}
                    email={email}
                    setEmail={setEmail}
                    emailError={emailError}
                    isSubmitting={isLoading}
                    onSubmit={handleOnSubmit}
                    onCancel={handleCancelEditUser}
                    primaryButtonLabel={'Save'}
                    customBackground={'#F4F9FC'}
                  />
                ) : (
                  <BodyRow
                    currentUserIndex={index}
                    key={user.id}
                    user={user}
                    updateUser={updateIndividualUser}
                    setOpenSnackbar={setOpenSnackbar}
                    setSnackbarVarient={setSnackbarVarient}
                    handleSetMessageSuccess={handleSetMessageSuccess}
                    handleSetMessageError={handleSetMessageError}
                    onEditUser={handleOpenEditUser(index)}
                    isLoadingData={isLoadingData}
                  />
                )
              )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
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

export default UserTable;
