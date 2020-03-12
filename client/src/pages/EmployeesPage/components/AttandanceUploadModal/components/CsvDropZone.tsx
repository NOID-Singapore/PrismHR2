import React, { FC, useState, useCallback } from 'react';
import UploadIcon from '@material-ui/icons/CloudUpload';

import { useDropzone } from 'react-dropzone';
import { CircularProgress, Grid, makeStyles, Paper, RootRef, Theme, Typography } from '@material-ui/core';
import { csvToJson } from 'utils';
import { format, parse } from 'date-fns';
import { minutesConvertToHours, hoursConvertToMinutes } from 'utils';

interface Props {
  label: string;
  setDataToImport: React.Dispatch<React.SetStateAction<AttendancesModel[]>>;
  delimeter: string;
  attendanceType: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  dropZone: {
    padding: theme.spacing(2),
    minHeight: 104
  },
  responsiveScale: {
    width: '100%'
  },
  uploadIcon: {
    color: '#C4C4C4'
  },
  buttonProgress: {
    position: 'absolute',
    top: '55%',
    left: '45%'
  }
}));

const CsvDropZone: FC<Props> = props => {
  const classes = useStyles(props);
  const {
    label,
    setDataToImport,
    delimeter,
    attendanceType,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageError,
    handleSetMessageSuccess
  } = props;

  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = useCallback(
    acceptedFiles => {
      const reader = new FileReader();
      let file;
      let fileName;
      if (acceptedFiles[0] === undefined) {
        file = '';
        fileName = '';
      } else {
        file = acceptedFiles[0];
        fileName = acceptedFiles[0].name;
        let attandances: AttendancesModel[] = [];
        reader.onload = () => {
          setIsLoading(true);
          const csvObject = csvToJson(`${reader.result}`, delimeter);
          if (attendanceType === 'SATS') {
            let index = 0;
            csvObject.map(object => {
              index++;
              const shiftDate = `${Object.values(object)[3]}`.replace(/"/g, '');
              if (shiftDate === 'undefined') {
                setOpenSnackbar(true);
                setSnackbarVarient('error');
                handleSetMessageError('CSV format wrong');
              } else {
                setOpenSnackbar(true);
                setSnackbarVarient('success');
                handleSetMessageSuccess('CSV format correct');
                const shiftStartTime = `${Object.values(object)[4]}`.replace(/"/g, '');
                const shiftEndTime = `${Object.values(object)[5]}`.replace(/"/g, '');
                const totalHour = `${Object.values(object)[14]}`.replace(/"/g, '');
                const location = `${Object.values(object)[0]}`.replace(/"/g, '');
                const EmployeeId = `${Object.values(object)[1]}`.replace(/"/g, '');

                const totalHourSplit = totalHour.split('.');
                const totalWorkInMinutes = hoursConvertToMinutes(Number(totalHourSplit[0]), Number(totalHourSplit[1]));
                const totalWorkInHours = minutesConvertToHours(totalWorkInMinutes);

                attandances.push({
                  shiftDate: format(parse(shiftDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd'),
                  attendanceType,
                  shiftStartTime,
                  shiftEndTime,
                  totalHour: totalHourSplit.length > 1 ? totalWorkInHours.hours : Number(totalHour),
                  location,
                  EmployeeId
                });
              }
              return attandances;
            });
            setDataToImport(attandances);
            index === csvObject.length ? setIsLoading(false) : setIsLoading(true);
          } else {
            let index = 0;
            csvObject.map(object => {
              index++;
              const getDate = `${Object.values(object)[3]}`.split(' ');
              if (getDate[0] === 'undefined') {
                setOpenSnackbar(true);
                setSnackbarVarient('error');
                handleSetMessageError('CSV format wrong');
              } else {
                setOpenSnackbar(true);
                setSnackbarVarient('success');
                handleSetMessageSuccess('CSV format correct');

                const shiftDate = getDate[0].replace(/"/g, '');
                const shiftStartTime = `${Object.values(object)[5]}`.replace(/"/g, '');
                const shiftEndTime = `${Object.values(object)[6]}`.replace(/"/g, '');
                const totalHour = `${Object.values(object)[7]}`.replace(/"/g, '');
                const location = `${Object.values(object)[15]}`.replace(/"/g, '');
                const EmployeeId = `${Object.values(object)[0]}`.replace(/"/g, '');

                const totalHourSplit = totalHour.split(':');
                const totalWorkInMinutes = hoursConvertToMinutes(Number(totalHourSplit[0]), Number(totalHourSplit[1]));
                const totalWorkInHours = minutesConvertToHours(totalWorkInMinutes);
                attandances.push({
                  shiftDate: format(parse(shiftDate, 'MM/dd/yyyy', new Date()), 'yyyy-MM-dd'),
                  attendanceType,
                  shiftStartTime,
                  shiftEndTime,
                  totalHour: totalHourSplit.length > 1 ? totalWorkInHours.hours : Number(totalHour),
                  location,
                  EmployeeId
                });
              }
              return attandances;
            });
            setDataToImport(attandances);
            index === csvObject.length ? setIsLoading(false) : setIsLoading(true);
          }
        };
        reader.readAsText(file);
      }
      setFileName(fileName);
    },
    [delimeter, setDataToImport, attendanceType, setIsLoading, handleSetMessageError, handleSetMessageSuccess, setOpenSnackbar, setSnackbarVarient]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    multiple: false,
    onDrop
  });
  const { ref, ...rootProps } = getRootProps();

  return (
    <RootRef rootRef={ref}>
      <div className={classes.responsiveScale}>
        <Paper {...rootProps} className={classes.dropZone}>
          <Grid container spacing={1}>
            {isLoading ? (
              <CircularProgress size={50} className={classes.buttonProgress} />
            ) : (
              <Grid item container direction='column' justify='flex-start' alignItems='center'>
                <Typography variant='body1' color='textSecondary'>
                  {label}
                </Typography>
                <input {...getInputProps()} />
                <Typography variant='body1' color='textSecondary'>
                  {fileName === '' ? 'Click Or Drag file here' : fileName}
                </Typography>
                <UploadIcon fontSize='large' className={classes.uploadIcon} />
              </Grid>
            )}
          </Grid>
        </Paper>
      </div>
    </RootRef>
  );
};
export default CsvDropZone;
