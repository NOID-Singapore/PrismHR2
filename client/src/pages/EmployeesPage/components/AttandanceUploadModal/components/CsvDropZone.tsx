import React, { FC, useState, useCallback } from 'react';
import UploadIcon from '@material-ui/icons/CloudUpload';

import { useDropzone } from 'react-dropzone';
import { CircularProgress, Grid, makeStyles, Paper, RootRef, Theme, Typography } from '@material-ui/core';
import { csvToJson } from 'utils';
import { format } from 'date-fns';

interface Props {
  label: string;
  setDataToImport: React.Dispatch<React.SetStateAction<AttendancesModel[]>>;
  delimeter: string;
  attendanceType: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
    top: '35%',
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
    setLoading,
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
          setLoading(true);
          const csvObject = csvToJson(`${reader.result}`, delimeter);

          let index = 0;
          try {
            csvObject.map(object => {
              index++;

              const getDate = `${Object.values(object)[3]}` + ',' + `${Object.values(object)[4]}`;
              const convertDate = new Date(getDate.replace(/"/g, ''));

              const shiftDate = format(convertDate, 'yyyy-MM-dd');
              const shiftStartTime = `${Object.values(object)[6]}`.replace(/"/g, '');
              const shiftEndTime = `${Object.values(object)[7]}`.replace(/"/g, '');

              const getTotalOtHour = `${Object.values(object)[11]}`.replace(/"/g, '');
              const splitTotalHour = getTotalOtHour.split(':');
              const getHour = Number(splitTotalHour[0]);
              const getMinute = Number(splitTotalHour[1]) / 60;
              const totalOtHour = getHour + getMinute;

              const location = `${Object.values(object)[15]}`.replace(/"/g, '');
              const EmployeeId = `${Object.values(object)[0]}`.replace(/"/g, '');

              attandances.push({
                shiftDate,
                attendanceType,
                shiftStartTime,
                shiftEndTime,
                lunchHours: 0,
                totalOtHour,
                location,
                EmployeeId
              });

              return attandances;
            });
            setOpenSnackbar(true);
            setSnackbarVarient('success');
            handleSetMessageSuccess('CSV format correct');
          } catch (err) {
            setOpenSnackbar(true);
            setSnackbarVarient('error');
            handleSetMessageError('CSV format wrong');
          }

          setDataToImport(attandances);
          if (index === csvObject.length) {
            setIsLoading(false);
            setLoading(false);
          } else {
            setIsLoading(true);
            setLoading(true);
          }
        };
        reader.readAsText(file);
      }
      setFileName(fileName);
    },
    [
      delimeter,
      setDataToImport,
      attendanceType,
      setIsLoading,
      handleSetMessageError,
      handleSetMessageSuccess,
      setOpenSnackbar,
      setSnackbarVarient,
      setLoading
    ]
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
