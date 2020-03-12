import React, { FC, useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Table, TableBody, TableHead } from '@material-ui/core';
import axios, { CancelTokenSource } from 'axios';
import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';
import CreateEditHolidayForm from './components/CreateEditHolidayForm';
import { HOLIDAY_BASE_URL, GET_EDIT_HOLIDAY_URL } from 'constants/url';

interface Props {
  isLoadingData: boolean;
  holidays: HolidaysModels[];
  count: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  openCreateHoliday: boolean;
  handleCancelCreateHoliday(): void;
  openEditHoliday: boolean;
  holiday?: HolidaysModels;
  currentEditingHolidayIndex: number;
  handleOpenEditHoliday: (holidayIndex: number) => React.MouseEventHandler;
  handleCancelEditHoliday(): void;
  addNewHoliday(holiday: HolidaysModels): void;
  updateIndividualHoliday: (updatedHolidayProperties: Partial<HolidaysModels>, holidayIndex?: number) => void;
  deleteIndividualHoliday: (holidayIndex: number) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      overflowX: 'auto'
    }
  })
);

const HolidayTable: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    isLoadingData,
    holidays,
    count,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    openCreateHoliday,
    handleCancelCreateHoliday,
    openEditHoliday,
    holiday,
    currentEditingHolidayIndex,
    handleOpenEditHoliday,
    handleCancelEditHoliday,
    addNewHoliday,
    updateIndividualHoliday,
    deleteIndividualHoliday
  } = props;

  const dummyHoliday: HolidaysModels = {
    id: 0,
    holidayDate: new Date(),
    descriptions: ''
  };

  const [isLoading, setLoading] = useState<boolean>(false);

  const [holidayDate, setHolidayDate] = useState<Date | null>(new Date());
  const [descriptions, setDescriptions] = useState<string>('');

  const resetInputFormValues = () => {
    setHolidayDate(new Date());
    setDescriptions('');
  };

  const resetEditFormValues = useCallback(() => {
    if (!holiday) {
      return;
    }

    const { holidayDate, descriptions } = holiday;

    setHolidayDate(holidayDate);
    setDescriptions(descriptions);
  }, [holiday]);

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  useEffect(() => {
    if (!openEditHoliday) {
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
  }, [openEditHoliday, isLoadingData, resetEditFormValues]);

  const clearFormErrors = () => {
    // setDescriptions('');
  };

  const hanldeCloseCreateHoliday = () => {
    handleCancelCreateHoliday();
    resetInputFormValues();
    clearFormErrors();
  };

  const hanldeCloseEditHoliday = () => {
    handleCancelEditHoliday();
    resetInputFormValues();
    clearFormErrors();
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    setLoading(true);
    try {
      cancelTokenSource = axios.CancelToken.source();

      if (!openEditHoliday) {
        const response = await axios.post(`${HOLIDAY_BASE_URL}`, { holidayDate, descriptions }, { cancelToken: cancelTokenSource.token });
        addNewHoliday(response.data);
        handleSetMessageSuccess('Successfully added new holiday');
      } else {
        const response = await axios.put(
          `${GET_EDIT_HOLIDAY_URL(holiday!.id)}`,
          { holidayDate, descriptions },
          {
            cancelToken: cancelTokenSource.token
          }
        );
        updateIndividualHoliday(response.data);
        handleSetMessageSuccess('Successfully update holiday data');
      }
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      !openEditHoliday ? hanldeCloseCreateHoliday() : hanldeCloseEditHoliday();
    } catch (err) {
      if (!openEditHoliday) {
        handleSetMessageError('Failed to add new holiday date');
      } else {
        handleSetMessageError('Failed to edit holiday date');
      }
      setSnackbarVarient('error');
      setOpenSnackbar(true);
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Holiday Date', verticalAlign: 'top' },
              { label: 'Description', verticalAlign: 'top' },
              { label: 'Action', verticalAlign: 'top' }
            ]}
          />
        </TableHead>
        <TableBody>
          {openCreateHoliday && (
            <CreateEditHolidayForm
              holidayDate={holidayDate}
              setHolidayDate={setHolidayDate}
              descriptions={descriptions}
              setDescriptions={setDescriptions}
              isSubmitting={isLoading}
              onSubmit={handleOnSubmit}
              onCancel={hanldeCloseCreateHoliday}
              primaryButtonLabel={'Save'}
            />
          )}
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => (
                <BodyRow
                  isLoadingData={isLoadingData}
                  key={index}
                  holiday={dummyHoliday}
                  setOpenSnackbar={setOpenSnackbar}
                  setSnackbarVarient={setSnackbarVarient}
                  handleSetMessageSuccess={handleSetMessageSuccess}
                  handleSetMessageError={handleSetMessageError}
                  onEditHoliday={handleOpenEditHoliday(index)}
                  index={index}
                  deleteIndividualHoliday={deleteIndividualHoliday}
                />
              ))
            : holidays.map((holiday, index) =>
                openEditHoliday && currentEditingHolidayIndex === index ? (
                  <CreateEditHolidayForm
                    key={holiday.id}
                    holidayDate={holidayDate}
                    setHolidayDate={setHolidayDate}
                    descriptions={descriptions}
                    setDescriptions={setDescriptions}
                    isSubmitting={isLoading}
                    onSubmit={handleOnSubmit}
                    onCancel={hanldeCloseEditHoliday}
                    primaryButtonLabel={'Save'}
                    customBackground={'#F4F9FC'}
                  />
                ) : (
                  <BodyRow
                    isLoadingData={isLoadingData}
                    key={holiday.id}
                    holiday={holiday}
                    setOpenSnackbar={setOpenSnackbar}
                    setSnackbarVarient={setSnackbarVarient}
                    handleSetMessageSuccess={handleSetMessageSuccess}
                    handleSetMessageError={handleSetMessageError}
                    onEditHoliday={handleOpenEditHoliday(index)}
                    index={index}
                    deleteIndividualHoliday={deleteIndividualHoliday}
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

export default HolidayTable;
