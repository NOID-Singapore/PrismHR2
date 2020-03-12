import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Button, makeStyles, TableRow, TextField, Theme } from '@material-ui/core';

import BodyCell from 'components/BodyCell';
import clsx from 'clsx';

interface Props {
  holidayDate: Date | null;
  descriptions: string;

  setHolidayDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setDescriptions: React.Dispatch<React.SetStateAction<string>>;

  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
  onCancel: React.MouseEventHandler;

  primaryButtonLabel: string;
  customBackground?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    height: 64
  },
  textFieldRoot: (props: Props) => ({
    backgroundColor: props.customBackground
  }),
  textFieldFont: {
    fontSize: '13px',
    height: 18
  },
  buttonContainer: {
    display: 'flex'
  },
  cancelButton: {
    marginRight: theme.spacing(1)
  }
}));

const CreateEditHolidayForm: React.FC<Props> = props => {
  const classes = useStyles(props);

  const { holidayDate, descriptions, setHolidayDate, setDescriptions } = props;
  const { isSubmitting, onSubmit, onCancel, primaryButtonLabel, customBackground } = props;

  const handleHolidayDateChange = (date: Date | null) => {
    setHolidayDate(date);
  };

  return (
    <TableRow className={classes.tableRow}>
      <BodyCell cellWidth='30%' isComponent={true}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin='dense'
            variant='dialog'
            inputVariant='outlined'
            required
            fullWidth
            className={clsx({ [classes.textFieldRoot]: customBackground })}
            id='holidayDate'
            label='Holiday Date'
            value={holidayDate}
            format='dd/MM/yyyy'
            onChange={handleHolidayDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
            InputProps={{
              classes: {
                input: classes.textFieldFont
              }
            }}
            InputLabelProps={{
              className: classes.textFieldFont
            }}
            InputAdornmentProps={{ position: 'start' }}
          />
        </MuiPickersUtilsProvider>
      </BodyCell>
      <BodyCell cellWidth='100%' isComponent={true}>
        <TextField
          margin='dense'
          variant='outlined'
          autoComplete='off'
          fullWidth
          className={clsx({ [classes.textFieldRoot]: customBackground })}
          id='descriptions'
          label='Descriptions'
          value={descriptions}
          onChange={event => setDescriptions(event.target.value)}
          InputProps={{
            classes: {
              input: classes.textFieldFont
            }
          }}
          InputLabelProps={{
            className: classes.textFieldFont
          }}
        />
      </BodyCell>
      <BodyCell cellWidth='15%' isComponent={true}>
        <div className={classes.buttonContainer}>
          <Button variant='contained' className={classes.cancelButton} onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} variant='contained' color='secondary' disabled={isSubmitting}>
            {primaryButtonLabel}
          </Button>
        </div>
      </BodyCell>
    </TableRow>
  );
};

export default CreateEditHolidayForm;
