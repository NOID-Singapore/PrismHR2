import React, { FC, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Avatar, ClickAwayListener, Divider, Grid, List, ListSubheader, ListItem, ListItemAvatar, Typography, Theme } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

interface Props {
  setOpenPopper?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingData?: boolean;
  employees?: EmployeeDetailsModel[];
  query?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 450,
    borderRadius: '5px'
  },
  subHeader: {
    color: '#00AFAB'
  },
  inline: {
    display: 'inline'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  },
  result: {
    padding: theme.spacing(1)
  },
  notFound: {
    marginTop: theme.spacing(1)
  }
}));

const EmployeeList: FC<Props> = props => {
  const classes = useStyles(props);

  const { isLoadingData, employees, query, setOpenPopper } = props;
  const dataLength = employees !== undefined ? employees.length : 5;

  const handleClickListItem = (clientId: string) => {
    window.open(`/employees/${clientId}`, '_blank');
    setOpenPopper && setOpenPopper(false);
  };

  const renderSkeleton = () => {
    return [1, 2, 3, 4, 5].map((value, index) => (
      <Fragment key={index}>
        <ListItem alignItems='flex-start' button>
          <ListItemAvatar>
            <Skeleton circle={true} height={36} width={36} />
          </ListItemAvatar>
          <Fragment>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle1' align='left'>
                  <Skeleton width={80} />
                </Typography>
                <Typography variant='subtitle1' align='left'>
                  <Skeleton width={150} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='subtitle1' align='left'>
                  <Skeleton width={80} />
                </Typography>
                <Typography variant='subtitle1' align='left'>
                  <Skeleton width={150} />
                </Typography>
              </Grid>
            </Grid>
          </Fragment>
        </ListItem>
        {index !== 4 && <Divider />}
      </Fragment>
    ));
  };

  const renderNoResult = () => {
    return (
      <Typography variant='body2' align='center' color='textSecondary' className={classes.notFound}>
        No results found for query <span style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>{query}</span>
      </Typography>
    );
  };

  const renderResult = () => {
    return (
      employees &&
      employees.map((employee, index) => {
        const suggestionOne = employee.id.toString();
        const matchOne = match(suggestionOne, query === undefined ? '' : query);
        const partOne = parse(suggestionOne, matchOne);

        const suggestionTwo = employee.name;
        const matchTwo = match(suggestionTwo, query === undefined ? '' : query);
        const partTwo = parse(suggestionTwo, matchTwo);

        return (
          <Fragment key={index}>
            <ListItem alignItems='flex-start' button onClick={event => handleClickListItem(employee.id)}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>{employee.name[0].toUpperCase()}</Avatar>
              </ListItemAvatar>
              <Fragment>
                <Grid container spacing={1} className={classes.result}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' align='left' color='primary'>
                      Employee Id
                    </Typography>
                    <Typography variant='body2' align='left' color='textSecondary'>
                      {partOne.map((part, index) =>
                        part.highlight ? (
                          <span key={String(index)} style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        )
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='subtitle1' align='left' color='primary'>
                      Employee Name
                    </Typography>
                    <Typography variant='body2' align='left' color='textSecondary'>
                      {partTwo.map((part, index) =>
                        part.highlight ? (
                          <span key={String(index)} style={{ color: '#53A0BE', backgroundColor: '#F4F8FD' }}>
                            {part.text}
                          </span>
                        ) : (
                          part.text
                        )
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Fragment>
            </ListItem>
            {index !== dataLength - 1 && <Divider />}
          </Fragment>
        );
      })
    );
  };

  const renderContent = () => {
    if (isLoadingData) {
      return renderSkeleton();
    } else {
      if (dataLength === 0) {
        return renderNoResult();
      } else {
        return renderResult();
      }
    }
  };

  return (
    <ClickAwayListener onClickAway={event => setOpenPopper && setOpenPopper(false)}>
      <List subheader={<ListSubheader className={classes.subHeader}>Search Result</ListSubheader>} className={classes.list}>
        <Divider />
        {renderContent()}
      </List>
    </ClickAwayListener>
  );
};

export default EmployeeList;
