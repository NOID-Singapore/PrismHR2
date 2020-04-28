import React, { FC, useState, useCallback } from 'react';
import UploadIcon from '@material-ui/icons/CloudUpload';

import { useDropzone } from 'react-dropzone';
import { Grid, makeStyles, Paper, RootRef, Theme, Typography } from '@material-ui/core';
import { csvToJson } from 'utils';

interface Props {
  label: string;
  setDataToImport: React.Dispatch<React.SetStateAction<EmployeeDetailsModel[]>>;
  delimeter: string;
  validationTitle: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  dropZone: {
    padding: theme.spacing(2),
    minHeight: 104
  },
  responsiveScale: {
    width: '100%'
  },
  defaultColor: {
    color: '#C4C4C4'
  },
  errorColor: {
    color: '#F44336'
  }
}));

const EmployeeCsvDropZone: FC<Props> = props => {
  const classes = useStyles(props);
  const { label, setDataToImport, delimeter, validationTitle } = props;

  const [fileName, setFileName] = useState<string>('');

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
        let employees: EmployeeDetailsModel[] = [];
        reader.onload = () => {
          const csvObject = csvToJson(`${reader.result}`, delimeter);
          csvObject.map(object => {
            const id = `${Object.values(object)[0]}`;
            const firstName = Object.values(object)[1];
            const middleName = Object.values(object)[2] ? ` ${Object.values(object)[2]}` : '';
            const lastName = Object.values(object)[3] ? ` ${Object.values(object)[3]}` : '';
            const position = Object.values(object)[4] ? `${Object.values(object)[4]}` : '';
            const name = `${firstName}${middleName}${lastName}`;
            const basicSalary = Object.values(object)[5] ? Number(Object.values(object)[5]) : 0;
            const hourPayRate = Object.values(object)[6] ? Number(Object.values(object)[6]) : undefined;
            const otherDaysPayRate = Object.values(object)[7] ? Number(Object.values(object)[7]) : undefined;
            const otPayRate = Object.values(object)[8] ? Number(Object.values(object)[8]) : undefined;
            const workHourPerDay = Object.values(object)[9] ? Number(Object.values(object)[9]) : 0;
            return employees.push({
              id,
              name,
              position,
              basicSalary,
              hourPayRate,
              otherDaysPayRate,
              otPayRate,
              workHourPerDay
            });
          });
          setDataToImport(employees);
        };
        reader.readAsText(file);
      }
      setFileName(fileName);
    },
    [delimeter, setDataToImport]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    multiple: false,
    onDrop
  });
  const { ref, ...rootProps } = getRootProps();

  const renderTitle = () => {
    if (fileName === '') {
      if (validationTitle !== '') {
        return validationTitle;
      } else {
        return 'Click Or Drag file here';
      }
    } else {
      return fileName;
    }
  };

  return (
    <RootRef rootRef={ref}>
      <div className={classes.responsiveScale}>
        <Paper {...rootProps} className={classes.dropZone}>
          <Grid container spacing={1}>
            <Grid item container direction='column' justify='flex-start' alignItems='center'>
              <Typography variant='body1' color='textSecondary'>
                {label}
              </Typography>
              <input {...getInputProps()} />
              <Typography
                variant='body1'
                className={fileName === '' ? (validationTitle !== '' ? classes.errorColor : classes.defaultColor) : classes.defaultColor}
              >
                {renderTitle()}
              </Typography>
              <UploadIcon
                fontSize='large'
                className={fileName === '' ? (validationTitle !== '' ? classes.errorColor : classes.defaultColor) : classes.defaultColor}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    </RootRef>
  );
};
export default EmployeeCsvDropZone;
