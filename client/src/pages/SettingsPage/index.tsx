import React, { FC, useState, useContext } from 'react';
import clsx from 'clsx';
import { Container, Divider, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { CurrentPageContext } from 'contexts/CurrentPageContext';
import SettingPageContents from 'typings/enum/SettingPageContents';

import SubMenu from './components/SubMenu';

import UsersPage from './pages/UsersPage';
import PublicHolidayPage from './pages/PublicHolidayPage';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  divider: {
    marginBottom: theme.spacing(4)
  },
  paper: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    margin: 'auto'
  },
  subMenuGrid: {
    borderRight: '1px solid #dcdcdc',
    maxWidth: theme.spacing(15)
  },
  content: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(0.2)
  },
  headerSubMenuTitleContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(0)
  },
  headerPageTitleContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2)
  },
  contentContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(0),
    paddingBottom: theme.spacing(2)
  }
}));

const SettingsPage: FC = () => {
  const classes = useStyles();
  const { currentPageTitle } = useContext(CurrentPageContext);

  const [selectedContent, setSelectedContent] = useState<SettingPageContents>(SettingPageContents.User);
  const selectedRenderContent = (selectedContent: SettingPageContents): React.MouseEventHandler => () => {
    setSelectedContent(selectedContent);
  };

  const SelectedPage: FC<{ page: SettingPageContents }> = props => {
    switch (props.page) {
      case SettingPageContents.User:
        return <UsersPage />;
      case SettingPageContents.PublicHoliday:
        return <PublicHolidayPage />;
      default:
        return <div />;
    }
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
      <Typography variant='h4' color='primary' gutterBottom>
        Settings - Account Information
      </Typography>
      <Divider className={classes.divider} />
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item className={classes.subMenuGrid}>
            <Container className={classes.headerSubMenuTitleContainer}>
              <Typography color='primary' variant='h6'>
                GENERAL
              </Typography>
            </Container>
            <SubMenu selectedRenderContent={selectedRenderContent} subMenuActive={selectedContent} />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction='column' spacing={2}>
              <Grid item xs>
                <Container className={classes.headerPageTitleContainer}>
                  <Typography color='primary' variant='h5'>
                    {currentPageTitle} Settings
                  </Typography>
                </Container>
                <Container className={classes.contentContainer}>
                  <SelectedPage page={selectedContent} />
                </Container>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
