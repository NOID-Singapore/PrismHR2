import React, { FC, useState, useEffect, useContext } from 'react';
import NumberFormat from 'react-number-format';
import axios, { CancelTokenSource } from 'axios';
import clsx from 'clsx';
import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import useRouter from 'hooks/useRouter';
import Skeleton from 'react-loading-skeleton';
import CustomizedTabs from 'components/CustomizedTabs';

import { CurrentPageContext } from 'contexts/CurrentPageContext';
import { Avatar, Container, Grid, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import AttendanceHistoryContent from './components/AttendanceHistoryContent';
import PayHistoryContent from './components/PayHistoryContent';
import { GET_EMPLOYEE_BY_ID_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(4)
  },
  container: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  gridName: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    height: 45,
    width: 45
  },
  contentTypography: {
    fontWeight: 500
  },
  paper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: 'auto'
  }
}));

const EmployeeDetailPage: FC = () => {
  useCurrentPageTitleUpdater('Employee Detail');
  const classes = useStyles();
  const { currentPageTitle } = useContext(CurrentPageContext);
  const { match } = useRouter();
  const params = match.params.id;
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const dummyEmployee: EmployeeDetailsModel = {
    name: '',
    id: '',
    position: '',
    basicSalary: 0,
    hourPayRate: 0,
    otherDaysPayRate: 0,
    otPayRate: 0,
    workHourPerDay: 0,
    totalRegularDays: 0,
    totalExtraDays: 0,
    totalOtHours: 0,
    totalRegularPay: 0,
    totalExtraDaysPay: 0,
    totalOtPay: 0,
    totalPay: 0
  };

  const [employee, setEmployee] = useState<EmployeeDetailsModel>(dummyEmployee);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const { data } = await axios.get(`${GET_EMPLOYEE_BY_ID_URL(params)}`, { cancelToken: cancelTokenSource.token });
        setEmployee(data.employee);
      } catch (err) {
        console.log(err);
      }
      setIsLoadingData(false);
    };
    loadData();
    return () => {
      cancelTokenSource.cancel();
    };
  }, [params]);

  const { name, position, basicSalary, hourPayRate, otherDaysPayRate, otPayRate, workHourPerDay } = employee!;

  let initialName: any = [];
  if (name) {
    const splitedNames = name.split(' ');
    splitedNames.map((splitedName, index) => {
      if (index === 0 || index === splitedNames.length - 1) {
        if (splitedName[0]) {
          initialName.push(splitedName[0].toUpperCase());
        } else {
          initialName.push(splitedNames[index - 1][0] ? splitedNames[index - 1][0].toUpperCase() : '');
        }
      }
      return initialName;
    });
  }

  const renderAvatar = () => {
    if (isLoadingData) {
      return <Skeleton circle={true} height={50} width={50} />;
    } else {
      return (
        <Avatar className={classes.avatar} aria-label='candidateInitial'>
          {initialName.join('')}
        </Avatar>
      );
    }
  };

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    action(actionParam);
  };

  const SelectedContent: FC<{ page: number }> = props => {
    switch (props.page) {
      case 0:
        return <AttendanceHistoryContent />;
      case 1:
        return <PayHistoryContent />;
      default:
        return <AttendanceHistoryContent />;
    }
  };

  return (
    <Container maxWidth='lg' className={clsx(classes.root, classes.container)}>
      <Typography variant='h4' color='primary' gutterBottom>
        {currentPageTitle}
      </Typography>
      <Grid container spacing={2}>
        <Grid item>{renderAvatar()}</Grid>
        <Grid item className={classes.gridName}>
          <Typography color='primary' variant='h4'>
            {isLoadingData ? <Skeleton width={90} /> : `${name}`}
          </Typography>
          <Typography color='primary' variant='h6'>
            {isLoadingData ? <Skeleton width={90} /> : `${position}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant='h6' color='primary' display='inline'>
            Basic Salary:
          </Typography>
          <Typography variant='h6' display='inline'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : (
              <NumberFormat value={basicSalary} displayType={'text'} thousandSeparator={true} prefix={' $'} className={classes.contentTypography} />
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='h6' color='primary' display='inline'>
            Sunday/PH Pay Rate:
          </Typography>
          <Typography variant='h6' display='inline'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : otPayRate ? (
              <NumberFormat
                value={otherDaysPayRate}
                displayType={'text'}
                thousandSeparator={true}
                prefix={' $'}
                className={classes.contentTypography}
              />
            ) : (
              <span className={classes.contentTypography}> $0</span>
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='h6' color='primary' display='inline'>
            Over Time Pay Rate:
          </Typography>
          <Typography variant='h6' display='inline'>
            {isLoadingData ? (
              <Skeleton width={50} />
            ) : otPayRate ? (
              <NumberFormat value={otPayRate} displayType={'text'} thousandSeparator={true} prefix={' $'} className={classes.contentTypography} />
            ) : (
              <span className={classes.contentTypography}> $0</span>
            )}
          </Typography>
        </Grid>
      </Grid>
      <CustomizedTabs
        tabs={[{ id: 0, name: 'Attendance History' }, { id: 1, name: 'Pay History' }]}
        selectedTabId={selectedTab}
        onSelect={(tabId: number) => performActionAndRevertPage(setSelectedTab, tabId)}
      />
      <Paper className={classes.paper}>
        <SelectedContent page={selectedTab} />
      </Paper>
    </Container>
  );
};

export default EmployeeDetailPage;
