import React from 'react';
import { Button, makeStyles, TableRow, TextField, Theme } from '@material-ui/core';

import BodyCell from 'components/BodyCell';
import clsx from 'clsx';

interface Props {
  name: string;
  email: string;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;

  nameError: string;
  emailError: string;

  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
  onCancel: React.MouseEventHandler;

  primaryButtonLabel: string;
  customBackground?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  userForm: {
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

const CreateEditUserForm: React.FC<Props> = props => {
  const classes = useStyles(props);

  const { name, setName, nameError } = props;
  const { email, setEmail, emailError } = props;

  const { onSubmit, onCancel } = props;
  const { isSubmitting } = props;

  const { primaryButtonLabel, customBackground } = props;

  return (
    <TableRow className={classes.userForm}>
      <BodyCell cellWidth='30%' isComponent={true}>
        <TextField
          margin='dense'
          required
          fullWidth
          className={clsx({ [classes.textFieldRoot]: customBackground })}
          id='name'
          label='Display Name'
          error={nameError !== ''}
          value={name}
          onChange={event => setName(event.target.value)}
          variant='outlined'
          autoComplete='off'
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
      <BodyCell cellWidth='30%' isComponent={true}>
        <TextField
          margin='dense'
          fullWidth
          className={clsx({ [classes.textFieldRoot]: customBackground })}
          id='email'
          label='Email'
          error={emailError !== ''}
          value={email}
          onChange={event => setEmail(event.target.value)}
          variant='outlined'
          autoComplete='off'
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
      <BodyCell cellWidth='20%' isComponent={true}>
        <TextField
          margin='dense'
          fullWidth
          disabled
          className={clsx({ [classes.textFieldRoot]: customBackground })}
          id='status'
          label='Status'
          value='Active'
          onChange={event => setEmail(event.target.value)}
          variant='outlined'
          autoComplete='off'
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
      <BodyCell cellWidth='20%' isComponent={true}>
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

export default CreateEditUserForm;
