import React, { FC } from 'react';
import { Button, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import notFoundImage from 'images/pageNotFound.svg';

import useRouter from 'hooks/useRouter';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  notFoundImage: {
    width: '50%'
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const NotFoundPage: FC = () => {
  const classes = useStyles();
  const { history } = useRouter();

  const onClickHandler: React.MouseEventHandler = event => {
    event.preventDefault();

    history.push('/employees');
  };

  return (
    <div className={classes.root}>
      <Typography align='center' variant='h1'>
        404: The page you are looking for isn’t here
      </Typography>
      <Typography align='center' variant='subtitle2' color='textSecondary'>
        You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
      </Typography>
      <Grid container direction='row' justify='center' alignItems='center'>
        <img src={notFoundImage} alt='notFoundImage' className={classes.notFoundImage} />
      </Grid>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Button variant='outlined' color='primary' className={classes.button} onClick={onClickHandler}>
          Back To Home
        </Button>
      </Grid>
    </div>
  );
};

export default NotFoundPage;
